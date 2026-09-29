import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { prisma } from './lib/db/prisma';
import { getAIProvider } from './lib/ai';
import { incidentService } from './lib/incident/incidentService';
import { memoryService } from './lib/memory/memoryService';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Input validation schema for raising a complaint
const CreateComplaintSchema = z.object({
  description: z.string().min(3, 'Complaint description is too short'),
  residentId: z.string().optional(),
  wing: z.string().optional().default('B'),
  flatNumber: z.string().optional().default('B-402'),
  photoUrl: z.string().optional(),
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'SocietyOS Backend', timestamp: new Date().toISOString() });
});

// GET /api/residents/default - Get current resident profile for mobile header
app.get('/api/residents/default', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let resident = await prisma.resident.findFirst({
      where: {
        flatNumber: 'B-402',
        wing: 'B',
      },
    });

    if (!resident) {
      resident = await prisma.resident.findFirst();
    }

    res.json({ resident });
  } catch (error) {
    next(error);
  }
});

// GET /api/complaints - Get active and recently resolved complaints for Home screen
app.get('/api/complaints', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activeComplaints = await prisma.complaint.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'IN_PROGRESS', 'REOPENED', 'ESCALATED', 'COMMITTEE_REVIEW'],
        },
      },
      include: {
        resident: {
          select: { name: true, flatNumber: true, wing: true },
        },
        asset: {
          select: { name: true, type: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const resolvedComplaints = await prisma.complaint.findMany({
      where: {
        status: 'RESOLVED',
      },
      include: {
        resident: {
          select: { name: true, flatNumber: true, wing: true },
        },
        asset: {
          select: { name: true, type: true },
        },
      },
      orderBy: {
        resolvedAt: 'desc',
      },
      take: 10,
    });

    // Counts for status cards
    const totalActive = await prisma.complaint.count({
      where: {
        status: {
          in: ['ACTIVE', 'IN_PROGRESS', 'REOPENED', 'ESCALATED', 'COMMITTEE_REVIEW'],
        },
      },
    });

    const totalResolved = await prisma.complaint.count({
      where: {
        status: 'RESOLVED',
      },
    });

    const totalIncidents = await prisma.incident.count({
      where: {
        status: { in: ['ACTIVE', 'REOPENED'] },
      },
    });

    res.json({
      activeComplaints,
      resolvedComplaints,
      stats: {
        active: totalActive,
        resolved: totalResolved,
        openIncidents: totalIncidents,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/complaints - Core Complaint & Memory Pipeline
app.post('/api/complaints', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateComplaintSchema.parse(req.body);

    // 1. Resolve Resident
    let residentId = validatedData.residentId;
    if (!residentId) {
      const resident = await prisma.resident.findFirst({
        where: {
          flatNumber: validatedData.flatNumber,
          wing: validatedData.wing,
        },
      });
      if (resident) {
        residentId = resident.id;
      } else {
        const fallbackResident = await prisma.resident.findFirst();
        if (fallbackResident) {
          residentId = fallbackResident.id;
        } else {
          const created = await prisma.resident.create({
            data: {
              name: 'Aarav Sharma',
              flatNumber: validatedData.flatNumber,
              wing: validatedData.wing,
              phone: '9876543210',
            },
          });
          residentId = created.id;
        }
      }
    }

    // 2. AI Triage & Extraction
    const ai = getAIProvider();
    const aiAnalysis = await ai.extractComplaintDetails(validatedData.description, {
      wing: validatedData.wing,
      flatNumber: validatedData.flatNumber,
    });

    // 3. Correlate with Incident
    const relatedIncident = await incidentService.correlateIncident(aiAnalysis);

    // 4. Retrieve Operational Memory from PostgreSQL
    const societyMemory = await memoryService.retrieveSocietyMemory(aiAnalysis);

    // 5. Store the Complaint in Database
    const complaint = await prisma.complaint.create({
      data: {
        residentId: residentId!,
        description: validatedData.description,
        category: aiAnalysis.category,
        urgency: aiAnalysis.urgency,
        wing: aiAnalysis.wing,
        flatNumber: validatedData.flatNumber,
        status: 'ACTIVE',
        incidentId: relatedIncident?.id,
        assetId: societyMemory.relatedAsset?.id,
      },
      include: {
        resident: true,
        asset: true,
        incident: true,
      },
    });

    // 6. Return response format adhering exactly to prompt requirements
    res.status(201).json({
      complaint,
      aiAnalysis,
      relatedComplaints: societyMemory.relatedComplaints,
      relatedComplaintsCount: societyMemory.relatedComplaintsCount,
      incidentsCount: societyMemory.incidentsCount,
      reopenedCount: societyMemory.reopenedCount,
      recurrence: societyMemory.recurrence,
      relatedIncident: societyMemory.relatedIncident,
      relatedAsset: societyMemory.relatedAsset,
      lastIncidentDaysAgo: societyMemory.lastIncidentDaysAgo,
      previousResolution: societyMemory.previousResolution,
      recommendedAction: societyMemory.recommendedAction,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    next(error);
  }
});

// POST /api/complaints/:id/committee - Forward complaint to committee action
app.post('/api/complaints/:id/committee', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: 'COMMITTEE_REVIEW',
      },
      include: {
        resident: true,
        incident: true,
        asset: true,
      },
    });

    res.json({
      success: true,
      message: 'Complaint successfully dispatched to Society Committee with AI operational dossier',
      complaint,
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SocietyOS Backend Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

const server = app.listen(Number(port), '0.0.0.0', () => {
  console.log(`🚀 SocietyOS Backend running at http://0.0.0.0:${port}`);
  console.log(`🧠 AI Provider initialized in ${process.env.AI_MODE || 'mock'} mode`);
});

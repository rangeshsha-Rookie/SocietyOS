import { prisma } from '../db/prisma';
import { AIExtraction } from '../ai/types';
import { getAIProvider } from '../ai';

export interface SocietyMemoryResult {
  relatedComplaints: any[];
  relatedComplaintsCount: number;
  incidentsCount: number;
  reopenedCount: number;
  recurrence: 'LOW' | 'MEDIUM' | 'HIGH';
  relatedIncident: any | null;
  relatedAsset: any | null;
  lastIncidentDaysAgo: number | null;
  previousResolution: any | null;
  recommendedAction: string;
}

export class MemoryService {
  /**
   * Recovers operational society memory from PostgreSQL for the given complaint context.
   */
  async retrieveSocietyMemory(
    extraction: AIExtraction,
    currentComplaintId?: string
  ): Promise<SocietyMemoryResult> {
    const ai = getAIProvider();

    // 1. Query historical related complaints from database
    const relatedComplaints = await prisma.complaint.findMany({
      where: {
        category: extraction.category,
        wing: extraction.wing,
        ...(currentComplaintId ? { id: { not: currentComplaintId } } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        resident: {
          select: {
            name: true,
            flatNumber: true,
            wing: true,
          },
        },
      },
    });

    const relatedComplaintsCount = relatedComplaints.length;

    // 2. Query related incidents from database
    const relatedIncidents = await prisma.incident.findMany({
      where: {
        category: extraction.category,
        location: {
          contains: extraction.wing,
          mode: 'insensitive',
        },
      },
      orderBy: {
        lastReportedAt: 'desc',
      },
      include: {
        resolutions: {
          orderBy: {
            resolvedAt: 'desc',
          },
        },
      },
    });

    const incidentsCount = relatedIncidents.length;

    // 3. Calculate reopened count from database records
    const reopenedIncidents = relatedIncidents.filter(
      (inc) => inc.status === 'REOPENED' || inc.reopenCount > 0
    );
    const sumReopenCount = relatedIncidents.reduce(
      (acc, inc) => acc + (inc.reopenCount || 0),
      0
    );
    const reopenedCount = Math.max(reopenedIncidents.length, sumReopenCount);

    // 4. Query related Asset from database
    let relatedAsset = null;
    if (extraction.category === 'Water Supply') {
      relatedAsset = await prisma.asset.findFirst({
        where: {
          type: { contains: 'Water Pump', mode: 'insensitive' },
          location: { contains: extraction.wing, mode: 'insensitive' },
        },
        include: {
          vendor: true,
        },
      });
    } else if (extraction.category === 'Elevator') {
      relatedAsset = await prisma.asset.findFirst({
        where: {
          type: { contains: 'Elevator', mode: 'insensitive' },
          location: { contains: extraction.wing, mode: 'insensitive' },
        },
        include: {
          vendor: true,
        },
      });
    }

    if (!relatedAsset) {
      relatedAsset = await prisma.asset.findFirst({
        where: {
          location: { contains: extraction.wing, mode: 'insensitive' },
        },
        include: {
          vendor: true,
        },
      });
    }

    // 5. Retrieve previous resolution from database
    let previousResolution = null;
    for (const inc of relatedIncidents) {
      if (inc.resolutions && inc.resolutions.length > 0) {
        previousResolution = inc.resolutions[0];
        break;
      }
    }

    if (!previousResolution) {
      previousResolution = await prisma.resolution.findFirst({
        where: {
          complaint: {
            category: extraction.category,
            wing: extraction.wing,
          },
        },
        orderBy: {
          resolvedAt: 'desc',
        },
      });
    }

    // 6. Determine the last incident and days elapsed
    const primaryIncident = relatedIncidents[0] || null;
    let lastIncidentDaysAgo: number | null = null;

    const referenceDate = previousResolution?.resolvedAt || primaryIncident?.firstReportedAt;
    if (referenceDate) {
      const now = new Date().getTime();
      const incidentDate = new Date(referenceDate).getTime();
      const diffDays = Math.round((now - incidentDate) / (1000 * 60 * 60 * 24));
      lastIncidentDaysAgo = Math.max(diffDays, 1);
    }

    // 7. Calculate Recurrence level
    let recurrence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (
      relatedComplaintsCount >= 4 ||
      incidentsCount >= 2 ||
      reopenedCount >= 2 ||
      (previousResolution?.recurrenceDays && previousResolution.recurrenceDays <= 30)
    ) {
      recurrence = 'HIGH';
    } else if (relatedComplaintsCount >= 2 || incidentsCount >= 1) {
      recurrence = 'MEDIUM';
    }

    // 8. Generate Recommended Action
    const recommendedAction = await ai.generateRecommendedAction({
      category: extraction.category,
      issue: extraction.issue,
      wing: extraction.wing,
      assetName: relatedAsset?.name,
      previousAction: previousResolution?.actionTaken,
      outcome: previousResolution?.outcome,
      recurrenceDays: previousResolution?.recurrenceDays,
      reopenCount: reopenedCount,
    });

    return {
      relatedComplaints,
      relatedComplaintsCount,
      incidentsCount,
      reopenedCount,
      recurrence,
      relatedIncident: primaryIncident,
      relatedAsset,
      lastIncidentDaysAgo,
      previousResolution,
      recommendedAction,
    };
  }
}

export const memoryService = new MemoryService();

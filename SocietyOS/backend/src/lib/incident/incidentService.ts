import { prisma } from '../db/prisma';
import { AIExtraction } from '../ai/types';

export class IncidentService {
  /**
   * Correlates an incoming complaint with existing open or recurring incidents in the database.
   */
  async correlateIncident(extraction: AIExtraction, complaintId?: string) {
    // Search database for incidents matching category and wing/location
    const matchingIncidents = await prisma.incident.findMany({
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

    // If an incident already exists, update its complaint count and lastReportedAt
    if (matchingIncidents.length > 0) {
      const primaryIncident = matchingIncidents[0];

      const updatedIncident = await prisma.incident.update({
        where: { id: primaryIncident.id },
        data: {
          complaintCount: { increment: 1 },
          lastReportedAt: new Date(),
          status: primaryIncident.status === 'RESOLVED' ? 'REOPENED' : primaryIncident.status,
          reopenCount: primaryIncident.status === 'RESOLVED' ? { increment: 1 } : undefined,
        },
        include: {
          resolutions: true,
        },
      });

      return updatedIncident;
    }

    // Otherwise create a new incident
    const newIncident = await prisma.incident.create({
      data: {
        title: `${extraction.category} issue in Wing ${extraction.wing}`,
        category: extraction.category,
        location: `Wing ${extraction.wing}`,
        status: 'ACTIVE',
        firstReportedAt: new Date(),
        lastReportedAt: new Date(),
        complaintCount: 1,
        reopenCount: 0,
      },
    });

    return newIncident;
  }
}

export const incidentService = new IncidentService();

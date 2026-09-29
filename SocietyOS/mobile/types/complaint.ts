export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ComplaintStatus =
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'REOPENED'
  | 'ESCALATED'
  | 'COMMITTEE_REVIEW'
  | 'RESOLVED';
export type RecurrenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Resident {
  id: string;
  name: string;
  flatNumber: string;
  wing: string;
  phone?: string;
}

export interface Complaint {
  id: string;
  residentId: string;
  description: string;
  category: string;
  urgency: UrgencyLevel;
  wing: string;
  flatNumber: string;
  status: ComplaintStatus;
  incidentId?: string | null;
  assetId?: string | null;
  vendorId?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  verifiedAt?: string | null;
  resident?: Resident;
  asset?: {
    id: string;
    name: string;
    type: string;
  } | null;
}

export interface AIAnalysis {
  category: string;
  urgency: UrgencyLevel;
  wing: string;
  issue: string;
  confidence?: number;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  location: string;
  vendorId?: string | null;
  vendor?: {
    id: string;
    name: string;
    serviceType: string;
  } | null;
}

export interface Resolution {
  id: string;
  complaintId?: string | null;
  incidentId?: string | null;
  actionTaken: string;
  outcome: string;
  recurrenceDays?: number | null;
  residentVerified: boolean;
  resolvedAt: string;
}

export interface Incident {
  id: string;
  title: string;
  category: string;
  location: string;
  status: string;
  firstReportedAt: string;
  lastReportedAt: string;
  complaintCount: number;
  reopenCount: number;
  resolutions?: Resolution[];
}

export interface CreateComplaintInput {
  description: string;
  wing?: string;
  flatNumber?: string;
  residentId?: string;
  photoUri?: string;
}

export interface ComplaintAnalysisResponse {
  complaint: Complaint;
  aiAnalysis: AIAnalysis;
  relatedComplaints: Complaint[];
  relatedComplaintsCount: number;
  incidentsCount: number;
  reopenedCount: number;
  recurrence: RecurrenceLevel;
  relatedIncident: Incident | null;
  relatedAsset: Asset | null;
  lastIncidentDaysAgo: number | null;
  previousResolution: Resolution | null;
  recommendedAction: string;
}

export interface HomeComplaintsResponse {
  activeComplaints: Complaint[];
  resolvedComplaints: Complaint[];
  stats: {
    active: number;
    resolved: number;
    openIncidents: number;
  };
}

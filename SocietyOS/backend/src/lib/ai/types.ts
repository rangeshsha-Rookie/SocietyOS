export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIExtraction {
  category: string;
  urgency: UrgencyLevel;
  wing: string;
  issue: string;
  confidence?: number;
}

export interface RecommendedActionContext {
  category: string;
  issue: string;
  wing?: string;
  assetName?: string;
  previousAction?: string;
  outcome?: string;
  recurrenceDays?: number | null;
  reopenCount?: number;
}

export interface IAIProvider {
  name: string;
  extractComplaintDetails(
    description: string,
    fallback?: { wing?: string; flatNumber?: string }
  ): Promise<AIExtraction>;
  generateRecommendedAction(
    context: RecommendedActionContext
  ): Promise<string>;
}

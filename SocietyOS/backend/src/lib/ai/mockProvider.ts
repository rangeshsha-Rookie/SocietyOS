import { AIExtraction, IAIProvider, RecommendedActionContext } from './types';

export class MockAIProvider implements IAIProvider {
  name = 'MockAIProvider';

  async extractComplaintDetails(
    description: string,
    fallback?: { wing?: string; flatNumber?: string }
  ): Promise<AIExtraction> {
    const text = description.toLowerCase();

    // Wing extraction: look for patterns like "b wing", "wing b", "b-wing", or fallback
    let wing = fallback?.wing || 'B';
    const wingMatch = text.match(/(?:wing\s*([a-d])|([a-d])\s*wing|([a-d])-[0-9]{3,4})/i);
    if (wingMatch) {
      wing = (wingMatch[1] || wingMatch[2] || wingMatch[3]).toUpperCase();
    }

    // Category and issue extraction
    if (
      text.includes('pani') ||
      text.includes('water') ||
      text.includes('pressure') ||
      text.includes('pump') ||
      text.includes('leak')
    ) {
      let issue = 'Low water pressure';
      if (text.includes('leak')) {
        issue = 'Pipe leakage';
      } else if (text.includes('no water') || text.includes('pani nahi')) {
        issue = 'Complete water outage';
      }

      return {
        category: 'Water Supply',
        urgency: 'HIGH',
        wing,
        issue,
        confidence: 0.95,
      };
    }

    if (text.includes('lift') || text.includes('elevator')) {
      return {
        category: 'Elevator',
        urgency: 'HIGH',
        wing,
        issue: 'Lift breakdown or irregular movement',
        confidence: 0.92,
      };
    }

    if (text.includes('bijli') || text.includes('light') || text.includes('power') || text.includes('spark')) {
      return {
        category: 'Electrical',
        urgency: 'MEDIUM',
        wing,
        issue: 'Power fluctuation or corridor lighting outage',
        confidence: 0.88,
      };
    }

    if (text.includes('kachra') || text.includes('garbage') || text.includes('clean') || text.includes('smell')) {
      return {
        category: 'Cleanliness',
        urgency: 'LOW',
        wing,
        issue: 'Waste accumulation or hygiene maintenance',
        confidence: 0.89,
      };
    }

    // Default fallback
    return {
      category: 'General Maintenance',
      urgency: 'MEDIUM',
      wing,
      issue: description.slice(0, 50),
      confidence: 0.8,
    };
  }

  async generateRecommendedAction(context: RecommendedActionContext): Promise<string> {
    // If recurring issue where pump servicing failed
    if (
      context.category === 'Water Supply' &&
      context.previousAction?.toLowerCase().includes('pump servicing') &&
      context.outcome?.toLowerCase().includes('returned')
    ) {
      return 'Inspect pump + supply line';
    }

    if (context.category === 'Water Supply') {
      if (context.reopenCount && context.reopenCount > 1) {
        return 'Conduct pressure test across pipeline and replace faulty non-return valve';
      }
      return 'Inspect pump + supply line';
    }

    if (context.category === 'Elevator') {
      return 'Dispatch OEM technician for drive inverter and safety sensor recalibration';
    }

    return 'Dispatch facility engineer for root-cause inspection and verification';
  }
}

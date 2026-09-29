import { IAIProvider } from './types';
import { MockAIProvider } from './mockProvider';

export * from './types';
export * from './mockProvider';

export function getAIProvider(): IAIProvider {
  const mode = process.env.AI_MODE || 'mock';

  switch (mode) {
    case 'mock':
    default:
      return new MockAIProvider();
  }
}

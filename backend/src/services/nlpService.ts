import OpenAI from 'openai';
import { logger } from '../config/logger';

interface SearchIntent {
  jobTitle?: string;
  location?: string;
  salary?: { min?: number; max?: number };
  remote?: boolean;
  experience?: string;
  skills?: string[];
  company?: string;
  industry?: string;
}

interface ConversationContext {
  userId: string;
  previousQueries: string[];
  refinements: SearchIntent[];
  sessionId: string;
}

export class NLPService {
  private openai: OpenAI;
  private contexts: Map<string, ConversationContext> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async parseJobSearchQuery(query: string, userId: string): Promise<SearchIntent> {
    try {
      const prompt = `
        Parse this job search query into structured data:
        "${query}"
        
        Extract:
        - jobTitle: specific role or position
        - location: city, state, country, or "remote"
        - salary: min/max numbers if mentioned
        - remote: true if remote work mentioned
        - experience: junior, mid, senior, years
        - skills: technical skills mentioned
        - company: specific company names
        - industry: tech, finance, healthcare, etc.
        
        Return valid JSON only.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      // Store context for conversation
      this.updateContext(userId, query, parsed);
      
      return parsed;
    } catch (error) {
      logger.error('NLP parsing error:', error);
      return {};
    }
  }

  private updateContext(userId: string, query: string, intent: SearchIntent): void {
    const context = this.contexts.get(userId) || {
      userId,
      previousQueries: [],
      refinements: [],
      sessionId: Date.now().toString()
    };

    context.previousQueries.push(query);
    context.refinements.push(intent);
    
    // Keep only last 5 queries for context
    if (context.previousQueries.length > 5) {
      context.previousQueries.shift();
      context.refinements.shift();
    }

    this.contexts.set(userId, context);
  }
}
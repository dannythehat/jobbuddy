import OpenAI from 'openai';
import { logger } from '../config/logger';

interface ConversationTurn {
  id: string;
  query: string;
  intent: any;
  timestamp: Date;
  refinements?: string[];
  satisfaction?: number;
}

interface UserContext {
  userId: string;
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange: { min: number; max: number };
    remote: boolean;
    industries: string[];
  };
  searchHistory: ConversationTurn[];
  learningGoals: string[];
  careerObjectives: string[];
  skillLevels: { [skill: string]: string };
}

interface ContextualResponse {
  response: string;
  suggestions: string[];
  clarifications?: string[];
  confidence: number;
}

export class ConversationContextService {
  private openai: OpenAI;
  private userContexts: Map<string, UserContext> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async initializeUserContext(userId: string, profile: any): Promise<UserContext> {
    const context: UserContext = {
      userId,
      preferences: {
        jobTypes: profile.preferredRoles || [],
        locations: profile.preferredLocations || [],
        salaryRange: profile.salaryRange || { min: 0, max: 200000 },
        remote: profile.remotePreference || false,
        industries: profile.industries || []
      },
      searchHistory: [],
      learningGoals: profile.learningGoals || [],
      careerObjectives: profile.careerObjectives || [],
      skillLevels: profile.skillLevels || {}
    };

    this.userContexts.set(userId, context);
    return context;
  }

  async processConversationalQuery(
    userId: string,
    query: string,
    conversationId?: string
  ): Promise<ContextualResponse> {
    try {
      const context = this.userContexts.get(userId);
      if (!context) {
        throw new Error('User context not found');
      }

      const recentHistory = context.searchHistory.slice(-3);
      
      const prompt = `
        Process this conversational job search query with context:
        
        Current Query: "${query}"
        
        User Context:
        - Preferred Roles: ${context.preferences.jobTypes.join(', ')}
        - Locations: ${context.preferences.locations.join(', ')}
        - Salary Range: $${context.preferences.salaryRange.min}k - $${context.preferences.salaryRange.max}k
        - Remote: ${context.preferences.remote}
        - Industries: ${context.preferences.industries.join(', ')}
        
        Recent Search History:
        ${recentHistory.map(h => `- "${h.query}" (${h.timestamp.toISOString()})`).join('\n')}
        
        Career Goals: ${context.careerObjectives.join(', ')}
        Learning Goals: ${context.learningGoals.join(', ')}
        
        Provide:
        1. Contextual response addressing the query
        2. 3-5 follow-up suggestions based on context
        3. Any clarifications needed
        4. Confidence score (0-100)
        
        Consider conversation flow and user's established preferences.
        Return as JSON.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 800
      });

      const contextualResponse = JSON.parse(response.choices[0].message.content || '{}');
      
      // Store conversation turn
      const turn: ConversationTurn = {
        id: `turn_${Date.now()}`,
        query,
        intent: contextualResponse,
        timestamp: new Date()
      };
      
      context.searchHistory.push(turn);
      
      // Keep only last 10 conversations
      if (context.searchHistory.length > 10) {
        context.searchHistory.shift();
      }

      return contextualResponse;
    } catch (error) {
      logger.error('Conversational query processing error:', error);
      throw error;
    }
  }

  async refineSearchWithFeedback(
    userId: string,
    turnId: string,
    feedback: 'helpful' | 'not_helpful' | 'needs_refinement',
    refinementQuery?: string
  ): Promise<ContextualResponse> {
    try {
      const context = this.userContexts.get(userId);
      if (!context) {
        throw new Error('User context not found');
      }

      const turn = context.searchHistory.find(t => t.id === turnId);
      if (!turn) {
        throw new Error('Conversation turn not found');
      }

      turn.satisfaction = feedback === 'helpful' ? 1 : feedback === 'not_helpful' ? -1 : 0;
      
      if (refinementQuery) {
        const prompt = `
          Refine the previous search based on user feedback:
          
          Original Query: "${turn.query}"
          User Feedback: ${feedback}
          Refinement Request: "${refinementQuery}"
          
          User Context: ${JSON.stringify(context.preferences)}
          
          Provide improved search suggestions and clarifications.
          Return as JSON.
        `;

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 600
        });

        const refinedResponse = JSON.parse(response.choices[0].message.content || '{}');
        
        turn.refinements = turn.refinements || [];
        turn.refinements.push(refinementQuery);
        
        return refinedResponse;
      }

      return { response: 'Feedback recorded', suggestions: [], confidence: 100 };
    } catch (error) {
      logger.error('Search refinement error:', error);
      throw error;
    }
  }

  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserContext['preferences']>
  ): Promise<void> {
    const context = this.userContexts.get(userId);
    if (context) {
      context.preferences = { ...context.preferences, ...preferences };
    }
  }

  getUserContext(userId: string): UserContext | undefined {
    return this.userContexts.get(userId);
  }
}
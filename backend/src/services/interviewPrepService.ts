import OpenAI from 'openai';
import { logger } from '../config/logger';

interface InterviewQuestion {
  id: string;
  question: string;
  type: 'behavioral' | 'technical' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer?: string;
}

interface InterviewSession {
  id: string;
  userId: string;
  jobTitle: string;
  company?: string;
  questions: InterviewQuestion[];
  responses: { questionId: string; answer: string; score: number; feedback: string }[];
  overallScore: number;
  createdAt: Date;
}

export class InterviewPrepService {
  private openai: OpenAI;
  private sessions: Map<string, InterviewSession> = new Map();

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateMockInterview(
    userId: string, 
    jobTitle: string, 
    company?: string
  ): Promise<InterviewSession> {
    try {
      const prompt = `
        Generate 5 interview questions for a ${jobTitle} position${company ? ` at ${company}` : ''}.
        
        Include:
        - 2 behavioral questions
        - 2 technical questions  
        - 1 situational question
        
        For each question provide:
        - The question text
        - Question type
        - Difficulty level
        - Brief expected answer outline
        
        Return as JSON array.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const questions = JSON.parse(response.choices[0].message.content || '[]');
      
      const session: InterviewSession = {
        id: Date.now().toString(),
        userId,
        jobTitle,
        company,
        questions: questions.map((q: any, index: number) => ({
          id: `q_${index}`,
          question: q.question,
          type: q.type,
          difficulty: q.difficulty,
          expectedAnswer: q.expectedAnswer
        })),
        responses: [],
        overallScore: 0,
        createdAt: new Date()
      };

      this.sessions.set(session.id, session);
      return session;
    } catch (error) {
      logger.error('Mock interview generation error:', error);
      throw error;
    }
  }

  async analyzeResponse(
    sessionId: string, 
    questionId: string, 
    answer: string
  ): Promise<{ score: number; feedback: string }> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) throw new Error('Session not found');

      const question = session.questions.find(q => q.id === questionId);
      if (!question) throw new Error('Question not found');

      const prompt = `
        Analyze this interview response:
        
        Question: "${question.question}"
        Type: ${question.type}
        Answer: "${answer}"
        
        Provide:
        1. Score (0-100)
        2. Specific feedback for improvement
        3. What was good about the answer
        4. Areas to strengthen
        
        Return as JSON: { "score": number, "feedback": "detailed feedback" }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      
      // Store response
      session.responses.push({
        questionId,
        answer,
        score: analysis.score,
        feedback: analysis.feedback
      });

      // Update overall score
      session.overallScore = session.responses.reduce((sum, r) => sum + r.score, 0) / session.responses.length;
      
      return analysis;
    } catch (error) {
      logger.error('Response analysis error:', error);
      throw error;
    }
  }
}
import OpenAI from 'openai';

interface ParsedQuery {
  keywords: string[];
  location?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  jobType?: string;
  experience?: string;
  remote?: boolean;
  skills?: string[];
  company?: string;
  confidence: number;
  originalQuery: string;
}

interface QueryParsingError {
  error: string;
  fallbackSuggestion?: string;
}

class NaturalLanguageService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Parse natural language job search query into structured parameters
   */
  async parseJobQuery(query: string): Promise<ParsedQuery | QueryParsingError> {
    try {
      if (!query || query.trim().length < 3) {
        return {
          error: 'Query too short',
          fallbackSuggestion: 'Try: "Find remote React jobs in London"'
        };
      }

      const systemPrompt = `You are a job search query parser. Convert natural language job search queries into structured JSON.

Extract these fields when present:
- keywords: array of job-related terms
- location: city, region, or "remote"
- salary: {min, max, currency} if mentioned
- jobType: "full-time", "part-time", "contract", "internship"
- experience: "junior", "mid-level", "senior", or years
- remote: boolean if remote work mentioned
- skills: array of technical skills
- company: specific company or company type

Return JSON with confidence score (0-1).`;

      const userPrompt = `Parse this job search query: "${query}"

Examples:
"Find remote React jobs in London paying over £50k" → {"keywords":["React","developer"],"location":"London","salary":{"min":50000,"currency":"GBP"},"remote":true,"skills":["React"],"confidence":0.9}

"Senior Python developer positions" → {"keywords":["Python","developer"],"experience":"senior","skills":["Python"],"confidence":0.8}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      
      return {
        ...parsed,
        originalQuery: query,
        confidence: parsed.confidence || 0.5
      };

    } catch (error) {
      console.error('Natural language parsing error:', error);
      
      // Fallback: basic keyword extraction
      const keywords = this.extractBasicKeywords(query);
      
      return {
        keywords,
        originalQuery: query,
        confidence: 0.3
      };
    }
  }

  /**
   * Fallback method for basic keyword extraction when AI fails
   */
  private extractBasicKeywords(query: string): string[] {
    const commonJobTerms = [
      'developer', 'engineer', 'manager', 'analyst', 'designer',
      'react', 'python', 'javascript', 'java', 'node', 'angular',
      'senior', 'junior', 'lead', 'full-time', 'part-time', 'remote'
    ];

    const words = query.toLowerCase().split(/\s+/);
    return words.filter(word => 
      commonJobTerms.includes(word) || word.length > 3
    );
  }

  /**
   * Generate search suggestions based on query
   */
  generateSuggestions(query: string): string[] {
    const suggestions = [
      'Try: "Find remote React jobs in London"',
      'Try: "Senior Python developer positions"',
      'Try: "Part-time marketing roles near Manchester"',
      'Try: "Data science jobs at startups"'
    ];

    // Simple suggestion logic - can be enhanced with AI later
    if (query.length < 10) {
      return suggestions.slice(0, 2);
    }

    return suggestions;
  }

  /**
   * Validate parsed query for completeness
   */
  validateParsedQuery(parsed: ParsedQuery): {
    isValid: boolean;
    suggestions: string[];
  } {
    const suggestions: string[] = [];

    if (!parsed.keywords || parsed.keywords.length === 0) {
      suggestions.push('Add job title or skills (e.g., "React developer")');
    }

    if (!parsed.location && !parsed.remote) {
      suggestions.push('Specify location or mention "remote"');
    }

    if (parsed.confidence < 0.6) {
      suggestions.push('Try being more specific about the role you want');
    }

    return {
      isValid: suggestions.length === 0,
      suggestions
    };
  }
}

export default NaturalLanguageService;
export { ParsedQuery, QueryParsingError };
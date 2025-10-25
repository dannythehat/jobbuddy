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
- keywords: array of job-related terms (job titles, roles)
- location: city, region, country
- salary: {min, max, currency} if mentioned (convert to numbers)
- jobType: "full-time", "part-time", "contract", "internship"
- experience: "Entry Level", "Mid Level", "Senior Level"
- remote: true if remote/work-from-home mentioned
- skills: array of technical skills (React, Python, etc)
- company: specific company name or type (startup, enterprise)

Return ONLY valid JSON with confidence score (0-1). No markdown, no explanations.`;

      const userPrompt = `Parse: "${query}"

Examples:
"Find remote React jobs in London paying over £50k" → {"keywords":["React","developer"],"location":"London","salary":{"min":50000,"currency":"GBP"},"remote":true,"skills":["React"],"confidence":0.9}

"Senior Python developer positions" → {"keywords":["Python","developer"],"experience":"Senior Level","skills":["Python"],"confidence":0.85}

"Full-time data analyst jobs in New York" → {"keywords":["data","analyst"],"location":"New York","jobType":"full-time","confidence":0.8}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      
      return {
        keywords: parsed.keywords || [],
        location: parsed.location,
        salary: parsed.salary,
        jobType: parsed.jobType,
        experience: parsed.experience,
        remote: parsed.remote || false,
        skills: parsed.skills || [],
        company: parsed.company,
        originalQuery: query,
        confidence: parsed.confidence || 0.5
      };

    } catch (error) {
      console.error('Natural language parsing error:', error);
      
      // Fallback: basic keyword extraction
      const keywords = this.extractBasicKeywords(query);
      const remote = /remote|work from home|wfh/i.test(query);
      
      return {
        keywords,
        remote,
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
      'senior', 'junior', 'lead', 'full-time', 'part-time', 'remote',
      'frontend', 'backend', 'fullstack', 'devops', 'data'
    ];

    const words = query.toLowerCase().split(/\s+/);
    const filtered = words.filter(word => 
      commonJobTerms.includes(word) || word.length > 3
    );

    return filtered.length > 0 ? filtered : ['developer'];
  }

  /**
   * Generate search suggestions based on query
   */
  generateSuggestions(query: string): string[] {
    const suggestions = [
      'Find remote React jobs in London',
      'Senior Python developer positions',
      'Part-time marketing roles near Manchester',
      'Data science jobs at startups',
      'Junior frontend developer internships'
    ];

    if (query.length < 10) {
      return suggestions.slice(0, 3);
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
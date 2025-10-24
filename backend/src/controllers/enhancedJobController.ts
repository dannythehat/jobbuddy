import { Request, Response } from 'express';
import NaturalLanguageService, { ParsedQuery } from '../services/naturalLanguageService';

class EnhancedJobController {
  private nlService: NaturalLanguageService;

  constructor() {
    this.nlService = new NaturalLanguageService();
  }

  /**
   * POST /api/jobs/search/natural - Natural language job search
   */
  async naturalLanguageSearch(req: Request, res: Response) {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          status: 'error',
          message: 'Query is required and must be a string',
          suggestions: this.nlService.generateSuggestions('')
        });
      }

      // Parse natural language query
      const parsed = await this.nlService.parseJobQuery(query);

      // Check if parsing failed
      if ('error' in parsed) {
        return res.status(400).json({
          status: 'error',
          message: parsed.error,
          fallbackSuggestion: parsed.fallbackSuggestion,
          suggestions: this.nlService.generateSuggestions(query)
        });
      }

      // Validate parsed query
      const validation = this.nlService.validateParsedQuery(parsed);

      // Convert parsed query to traditional search parameters
      const searchParams = this.convertToSearchParams(parsed);

      // TODO: Integrate with existing job search logic
      const jobs = await this.performJobSearch(searchParams);

      res.json({
        status: 'success',
        data: {
          jobs,
          parsedQuery: parsed,
          searchParams,
          validation,
          totalResults: jobs.length
        }
      });

    } catch (error) {
      console.error('Natural language search error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Search failed. Please try again.',
        suggestions: this.nlService.generateSuggestions('')
      });
    }
  }

  /**
   * POST /api/jobs/search/parse - Parse query without searching
   */
  async parseQuery(req: Request, res: Response) {
    try {
      const { query } = req.body;

      if (!query) {
        return res.status(400).json({
          status: 'error',
          message: 'Query is required'
        });
      }

      const parsed = await this.nlService.parseJobQuery(query);

      if ('error' in parsed) {
        return res.status(400).json({
          status: 'error',
          message: parsed.error,
          fallbackSuggestion: parsed.fallbackSuggestion
        });
      }

      const validation = this.nlService.validateParsedQuery(parsed);
      const searchParams = this.convertToSearchParams(parsed);

      res.json({
        status: 'success',
        data: {
          parsedQuery: parsed,
          searchParams,
          validation
        }
      });

    } catch (error) {
      console.error('Query parsing error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to parse query'
      });
    }
  }

  /**
   * GET /api/jobs/search/suggestions - Get search suggestions
   */
  async getSearchSuggestions(req: Request, res: Response) {
    try {
      const { partial } = req.query;
      const suggestions = this.nlService.generateSuggestions(partial as string || '');

      res.json({
        status: 'success',
        data: {
          suggestions,
          examples: [
            'Find remote React developer jobs in London',
            'Senior Python positions paying over $80k',
            'Part-time marketing roles near Manchester',
            'Data science jobs at tech startups',
            'Junior frontend developer internships'
          ]
        }
      });

    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to get suggestions'
      });
    }
  }

  /**
   * Convert parsed NL query to traditional search parameters
   */
  private convertToSearchParams(parsed: ParsedQuery) {
    return {
      keywords: parsed.keywords?.join(' ') || '',
      location: parsed.location || '',
      salaryMin: parsed.salary?.min || null,
      salaryMax: parsed.salary?.max || null,
      currency: parsed.salary?.currency || 'USD',
      jobType: parsed.jobType || '',
      experience: parsed.experience || '',
      remote: parsed.remote || false,
      skills: parsed.skills || [],
      company: parsed.company || '',
      confidence: parsed.confidence
    };
  }

  /**
   * Perform actual job search (placeholder - integrate with existing logic)
   */
  private async performJobSearch(params: any): Promise<any[]> {
    // TODO: Integrate with existing job search service
    // For now, return mock data
    return [
      {
        id: 'job_1',
        title: 'React Developer',
        company: 'Tech Corp',
        location: params.location || 'Remote',
        salary: params.salaryMin ? `$${params.salaryMin}+` : 'Competitive',
        type: params.jobType || 'Full-time',
        skills: params.skills,
        relevanceScore: params.confidence,
        description: 'Mock job matching your search criteria'
      }
    ];
  }
}

export default EnhancedJobController;
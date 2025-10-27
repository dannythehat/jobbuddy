import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface JobSummary {
  bullets: string[];
  generatedAt: Date;
}

export class JobSummarizerService {
  /**
   * Summarize a job description into 3 concise bullet points
   */
  async summarizeJob(description: string): Promise<string[]> {
    if (!description || description.trim().length === 0) {
      throw new Error('Job description is required');
    }

    const prompt = `Summarize this job description into exactly 3 concise bullet points.
Focus on: key responsibilities, required skills, and what makes it unique.

Job Description:
${description}

Format: Return only 3 bullet points, no introduction or conclusion.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      });

      const summary = response.choices[0].message.content || '';
      
      // Parse bullet points
      const bullets = summary
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3);

      // Ensure we have exactly 3 bullets
      if (bullets.length < 3) {
        throw new Error('Failed to generate 3 bullet points');
      }

      return bullets;
    } catch (error: any) {
      console.error('Error summarizing job:', error);
      throw new Error(`Failed to summarize job: ${error.message}`);
    }
  }

  /**
   * Summarize multiple jobs in batch
   */
  async summarizeJobBatch(jobs: Array<{ id: string; description: string }>): Promise<Array<{ id: string; summary: string[] }>> {
    const summaries = await Promise.all(
      jobs.map(async (job) => {
        try {
          const summary = await this.summarizeJob(job.description);
          return { id: job.id, summary };
        } catch (error) {
          console.error(`Error summarizing job ${job.id}:`, error);
          return { 
            id: job.id, 
            summary: ['Unable to generate summary', 'Please review full description', 'Contact support if issue persists'] 
          };
        }
      })
    );
    return summaries;
  }

  /**
   * Get a cached summary or generate a new one
   */
  async getSummaryWithCache(jobId: string, description: string, cachedSummary?: string[]): Promise<string[]> {
    // If we have a cached summary less than 7 days old, use it
    if (cachedSummary && cachedSummary.length === 3) {
      return cachedSummary;
    }

    // Otherwise generate a new summary
    return await this.summarizeJob(description);
  }
}

export const jobSummarizerService = new JobSummarizerService();

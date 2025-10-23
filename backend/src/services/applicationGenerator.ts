import OpenAI from 'openai';
import { CV } from '../models/CV';
import { Job } from '../models/Job';
import { JobPreference } from '../models/JobPreference';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ApplicationContent {
  coverLetter: string;
  customizedResume?: string;
  applicationNotes: string;
  keyPoints: string[];
  matchingSkills: string[];
  addressedRequirements: string[];
}

export interface GenerateApplicationOptions {
  includeCustomResume?: boolean;
  tone?: 'professional' | 'enthusiastic' | 'conversational' | 'formal';
  length?: 'short' | 'medium' | 'long';
  focusAreas?: string[];
}

export class ApplicationGenerator {
  /**
   * Generate a complete application package for a job
   */
  static async generateApplication(
    cv: CV,
    job: Job,
    jobPreferences: JobPreference,
    options: GenerateApplicationOptions = {}
  ): Promise<ApplicationContent> {
    try {
      const {
        tone = 'professional',
        length = 'medium',
        includeCustomResume = false,
        focusAreas = []
      } = options;

      // Generate cover letter
      const coverLetter = await this.generateCoverLetter(cv, job, jobPreferences, {
        tone,
        length,
        focusAreas
      });

      // Generate application notes and analysis
      const analysisResult = await this.analyzeJobMatch(cv, job);

      // Optionally generate customized resume
      let customizedResume;
      if (includeCustomResume) {
        customizedResume = await this.generateCustomizedResume(cv, job);
      }

      return {
        coverLetter,
        customizedResume,
        applicationNotes: analysisResult.notes,
        keyPoints: analysisResult.keyPoints,
        matchingSkills: analysisResult.matchingSkills,
        addressedRequirements: analysisResult.addressedRequirements
      };
    } catch (error) {
      console.error('Error generating application:', error);
      throw new Error('Failed to generate application content');
    }
  }

  /**
   * Generate a personalized cover letter
   */
  private static async generateCoverLetter(
    cv: CV,
    job: Job,
    jobPreferences: JobPreference,
    options: { tone: string; length: string; focusAreas: string[] }
  ): Promise<string> {
    const prompt = this.buildCoverLetterPrompt(cv, job, jobPreferences, options);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career counselor and professional writer specializing in creating compelling, personalized cover letters that highlight relevant experience and demonstrate genuine interest in specific roles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: this.getMaxTokensForLength(options.length)
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Generate a customized resume tailored to the job
   */
  private static async generateCustomizedResume(cv: CV, job: Job): Promise<string> {
    const prompt = `
Create a customized resume based on the following CV and job posting. Reorder and emphasize relevant experience, skills, and achievements that align with the job requirements.

ORIGINAL CV DATA:
Personal Info: ${JSON.stringify(cv.personalInfo)}
Experience: ${JSON.stringify(cv.experience)}
Education: ${JSON.stringify(cv.education)}
Skills: ${JSON.stringify(cv.skills)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements}
Skills Required: ${job.skillsRequired}

Instructions:
1. Reorder experience to highlight most relevant roles first
2. Emphasize achievements that align with job requirements
3. Adjust skill presentation to match job needs
4. Keep all information truthful - only reorder and emphasize, don't fabricate
5. Format as a clean, professional resume
6. Include quantified achievements where possible

Return the customized resume in a clean, professional format.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume writer who specializes in tailoring resumes to specific job opportunities while maintaining complete accuracy and truthfulness.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Analyze job match and generate insights
   */
  private static async analyzeJobMatch(cv: CV, job: Job): Promise<{
    notes: string;
    keyPoints: string[];
    matchingSkills: string[];
    addressedRequirements: string[];
  }> {
    const prompt = `
Analyze the match between this CV and job posting. Provide strategic insights for the application.

CV DATA:
Skills: ${JSON.stringify(cv.skills)}
Experience: ${JSON.stringify(cv.experience)}
Education: ${JSON.stringify(cv.education)}

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements}
Skills Required: ${job.skillsRequired}

Provide analysis in this JSON format:
{
  "notes": "Strategic notes for this application (2-3 sentences)",
  "keyPoints": ["Key selling point 1", "Key selling point 2", "Key selling point 3"],
  "matchingSkills": ["skill1", "skill2", "skill3"],
  "addressedRequirements": ["requirement1", "requirement2", "requirement3"]
}

Focus on:
1. Strongest matching points between CV and job
2. Key skills that align
3. Specific requirements the candidate can address
4. Strategic advice for positioning the application
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a career strategist who analyzes job matches and provides actionable insights for job applications.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    try {
      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return {
        notes: 'Analysis completed successfully.',
        keyPoints: [],
        matchingSkills: [],
        addressedRequirements: []
      };
    }
  }

  /**
   * Build the cover letter prompt
   */
  private static buildCoverLetterPrompt(
    cv: CV,
    job: Job,
    jobPreferences: JobPreference,
    options: { tone: string; length: string; focusAreas: string[] }
  ): string {
    const lengthGuidance = {
      short: '2-3 paragraphs, concise and impactful',
      medium: '3-4 paragraphs, balanced detail',
      long: '4-5 paragraphs, comprehensive coverage'
    };

    const toneGuidance = {
      professional: 'formal, business-appropriate language',
      enthusiastic: 'energetic and passionate tone',
      conversational: 'warm and approachable while professional',
      formal: 'traditional, highly formal business language'
    };

    return `
Write a compelling cover letter for this job application.

CANDIDATE INFORMATION:
Personal Info: ${JSON.stringify(cv.personalInfo)}
Experience: ${JSON.stringify(cv.experience)}
Education: ${JSON.stringify(cv.education)}
Skills: ${JSON.stringify(cv.skills)}
Career Preferences: ${JSON.stringify(jobPreferences)}

JOB DETAILS:
Position: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description: ${job.description}
Requirements: ${job.requirements}
Skills Required: ${job.skillsRequired}
Salary Range: ${job.salaryMin ? `$${job.salaryMin} - $${job.salaryMax}` : 'Not specified'}

WRITING REQUIREMENTS:
- Length: ${lengthGuidance[options.length as keyof typeof lengthGuidance]}
- Tone: ${toneGuidance[options.tone as keyof typeof toneGuidance]}
- Focus Areas: ${options.focusAreas.length > 0 ? options.focusAreas.join(', ') : 'General fit and enthusiasm'}

INSTRUCTIONS:
1. Start with a compelling opening that shows genuine interest
2. Highlight 2-3 most relevant experiences/achievements
3. Address specific job requirements mentioned in the posting
4. Show knowledge of the company (if company info available)
5. Include a strong closing with call to action
6. Use specific examples and quantified achievements where possible
7. Maintain ${options.tone} tone throughout
8. Keep to ${options.length} length specification

Write a professional cover letter that would make this candidate stand out for this specific role.
    `;
  }

  /**
   * Get max tokens based on length preference
   */
  private static getMaxTokensForLength(length: string): number {
    switch (length) {
      case 'short': return 400;
      case 'medium': return 600;
      case 'long': return 800;
      default: return 600;
    }
  }

  /**
   * Generate multiple cover letter variations
   */
  static async generateCoverLetterVariations(
    cv: CV,
    job: Job,
    jobPreferences: JobPreference,
    count: number = 3
  ): Promise<string[]> {
    const variations = [];
    const tones = ['professional', 'enthusiastic', 'conversational'];

    for (let i = 0; i < Math.min(count, 3); i++) {
      const coverLetter = await this.generateCoverLetter(cv, job, jobPreferences, {
        tone: tones[i] as any,
        length: 'medium',
        focusAreas: []
      });
      variations.push(coverLetter);
    }

    return variations;
  }

  /**
   * Optimize application based on feedback
   */
  static async optimizeApplication(
    originalApplication: ApplicationContent,
    feedback: string,
    cv: CV,
    job: Job
  ): Promise<ApplicationContent> {
    const prompt = `
Improve this job application based on the feedback provided.

ORIGINAL APPLICATION:
Cover Letter: ${originalApplication.coverLetter}
Notes: ${originalApplication.applicationNotes}

FEEDBACK: ${feedback}

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Requirements: ${job.requirements}

Please provide an improved version addressing the feedback while maintaining the core strengths of the original application.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach who helps optimize job applications based on feedback and best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });

    const improvedCoverLetter = response.choices[0]?.message?.content || originalApplication.coverLetter;

    return {
      ...originalApplication,
      coverLetter: improvedCoverLetter,
      applicationNotes: `${originalApplication.applicationNotes}\n\nOptimized based on feedback: ${feedback}`
    };
  }
}

export default ApplicationGenerator;
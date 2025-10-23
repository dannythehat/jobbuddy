import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmailResponseOptions {
  action: 'accept' | 'decline' | 'reschedule';
  tone: 'professional' | 'enthusiastic' | 'formal' | 'friendly';
  userPreferences?: {
    name?: string;
    preferredTimes?: string[];
    timezone?: string;
    unavailableDates?: string[];
    additionalNotes?: string;
  };
  interviewDetails?: {
    company: string;
    position: string;
    interviewer: string;
    originalDate?: string;
    originalTime?: string;
    location?: string;
  };
  rescheduleReason?: string;
  alternativeTimes?: Array<{
    date: string;
    time: string;
  }>;
}

export interface GeneratedEmailResponse {
  subject: string;
  body: string;
  tone: string;
  confidence: number;
  suggestions?: string[];
}

export class EmailResponseService {
  /**
   * Generate AI-powered email response for interview invitations
   */
  static async generateResponse(
    originalEmail: {
      subject: string;
      content: string;
      sender: string;
      senderName?: string;
    },
    options: EmailResponseOptions
  ): Promise<GeneratedEmailResponse> {
    try {
      const prompt = this.buildResponsePrompt(originalEmail, options);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional email assistant helping job seekers respond to interview invitations. 
            Generate appropriate, professional responses that maintain a positive impression while being clear and concise.
            Always respond with valid JSON only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      const parsedResult = JSON.parse(result);
      return this.validateAndSanitizeResponse(parsedResult, options);
      
    } catch (error) {
      console.error('Error generating email response:', error);
      return this.getFallbackResponse(originalEmail, options);
    }
  }

  /**
   * Generate multiple response variations for A/B testing
   */
  static async generateResponseVariations(
    originalEmail: {
      subject: string;
      content: string;
      sender: string;
      senderName?: string;
    },
    options: EmailResponseOptions,
    count: number = 3
  ): Promise<GeneratedEmailResponse[]> {
    const variations: GeneratedEmailResponse[] = [];
    const tones: EmailResponseOptions['tone'][] = ['professional', 'enthusiastic', 'formal', 'friendly'];
    
    for (let i = 0; i < count; i++) {
      const variationOptions = {
        ...options,
        tone: tones[i % tones.length],
      };
      
      try {
        const response = await this.generateResponse(originalEmail, variationOptions);
        variations.push(response);
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating variation ${i + 1}:`, error);
      }
    }
    
    return variations;
  }

  /**
   * Build the prompt for email response generation
   */
  private static buildResponsePrompt(
    originalEmail: {
      subject: string;
      content: string;
      sender: string;
      senderName?: string;
    },
    options: EmailResponseOptions
  ): string {
    const { action, tone, userPreferences, interviewDetails, rescheduleReason, alternativeTimes } = options;
    
    return `
Generate a professional email response to this interview invitation:

ORIGINAL EMAIL:
From: ${originalEmail.senderName || originalEmail.sender}
Subject: ${originalEmail.subject}
Content: ${originalEmail.content}

RESPONSE REQUIREMENTS:
Action: ${action}
Tone: ${tone}
${userPreferences?.name ? `User Name: ${userPreferences.name}` : ''}
${interviewDetails?.company ? `Company: ${interviewDetails.company}` : ''}
${interviewDetails?.position ? `Position: ${interviewDetails.position}` : ''}

${action === 'reschedule' ? `
RESCHEDULE DETAILS:
Reason: ${rescheduleReason || 'Schedule conflict'}
${alternativeTimes?.length ? `
Alternative Times:
${alternativeTimes.map(alt => `- ${alt.date} at ${alt.time}`).join('\n')}
` : ''}
${userPreferences?.preferredTimes?.length ? `
Preferred Times: ${userPreferences.preferredTimes.join(', ')}
` : ''}
${userPreferences?.timezone ? `Timezone: ${userPreferences.timezone}` : ''}
` : ''}

${userPreferences?.additionalNotes ? `
Additional Notes: ${userPreferences.additionalNotes}
` : ''}

RESPONSE GUIDELINES:
- ${action === 'accept' ? 'Express enthusiasm and confirm availability' : ''}
- ${action === 'decline' ? 'Be polite and professional, express gratitude' : ''}
- ${action === 'reschedule' ? 'Apologize for inconvenience, provide clear alternatives' : ''}
- Match the ${tone} tone throughout
- Keep it concise but complete
- Include relevant details from the original email
- Maintain professional courtesy
- End with appropriate closing

RESPOND WITH VALID JSON ONLY:
{
  "subject": "Re: [Original Subject]",
  "body": "Professional email body with proper formatting",
  "tone": "${tone}",
  "confidence": 0.95,
  "suggestions": ["Optional improvement suggestions"]
}

FORMATTING RULES:
- Use proper email formatting with line breaks
- Include appropriate greeting and closing
- Use professional language
- Keep paragraphs short and readable
`;
  }

  /**
   * Validate and sanitize the AI response
   */
  private static validateAndSanitizeResponse(
    result: any,
    options: EmailResponseOptions
  ): GeneratedEmailResponse {
    return {
      subject: result.subject || `Re: Interview Invitation`,
      body: result.body || this.getFallbackBody(options),
      tone: result.tone || options.tone,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : undefined,
    };
  }

  /**
   * Generate fallback response when AI fails
   */
  private static getFallbackResponse(
    originalEmail: {
      subject: string;
      content: string;
      sender: string;
      senderName?: string;
    },
    options: EmailResponseOptions
  ): GeneratedEmailResponse {
    const { action, interviewDetails, userPreferences } = options;
    
    let subject = `Re: ${originalEmail.subject}`;
    let body = '';
    
    const greeting = `Dear ${originalEmail.senderName || 'Hiring Manager'},\n\n`;
    const closing = `\nBest regards,\n${userPreferences?.name || '[Your Name]'}`;
    
    switch (action) {
      case 'accept':
        body = greeting +
          `Thank you for the interview invitation for the ${interviewDetails?.position || 'position'} role at ${interviewDetails?.company || 'your company'}.\n\n` +
          `I am excited about this opportunity and confirm my availability for the interview as scheduled.\n\n` +
          `Please let me know if you need any additional information from me prior to our meeting.\n\n` +
          `I look forward to speaking with you.` +
          closing;
        break;
        
      case 'decline':
        body = greeting +
          `Thank you for considering me for the ${interviewDetails?.position || 'position'} role at ${interviewDetails?.company || 'your company'}.\n\n` +
          `Unfortunately, I will not be able to proceed with the interview process at this time.\n\n` +
          `I appreciate your time and consideration.` +
          closing;
        break;
        
      case 'reschedule':
        body = greeting +
          `Thank you for the interview invitation for the ${interviewDetails?.position || 'position'} role.\n\n` +
          `I am very interested in this opportunity, however, I have a scheduling conflict at the proposed time.\n\n` +
          `Would it be possible to reschedule the interview? I am available at the following times:\n` +
          `${options.alternativeTimes?.map(alt => `- ${alt.date} at ${alt.time}`).join('\n') || '- [Please provide alternative times]'}\n\n` +
          `I apologize for any inconvenience and look forward to hearing from you.` +
          closing;
        break;
    }
    
    return {
      subject,
      body,
      tone: options.tone,
      confidence: 0.6,
    };
  }

  /**
   * Get fallback email body
   */
  private static getFallbackBody(options: EmailResponseOptions): string {
    const { action, userPreferences } = options;
    
    const greeting = `Dear Hiring Manager,\n\n`;
    const closing = `\nBest regards,\n${userPreferences?.name || '[Your Name]'}`;
    
    switch (action) {
      case 'accept':
        return greeting + `Thank you for the interview invitation. I confirm my availability and look forward to speaking with you.` + closing;
      case 'decline':
        return greeting + `Thank you for your consideration. Unfortunately, I will not be able to proceed with the interview process at this time.` + closing;
      case 'reschedule':
        return greeting + `Thank you for the interview invitation. I have a scheduling conflict and would appreciate the opportunity to reschedule.` + closing;
      default:
        return greeting + `Thank you for your email.` + closing;
    }
  }

  /**
   * Extract interview details from email content
   */
  static extractInterviewDetails(content: string): {
    date?: string;
    time?: string;
    location?: string;
    meetingUrl?: string;
    interviewer?: string;
    duration?: string;
  } {
    const details: any = {};
    
    // Extract dates (various formats)
    const datePatterns = [
      /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/gi,
      /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}/gi,
      /\d{1,2}\/\d{1,2}\/\d{4}/g,
      /\d{4}-\d{2}-\d{2}/g,
    ];
    
    for (const pattern of datePatterns) {
      const matches = content.match(pattern);
      if (matches && matches.length > 0) {
        details.date = matches[0];
        break;
      }
    }
    
    // Extract times
    const timePattern = /\b(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*(?:AM|PM|am|pm)\b/gi;
    const timeMatches = content.match(timePattern);
    if (timeMatches && timeMatches.length > 0) {
      details.time = timeMatches[0];
    }
    
    // Extract meeting URLs
    const urlPattern = /(https?:\/\/[^\s]+(?:zoom|teams|meet|webex)[^\s]*)/gi;
    const urlMatches = content.match(urlPattern);
    if (urlMatches && urlMatches.length > 0) {
      details.meetingUrl = urlMatches[0];
    }
    
    // Extract duration
    const durationPattern = /(?:(\d+)\s*(?:hour|hr|minute|min)s?)/gi;
    const durationMatches = content.match(durationPattern);
    if (durationMatches && durationMatches.length > 0) {
      details.duration = durationMatches[0];
    }
    
    // Extract interviewer names (basic pattern)
    const interviewerPattern = /(?:interview(?:er)?|meet(?:ing)?\s+with|speak(?:ing)?\s+with)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi;
    const interviewerMatches = content.match(interviewerPattern);
    if (interviewerMatches && interviewerMatches.length > 0) {
      details.interviewer = interviewerMatches[0].replace(/.*with\s+/i, '');
    }
    
    return details;
  }

  /**
   * Validate email before sending
   */
  static validateEmail(email: GeneratedEmailResponse): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required fields
    if (!email.subject || email.subject.trim().length === 0) {
      errors.push('Subject is required');
    }
    
    if (!email.body || email.body.trim().length === 0) {
      errors.push('Email body is required');
    }
    
    // Check email length
    if (email.body && email.body.length > 2000) {
      warnings.push('Email body is quite long - consider shortening');
    }
    
    if (email.body && email.body.length < 50) {
      warnings.push('Email body seems too short');
    }
    
    // Check for placeholder text
    if (email.body && email.body.includes('[Your Name]')) {
      warnings.push('Email contains placeholder text that should be replaced');
    }
    
    // Check confidence score
    if (email.confidence < 0.7) {
      warnings.push('AI confidence is low - review email carefully before sending');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export default EmailResponseService;
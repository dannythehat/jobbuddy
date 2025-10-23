import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClassificationResult {
  classification: 'interview_invite' | 'rejection' | 'request_info' | 'acknowledgment' | 'offer' | 'follow_up' | 'other';
  confidence: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  extractedData: {
    interviewDate?: Date;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: 'phone' | 'video' | 'in_person' | 'panel';
    interviewers?: string[];
    nextSteps?: string;
    deadline?: Date;
    salaryMention?: number;
    benefits?: string[];
    rejectionReason?: string;
    feedback?: string;
  };
  actionRequired: boolean;
  suggestedActions?: string[];
}

export class ResponseClassificationService {
  /**
   * Classify and extract data from job application response email
   */
  static async classifyResponse(
    subject: string,
    content: string,
    senderName?: string,
    jobTitle?: string,
    companyName?: string
  ): Promise<ClassificationResult> {
    try {
      const prompt = this.buildClassificationPrompt(subject, content, senderName, jobTitle, companyName);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert email classifier for job application responses. 
            Analyze emails and extract relevant information with high accuracy.
            Always respond with valid JSON only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsedResult = JSON.parse(result);
      
      // Validate and sanitize the result
      return this.validateAndSanitizeResult(parsedResult);
      
    } catch (error) {
      console.error('Error classifying response:', error);
      
      // Fallback classification
      return this.getFallbackClassification(subject, content);
    }
  }

  /**
   * Build the classification prompt
   */
  private static buildClassificationPrompt(
    subject: string,
    content: string,
    senderName?: string,
    jobTitle?: string,
    companyName?: string
  ): string {
    return `
Analyze this job application response email and classify it. Extract all relevant information.

EMAIL DETAILS:
Subject: ${subject}
Sender: ${senderName || 'Unknown'}
Job Title: ${jobTitle || 'Unknown'}
Company: ${companyName || 'Unknown'}

EMAIL CONTENT:
${content}

CLASSIFICATION OPTIONS:
- interview_invite: Email inviting for an interview
- rejection: Application rejected
- request_info: Requesting additional information
- acknowledgment: Confirming receipt of application
- offer: Job offer extended
- follow_up: Follow-up communication
- other: Doesn't fit other categories

RESPOND WITH VALID JSON ONLY:
{
  "classification": "one of the options above",
  "confidence": 0.95,
  "sentiment": "positive|neutral|negative",
  "sentimentScore": 0.8,
  "extractedData": {
    "interviewDate": "2024-01-15T10:00:00Z",
    "interviewTime": "10:00 AM",
    "interviewLocation": "123 Main St, Office 5B",
    "interviewType": "phone|video|in_person|panel",
    "interviewers": ["John Smith", "Jane Doe"],
    "nextSteps": "Please confirm your availability",
    "deadline": "2024-01-10T17:00:00Z",
    "salaryMention": 75000,
    "benefits": ["Health insurance", "401k"],
    "rejectionReason": "Position filled",
    "feedback": "Strong candidate but..."
  },
  "actionRequired": true,
  "suggestedActions": ["Confirm interview availability", "Prepare for interview"]
}

EXTRACTION RULES:
- Extract dates in ISO format
- Extract salary as numbers only
- Only include fields that are explicitly mentioned
- Be conservative with confidence scores
- Mark actionRequired=true if response needs user action
- Provide specific, actionable suggestions
`;
  }

  /**
   * Validate and sanitize the AI response
   */
  private static validateAndSanitizeResult(result: any): ClassificationResult {
    const validClassifications = [
      'interview_invite', 'rejection', 'request_info', 
      'acknowledgment', 'offer', 'follow_up', 'other'
    ];
    
    const validSentiments = ['positive', 'neutral', 'negative'];
    const validInterviewTypes = ['phone', 'video', 'in_person', 'panel'];

    return {
      classification: validClassifications.includes(result.classification) 
        ? result.classification 
        : 'other',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      sentiment: validSentiments.includes(result.sentiment) 
        ? result.sentiment 
        : 'neutral',
      sentimentScore: Math.max(-1, Math.min(1, result.sentimentScore || 0)),
      extractedData: {
        interviewDate: result.extractedData?.interviewDate 
          ? new Date(result.extractedData.interviewDate) 
          : undefined,
        interviewTime: result.extractedData?.interviewTime || undefined,
        interviewLocation: result.extractedData?.interviewLocation || undefined,
        interviewType: validInterviewTypes.includes(result.extractedData?.interviewType)
          ? result.extractedData.interviewType
          : undefined,
        interviewers: Array.isArray(result.extractedData?.interviewers)
          ? result.extractedData.interviewers
          : undefined,
        nextSteps: result.extractedData?.nextSteps || undefined,
        deadline: result.extractedData?.deadline 
          ? new Date(result.extractedData.deadline)
          : undefined,
        salaryMention: typeof result.extractedData?.salaryMention === 'number'
          ? result.extractedData.salaryMention
          : undefined,
        benefits: Array.isArray(result.extractedData?.benefits)
          ? result.extractedData.benefits
          : undefined,
        rejectionReason: result.extractedData?.rejectionReason || undefined,
        feedback: result.extractedData?.feedback || undefined,
      },
      actionRequired: Boolean(result.actionRequired),
      suggestedActions: Array.isArray(result.suggestedActions)
        ? result.suggestedActions
        : undefined,
    };
  }

  /**
   * Fallback classification when AI fails
   */
  private static getFallbackClassification(subject: string, content: string): ClassificationResult {
    const lowerSubject = subject.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    // Simple keyword-based classification
    let classification: ClassificationResult['classification'] = 'other';
    let confidence = 0.3;
    let sentiment: ClassificationResult['sentiment'] = 'neutral';
    let actionRequired = false;

    if (lowerSubject.includes('interview') || lowerContent.includes('interview')) {
      classification = 'interview_invite';
      confidence = 0.7;
      sentiment = 'positive';
      actionRequired = true;
    } else if (lowerSubject.includes('reject') || lowerContent.includes('reject') || 
               lowerContent.includes('unfortunately') || lowerContent.includes('not selected')) {
      classification = 'rejection';
      confidence = 0.8;
      sentiment = 'negative';
    } else if (lowerSubject.includes('offer') || lowerContent.includes('offer') ||
               lowerContent.includes('congratulations')) {
      classification = 'offer';
      confidence = 0.8;
      sentiment = 'positive';
      actionRequired = true;
    } else if (lowerSubject.includes('received') || lowerContent.includes('received') ||
               lowerContent.includes('thank you for applying')) {
      classification = 'acknowledgment';
      confidence = 0.6;
    }

    return {
      classification,
      confidence,
      sentiment,
      sentimentScore: sentiment === 'positive' ? 0.5 : sentiment === 'negative' ? -0.5 : 0,
      extractedData: {},
      actionRequired,
    };
  }

  /**
   * Batch classify multiple responses
   */
  static async batchClassifyResponses(
    responses: Array<{
      subject: string;
      content: string;
      senderName?: string;
      jobTitle?: string;
      companyName?: string;
    }>
  ): Promise<ClassificationResult[]> {
    const results: ClassificationResult[] = [];
    
    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < responses.length; i += batchSize) {
      const batch = responses.slice(i, i + batchSize);
      const batchPromises = batch.map(response => 
        this.classifyResponse(
          response.subject,
          response.content,
          response.senderName,
          response.jobTitle,
          response.companyName
        )
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < responses.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export default ResponseClassificationService;
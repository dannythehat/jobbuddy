import { Interview } from '../models/Interview';
import { Response } from '../models/Response';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import CalendarService, { CalendarEvent } from './calendarService';
import EmailResponseService from './emailResponseService';
import { Op } from 'sequelize';

export interface InterviewScheduleRequest {
  responseId: string;
  userAction: 'accept' | 'decline' | 'reschedule';
  rescheduleOptions?: {
    reason: string;
    alternativeTimes: Array<{
      date: string;
      time: string;
    }>;
  };
  calendarPreferences?: {
    provider: 'google' | 'outlook' | 'apple';
    credentials?: any;
    reminders?: Array<{
      type: 'email' | 'push' | 'sms';
      timing: number; // minutes before
    }>;
  };
  userPreferences?: {
    name: string;
    timezone: string;
    email: string;
  };
}

export interface SchedulingResult {
  success: boolean;
  interview?: Interview;
  calendarEventId?: string;
  emailResponse?: {
    subject: string;
    body: string;
    sent: boolean;
  };
  errors?: string[];
  warnings?: string[];
}

export class InterviewScheduler {
  private calendarService: CalendarService;

  constructor() {
    this.calendarService = new CalendarService();
  }

  /**
   * Process interview scheduling request
   */
  async scheduleInterview(request: InterviewScheduleRequest): Promise<SchedulingResult> {
    try {
      // Get the response and related data
      const response = await Response.findByPk(request.responseId, {
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job'
              }
            ]
          }
        ]
      });

      if (!response) {
        return {
          success: false,
          errors: ['Response not found']
        };
      }

      if (response.classification !== 'interview_invite') {
        return {
          success: false,
          errors: ['Response is not an interview invitation']
        };
      }

      const result: SchedulingResult = {
        success: false,
        errors: [],
        warnings: []
      };

      // Process based on user action
      switch (request.userAction) {
        case 'accept':
          return await this.handleAcceptInterview(response, request, result);
        case 'decline':
          return await this.handleDeclineInterview(response, request, result);
        case 'reschedule':
          return await this.handleRescheduleInterview(response, request, result);
        default:
          result.errors!.push('Invalid user action');
          return result;
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      return {
        success: false,
        errors: ['Failed to process interview scheduling request']
      };
    }
  }

  /**
   * Handle interview acceptance
   */
  private async handleAcceptInterview(
    response: Response,
    request: InterviewScheduleRequest,
    result: SchedulingResult
  ): Promise<SchedulingResult> {
    try {
      const extractedData = response.extractedData;
      
      if (!extractedData?.interviewDate) {
        result.errors!.push('Interview date not found in response');
        return result;
      }

      // Create interview record
      const interview = await Interview.create({
        applicationId: response.applicationId,
        responseId: response.id,
        title: `Interview - ${response.application?.job?.title || 'Position'}`,
        description: `Interview for ${response.application?.job?.title} at ${response.application?.job?.company}`,
        scheduledDate: new Date(extractedData.interviewDate),
        duration: this.parseDuration(extractedData.interviewTime) || 60,
        timezone: request.userPreferences?.timezone || 'UTC',
        location: extractedData.interviewLocation,
        meetingUrl: this.extractMeetingUrl(response.content),
        type: extractedData.interviewType || 'video',
        format: 'one_on_one',
        interviewers: this.parseInterviewers(response.content, extractedData.interviewers),
        status: 'confirmed',
        userResponse: 'accepted',
        userResponseDate: new Date(),
        calendarSynced: false,
        confirmationEmailSent: false,
        thankYouEmailSent: false,
        rescheduleCount: 0,
        userId: response.userId
      });

      // Create calendar event if credentials provided
      if (request.calendarPreferences?.credentials) {
        try {
          this.calendarService.setCredentials(request.calendarPreferences.credentials);
          
          const calendarEvent: CalendarEvent = {
            title: interview.title,
            description: interview.description,
            startTime: interview.scheduledDate,
            endTime: new Date(interview.scheduledDate.getTime() + interview.duration * 60000),
            location: interview.location,
            meetingUrl: interview.meetingUrl,
            timezone: interview.timezone,
            attendees: interview.interviewers.map(interviewer => ({
              email: interviewer.email || '',
              name: interviewer.name
            })).filter(attendee => attendee.email),
            reminders: request.calendarPreferences.reminders || [
              { method: 'email', minutes: 1440 }, // 24 hours
              { method: 'popup', minutes: 60 },   // 1 hour
              { method: 'popup', minutes: 15 }    // 15 minutes
            ]
          };

          const eventId = await this.calendarService.createEvent(calendarEvent);
          
          await interview.update({
            calendarEventId: eventId,
            calendarProvider: request.calendarPreferences.provider,
            calendarSynced: true
          });

          result.calendarEventId = eventId;
        } catch (calendarError) {
          console.error('Calendar creation failed:', calendarError);
          result.warnings!.push('Interview created but calendar sync failed');
        }
      }

      // Generate confirmation email
      const emailResponse = await EmailResponseService.generateResponse(
        {
          subject: response.subject,
          content: response.content,
          sender: response.sender,
          senderName: response.senderName
        },
        {
          action: 'accept',
          tone: 'professional',
          userPreferences: request.userPreferences,
          interviewDetails: {
            company: response.application?.job?.company || '',
            position: response.application?.job?.title || '',
            interviewer: response.senderName || response.sender,
            originalDate: extractedData.interviewDate?.toString(),
            originalTime: extractedData.interviewTime,
            location: extractedData.interviewLocation
          }
        }
      );

      // Update response status
      await response.update({
        processed: true,
        processingDate: new Date(),
        processingNotes: 'Interview accepted and scheduled',
        actionTaken: 'Interview scheduled and confirmation email generated'
      });

      result.success = true;
      result.interview = interview;
      result.emailResponse = {
        subject: emailResponse.subject,
        body: emailResponse.body,
        sent: false // Will be sent by the controller
      };

      return result;
    } catch (error) {
      console.error('Error handling interview acceptance:', error);
      result.errors!.push('Failed to process interview acceptance');
      return result;
    }
  }

  /**
   * Handle interview decline
   */
  private async handleDeclineInterview(
    response: Response,
    request: InterviewScheduleRequest,
    result: SchedulingResult
  ): Promise<SchedulingResult> {
    try {
      // Generate decline email
      const emailResponse = await EmailResponseService.generateResponse(
        {
          subject: response.subject,
          content: response.content,
          sender: response.sender,
          senderName: response.senderName
        },
        {
          action: 'decline',
          tone: 'professional',
          userPreferences: request.userPreferences,
          interviewDetails: {
            company: response.application?.job?.company || '',
            position: response.application?.job?.title || '',
            interviewer: response.senderName || response.sender
          }
        }
      );

      // Update response and application status
      await response.update({
        processed: true,
        processingDate: new Date(),
        processingNotes: 'Interview declined',
        actionTaken: 'Interview declined and response email generated'
      });

      // Update application status
      if (response.application) {
        await response.application.update({
          status: 'withdrawn'
        });
      }

      result.success = true;
      result.emailResponse = {
        subject: emailResponse.subject,
        body: emailResponse.body,
        sent: false
      };

      return result;
    } catch (error) {
      console.error('Error handling interview decline:', error);
      result.errors!.push('Failed to process interview decline');
      return result;
    }
  }

  /**
   * Handle interview reschedule
   */
  private async handleRescheduleInterview(
    response: Response,
    request: InterviewScheduleRequest,
    result: SchedulingResult
  ): Promise<SchedulingResult> {
    try {
      if (!request.rescheduleOptions) {
        result.errors!.push('Reschedule options are required');
        return result;
      }

      // Generate reschedule email
      const emailResponse = await EmailResponseService.generateResponse(
        {
          subject: response.subject,
          content: response.content,
          sender: response.sender,
          senderName: response.senderName
        },
        {
          action: 'reschedule',
          tone: 'professional',
          userPreferences: request.userPreferences,
          interviewDetails: {
            company: response.application?.job?.company || '',
            position: response.application?.job?.title || '',
            interviewer: response.senderName || response.sender,
            originalDate: response.extractedData?.interviewDate?.toString(),
            originalTime: response.extractedData?.interviewTime
          },
          rescheduleReason: request.rescheduleOptions.reason,
          alternativeTimes: request.rescheduleOptions.alternativeTimes
        }
      );

      // Create interview record with pending status
      const interview = await Interview.create({
        applicationId: response.applicationId,
        responseId: response.id,
        title: `Interview - ${response.application?.job?.title || 'Position'} (Reschedule Requested)`,
        description: `Interview reschedule requested for ${response.application?.job?.title} at ${response.application?.job?.company}`,
        scheduledDate: response.extractedData?.interviewDate ? new Date(response.extractedData.interviewDate) : new Date(),
        duration: 60,
        timezone: request.userPreferences?.timezone || 'UTC',
        location: response.extractedData?.interviewLocation,
        type: response.extractedData?.interviewType || 'video',
        format: 'one_on_one',
        interviewers: this.parseInterviewers(response.content, response.extractedData?.interviewers),
        status: 'pending',
        userResponse: 'reschedule_requested',
        userResponseDate: new Date(),
        calendarSynced: false,
        confirmationEmailSent: false,
        thankYouEmailSent: false,
        rescheduleCount: 1,
        rescheduleReason: request.rescheduleOptions.reason,
        originalDate: response.extractedData?.interviewDate ? new Date(response.extractedData.interviewDate) : undefined,
        userId: response.userId
      });

      // Update response status
      await response.update({
        processed: true,
        processingDate: new Date(),
        processingNotes: 'Interview reschedule requested',
        actionTaken: 'Reschedule request sent'
      });

      result.success = true;
      result.interview = interview;
      result.emailResponse = {
        subject: emailResponse.subject,
        body: emailResponse.body,
        sent: false
      };

      return result;
    } catch (error) {
      console.error('Error handling interview reschedule:', error);
      result.errors!.push('Failed to process interview reschedule');
      return result;
    }
  }

  /**
   * Get upcoming interviews for a user
   */
  async getUpcomingInterviews(userId: string, days: number = 7): Promise<Interview[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await Interview.findAll({
      where: {
        userId,
        scheduledDate: {
          [Op.between]: [startDate, endDate]
        },
        status: {
          [Op.in]: ['confirmed', 'pending']
        }
      },
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            {
              model: Job,
              as: 'job'
            }
          ]
        }
      ],
      order: [['scheduledDate', 'ASC']]
    });
  }

  /**
   * Send interview reminders
   */
  async sendInterviewReminders(): Promise<void> {
    try {
      const now = new Date();
      const interviews = await Interview.findAll({
        where: {
          status: 'confirmed',
          scheduledDate: {
            [Op.gt]: now
          }
        },
        include: [
          {
            model: Application,
            as: 'application',
            include: [
              {
                model: Job,
                as: 'job'
              }
            ]
          }
        ]
      });

      for (const interview of interviews) {
        const timeUntilInterview = interview.scheduledDate.getTime() - now.getTime();
        const minutesUntilInterview = Math.floor(timeUntilInterview / (1000 * 60));

        // Check each reminder
        for (const reminder of interview.reminders) {
          if (!reminder.sent && minutesUntilInterview <= reminder.timing) {
            try {
              await this.sendReminder(interview, reminder);
              
              // Update reminder as sent
              const updatedReminders = interview.reminders.map(r => 
                r.timing === reminder.timing && r.type === reminder.type
                  ? { ...r, sent: true, sentDate: new Date() }
                  : r
              );
              
              await interview.update({ reminders: updatedReminders });
            } catch (error) {
              console.error(`Failed to send reminder for interview ${interview.id}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending interview reminders:', error);
    }
  }

  /**
   * Send individual reminder
   */
  private async sendReminder(interview: Interview, reminder: any): Promise<void> {
    // This would integrate with your notification system
    // For now, just log the reminder
    console.log(`Reminder: Interview "${interview.title}" in ${reminder.timing} minutes`);
    
    // TODO: Implement actual notification sending
    // - Email reminders
    // - Push notifications
    // - SMS reminders
  }

  /**
   * Parse duration from time string
   */
  private parseDuration(timeString?: string): number | undefined {
    if (!timeString) return undefined;
    
    // Look for duration indicators
    const durationMatch = timeString.match(/(\d+)\s*(hour|hr|minute|min)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      return unit.startsWith('hour') || unit.startsWith('hr') ? value * 60 : value;
    }
    
    return undefined;
  }

  /**
   * Extract meeting URL from content
   */
  private extractMeetingUrl(content: string): string | undefined {
    const urlMatch = content.match(/(https?:\/\/[^\s]+(?:zoom|teams|meet|webex)[^\s]*)/i);
    return urlMatch ? urlMatch[1] : undefined;
  }

  /**
   * Parse interviewers from content
   */
  private parseInterviewers(content: string, extractedInterviewers?: string[]): Array<{
    name: string;
    title?: string;
    email?: string;
    phone?: string;
  }> {
    const interviewers: Array<{
      name: string;
      title?: string;
      email?: string;
      phone?: string;
    }> = [];

    // Use extracted interviewers if available
    if (extractedInterviewers && extractedInterviewers.length > 0) {
      extractedInterviewers.forEach(name => {
        interviewers.push({ name });
      });
    } else {
      // Try to extract from content
      const namePattern = /(?:interview(?:er)?|meet(?:ing)?\s+with|speak(?:ing)?\s+with)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi;
      const matches = content.match(namePattern);
      
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/.*with\s+/i, '').trim();
          if (name && !interviewers.some(i => i.name === name)) {
            interviewers.push({ name });
          }
        });
      }
    }

    // If no interviewers found, add a placeholder
    if (interviewers.length === 0) {
      interviewers.push({ name: 'Hiring Manager' });
    }

    return interviewers;
  }
}

export default InterviewScheduler;
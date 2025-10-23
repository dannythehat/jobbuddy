import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingUrl?: string;
  attendees?: Array<{
    email: string;
    name?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: Array<{
    method: 'email' | 'popup';
    minutes: number;
  }>;
  timezone?: string;
}

export interface CalendarCredentials {
  accessToken: string;
  refreshToken: string;
  expiryDate?: number;
}

export class CalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Set user credentials for calendar access
   */
  setCredentials(credentials: CalendarCredentials) {
    this.oauth2Client.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
      expiry_date: credentials.expiryDate,
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string): Promise<CalendarCredentials> {
    const { tokens } = await this.oauth2Client.getToken(code);
    
    return {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token!,
      expiryDate: tokens.expiry_date,
    };
  }

  /**
   * Refresh access token if needed
   */
  async refreshTokenIfNeeded(): Promise<void> {
    try {
      await this.oauth2Client.getAccessToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh calendar access token');
    }
  }

  /**
   * Create a calendar event
   */
  async createEvent(event: CalendarEvent): Promise<string> {
    try {
      await this.refreshTokenIfNeeded();

      const calendarEvent = {
        summary: event.title,
        description: this.formatEventDescription(event),
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timezone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timezone || 'UTC',
        },
        location: event.location,
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })),
        reminders: {
          useDefault: false,
          overrides: event.reminders || [
            { method: 'email', minutes: 1440 }, // 24 hours
            { method: 'popup', minutes: 60 },   // 1 hour
            { method: 'popup', minutes: 15 },   // 15 minutes
          ],
        },
        conferenceData: event.meetingUrl ? {
          createRequest: {
            requestId: `jobbuddy-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        } : undefined,
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent,
        conferenceDataVersion: event.meetingUrl ? 1 : 0,
        sendUpdates: 'all',
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(eventId: string, event: CalendarEvent): Promise<void> {
    try {
      await this.refreshTokenIfNeeded();

      const calendarEvent = {
        summary: event.title,
        description: this.formatEventDescription(event),
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: event.timezone || 'UTC',
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: event.timezone || 'UTC',
        },
        location: event.location,
        attendees: event.attendees?.map(attendee => ({
          email: attendee.email,
          displayName: attendee.name,
        })),
        reminders: {
          useDefault: false,
          overrides: event.reminders || [
            { method: 'email', minutes: 1440 },
            { method: 'popup', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      };

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: calendarEvent,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string): Promise<void> {
    try {
      await this.refreshTokenIfNeeded();

      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Get calendar event details
   */
  async getEvent(eventId: string): Promise<any> {
    try {
      await this.refreshTokenIfNeeded();

      const response = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      return response.data;
    } catch (error) {
      console.error('Error getting calendar event:', error);
      throw new Error('Failed to get calendar event');
    }
  }

  /**
   * Check for calendar conflicts
   */
  async checkConflicts(startTime: Date, endTime: Date): Promise<any[]> {
    try {
      await this.refreshTokenIfNeeded();

      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error checking calendar conflicts:', error);
      return [];
    }
  }

  /**
   * Get user's calendar list
   */
  async getCalendars(): Promise<any[]> {
    try {
      await this.refreshTokenIfNeeded();

      const response = await this.calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      console.error('Error getting calendars:', error);
      return [];
    }
  }

  /**
   * Find free time slots
   */
  async findFreeTime(
    startDate: Date,
    endDate: Date,
    duration: number, // in minutes
    workingHours: { start: number; end: number } = { start: 9, end: 17 }
  ): Promise<Array<{ start: Date; end: Date }>> {
    try {
      await this.refreshTokenIfNeeded();

      const response = await this.calendar.freebusy.query({
        resource: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: 'primary' }],
        },
      });

      const busyTimes = response.data.calendars?.primary?.busy || [];
      const freeSlots: Array<{ start: Date; end: Date }> = [];

      // Simple algorithm to find free slots
      // This is a basic implementation - could be enhanced
      let currentTime = new Date(startDate);
      
      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);
        
        // Check if this slot conflicts with busy times
        const hasConflict = busyTimes.some((busy: any) => {
          const busyStart = new Date(busy.start);
          const busyEnd = new Date(busy.end);
          return (currentTime < busyEnd && slotEnd > busyStart);
        });

        // Check if within working hours
        const hour = currentTime.getHours();
        const isWorkingHours = hour >= workingHours.start && hour < workingHours.end;

        if (!hasConflict && isWorkingHours) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(slotEnd),
          });
        }

        // Move to next 30-minute slot
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }

      return freeSlots.slice(0, 10); // Return first 10 free slots
    } catch (error) {
      console.error('Error finding free time:', error);
      return [];
    }
  }

  /**
   * Format event description with interview details
   */
  private formatEventDescription(event: CalendarEvent): string {
    let description = event.description || '';
    
    if (event.meetingUrl) {
      description += `\n\nJoin Meeting: ${event.meetingUrl}`;
    }

    description += '\n\n--- Created by JobBuddy ---';
    description += '\nThis interview was automatically scheduled based on your job application.';
    
    return description;
  }

  /**
   * Parse calendar event from email content
   */
  static parseEventFromEmail(content: string): Partial<CalendarEvent> {
    const event: Partial<CalendarEvent> = {};
    
    // Extract meeting URLs
    const urlRegex = /(https?:\/\/[^\s]+(?:zoom|teams|meet|webex)[^\s]*)/gi;
    const urls = content.match(urlRegex);
    if (urls && urls.length > 0) {
      event.meetingUrl = urls[0];
    }

    // Extract phone numbers
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const phones = content.match(phoneRegex);
    if (phones && phones.length > 0) {
      event.location = `Phone: ${phones[0]}`;
    }

    // Extract addresses (basic pattern)
    const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)/gi;
    const addresses = content.match(addressRegex);
    if (addresses && addresses.length > 0) {
      event.location = addresses[0];
    }

    return event;
  }
}

export default CalendarService;
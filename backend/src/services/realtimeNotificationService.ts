import { EventEmitter } from 'events';
import { logger } from '../config/logger';

interface Notification {
  id: string;
  userId: string;
  type: 'job_match' | 'interview_reminder' | 'skill_milestone' | 'market_alert' | 'learning_update';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  metadata?: any;
  createdAt: Date;
  readAt?: Date;
  dismissed?: boolean;
}

interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  types: string[];
}

export class RealtimeNotificationService extends EventEmitter {
  private notifications: Map<string, Notification[]> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private activeConnections: Map<string, any> = new Map();

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.on('job_matched', this.handleJobMatch.bind(this));
    this.on('interview_scheduled', this.handleInterviewReminder.bind(this));
    this.on('skill_milestone', this.handleSkillMilestone.bind(this));
    this.on('market_change', this.handleMarketAlert.bind(this));
  }

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    metadata?: any
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      priority,
      metadata,
      createdAt: new Date()
    };

    // Store notification
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.unshift(notification);
    
    // Keep only last 50 notifications per user
    if (userNotifications.length > 50) {
      userNotifications.splice(50);
    }
    
    this.notifications.set(userId, userNotifications);

    // Send real-time notification if user is connected
    await this.sendRealtimeNotification(userId, notification);

    // Handle other delivery methods based on preferences
    await this.processNotificationDelivery(userId, notification);

    return notification;
  }

  private async sendRealtimeNotification(userId: string, notification: Notification): Promise<void> {
    const connection = this.activeConnections.get(userId);
    if (connection && connection.readyState === 1) {
      try {
        connection.send(JSON.stringify({
          type: 'notification',
          data: notification
        }));
      } catch (error) {
        logger.error('Real-time notification send error:', error);
      }
    }
  }

  private async processNotificationDelivery(userId: string, notification: Notification): Promise<void> {
    const prefs = this.preferences.get(userId);
    if (!prefs) return;

    // Check if user wants this type of notification
    if (!prefs.types.includes(notification.type)) return;

    // Handle different delivery methods
    if (prefs.email) {
      await this.sendEmailNotification(userId, notification);
    }

    if (prefs.push) {
      await this.sendPushNotification(userId, notification);
    }
  }

  private async sendEmailNotification(userId: string, notification: Notification): Promise<void> {
    // Email sending logic would go here
    logger.info(`Email notification sent to user ${userId}: ${notification.title}`);
  }

  private async sendPushNotification(userId: string, notification: Notification): Promise<void> {
    // Push notification logic would go here
    logger.info(`Push notification sent to user ${userId}: ${notification.title}`);
  }

  // Event handlers
  private async handleJobMatch(data: { userId: string; job: any; matchScore: number }): Promise<void> {
    await this.createNotification(
      data.userId,
      'job_match',
      'New Job Match Found!',
      `Found a ${data.matchScore}% match for ${data.job.title} at ${data.job.company}`,
      data.matchScore > 80 ? 'high' : 'medium',
      { job: data.job, matchScore: data.matchScore }
    );
  }

  private async handleInterviewReminder(data: { userId: string; interview: any }): Promise<void> {
    await this.createNotification(
      data.userId,
      'interview_reminder',
      'Interview Reminder',
      `Your interview with ${data.interview.company} is in 1 hour`,
      'high',
      { interview: data.interview }
    );
  }

  private async handleSkillMilestone(data: { userId: string; skill: string; milestone: string }): Promise<void> {
    await this.createNotification(
      data.userId,
      'skill_milestone',
      'Skill Milestone Achieved!',
      `Congratulations! You've reached ${data.milestone} in ${data.skill}`,
      'medium',
      { skill: data.skill, milestone: data.milestone }
    );
  }

  private async handleMarketAlert(data: { userId: string; alert: any }): Promise<void> {
    await this.createNotification(
      data.userId,
      'market_alert',
      'Market Alert',
      data.alert.message,
      data.alert.priority || 'medium',
      { alert: data.alert }
    );
  }

  // User management
  connectUser(userId: string, connection: any): void {
    this.activeConnections.set(userId, connection);
    logger.info(`User ${userId} connected for real-time notifications`);
  }

  disconnectUser(userId: string): void {
    this.activeConnections.delete(userId);
    logger.info(`User ${userId} disconnected from real-time notifications`);
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    const notifications = this.notifications.get(userId) || [];
    return notifications.slice(0, limit);
  }

  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const notifications = this.notifications.get(userId) || [];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.readAt = new Date();
      return true;
    }
    
    return false;
  }

  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<void> {
    const current = this.preferences.get(userId) || {
      userId,
      email: true,
      push: true,
      inApp: true,
      frequency: 'immediate',
      types: ['job_match', 'interview_reminder', 'skill_milestone', 'market_alert']
    };

    this.preferences.set(userId, { ...current, ...preferences });
  }
}
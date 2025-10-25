// Phase 7.1.1: Job Board Provider Registry
import { BaseJobBoardClient } from './BaseJobBoardClient';
import { LinkedInClient } from './LinkedInClient';
import { IndeedClient } from './IndeedClient';
import { GlassdoorClient } from './GlassdoorClient';
import { ZipRecruiterClient } from './ZipRecruiterClient';
import { MonsterClient } from './MonsterClient';
import { ReedClient } from './ReedClient';
import { SeekClient } from './SeekClient';
import { NaukriClient } from './NaukriClient';
import { DiceClient } from './DiceClient';
import { WellfoundClient } from './WellfoundClient';

export interface ProviderMetadata {
  id: string;
  name: string;
  displayName: string;
  region: string[];
  currency: string;
  rateLimit: number;
  features: string[];
  description: string;
}

export class JobBoardProviderRegistry {
  private static clients: Map<string, BaseJobBoardClient> = new Map();
  private static metadata: Map<string, ProviderMetadata> = new Map();

  static {
    this.registerProviders();
  }

  private static registerProviders() {
    // LinkedIn
    this.register('linkedin', new LinkedInClient(), {
      id: 'linkedin',
      name: 'LinkedIn',
      displayName: 'LinkedIn',
      region: ['Global'],
      currency: 'USD',
      rateLimit: 100,
      features: ['Professional Network', 'Company Insights', 'Direct Apply'],
      description: 'Professional networking platform with extensive job listings'
    });

    // Indeed
    this.register('indeed', new IndeedClient(), {
      id: 'indeed',
      name: 'Indeed',
      displayName: 'Indeed',
      region: ['Global'],
      currency: 'USD',
      rateLimit: 100,
      features: ['High Volume', 'Salary Info', 'Company Reviews'],
      description: 'World\'s largest job site with millions of listings'
    });

    // Glassdoor
    this.register('glassdoor', new GlassdoorClient(), {
      id: 'glassdoor',
      name: 'Glassdoor',
      displayName: 'Glassdoor',
      region: ['Global'],
      currency: 'USD',
      rateLimit: 1000,
      features: ['Company Reviews', 'Salary Transparency', 'Interview Insights'],
      description: 'Job search with company reviews and salary information'
    });

    // ZipRecruiter
    this.register('ziprecruiter', new ZipRecruiterClient(), {
      id: 'ziprecruiter',
      name: 'ZipRecruiter',
      displayName: 'ZipRecruiter',
      region: ['US', 'UK', 'CA'],
      currency: 'USD',
      rateLimit: 500,
      features: ['AI Matching', 'One-Click Apply', 'Urgency Indicators'],
      description: 'AI-powered job matching with high-volume listings'
    });

    // Monster
    this.register('monster', new MonsterClient(), {
      id: 'monster',
      name: 'Monster',
      displayName: 'Monster',
      region: ['Global'],
      currency: 'USD',
      rateLimit: 200,
      features: ['Traditional Job Board', 'Career Advice', 'Resume Services'],
      description: 'Established job board with global reach'
    });

    // Reed (UK)
    this.register('reed', new ReedClient(), {
      id: 'reed',
      name: 'Reed',
      displayName: 'Reed.co.uk',
      region: ['UK'],
      currency: 'GBP',
      rateLimit: 200,
      features: ['UK Market Leader', 'Recruitment Agency', 'Career Advice'],
      description: 'Leading UK job board with extensive local listings'
    });

    // Seek (Australia/NZ)
    this.register('seek', new SeekClient(), {
      id: 'seek',
      name: 'Seek',
      displayName: 'SEEK',
      region: ['AU', 'NZ', 'HK', 'SG', 'TH'],
      currency: 'AUD',
      rateLimit: 300,
      features: ['APAC Leader', 'Career Advice', 'Salary Tools'],
      description: 'Leading job board in Australia and Asia-Pacific'
    });

    // Naukri (India)
    this.register('naukri', new NaukriClient(), {
      id: 'naukri',
      name: 'Naukri',
      displayName: 'Naukri.com',
      region: ['IN'],
      currency: 'INR',
      rateLimit: 250,
      features: ['India Market Leader', 'Skill Assessment', 'Resume Services'],
      description: 'India\'s largest job portal with millions of opportunities'
    });

    // Dice (Tech)
    this.register('dice', new DiceClient(), {
      id: 'dice',
      name: 'Dice',
      displayName: 'Dice',
      region: ['US', 'UK'],
      currency: 'USD',
      rateLimit: 150,
      features: ['Tech-Focused', 'Skills Tracking', 'Certifications', 'Clearance Jobs'],
      description: 'Premier tech job board for IT professionals'
    });

    // Wellfound (Startups)
    this.register('wellfound', new WellfoundClient(), {
      id: 'wellfound',
      name: 'Wellfound',
      displayName: 'Wellfound (AngelList)',
      region: ['Global'],
      currency: 'USD',
      rateLimit: 100,
      features: ['Startup Jobs', 'Equity Info', 'Company Stage', 'Direct Founders'],
      description: 'Startup and tech jobs with equity and company insights'
    });
  }

  private static register(
    id: string,
    client: BaseJobBoardClient,
    metadata: ProviderMetadata
  ) {
    this.clients.set(id, client);
    this.metadata.set(id, metadata);
  }

  static getClient(providerId: string): BaseJobBoardClient | undefined {
    return this.clients.get(providerId);
  }

  static getMetadata(providerId: string): ProviderMetadata | undefined {
    return this.metadata.get(providerId);
  }

  static getAllProviders(): string[] {
    return Array.from(this.clients.keys());
  }

  static getAllMetadata(): ProviderMetadata[] {
    return Array.from(this.metadata.values());
  }

  static getProvidersByRegion(region: string): ProviderMetadata[] {
    return this.getAllMetadata().filter(m => 
      m.region.includes(region) || m.region.includes('Global')
    );
  }

  static isProviderSupported(providerId: string): boolean {
    return this.clients.has(providerId);
  }
}

import { Op } from 'sequelize';
import { ABTest } from '../models/ABTest';
import { ABTestParticipation } from '../models/ABTestParticipation';
import { Application } from '../models/Application';
import { User } from '../models/User';

export interface ABTestConfig {
  name: string;
  description: string;
  type: 'cover_letter' | 'application_method' | 'timing' | 'cv_template' | 'subject_line' | 'follow_up';
  variants: Array<{
    name: string;
    content: any;
    weight: number;
  }>;
  targetMetric: 'response_rate' | 'interview_rate' | 'offer_rate' | 'click_rate' | 'open_rate';
  minimumSampleSize: number;
  confidenceLevel: number;
  expectedEffect: number;
  duration?: number;
  targetAudience?: {
    industries?: string[];
    experienceLevels?: string[];
    locations?: string[];
    jobTypes?: string[];
  };
}

export interface VariantAssignment {
  testId: string;
  variantId: string;
  variantName: string;
  content: any;
}

export interface TestResults {
  testId: string;
  winner?: string;
  confidence: number;
  statisticalSignificance: boolean;
  pValue: number;
  effectSize: number;
  variants: Array<{
    id: string;
    name: string;
    participants: number;
    conversions: number;
    conversionRate: number;
    confidenceInterval: { lower: number; upper: number };
  }>;
  recommendations: string[];
}

export class ABTestingService {
  
  /**
   * Create a new A/B test
   */
  async createTest(userId: string, config: ABTestConfig): Promise<ABTest> {
    // Validate variants
    this.validateVariants(config.variants);
    
    // Generate variant IDs
    const variants = config.variants.map((variant, index) => ({
      id: `variant_${index + 1}`,
      name: variant.name,
      content: variant.content,
      weight: variant.weight
    }));
    
    const test = await ABTest.create({
      name: config.name,
      description: config.description,
      type: config.type,
      variants,
      targetMetric: config.targetMetric,
      minimumSampleSize: config.minimumSampleSize,
      confidenceLevel: config.confidenceLevel,
      expectedEffect: config.expectedEffect,
      duration: config.duration,
      targetAudience: config.targetAudience,
      createdBy: userId,
      userId
    });
    
    return test;
  }
  
  /**
   * Start an A/B test
   */
  async startTest(testId: string): Promise<ABTest> {
    const test = await ABTest.findByPk(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    if (test.status !== 'draft') {
      throw new Error('Only draft tests can be started');
    }
    
    test.status = 'running';
    test.startDate = new Date();
    
    if (test.duration) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + test.duration);
      test.endDate = endDate;
    }
    
    await test.save();
    return test;
  }
  
  /**
   * Assign a user to a variant for a specific test
   */
  async assignVariant(testId: string, userId: string, applicationId?: string, context?: any): Promise<VariantAssignment> {
    const test = await ABTest.findByPk(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    if (test.status !== 'running') {
      throw new Error('Test is not currently running');
    }
    
    // Check if user is already assigned to this test
    const existingParticipation = await ABTestParticipation.findOne({
      where: {
        testId,
        userId,
        ...(applicationId && { applicationId })
      }
    });
    
    if (existingParticipation) {
      const variant = test.variants.find(v => v.id === existingParticipation.variantId);
      return {
        testId,
        variantId: existingParticipation.variantId,
        variantName: existingParticipation.variantName,
        content: variant?.content
      };
    }
    
    // Check if user matches target audience
    if (test.targetAudience && !this.matchesTargetAudience(context, test.targetAudience)) {
      throw new Error('User does not match target audience criteria');
    }
    
    // Assign variant based on weights
    const selectedVariant = this.selectVariantByWeight(test.variants);
    
    // Create participation record
    await ABTestParticipation.create({
      testId,
      userId,
      applicationId,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      assignedAt: new Date(),
      context
    });
    
    return {
      testId,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      content: selectedVariant.content
    };
  }
  
  /**
   * Record a conversion event
   */
  async recordConversion(
    testId: string, 
    userId: string, 
    conversionType: 'response' | 'interview' | 'offer' | 'click' | 'open',
    applicationId?: string,
    conversionValue?: number
  ): Promise<void> {
    const participation = await ABTestParticipation.findOne({
      where: {
        testId,
        userId,
        ...(applicationId && { applicationId })
      }
    });
    
    if (!participation) {
      throw new Error('User is not participating in this test');
    }
    
    if (participation.converted) {
      return; // Already converted
    }
    
    participation.converted = true;
    participation.conversionType = conversionType;
    participation.conversionValue = conversionValue;
    participation.convertedAt = new Date();
    
    await participation.save();
    
    // Check if test should be auto-completed
    await this.checkTestCompletion(testId);
  }
  
  /**
   * Analyze test results and determine statistical significance
   */
  async analyzeTest(testId: string): Promise<TestResults> {
    const test = await ABTest.findByPk(testId, {
      include: [ABTestParticipation]
    });
    
    if (!test) {
      throw new Error('Test not found');
    }
    
    const participations = await ABTestParticipation.findAll({
      where: { testId }
    });
    
    // Group by variant
    const variantStats = new Map();
    
    test.variants.forEach(variant => {
      variantStats.set(variant.id, {
        id: variant.id,
        name: variant.name,
        participants: 0,
        conversions: 0,
        conversionRate: 0,
        confidenceInterval: { lower: 0, upper: 0 }
      });
    });
    
    participations.forEach(participation => {
      const stats = variantStats.get(participation.variantId);
      if (stats) {
        stats.participants++;
        if (participation.converted) {
          stats.conversions++;
        }
      }
    });
    
    // Calculate conversion rates and confidence intervals
    variantStats.forEach(stats => {
      stats.conversionRate = stats.participants > 0 ? (stats.conversions / stats.participants) * 100 : 0;
      stats.confidenceInterval = this.calculateConfidenceInterval(
        stats.conversions,
        stats.participants,
        test.confidenceLevel
      );
    });
    
    const variants = Array.from(variantStats.values());
    
    // Perform statistical significance test
    const { pValue, effectSize, winner, confidence } = this.performStatisticalTest(variants, test.confidenceLevel);
    
    const statisticalSignificance = pValue < (1 - test.confidenceLevel / 100);
    
    const results: TestResults = {
      testId,
      winner: statisticalSignificance ? winner : undefined,
      confidence,
      statisticalSignificance,
      pValue,
      effectSize,
      variants,
      recommendations: this.generateRecommendations(variants, statisticalSignificance, winner)
    };
    
    // Update test with results
    test.results = results;
    await test.save();
    
    return results;
  }
  
  /**
   * Get active tests for a user
   */
  async getActiveTests(userId: string, type?: string): Promise<ABTest[]> {
    const whereClause: any = {
      status: 'running',
      [Op.or]: [
        { userId },
        { userId: { [Op.ne]: userId } } // Global tests
      ]
    };
    
    if (type) {
      whereClause.type = type;
    }
    
    return ABTest.findAll({
      where: whereClause,
      order: [['startDate', 'DESC']]
    });
  }
  
  /**
   * Get test results for a user
   */
  async getUserTests(userId: string): Promise<ABTest[]> {
    return ABTest.findAll({
      where: { userId },
      include: [ABTestParticipation],
      order: [['createdAt', 'DESC']]
    });
  }
  
  /**
   * Pause a test
   */
  async pauseTest(testId: string): Promise<ABTest> {
    const test = await ABTest.findByPk(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    test.status = 'paused';
    await test.save();
    return test;
  }
  
  /**
   * Complete a test
   */
  async completeTest(testId: string): Promise<ABTest> {
    const test = await ABTest.findByPk(testId);
    if (!test) {
      throw new Error('Test not found');
    }
    
    // Analyze final results
    await this.analyzeTest(testId);
    
    test.status = 'completed';
    test.endDate = new Date();
    await test.save();
    
    return test;
  }
  
  /**
   * Private helper methods
   */
  
  private validateVariants(variants: any[]): void {
    if (variants.length < 2) {
      throw new Error('At least 2 variants are required');
    }
    
    const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      throw new Error('Variant weights must sum to 100%');
    }
  }
  
  private selectVariantByWeight(variants: any[]): any {
    const random = Math.random() * 100;
    let cumulativeWeight = 0;
    
    for (const variant of variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variant;
      }
    }
    
    return variants[variants.length - 1]; // Fallback
  }
  
  private matchesTargetAudience(context: any, targetAudience: any): boolean {
    if (!context) return true;
    
    if (targetAudience.industries && targetAudience.industries.length > 0) {
      if (!context.industry || !targetAudience.industries.includes(context.industry)) {
        return false;
      }
    }
    
    if (targetAudience.locations && targetAudience.locations.length > 0) {
      if (!context.location || !targetAudience.locations.includes(context.location)) {
        return false;
      }
    }
    
    return true;
  }
  
  private calculateConfidenceInterval(conversions: number, participants: number, confidenceLevel: number): { lower: number; upper: number } {
    if (participants === 0) {
      return { lower: 0, upper: 0 };
    }
    
    const p = conversions / participants;
    const z = this.getZScore(confidenceLevel);
    const margin = z * Math.sqrt((p * (1 - p)) / participants);
    
    return {
      lower: Math.max(0, (p - margin) * 100),
      upper: Math.min(100, (p + margin) * 100)
    };
  }
  
  private getZScore(confidenceLevel: number): number {
    switch (confidenceLevel) {
      case 90: return 1.645;
      case 95: return 1.96;
      case 99: return 2.576;
      default: return 1.96;
    }
  }
  
  private performStatisticalTest(variants: any[], confidenceLevel: number): {
    pValue: number;
    effectSize: number;
    winner?: string;
    confidence: number;
  } {
    if (variants.length < 2) {
      return { pValue: 1, effectSize: 0, confidence: 0 };
    }
    
    // Sort variants by conversion rate
    const sortedVariants = [...variants].sort((a, b) => b.conversionRate - a.conversionRate);
    const control = sortedVariants[1]; // Second best as control
    const treatment = sortedVariants[0]; // Best as treatment
    
    // Two-proportion z-test
    const p1 = treatment.conversions / treatment.participants;
    const p2 = control.conversions / control.participants;
    const n1 = treatment.participants;
    const n2 = control.participants;
    
    if (n1 === 0 || n2 === 0) {
      return { pValue: 1, effectSize: 0, confidence: 0 };
    }
    
    const pooledP = (treatment.conversions + control.conversions) / (n1 + n2);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1/n1 + 1/n2));
    
    const zScore = se > 0 ? (p1 - p2) / se : 0;
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    
    const effectSize = Math.abs(p1 - p2) * 100; // Percentage point difference
    const confidence = (1 - pValue) * 100;
    
    const winner = pValue < (1 - confidenceLevel / 100) ? treatment.id : undefined;
    
    return { pValue, effectSize, winner, confidence };
  }
  
  private normalCDF(x: number): number {
    // Approximation of the cumulative distribution function for standard normal distribution
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }
  
  private erf(x: number): number {
    // Approximation of the error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }
  
  private generateRecommendations(variants: any[], significant: boolean, winner?: string): string[] {
    const recommendations: string[] = [];
    
    if (significant && winner) {
      const winningVariant = variants.find(v => v.id === winner);
      recommendations.push(`Implement ${winningVariant?.name} as the default - it shows statistically significant improvement.`);
    } else {
      recommendations.push('Continue running the test - no statistically significant winner yet.');
      
      if (variants.some(v => v.participants < 30)) {
        recommendations.push('Increase sample size to at least 30 participants per variant for reliable results.');
      }
      
      const bestVariant = variants.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      );
      
      if (bestVariant.conversionRate > 0) {
        recommendations.push(`${bestVariant.name} is currently leading with ${bestVariant.conversionRate.toFixed(1)}% conversion rate.`);
      }
    }
    
    return recommendations;
  }
  
  private async checkTestCompletion(testId: string): Promise<void> {
    const test = await ABTest.findByPk(testId);
    if (!test || test.status !== 'running') return;
    
    const participationCount = await ABTestParticipation.count({
      where: { testId }
    });
    
    // Auto-complete if minimum sample size reached and test has been running for at least 7 days
    if (participationCount >= test.minimumSampleSize) {
      const daysSinceStart = test.startDate ? 
        (Date.now() - test.startDate.getTime()) / (1000 * 60 * 60 * 24) : 0;
      
      if (daysSinceStart >= 7) {
        const results = await this.analyzeTest(testId);
        if (results.statisticalSignificance) {
          await this.completeTest(testId);
        }
      }
    }
  }
}

export const abTestingService = new ABTestingService();
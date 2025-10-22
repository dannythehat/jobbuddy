import { JobPreference } from '../models/JobPreference';
import { Job } from '../models/Job';
import { CV } from '../models/CV';
import { Op } from 'sequelize';

export interface JobMatchScore {
  jobId: string;
  score: number;
  matchReasons: string[];
  job: any;
}

export interface MatchCriteria {
  titleMatch: number;
  locationMatch: number;
  skillsMatch: number;
  salaryMatch: number;
  typeMatch: number;
  experienceMatch: number;
}

// Calculate job match score based on user preferences and CV
export async function calculateJobMatches(userId: string): Promise<JobMatchScore[]> {
  try {
    // Get user preferences
    const preferences = await JobPreference.findOne({
      where: { userId },
    });

    if (!preferences) {
      throw new Error('User preferences not found');
    }

    // Get user's default CV for skills matching
    const defaultCV = await CV.findOne({
      where: { userId, isDefault: true },
    });

    // Get available jobs (in a real app, this would be from job scraping)
    const jobs = await Job.findAll({
      where: {
        status: 'active',
      },
      limit: 100, // Limit for performance
    });

    // Calculate match scores for each job
    const jobMatches: JobMatchScore[] = [];

    for (const job of jobs) {
      const matchScore = calculateSingleJobMatch(job, preferences, defaultCV);
      if (matchScore.score > 0.3) { // Only include jobs with >30% match
        jobMatches.push({
          jobId: job.id,
          score: matchScore.score,
          matchReasons: matchScore.reasons,
          job: job.toJSON(),
        });
      }
    }

    // Sort by match score (highest first)
    jobMatches.sort((a, b) => b.score - a.score);

    return jobMatches.slice(0, 50); // Return top 50 matches
  } catch (error) {
    console.error('Error calculating job matches:', error);
    throw error;
  }
}

// Calculate match score for a single job
function calculateSingleJobMatch(
  job: any,
  preferences: JobPreference,
  cv: CV | null
): { score: number; reasons: string[] } {
  const criteria: MatchCriteria = {
    titleMatch: 0,
    locationMatch: 0,
    skillsMatch: 0,
    salaryMatch: 0,
    typeMatch: 0,
    experienceMatch: 0,
  };

  const reasons: string[] = [];

  // 1. Job Title Match (25% weight)
  const titleScore = calculateTitleMatch(job.title, preferences.jobTitle);
  criteria.titleMatch = titleScore;
  if (titleScore > 0.7) {
    reasons.push(`Strong title match: ${job.title}`);
  } else if (titleScore > 0.4) {
    reasons.push(`Good title match: ${job.title}`);
  }

  // 2. Location Match (20% weight)
  const locationScore = calculateLocationMatch(job.location, preferences.location, preferences.remotePreference);
  criteria.locationMatch = locationScore;
  if (locationScore > 0.8) {
    reasons.push(`Perfect location match: ${job.location}`);
  } else if (locationScore > 0.5) {
    reasons.push(`Good location match: ${job.location}`);
  }

  // 3. Skills Match (25% weight)
  const skillsScore = calculateSkillsMatch(job.requiredSkills || [], preferences.skills || [], cv?.skills || []);
  criteria.skillsMatch = skillsScore;
  if (skillsScore > 0.7) {
    reasons.push(`Excellent skills match (${Math.round(skillsScore * 100)}%)`);
  } else if (skillsScore > 0.4) {
    reasons.push(`Good skills match (${Math.round(skillsScore * 100)}%)`);
  }

  // 4. Salary Match (15% weight)
  const salaryScore = calculateSalaryMatch(job.salaryMin, job.salaryMax, preferences.salaryMin, preferences.salaryMax);
  criteria.salaryMatch = salaryScore;
  if (salaryScore > 0.8) {
    reasons.push('Salary range matches your expectations');
  }

  // 5. Job Type Match (10% weight)
  const typeScore = calculateJobTypeMatch(job.jobType, preferences.jobType);
  criteria.typeMatch = typeScore;
  if (typeScore === 1) {
    reasons.push(`Perfect job type match: ${job.jobType}`);
  }

  // 6. Experience Match (5% weight)
  const experienceScore = calculateExperienceMatch(job.experienceLevel, preferences.experience);
  criteria.experienceMatch = experienceScore;

  // Calculate weighted total score
  const totalScore = 
    criteria.titleMatch * 0.25 +
    criteria.locationMatch * 0.20 +
    criteria.skillsMatch * 0.25 +
    criteria.salaryMatch * 0.15 +
    criteria.typeMatch * 0.10 +
    criteria.experienceMatch * 0.05;

  return {
    score: Math.min(totalScore, 1), // Cap at 1.0
    reasons,
  };
}

// Calculate title match score
function calculateTitleMatch(jobTitle: string, preferredTitles: string[]): number {
  if (!jobTitle || preferredTitles.length === 0) return 0;

  const jobTitleLower = jobTitle.toLowerCase();
  let maxScore = 0;

  for (const preferredTitle of preferredTitles) {
    const preferredLower = preferredTitle.toLowerCase();
    
    // Exact match
    if (jobTitleLower === preferredLower) {
      return 1.0;
    }
    
    // Contains match
    if (jobTitleLower.includes(preferredLower) || preferredLower.includes(jobTitleLower)) {
      maxScore = Math.max(maxScore, 0.8);
    }
    
    // Keyword overlap
    const jobWords = jobTitleLower.split(/\s+/);
    const preferredWords = preferredLower.split(/\s+/);
    const commonWords = jobWords.filter(word => preferredWords.includes(word));
    const overlapScore = commonWords.length / Math.max(jobWords.length, preferredWords.length);
    maxScore = Math.max(maxScore, overlapScore * 0.6);
  }

  return maxScore;
}

// Calculate location match score
function calculateLocationMatch(jobLocation: string, preferredLocations: string[], remotePreference: string): number {
  if (!jobLocation) return 0;

  const jobLocationLower = jobLocation.toLowerCase();
  
  // Handle remote jobs
  if (jobLocationLower.includes('remote')) {
    if (remotePreference === 'remote' || remotePreference === 'any') {
      return 1.0;
    }
    if (remotePreference === 'hybrid') {
      return 0.8;
    }
    return 0.3; // User prefers onsite but job is remote
  }

  // Handle hybrid jobs
  if (jobLocationLower.includes('hybrid')) {
    if (remotePreference === 'hybrid' || remotePreference === 'any') {
      return 1.0;
    }
    if (remotePreference === 'remote' || remotePreference === 'onsite') {
      return 0.7;
    }
  }

  // Check preferred locations
  for (const preferredLocation of preferredLocations) {
    const preferredLower = preferredLocation.toLowerCase();
    
    if (preferredLower === 'remote' && remotePreference !== 'onsite') {
      continue; // Skip remote preference, handled above
    }
    
    if (jobLocationLower.includes(preferredLower) || preferredLower.includes(jobLocationLower)) {
      return 1.0;
    }
  }

  return 0.2; // Some base score for any location if no specific match
}

// Calculate skills match score
function calculateSkillsMatch(jobSkills: string[], preferredSkills: string[], cvSkills: string[]): number {
  if (jobSkills.length === 0) return 0.5; // Neutral if no skills specified

  const allUserSkills = [...new Set([...preferredSkills, ...cvSkills])].map(s => s.toLowerCase());
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());

  let matchedSkills = 0;
  for (const jobSkill of jobSkillsLower) {
    if (allUserSkills.some(userSkill => 
      userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
    )) {
      matchedSkills++;
    }
  }

  return matchedSkills / jobSkills.length;
}

// Calculate salary match score
function calculateSalaryMatch(
  jobSalaryMin?: number,
  jobSalaryMax?: number,
  userSalaryMin?: number,
  userSalaryMax?: number
): number {
  // If no salary info, return neutral score
  if (!jobSalaryMin && !jobSalaryMax && !userSalaryMin && !userSalaryMax) {
    return 0.5;
  }

  // If user has no salary preference, return neutral
  if (!userSalaryMin && !userSalaryMax) {
    return 0.5;
  }

  // If job has no salary info but user has preferences, return lower score
  if (!jobSalaryMin && !jobSalaryMax) {
    return 0.3;
  }

  const jobMin = jobSalaryMin || 0;
  const jobMax = jobSalaryMax || jobSalaryMin || 0;
  const userMin = userSalaryMin || 0;
  const userMax = userSalaryMax || userSalaryMin || Infinity;

  // Check for overlap
  if (jobMax >= userMin && jobMin <= userMax) {
    // Calculate overlap percentage
    const overlapStart = Math.max(jobMin, userMin);
    const overlapEnd = Math.min(jobMax, userMax);
    const overlapSize = overlapEnd - overlapStart;
    const userRangeSize = userMax - userMin;
    
    if (userRangeSize === 0) return 1.0; // Exact match
    return Math.min(overlapSize / userRangeSize, 1.0);
  }

  return 0.1; // No overlap
}

// Calculate job type match score
function calculateJobTypeMatch(jobType: string, preferredTypes: string[]): number {
  if (!jobType || preferredTypes.length === 0) return 0.5;

  const jobTypeLower = jobType.toLowerCase().replace('-', '');
  for (const preferredType of preferredTypes) {
    const preferredLower = preferredType.toLowerCase().replace('-', '');
    if (jobTypeLower === preferredLower) {
      return 1.0;
    }
  }

  return 0.2;
}

// Calculate experience match score
function calculateExperienceMatch(jobExperience?: string, userExperience?: string): number {
  if (!jobExperience || !userExperience) return 0.5;

  const experienceLevels = ['entry level', 'mid level', 'senior level', 'lead/principal', 'executive'];
  const jobLevel = experienceLevels.indexOf(jobExperience.toLowerCase());
  const userLevel = experienceLevels.indexOf(userExperience.toLowerCase());

  if (jobLevel === -1 || userLevel === -1) return 0.5;

  // Perfect match
  if (jobLevel === userLevel) return 1.0;
  
  // Close match (1 level difference)
  if (Math.abs(jobLevel - userLevel) === 1) return 0.8;
  
  // Moderate match (2 levels difference)
  if (Math.abs(jobLevel - userLevel) === 2) return 0.5;
  
  // Poor match
  return 0.2;
}

export default {
  calculateJobMatches,
  calculateSingleJobMatch,
};
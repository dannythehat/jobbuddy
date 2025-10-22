import { Request, Response, NextFunction } from 'express';
import { JobPreference } from '../models/JobPreference';
import { CV } from '../models/CV';

// Get user's job preferences
export const getJobPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const preferences = await JobPreference.findOne({
      where: { userId },
    });

    res.status(200).json({
      status: 'success',
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

// Create or update job preferences
export const upsertJobPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const {
      jobTitle,
      location,
      remotePreference,
      salaryMin,
      salaryMax,
      salaryCurrency,
      jobType,
      industry,
      skills,
      experience,
      education,
      keywords,
      excludeKeywords,
    } = req.body;

    // Validation
    if (!jobTitle || !Array.isArray(jobTitle) || jobTitle.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Job titles are required',
      });
    }

    if (!location || !Array.isArray(location) || location.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Locations are required',
      });
    }

    if (!jobType || !Array.isArray(jobType) || jobType.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Job types are required',
      });
    }

    // Check if preferences already exist
    const existingPreferences = await JobPreference.findOne({
      where: { userId },
    });

    let preferences;
    if (existingPreferences) {
      // Update existing preferences
      await JobPreference.update(
        {
          jobTitle,
          location,
          remotePreference,
          salaryMin,
          salaryMax,
          salaryCurrency,
          jobType,
          industry,
          skills,
          experience,
          education,
          keywords,
          excludeKeywords,
        },
        {
          where: { userId },
        }
      );
      preferences = await JobPreference.findOne({ where: { userId } });
    } else {
      // Create new preferences
      preferences = await JobPreference.create({
        jobTitle,
        location,
        remotePreference,
        salaryMin,
        salaryMax,
        salaryCurrency,
        jobType,
        industry,
        skills,
        experience,
        education,
        keywords,
        excludeKeywords,
        userId,
      });
    }

    res.status(200).json({
      status: 'success',
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

// Auto-generate preferences from CV
export const generatePreferencesFromCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { cvId } = req.body;

    if (!cvId) {
      return res.status(400).json({
        status: 'error',
        message: 'CV ID is required',
      });
    }

    // Find the CV
    const cv = await CV.findOne({
      where: { id: cvId, userId },
    });

    if (!cv) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    if (!cv.parsedData || !cv.skills) {
      return res.status(400).json({
        status: 'error',
        message: 'CV must be parsed first',
      });
    }

    const parsedData = cv.parsedData as any;

    // Generate job preferences based on CV data
    const suggestedPreferences = {
      jobTitle: extractJobTitles(parsedData),
      location: ['Remote', 'United States'], // Default locations
      remotePreference: 'any' as const,
      jobType: ['full-time'] as const,
      skills: cv.skills || [],
      experience: determineExperienceLevel(parsedData),
      education: extractEducationLevel(parsedData),
      keywords: cv.skills?.slice(0, 10) || [], // Top 10 skills as keywords
    };

    res.status(200).json({
      status: 'success',
      data: suggestedPreferences,
      message: 'Job preferences generated from CV. Review and save to apply.',
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to extract job titles from CV
function extractJobTitles(parsedData: any): string[] {
  const titles = new Set<string>();
  
  if (parsedData.experience && Array.isArray(parsedData.experience)) {
    parsedData.experience.forEach((exp: any) => {
      if (exp.title) {
        titles.add(exp.title);
      }
    });
  }
  
  // If no titles found, suggest generic ones based on skills
  if (titles.size === 0) {
    const skills = parsedData.skills || [];
    if (skills.some((skill: string) => skill.toLowerCase().includes('react') || skill.toLowerCase().includes('javascript'))) {
      titles.add('Frontend Developer');
      titles.add('Full Stack Developer');
    }
    if (skills.some((skill: string) => skill.toLowerCase().includes('python') || skill.toLowerCase().includes('django'))) {
      titles.add('Backend Developer');
      titles.add('Python Developer');
    }
    if (skills.some((skill: string) => skill.toLowerCase().includes('aws') || skill.toLowerCase().includes('docker'))) {
      titles.add('DevOps Engineer');
      titles.add('Cloud Engineer');
    }
  }
  
  return Array.from(titles).slice(0, 5); // Limit to 5 titles
}

// Helper function to determine experience level
function determineExperienceLevel(parsedData: any): string {
  if (!parsedData.experience || !Array.isArray(parsedData.experience)) {
    return 'Entry Level';
  }
  
  const experienceCount = parsedData.experience.length;
  
  if (experienceCount >= 5) {
    return 'Senior Level';
  } else if (experienceCount >= 2) {
    return 'Mid Level';
  } else {
    return 'Entry Level';
  }
}

// Helper function to extract education level
function extractEducationLevel(parsedData: any): string {
  if (!parsedData.education || !Array.isArray(parsedData.education)) {
    return 'High School';
  }
  
  const education = parsedData.education[0]; // Take the first/highest education
  if (!education.degree) {
    return 'High School';
  }
  
  const degree = education.degree.toLowerCase();
  if (degree.includes('phd') || degree.includes('doctorate')) {
    return 'Doctorate';
  } else if (degree.includes('master') || degree.includes('mba')) {
    return 'Masters';
  } else if (degree.includes('bachelor') || degree.includes('degree')) {
    return 'Bachelors';
  } else {
    return 'High School';
  }
}

// Delete job preferences
export const deleteJobPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const deletedRowsCount = await JobPreference.destroy({
      where: { userId },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job preferences not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Job preferences deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
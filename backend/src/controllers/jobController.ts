import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import { Job } from '../models/Job';
import { calculateJobMatches } from '../services/jobMatcher';
import { JobPreference } from '../models/JobPreference';

// Get matched jobs for user
export const getMatchedJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    // Check if user has preferences
    const preferences = await JobPreference.findOne({
      where: { userId },
    });

    if (!preferences) {
      return res.status(400).json({
        status: 'error',
        message: 'Please set your job preferences first',
      });
    }

    // Calculate job matches
    const jobMatches = await calculateJobMatches(userId);

    // Apply pagination
    const paginatedMatches = jobMatches.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );

    res.status(200).json({
      status: 'success',
      data: {
        matches: paginatedMatches,
        total: jobMatches.length,
        hasMore: Number(offset) + Number(limit) < jobMatches.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all jobs (for browsing)
export const getAllJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      limit = 20, 
      offset = 0, 
      location, 
      jobType, 
      salaryMin, 
      salaryMax,
      search 
    } = req.query;

    const whereClause: any = {
      status: 'active',
    };

    // Add filters
    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`,
      };
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (salaryMin) {
      whereClause.salaryMin = {
        [Op.gte]: Number(salaryMin),
      };
    }

    if (salaryMax) {
      whereClause.salaryMax = {
        [Op.lte]: Number(salaryMax),
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [['postedDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: {
        jobs: jobs.rows,
        total: jobs.count,
        hasMore: Number(offset) + Number(limit) < jobs.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific job
export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// Create sample jobs (for development/testing)
export const createSampleJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        salaryMin: 120000,
        salaryMax: 160000,
        salaryCurrency: 'USD',
        description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
        requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Node.js'],
        experienceLevel: 'Senior Level',
        postedDate: new Date(),
        applicationUrl: 'https://example.com/apply/1',
        status: 'active',
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        jobType: 'full-time',
        salaryMin: 90000,
        salaryMax: 130000,
        salaryCurrency: 'USD',
        description: 'Join our fast-growing startup as a Full Stack Developer. Work with React, Node.js, PostgreSQL, and AWS to build scalable web applications.',
        requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'JavaScript', 'Express.js'],
        experienceLevel: 'Mid Level',
        postedDate: new Date(),
        applicationUrl: 'https://example.com/apply/2',
        status: 'active',
      },
      {
        title: 'DevOps Engineer',
        company: 'CloudTech Solutions',
        location: 'Austin, TX',
        jobType: 'full-time',
        salaryMin: 110000,
        salaryMax: 150000,
        salaryCurrency: 'USD',
        description: 'We need a DevOps Engineer to manage our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines required.',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Python'],
        experienceLevel: 'Senior Level',
        postedDate: new Date(),
        applicationUrl: 'https://example.com/apply/3',
        status: 'active',
      },
      {
        title: 'Python Backend Developer',
        company: 'DataFlow Inc.',
        location: 'New York, NY',
        jobType: 'full-time',
        salaryMin: 100000,
        salaryMax: 140000,
        salaryCurrency: 'USD',
        description: 'Looking for a Python Backend Developer to work on our data processing platform. Experience with Django, PostgreSQL, and Redis preferred.',
        requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'REST API', 'Git'],
        experienceLevel: 'Mid Level',
        postedDate: new Date(),
        applicationUrl: 'https://example.com/apply/4',
        status: 'active',
      },
      {
        title: 'Junior Frontend Developer',
        company: 'WebDev Agency',
        location: 'Chicago, IL',
        jobType: 'full-time',
        salaryMin: 60000,
        salaryMax: 80000,
        salaryCurrency: 'USD',
        description: 'Entry-level position for a Frontend Developer. Great opportunity to learn and grow with modern web technologies.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        experienceLevel: 'Entry Level',
        postedDate: new Date(),
        applicationUrl: 'https://example.com/apply/5',
        status: 'active',
      },
    ];

    const createdJobs = await Job.bulkCreate(sampleJobs);

    res.status(201).json({
      status: 'success',
      message: `${createdJobs.length} sample jobs created`,
      data: createdJobs,
    });
  } catch (error) {
    next(error);
  }
};

// Get job statistics
export const getJobStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalJobs = await Job.count({
      where: { status: 'active' },
    });

    const jobsByType = await Job.findAll({
      attributes: [
        'jobType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { status: 'active' },
      group: ['jobType'],
      raw: true,
    });

    const jobsByLocation = await Job.findAll({
      attributes: [
        'location',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: { status: 'active' },
      group: ['location'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalJobs,
        jobsByType,
        topLocations: jobsByLocation,
      },
    });
  } catch (error) {
    next(error);
  }
};
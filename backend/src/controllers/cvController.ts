import { Request, Response, NextFunction } from 'express';
import { CV } from '../models/CV';
import { User } from '../models/User';
import { parseCV, extractSkills } from '../services/cvParser';
import fs from 'fs';
import path from 'path';

// Get all CVs for a user
export const getCVs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const cvs = await CV.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: cvs,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific CV
export const getCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await CV.findOne({
      where: { id, userId },
    });

    if (!cv) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: cv,
    });
  } catch (error) {
    next(error);
  }
};

// Upload and parse a new CV
export const uploadCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }

    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'CV title is required',
      });
    }

    // Create CV record first
    const cv = await CV.create({
      title,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      userId,
    });

    // Parse CV in background (don't wait for completion)
    parseCVAsync(cv.id, file.path, file.mimetype);

    res.status(201).json({
      status: 'success',
      message: 'CV uploaded successfully. Parsing in progress...',
      data: cv,
    });
  } catch (error) {
    // Clean up uploaded file if CV creation fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    next(error);
  }
};

// Async CV parsing function
async function parseCVAsync(cvId: string, filePath: string, fileType: string) {
  try {
    console.log(`Starting CV parsing for CV ID: ${cvId}`);
    
    // Parse the CV
    const parsedData = await parseCV(filePath, fileType);
    
    // Extract skills
    const skills = extractSkills(parsedData);
    
    // Update CV with parsed data
    await CV.update(
      {
        parsedData,
        skills,
      },
      {
        where: { id: cvId },
      }
    );
    
    console.log(`CV parsing completed for CV ID: ${cvId}`);
  } catch (error) {
    console.error(`Error parsing CV ${cvId}:`, error);
    
    // Update CV with error status
    await CV.update(
      {
        parsedData: { error: 'Failed to parse CV' },
      },
      {
        where: { id: cvId },
      }
    );
  }
}

// Get CV parsing status
export const getCVParsingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cv = await CV.findOne({
      where: { id, userId },
      attributes: ['id', 'title', 'parsedData', 'skills', 'createdAt'],
    });

    if (!cv) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    const isParsed = cv.parsedData && Object.keys(cv.parsedData).length > 0;
    const hasError = cv.parsedData && (cv.parsedData as any).error;

    res.status(200).json({
      status: 'success',
      data: {
        id: cv.id,
        title: cv.title,
        isParsed,
        hasError,
        skillsCount: cv.skills ? cv.skills.length : 0,
        parsedAt: cv.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update CV
export const updateCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, isDefault } = req.body;
    const userId = req.user.id;

    // If setting as default, unset other default CVs
    if (isDefault) {
      await CV.update(
        { isDefault: false },
        { where: { userId, isDefault: true } }
      );
    }

    const [updatedRowsCount] = await CV.update(
      { title, isDefault },
      {
        where: { id, userId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    const updatedCV = await CV.findByPk(id);

    res.status(200).json({
      status: 'success',
      data: updatedCV,
    });
  } catch (error) {
    next(error);
  }
};

// Delete CV
export const deleteCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find CV first to get file path
    const cv = await CV.findOne({
      where: { id, userId },
    });

    if (!cv) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    // Delete the file
    try {
      if (fs.existsSync(cv.filePath)) {
        fs.unlinkSync(cv.filePath);
      }
    } catch (fileError) {
      console.error('Error deleting CV file:', fileError);
    }

    // Delete CV record
    await CV.destroy({
      where: { id, userId },
    });

    res.status(200).json({
      status: 'success',
      message: 'CV deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { CV } from '../models/CV';
import { User } from '../models/User';

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

// Upload a new CV (placeholder - file upload will be implemented later)
export const uploadCV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    // This is a placeholder - actual file upload logic will be added later
    const cv = await CV.create({
      title,
      filePath: '/placeholder/path',
      fileType: 'pdf',
      fileSize: 0,
      userId,
    });

    res.status(201).json({
      status: 'success',
      data: cv,
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

    const deletedRowsCount = await CV.destroy({
      where: { id, userId },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'CV not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'CV deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
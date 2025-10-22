import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

// Get user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          status: 'error',
          message: 'Email is already taken',
        });
      }
    }

    // Update user
    const [updatedRowsCount] = await User.update(
      { name, email },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Get updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;

    const deletedRowsCount = await User.destroy({
      where: { id: userId },
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
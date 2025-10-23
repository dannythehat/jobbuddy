import { Request, Response } from 'express';
import { Certificate } from '../models/Certificate';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class CertificateController {
  /**
   * Get all certificates for the authenticated user
   */
  static async getCertificates(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const { category, search, sortBy = 'issueDate', sortOrder = 'desc' } = req.query;

      // Build where clause
      const whereClause: any = { userId };
      
      if (category && category !== 'all') {
        whereClause.category = category;
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { issuer: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const certificates = await Certificate.findAll({
        where: whereClause,
        order: [[sortBy as string, sortOrder as string]],
      });

      // Group by category for better organization
      const groupedCertificates = certificates.reduce((acc: any, cert) => {
        if (!acc[cert.category]) {
          acc[cert.category] = [];
        }
        acc[cert.category].push(cert);
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          certificates,
          grouped: groupedCertificates,
          total: certificates.length
        }
      });
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch certificates'
      });
    }
  }

  /**
   * Get a specific certificate by ID
   */
  static async getCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const certificate = await Certificate.findOne({
        where: { id, userId }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: 'Certificate not found'
        });
      }

      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      console.error('Error fetching certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch certificate'
      });
    }
  }

  /**
   * Create a new certificate
   */
  static async createCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const {
        name,
        issuer,
        issueDate,
        expiryDate,
        credentialId,
        credentialUrl,
        description,
        category,
        skills
      } = req.body;

      // Handle file upload if present
      let fileData = {};
      if (req.file) {
        fileData = {
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileSize: req.file.size,
          mimeType: req.file.mimetype
        };
      }

      const certificate = await Certificate.create({
        userId,
        name,
        issuer,
        issueDate,
        expiryDate,
        credentialId,
        credentialUrl,
        description,
        category: category || 'certificate',
        skills: skills ? JSON.parse(skills) : [],
        isVerified: false,
        ...fileData
      });

      res.status(201).json({
        success: true,
        data: certificate
      });
    } catch (error) {
      console.error('Error creating certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create certificate'
      });
    }
  }

  /**
   * Update a certificate
   */
  static async updateCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const certificate = await Certificate.findOne({
        where: { id, userId }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: 'Certificate not found'
        });
      }

      const updateData = { ...req.body };
      
      // Handle skills parsing if it's a string
      if (updateData.skills && typeof updateData.skills === 'string') {
        updateData.skills = JSON.parse(updateData.skills);
      }

      // Handle file upload if present
      if (req.file) {
        // Delete old file if it exists
        if (certificate.filePath && fs.existsSync(certificate.filePath)) {
          fs.unlinkSync(certificate.filePath);
        }

        updateData.fileName = req.file.originalname;
        updateData.filePath = req.file.path;
        updateData.fileSize = req.file.size;
        updateData.mimeType = req.file.mimetype;
      }

      await certificate.update(updateData);

      res.json({
        success: true,
        data: certificate
      });
    } catch (error) {
      console.error('Error updating certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update certificate'
      });
    }
  }

  /**
   * Delete a certificate
   */
  static async deleteCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const certificate = await Certificate.findOne({
        where: { id, userId }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: 'Certificate not found'
        });
      }

      // Delete associated file if it exists
      if (certificate.filePath && fs.existsSync(certificate.filePath)) {
        fs.unlinkSync(certificate.filePath);
      }

      await certificate.destroy();

      res.json({
        success: true,
        message: 'Certificate deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete certificate'
      });
    }
  }

  /**
   * Download certificate file
   */
  static async downloadCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const certificate = await Certificate.findOne({
        where: { id, userId }
      });

      if (!certificate || !certificate.filePath) {
        return res.status(404).json({
          success: false,
          error: 'Certificate file not found'
        });
      }

      if (!fs.existsSync(certificate.filePath)) {
        return res.status(404).json({
          success: false,
          error: 'File not found on server'
        });
      }

      res.download(certificate.filePath, certificate.fileName || 'certificate');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download certificate'
      });
    }
  }

  /**
   * Get certificate statistics
   */
  static async getCertificateStats(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const stats = await Certificate.findAll({
        where: { userId },
        attributes: [
          'category',
          [Certificate.sequelize!.fn('COUNT', '*'), 'count']
        ],
        group: ['category'],
        raw: true
      });

      const totalCertificates = await Certificate.count({ where: { userId } });
      
      // Count expiring certificates (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringCertificates = await Certificate.count({
        where: {
          userId,
          expiryDate: {
            [Op.lte]: thirtyDaysFromNow,
            [Op.gte]: new Date()
          }
        }
      });

      // Count expired certificates
      const expiredCertificates = await Certificate.count({
        where: {
          userId,
          expiryDate: {
            [Op.lt]: new Date()
          }
        }
      });

      // Count verified certificates
      const verifiedCertificates = await Certificate.count({
        where: { userId, isVerified: true }
      });

      res.json({
        success: true,
        data: {
          categoryBreakdown: stats,
          totalCertificates,
          expiringCertificates,
          expiredCertificates,
          verifiedCertificates,
          verificationRate: totalCertificates > 0 ? Math.round((verifiedCertificates / totalCertificates) * 100) : 0
        }
      });
    } catch (error) {
      console.error('Error fetching certificate stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch certificate statistics'
      });
    }
  }

  /**
   * Verify a certificate (manual verification)
   */
  static async verifyCertificate(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const { isVerified } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const certificate = await Certificate.findOne({
        where: { id, userId }
      });

      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: 'Certificate not found'
        });
      }

      await certificate.update({ isVerified: Boolean(isVerified) });

      res.json({
        success: true,
        data: certificate,
        message: `Certificate ${isVerified ? 'verified' : 'unverified'} successfully`
      });
    } catch (error) {
      console.error('Error verifying certificate:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to verify certificate'
      });
    }
  }

  /**
   * Get certificates by skills
   */
  static async getCertificatesBySkills(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { skills } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!skills) {
        return res.status(400).json({
          success: false,
          error: 'Skills parameter is required'
        });
      }

      const skillsArray = Array.isArray(skills) ? skills : [skills];

      const certificates = await Certificate.findAll({
        where: {
          userId,
          skills: {
            [Op.overlap]: skillsArray
          }
        },
        order: [['issueDate', 'DESC']]
      });

      res.json({
        success: true,
        data: certificates
      });
    } catch (error) {
      console.error('Error fetching certificates by skills:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch certificates by skills'
      });
    }
  }
}

export default CertificateController;
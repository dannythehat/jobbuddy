import express from 'express';
import multer from 'multer';
import path from 'path';
import { CertificateController } from '../controllers/certificateController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Configure multer for certificate file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certificates/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'certificate-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow common certificate file types
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route GET /api/certificates
 * @desc Get all certificates for the authenticated user
 * @access Private
 * @query category, search, sortBy, sortOrder
 */
router.get('/', CertificateController.getCertificates);

/**
 * @route GET /api/certificates/stats
 * @desc Get certificate statistics for the user
 * @access Private
 */
router.get('/stats', CertificateController.getCertificateStats);

/**
 * @route GET /api/certificates/by-skills
 * @desc Get certificates by skills
 * @access Private
 * @query skills (array or string)
 */
router.get('/by-skills', CertificateController.getCertificatesBySkills);

/**
 * @route GET /api/certificates/:id
 * @desc Get a specific certificate by ID
 * @access Private
 */
router.get('/:id', CertificateController.getCertificate);

/**
 * @route GET /api/certificates/:id/download
 * @desc Download certificate file
 * @access Private
 */
router.get('/:id/download', CertificateController.downloadCertificate);

/**
 * @route POST /api/certificates
 * @desc Create a new certificate
 * @access Private
 * @body { 
 *   name: string,
 *   issuer: string,
 *   issueDate: string,
 *   expiryDate?: string,
 *   credentialId?: string,
 *   credentialUrl?: string,
 *   description?: string,
 *   category?: string,
 *   skills?: string[]
 * }
 * @file certificate file (optional)
 */
router.post('/', upload.single('certificate'), CertificateController.createCertificate);

/**
 * @route PUT /api/certificates/:id
 * @desc Update a certificate
 * @access Private
 * @body { 
 *   name?: string,
 *   issuer?: string,
 *   issueDate?: string,
 *   expiryDate?: string,
 *   credentialId?: string,
 *   credentialUrl?: string,
 *   description?: string,
 *   category?: string,
 *   skills?: string[]
 * }
 * @file certificate file (optional)
 */
router.put('/:id', upload.single('certificate'), CertificateController.updateCertificate);

/**
 * @route PUT /api/certificates/:id/verify
 * @desc Verify or unverify a certificate
 * @access Private
 * @body { isVerified: boolean }
 */
router.put('/:id/verify', CertificateController.verifyCertificate);

/**
 * @route DELETE /api/certificates/:id
 * @desc Delete a certificate
 * @access Private
 */
router.delete('/:id', CertificateController.deleteCertificate);

export default router;
import { Router } from 'express';
import {
  createReport,
  getMyReports,
  getReportById,
  updateReport,
  getAllReports,
  updateReportStatus,
  getStatistics,
} from '../controllers/reportController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

router.post('/create', authMiddleware, upload.single('foto'), createReport);
router.get('/my-reports', authMiddleware, getMyReports);
router.get('/:id', authMiddleware, getReportById);
router.put('/:id', authMiddleware, upload.single('foto'), updateReport);

router.get('/', authMiddleware, adminMiddleware, getAllReports);
router.put('/:id/status', authMiddleware, adminMiddleware, updateReportStatus);
router.get('/statistics/all', authMiddleware, adminMiddleware, getStatistics);

export default router;

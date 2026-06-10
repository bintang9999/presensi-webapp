"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const router = (0, express_1.Router)();
router.post('/create', auth_1.authMiddleware, upload.single('foto'), reportController_1.createReport);
router.get('/my-reports', auth_1.authMiddleware, reportController_1.getMyReports);
router.get('/:id', auth_1.authMiddleware, reportController_1.getReportById);
router.put('/:id', auth_1.authMiddleware, upload.single('foto'), reportController_1.updateReport);
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, reportController_1.getAllReports);
router.put('/:id/status', auth_1.authMiddleware, auth_1.adminMiddleware, reportController_1.updateReportStatus);
router.get('/statistics/all', auth_1.authMiddleware, auth_1.adminMiddleware, reportController_1.getStatistics);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map
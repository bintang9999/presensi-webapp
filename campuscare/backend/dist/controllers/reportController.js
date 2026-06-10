"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = createReport;
exports.getMyReports = getMyReports;
exports.getReportById = getReportById;
exports.updateReport = updateReport;
exports.getAllReports = getAllReports;
exports.updateReportStatus = updateReportStatus;
exports.getStatistics = getStatistics;
const ReportService_1 = require("../services/ReportService");
async function createReport(req, res) {
    try {
        const { judul, deskripsi, lokasi } = req.body;
        if (!judul || !deskripsi || !lokasi) {
            res.status(400).json({
                success: false,
                message: 'Judul, deskripsi, dan lokasi harus diisi',
            });
            return;
        }
        let fotoPath = null;
        if (req.file) {
            fotoPath = `/uploads/${req.file.filename}`;
        }
        const reportService = new ReportService_1.ReportService();
        const result = await reportService.createReport(req.user?.id, {
            judul,
            deskripsi,
            lokasi,
            foto: fotoPath,
        });
        res.status(201).json({
            success: true,
            message: 'Laporan berhasil dibuat',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function getMyReports(req, res) {
    try {
        const reportService = new ReportService_1.ReportService();
        const reports = await reportService.getReportsByUser(req.user?.id);
        res.json({
            success: true,
            message: 'Laporan berhasil diambil',
            data: reports.map(r => r.getDetail()),
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function getReportById(req, res) {
    try {
        const { id } = req.params;
        const reportService = new ReportService_1.ReportService();
        // Admin can see all, pelapor only their own
        const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
        const report = await reportService.getReportById(Number(id), userId);
        res.json({
            success: true,
            message: 'Laporan berhasil diambil',
            data: report,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function updateReport(req, res) {
    try {
        const { id } = req.params;
        const { judul, deskripsi, lokasi } = req.body;
        let fotoPath = undefined;
        if (req.file) {
            fotoPath = `/uploads/${req.file.filename}`;
        }
        const reportService = new ReportService_1.ReportService();
        await reportService.updateReport(Number(id), req.user?.id, {
            judul,
            deskripsi,
            lokasi,
            foto: fotoPath,
        });
        res.json({
            success: true,
            message: 'Laporan berhasil diperbarui',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function getAllReports(req, res) {
    try {
        const reportService = new ReportService_1.ReportService();
        const reports = await reportService.getAllReports();
        res.json({
            success: true,
            message: 'Semua laporan berhasil diambil',
            data: reports,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function updateReportStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const reportService = new ReportService_1.ReportService();
        await reportService.updateReportStatus(Number(id), status);
        res.json({
            success: true,
            message: 'Status laporan berhasil diperbarui',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function getStatistics(req, res) {
    try {
        const reportService = new ReportService_1.ReportService();
        const stats = await reportService.getStatistics();
        res.json({
            success: true,
            message: 'Statistik berhasil diambil',
            data: stats,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
//# sourceMappingURL=reportController.js.map
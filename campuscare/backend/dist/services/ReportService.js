"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const connection_1 = require("../database/connection");
const Pelapor_1 = require("../models/Pelapor");
const Admin_1 = require("../models/Admin");
const Notifikasi_1 = require("../models/Notifikasi");
class ReportService {
    async createReport(userId, data) {
        const pelapor = new Pelapor_1.Pelapor(userId, '', '', 'pelapor');
        const report = await pelapor.buatLaporan(data);
        return {
            id: report.getId(),
            kode_laporan: report.getKodeLaporan(),
            status: report.getStatus(),
        };
    }
    async getReportsByUser(userId) {
        const pelapor = new Pelapor_1.Pelapor(userId, '', '', 'pelapor');
        return pelapor.lihatRiwayatLaporan();
    }
    async getReportById(reportId, userId) {
        const db = (0, connection_1.getDatabase)();
        const report = await db.get('SELECT * FROM reports WHERE id = ?', [reportId]);
        if (!report) {
            throw new Error('Laporan tidak ditemukan');
        }
        if (userId && report.user_id !== userId) {
            throw new Error('Anda tidak memiliki akses ke laporan ini');
        }
        return report;
    }
    async getAllReports() {
        const db = (0, connection_1.getDatabase)();
        return db.all(`SELECT r.*, u.nama as pelapor FROM reports r 
       JOIN users u ON r.user_id = u.id 
       ORDER BY r.created_at DESC`);
    }
    async updateReport(reportId, userId, data) {
        const db = (0, connection_1.getDatabase)();
        const report = await db.get('SELECT * FROM reports WHERE id = ? AND user_id = ? AND status = ?', [reportId, userId, 'pending']);
        if (!report) {
            throw new Error('Laporan tidak ditemukan atau tidak dapat diubah');
        }
        await db.run('UPDATE reports SET judul = ?, deskripsi = ?, lokasi = ?, foto = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [data.judul || report.judul, data.deskripsi || report.deskripsi, data.lokasi || report.lokasi, data.foto || report.foto, reportId]);
        return true;
    }
    async updateReportStatus(reportId, newStatus) {
        const db = (0, connection_1.getDatabase)();
        const report = await db.get('SELECT * FROM reports WHERE id = ?', [reportId]);
        if (!report) {
            throw new Error('Laporan tidak ditemukan');
        }
        const admin = new Admin_1.Admin(1, '', '', 'admin');
        await admin.ubahStatusLaporan(reportId, newStatus);
        // Kirim notifikasi ke pelapor
        const notifikasi = new Notifikasi_1.Notifikasi(report.user_id, 'status_change', '');
        await notifikasi.kirimNotifikasiStatus(report.kode_laporan, report.status, newStatus);
        return true;
    }
    async deleteReport(reportId, userId) {
        const db = (0, connection_1.getDatabase)();
        const report = await db.get('SELECT * FROM reports WHERE id = ? AND user_id = ?', [reportId, userId]);
        if (!report) {
            throw new Error('Laporan tidak ditemukan');
        }
        if (report.status !== 'pending') {
            throw new Error('Hanya laporan pending yang dapat dihapus');
        }
        await db.run('DELETE FROM reports WHERE id = ?', [reportId]);
        return true;
    }
    async getStatistics() {
        const db = (0, connection_1.getDatabase)();
        const stats = await db.get(`SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM reports`);
        const monthlyStats = await db.all(`SELECT 
        strftime('%Y-%m', created_at) as bulan,
        COUNT(*) as jumlah
      FROM reports
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY bulan DESC
      LIMIT 12`);
        return { ...stats, monthlyStats };
    }
    async getDashboardData(userId, role) {
        if (role === 'admin') {
            const admin = new Admin_1.Admin(userId, '', '', 'admin');
            return admin.getDashboardData();
        }
        else {
            const pelapor = new Pelapor_1.Pelapor(userId, '', '', 'pelapor');
            return pelapor.getDashboardData();
        }
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=ReportService.js.map
import { getDatabase } from '../database/connection';
import { Report } from '../models/Report';
import { Pelapor } from '../models/Pelapor';
import { Admin } from '../models/Admin';
import { Notifikasi } from '../models/Notifikasi';

export class ReportService {
  async createReport(userId: number, data: any): Promise<any> {
    const pelapor = new Pelapor(userId, '', '', 'pelapor');
    const report = await pelapor.buatLaporan(data);

    return {
      id: report.getId(),
      kode_laporan: report.getKodeLaporan(),
      status: report.getStatus(),
    };
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    const pelapor = new Pelapor(userId, '', '', 'pelapor');
    return pelapor.lihatRiwayatLaporan();
  }

  async getReportById(reportId: number, userId?: number): Promise<any> {
    const db = getDatabase();
    const report = await db.get('SELECT * FROM reports WHERE id = ?', [reportId]);

    if (!report) {
      throw new Error('Laporan tidak ditemukan');
    }

    if (userId && report.user_id !== userId) {
      throw new Error('Anda tidak memiliki akses ke laporan ini');
    }

    return report;
  }

  async getAllReports(): Promise<any[]> {
    const db = getDatabase();
    return db.all(
      `SELECT r.*, u.nama as pelapor FROM reports r 
       JOIN users u ON r.user_id = u.id 
       ORDER BY r.created_at DESC`
    );
  }

  async updateReport(reportId: number, userId: number, data: any): Promise<boolean> {
    const db = getDatabase();
    const report = await db.get(
      'SELECT * FROM reports WHERE id = ? AND user_id = ? AND status = ?',
      [reportId, userId, 'pending']
    );

    if (!report) {
      throw new Error('Laporan tidak ditemukan atau tidak dapat diubah');
    }

    await db.run(
      'UPDATE reports SET judul = ?, deskripsi = ?, lokasi = ?, foto = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [data.judul || report.judul, data.deskripsi || report.deskripsi, data.lokasi || report.lokasi, data.foto || report.foto, reportId]
    );

    return true;
  }

  async updateReportStatus(reportId: number, newStatus: string): Promise<boolean> {
    const db = getDatabase();
    const report = await db.get('SELECT * FROM reports WHERE id = ?', [reportId]);

    if (!report) {
      throw new Error('Laporan tidak ditemukan');
    }

    const admin = new Admin(1, '', '', 'admin');
    await admin.ubahStatusLaporan(reportId, newStatus);

    // Kirim notifikasi ke pelapor
    const notifikasi = new Notifikasi(report.user_id, 'status_change', '');
    await notifikasi.kirimNotifikasiStatus(report.kode_laporan, report.status, newStatus);

    return true;
  }

  async deleteReport(reportId: number, userId: number): Promise<boolean> {
    const db = getDatabase();
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

  async getStatistics(): Promise<any> {
    const db = getDatabase();

    const stats = await db.get(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM reports`
    );

    const monthlyStats = await db.all(
      `SELECT 
        strftime('%Y-%m', created_at) as bulan,
        COUNT(*) as jumlah
      FROM reports
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY bulan DESC
      LIMIT 12`
    );

    return { ...stats, monthlyStats };
  }

  async getDashboardData(userId: number, role: string): Promise<any> {
    if (role === 'admin') {
      const admin = new Admin(userId, '', '', 'admin');
      return admin.getDashboardData();
    } else {
      const pelapor = new Pelapor(userId, '', '', 'pelapor');
      return pelapor.getDashboardData();
    }
  }
}

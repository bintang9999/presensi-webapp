import { BaseUser } from './BaseUser';
import { Report } from './Report';
import { getDatabase } from '../database/connection';

export class Pelapor extends BaseUser {
  async buatLaporan(laporan: any): Promise<Report> {
    const db = getDatabase();
    const kodeLaporan = `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const result = await db.run(
      'INSERT INTO reports (kode_laporan, judul, deskripsi, lokasi, foto, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [kodeLaporan, laporan.judul, laporan.deskripsi, laporan.lokasi, laporan.foto, this.id, 'pending']
    );

    return new Report(
      result.lastID!,
      kodeLaporan,
      laporan.judul,
      laporan.deskripsi,
      laporan.lokasi,
      laporan.foto,
      'pending',
      this.id
    );
  }

  async lihatRiwayatLaporan(): Promise<Report[]> {
    const db = getDatabase();
    const rows = await db.all(
      'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [this.id]
    );

    return rows.map((row: any) =>
      new Report(
        row.id,
        row.kode_laporan,
        row.judul,
        row.deskripsi,
        row.lokasi,
        row.foto,
        row.status,
        row.user_id
      )
    );
  }

  async getDashboardData(): Promise<any> {
    const reports = await this.lihatRiwayatLaporan();
    
    const stats = {
      total: reports.length,
      pending: reports.filter(r => r.getStatus() === 'pending').length,
      diproses: reports.filter(r => r.getStatus() === 'diproses').length,
      selesai: reports.filter(r => r.getStatus() === 'selesai').length,
      ditolak: reports.filter(r => r.getStatus() === 'ditolak').length,
    };

    return {
      user: {
        id: this.id,
        nama: this.nama,
        email: this.email,
      },
      statistics: stats,
      recentReports: reports.slice(0, 5),
    };
  }
}

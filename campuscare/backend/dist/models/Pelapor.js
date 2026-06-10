"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pelapor = void 0;
const BaseUser_1 = require("./BaseUser");
const Report_1 = require("./Report");
const connection_1 = require("../database/connection");
class Pelapor extends BaseUser_1.BaseUser {
    async buatLaporan(laporan) {
        const db = (0, connection_1.getDatabase)();
        const kodeLaporan = `CC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const result = await db.run('INSERT INTO reports (kode_laporan, judul, deskripsi, lokasi, foto, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [kodeLaporan, laporan.judul, laporan.deskripsi, laporan.lokasi, laporan.foto, this.id, 'pending']);
        return new Report_1.Report(result.lastID, kodeLaporan, laporan.judul, laporan.deskripsi, laporan.lokasi, laporan.foto, 'pending', this.id);
    }
    async lihatRiwayatLaporan() {
        const db = (0, connection_1.getDatabase)();
        const rows = await db.all('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC', [this.id]);
        return rows.map((row) => new Report_1.Report(row.id, row.kode_laporan, row.judul, row.deskripsi, row.lokasi, row.foto, row.status, row.user_id));
    }
    async getDashboardData() {
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
exports.Pelapor = Pelapor;
//# sourceMappingURL=Pelapor.js.map
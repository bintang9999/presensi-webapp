"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const BaseUser_1 = require("./BaseUser");
const connection_1 = require("../database/connection");
class Admin extends BaseUser_1.BaseUser {
    async ubahStatusLaporan(reportId, newStatus) {
        const validStatuses = ['pending', 'diproses', 'selesai', 'ditolak'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Status tidak valid');
        }
        const db = (0, connection_1.getDatabase)();
        await db.run('UPDATE reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, reportId]);
        return true;
    }
    async kelolaUser(userId, updates) {
        const db = (0, connection_1.getDatabase)();
        if (updates.role && !['pelapor', 'admin'].includes(updates.role)) {
            throw new Error('Role tidak valid');
        }
        await db.run('UPDATE users SET nama = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [updates.nama || null, updates.role || null, userId]);
        return true;
    }
    async hapusUser(userId) {
        if (userId === this.id) {
            throw new Error('Tidak dapat menghapus akun sendiri');
        }
        const db = (0, connection_1.getDatabase)();
        await db.run('DELETE FROM users WHERE id = ?', [userId]);
        return true;
    }
    async getDashboardData() {
        const db = (0, connection_1.getDatabase)();
        const stats = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'diproses' THEN 1 ELSE 0 END) as diproses,
        SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak
      FROM reports
    `);
        const monthlyStats = await db.all(`
      SELECT 
        strftime('%Y-%m', created_at) as bulan,
        COUNT(*) as jumlah
      FROM reports
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY bulan DESC
      LIMIT 12
    `);
        const totalUsers = await db.get('SELECT COUNT(*) as count FROM users');
        return {
            user: {
                id: this.id,
                nama: this.nama,
                email: this.email,
            },
            reportStatistics: stats,
            monthlyReports: monthlyStats,
            totalUsers: totalUsers.count,
        };
    }
}
exports.Admin = Admin;
//# sourceMappingURL=Admin.js.map
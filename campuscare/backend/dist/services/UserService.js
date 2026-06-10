"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const connection_1 = require("../database/connection");
const Admin_1 = require("../models/Admin");
class UserService {
    async getAllUsers() {
        const db = (0, connection_1.getDatabase)();
        return db.all('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC');
    }
    async getUserById(userId) {
        const db = (0, connection_1.getDatabase)();
        const user = await db.get('SELECT id, nama, email, role, created_at FROM users WHERE id = ?', [userId]);
        if (!user) {
            throw new Error('Pengguna tidak ditemukan');
        }
        return user;
    }
    async updateUser(userId, updates) {
        const admin = new Admin_1.Admin(1, '', '', 'admin');
        return admin.kelolaUser(userId, updates);
    }
    async deleteUser(userId, adminId) {
        const admin = new Admin_1.Admin(adminId, '', '', 'admin');
        return admin.hapusUser(userId);
    }
    async countUsers() {
        const db = (0, connection_1.getDatabase)();
        const result = await db.get('SELECT COUNT(*) as count FROM users');
        return result.count;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map
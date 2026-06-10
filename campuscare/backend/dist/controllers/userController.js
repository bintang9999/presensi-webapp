"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const UserService_1 = require("../services/UserService");
async function getAllUsers(req, res) {
    try {
        const userService = new UserService_1.UserService();
        const users = await userService.getAllUsers();
        res.json({
            success: true,
            message: 'Semua pengguna berhasil diambil',
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { nama, role } = req.body;
        const userService = new UserService_1.UserService();
        await userService.updateUser(Number(id), { nama, role });
        res.json({
            success: true,
            message: 'Pengguna berhasil diperbarui',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const userService = new UserService_1.UserService();
        await userService.deleteUser(Number(id), req.user?.id);
        res.json({
            success: true,
            message: 'Pengguna berhasil dihapus',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
//# sourceMappingURL=userController.js.map
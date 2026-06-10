"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getProfile = getProfile;
const AuthService_1 = require("../services/AuthService");
async function register(req, res) {
    try {
        const { nama, email, password, role } = req.body;
        if (!nama || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Nama, email, dan password harus diisi',
            });
            return;
        }
        const authService = new AuthService_1.AuthService();
        const result = await authService.register(nama, email, password, role || 'pelapor');
        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email dan password harus diisi',
            });
            return;
        }
        const authService = new AuthService_1.AuthService();
        const result = await authService.login(email, password);
        res.json({
            success: true,
            message: 'Login berhasil',
            data: result,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
async function getProfile(req, res) {
    try {
        const authService = new AuthService_1.AuthService();
        const user = await authService.getUserById(req.user?.id);
        res.json({
            success: true,
            message: 'Profil berhasil diambil',
            data: {
                id: user.getId(),
                nama: user.getNama(),
                email: user.getEmail(),
                role: user.getRole(),
            },
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || 'Terjadi kesalahan pada server',
        });
    }
}
//# sourceMappingURL=authController.js.map
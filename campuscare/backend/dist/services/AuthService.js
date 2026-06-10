"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../database/connection");
const Pelapor_1 = require("../models/Pelapor");
const Admin_1 = require("../models/Admin");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
class AuthService {
    async register(nama, email, password, role = 'pelapor') {
        const db = (0, connection_1.getDatabase)();
        const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser) {
            throw new Error('Email sudah terdaftar');
        }
        const hashedPassword = await this.hashPassword(password);
        const result = await db.run('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', [nama, email, hashedPassword, role]);
        const userId = result.lastID;
        const token = this.generateToken(userId, email, role);
        return {
            token,
            userId,
            nama,
            role,
        };
    }
    async login(email, password) {
        const db = (0, connection_1.getDatabase)();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) {
            throw new Error('Email atau password salah');
        }
        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Email atau password salah');
        }
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            token,
            userId: user.id,
            nama: user.nama,
            role: user.role,
        };
    }
    async getUserById(userId) {
        const db = (0, connection_1.getDatabase)();
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            throw new Error('Pengguna tidak ditemukan');
        }
        if (user.role === 'admin') {
            return new Admin_1.Admin(user.id, user.nama, user.email, user.role);
        }
        else {
            return new Pelapor_1.Pelapor(user.id, user.nama, user.email, user.role);
        }
    }
    async hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    generateToken(userId, email, role) {
        return jsonwebtoken_1.default.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const auth_1 = require("../utils/auth");
function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Token tidak ditemukan',
            });
            return;
        }
        const decoded = (0, auth_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token tidak valid',
        });
    }
}
function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Akses hanya untuk admin',
        });
        return;
    }
    next();
}
//# sourceMappingURL=auth.js.map
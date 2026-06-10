import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiResponse, JwtPayload } from '../models/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan',
      } as ApiResponse<null>);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token tidak valid',
    } as ApiResponse<null>);
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Akses hanya untuk admin',
    } as ApiResponse<null>);
    return;
  }
  next();
}

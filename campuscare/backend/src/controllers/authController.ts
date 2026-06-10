import { Request, Response } from 'express';
import { ApiResponse } from '../models/types';
import { AuthService } from '../services/AuthService';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Nama, email, dan password harus diisi',
      } as ApiResponse<null>);
      return;
    }

    const authService = new AuthService();
    const result = await authService.register(nama, email, password, role || 'pelapor');

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: result,
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi',
      } as ApiResponse<null>);
      return;
    }

    const authService = new AuthService();
    const result = await authService.login(email, password);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: result,
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const authService = new AuthService();
    const user = await authService.getUserById(req.user?.id!);

    res.json({
      success: true,
      message: 'Profil berhasil diambil',
      data: {
        id: user.getId(),
        nama: user.getNama(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

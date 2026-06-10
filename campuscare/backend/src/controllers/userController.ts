import { Request, Response } from 'express';
import { ApiResponse } from '../models/types';
import { UserService } from '../services/UserService';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const userService = new UserService();
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      message: 'Semua pengguna berhasil diambil',
      data: users,
    } as ApiResponse<any[]>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { nama, role } = req.body;

    const userService = new UserService();
    await userService.updateUser(Number(id), { nama, role });

    res.json({
      success: true,
      message: 'Pengguna berhasil diperbarui',
    } as ApiResponse<null>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    const userService = new UserService();
    await userService.deleteUser(Number(id), req.user?.id!);

    res.json({
      success: true,
      message: 'Pengguna berhasil dihapus',
    } as ApiResponse<null>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

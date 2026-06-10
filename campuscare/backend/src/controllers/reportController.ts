import { Request, Response } from 'express';
import { ApiResponse } from '../models/types';
import { ReportService } from '../services/ReportService';

export async function createReport(req: Request, res: Response): Promise<void> {
  try {
    const { judul, deskripsi, lokasi } = req.body;

    if (!judul || !deskripsi || !lokasi) {
      res.status(400).json({
        success: false,
        message: 'Judul, deskripsi, dan lokasi harus diisi',
      } as ApiResponse<null>);
      return;
    }

    let fotoPath = null;
    if (req.file) {
      fotoPath = `/uploads/${req.file.filename}`;
    }

    const reportService = new ReportService();
    const result = await reportService.createReport(req.user?.id!, {
      judul,
      deskripsi,
      lokasi,
      foto: fotoPath,
    });

    res.status(201).json({
      success: true,
      message: 'Laporan berhasil dibuat',
      data: result,
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function getMyReports(req: Request, res: Response): Promise<void> {
  try {
    const reportService = new ReportService();
    const reports = await reportService.getReportsByUser(req.user?.id!);

    res.json({
      success: true,
      message: 'Laporan berhasil diambil',
      data: reports.map(r => r.getDetail()),
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function getReportById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const reportService = new ReportService();
    
    // Admin can see all, pelapor only their own
    const userId = req.user?.role === 'admin' ? undefined : req.user?.id;
    const report = await reportService.getReportById(Number(id), userId);

    res.json({
      success: true,
      message: 'Laporan berhasil diambil',
      data: report,
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function updateReport(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { judul, deskripsi, lokasi } = req.body;

    let fotoPath = undefined;
    if (req.file) {
      fotoPath = `/uploads/${req.file.filename}`;
    }

    const reportService = new ReportService();
    await reportService.updateReport(Number(id), req.user?.id!, {
      judul,
      deskripsi,
      lokasi,
      foto: fotoPath,
    });

    res.json({
      success: true,
      message: 'Laporan berhasil diperbarui',
    } as ApiResponse<null>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function getAllReports(req: Request, res: Response): Promise<void> {
  try {
    const reportService = new ReportService();
    const reports = await reportService.getAllReports();

    res.json({
      success: true,
      message: 'Semua laporan berhasil diambil',
      data: reports,
    } as ApiResponse<any[]>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function updateReportStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reportService = new ReportService();
    await reportService.updateReportStatus(Number(id), status);

    res.json({
      success: true,
      message: 'Status laporan berhasil diperbarui',
    } as ApiResponse<null>);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

export async function getStatistics(req: Request, res: Response): Promise<void> {
  try {
    const reportService = new ReportService();
    const stats = await reportService.getStatistics();

    res.json({
      success: true,
      message: 'Statistik berhasil diambil',
      data: stats,
    } as ApiResponse<any>);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Terjadi kesalahan pada server',
    } as ApiResponse<null>);
  }
}

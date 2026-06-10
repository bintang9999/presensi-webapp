export interface User {
  id: number;
  nama: string;
  email: string;
  role: 'pelapor' | 'admin';
  created_at: string;
}

export interface Report {
  id: number;
  kode_laporan: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  foto: string | null;
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  user_id: number;
  created_at: string;
  updated_at: string;
  pelapor?: string; // from join in admin view
}

export interface Statistics {
  total: number;
  pending: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  monthlyStats: { bulan: string; jumlah: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

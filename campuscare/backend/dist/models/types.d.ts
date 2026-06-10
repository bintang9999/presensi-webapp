export interface User {
    id: number;
    nama: string;
    email: string;
    password: string;
    role: 'pelapor' | 'admin';
    created_at: string;
    updated_at: string;
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
}
export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map
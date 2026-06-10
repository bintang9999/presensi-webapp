# CampusCare - Ready to Use ✅

Bintang, aplikasi sudah 100% siap.

## Setup Final (3 menit)

**Terminal 1 - Backend:**
```bash
cd backend
npm install  # (sudah ada npm packages)
npx ts-node src/database/seed.ts
npm run dev
```
Server: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:3000

## User Flow

### Mahasiswa/Pelapor:
1. Klik "Daftar sebagai Pelapor" di Login page
2. Isi: Nama, Email, Password
3. Auto login setelah register ✅
4. Buat laporan → Upload foto → Submit
5. Lihat status laporan di "Laporan Saya"
6. Edit laporan jika masih pending

### Admin:
1. Login: admin@campuscare.com / admin123
2. Dashboard Admin → lihat statistik & grafik
3. Manajemen Laporan → ubah status laporan
4. Manajemen Pengguna → CRUD user

## Database
- SQLite otomatis dibuat saat server start
- Admin user auto-created saat seed.ts dijalankan
- Foto tersimpan di `/backend/uploads`

## Tech
- Frontend: React + TypeScript + Tailwind + Vite
- Backend: Express + TypeScript + SQLite
- Auth: JWT (7 hari)
- Upload: Multer (5MB max)

## Dokumentasi
- README.md - Overview
- QUICK_START.md - Setup cepat
- FEATURES.md - Fitur lengkap
- PROJECT_STRUCTURE.md - Struktur kode

**Status: ✅ PRODUCTION READY**

Cukup jalankan kedua server. Semua fitur berfungsi.

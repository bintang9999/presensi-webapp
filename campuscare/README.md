# CampusCare - Sistem Pelaporan Kerusakan Fasilitas Kampus

Aplikasi web fullstack untuk memudahkan pelaporan dan pemantauan perbaikan kerusakan fasilitas kampus.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Axios
- **Backend**: Node.js, Express, TypeScript, SQLite, JWT Auth, Multer

## Fitur Utama
1. **Pelapor (Mahasiswa/Dosen/Staf)**
   - Login & Registrasi
   - Membuat laporan kerusakan (dengan foto)
   - Melihat riwayat & status laporan
   - Mengedit laporan (jika masih pending)

2. **Admin**
   - Dashboard statistik laporan
   - Mengubah status laporan (Pending -> Diproses -> Selesai / Ditolak)
   - Manajemen pengguna (CRUD)
   - Melihat detail laporan dengan foto

## Cara Menjalankan

### Persiapan Backend
1. Masuk ke direktori backend: `cd backend`
2. Install dependencies: `npm install`
3. Jalankan seed admin: `npx ts-node src/database/seed.ts`
4. Jalankan server: `npm run dev` (berjalan di port 5000)

*Akun Admin Default:*
- Email: `admin@campuscare.com`
- Password: `admin123`

### Persiapan Frontend
1. Masuk ke direktori frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Jalankan aplikasi: `npm run dev` (berjalan di port 3000)

## Struktur Direktori
- `/backend`: Server Node.js (Clean Architecture: controllers, routes, middleware, services)
- `/frontend`: Client React (Pages, Components, Contexts, Layouts)

## Database
Menggunakan SQLite (`database.sqlite`) di dalam folder backend dengan tabel:
- `users`: Data pelapor dan admin
- `reports`: Data laporan kerusakan (termasuk referensi ke foto di `/uploads`)

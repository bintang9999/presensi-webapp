# CampusCare - Fitur Lengkap

## 🎯 Fitur Sistem

### 1. Autentikasi & Otorisasi
- ✅ Registrasi pengguna (pelapor atau admin)
- ✅ Login dengan email & password
- ✅ JWT token-based authentication
- ✅ Password hashing dengan bcrypt
- ✅ Role-based access control (RBAC)

### 2. Dashboard Pelapor
- ✅ Total laporan, breakdown by status
- ✅ Tabel riwayat laporan terbaru
- ✅ Quick stats cards (pending, diproses, selesai)

### 3. Manajemen Laporan (Pelapor)
- ✅ Buat laporan baru dengan:
  - Judul kerusakan
  - Lokasi (dropdown)
  - Deskripsi detail
  - Upload foto (opsional, max 5MB)
- ✅ Lihat riwayat laporan dengan pagination
- ✅ Edit laporan (hanya jika status pending)
- ✅ Lihat detail laporan termasuk foto
- ✅ Kode laporan otomatis (CC-YYYYMMDD-NNN)

### 4. Dashboard Admin
- ✅ Statistik total laporan breakdown by status
- ✅ Grafik laporan per bulan (12 bulan terakhir)
- ✅ Card statistik dengan ikon & warna

### 5. Manajemen Laporan (Admin)
- ✅ Lihat semua laporan dari semua pengguna
- ✅ Ubah status laporan:
  - Pending → Diproses
  - Diproses → Selesai / Ditolak
- ✅ Lihat detail laporan dengan foto
- ✅ Sort & filter laporan
- ✅ Akses ke info pelapor

### 6. Manajemen Pengguna (Admin)
- ✅ CRUD pengguna
- ✅ Ubah role (pelapor ↔ admin)
- ✅ Hapus pengguna
- ✅ Lihat daftar semua pengguna dengan join data

### 7. UI/UX Modern
- ✅ **Glassmorphism design** dengan backdrop blur
- ✅ **Dark mode & Light mode** toggle
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Color scheme:
  - Primary: Indigo
  - Success: Emerald
  - Warning: Amber
  - Danger: Rose
- ✅ Smooth transitions & animations
- ✅ Icons dengan lucide-react
- ✅ Tailwind CSS untuk styling

### 8. Upload Foto
- ✅ Multer untuk handling file upload
- ✅ Simpan ke `/uploads` folder
- ✅ Preview foto sebelum submit
- ✅ Size limit 5MB
- ✅ Display foto di detail laporan

### 9. Notifikasi & Feedback
- ✅ Error messages
- ✅ Success toast
- ✅ Loading states
- ✅ Status badges dengan warna

### 10. API & Integrasi
- ✅ RESTful API dengan Express
- ✅ Error handling & validation
- ✅ CORS enabled
- ✅ JWT middleware protection
- ✅ Axios instance dengan auto token injection
- ✅ Interceptor untuk auto-logout on 401

## 🔐 Security Features
- ✅ JWT token untuk session management
- ✅ Password hashing dengan bcrypt (10 rounds)
- ✅ Token expiry (7 hari default)
- ✅ Protected routes dengan middleware
- ✅ Role-based access control
- ✅ CORS protection

## 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Sidebar collapses on mobile
- ✅ Touch-friendly buttons & inputs
- ✅ Grid layouts auto-adjust
- ✅ Tables with horizontal scroll on mobile

## 🎨 Design System
- Modern Glassmorphism dengan semi-transparent cards
- Consistent color palette
- Smooth transitions
- Professional SaaS-like appearance
- Dark/Light mode support
- Icons everywhere untuk better UX

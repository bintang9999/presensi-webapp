# 🚀 Quick Start Guide - CampusCare

## Prerequisites
- Node.js v16+ dan npm
- Terminal/Command Prompt

## 1️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create admin user
npx ts-node src/database/seed.ts

# Run server
npm run dev
```

Server akan berjalan di `http://localhost:5000`

### Default Admin Account
- Email: `admin@campuscare.com`
- Password: `admin123`

## 2️⃣ Setup Frontend (Terminal baru)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 3️⃣ Akses Aplikasi

1. Buka browser: `http://localhost:3000`
2. Login dengan akun admin atau buat akun baru sebagai pelapor
3. Mulai gunakan aplikasi!

## 📊 Test Data

### Login sebagai Admin
- Email: `admin@campuscare.com`
- Password: `admin123`

### Buat Akun Baru (Pelapor)
1. Klik "Register" di halaman login
2. Isi form dan pilih role "Pelapor"
3. Login dengan akun baru

## 🔧 Environment Setup

### Backend (.env)
Buat file `.env` di folder backend:

```env
PORT=5000
DB_PATH=./database.sqlite
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
UPLOAD_DIR=./uploads
```

### Frontend
Frontend sudah dikonfigurasi untuk connect ke backend di `http://localhost:5000/api`

## 📝 Available Scripts

### Backend
- `npm run dev` - Start dev server dengan auto-reload
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm run lint` - Type check

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Type check

## 🐛 Troubleshooting

### Backend tidak konek ke database
- Pastikan folder backend memiliki write permission
- Delete `database.sqlite` dan jalankan server lagi

### Frontend tidak konek ke backend
- Pastikan backend sudah running di port 5000
- Check browser console untuk error messages
- Verify CORS settings di backend

### Port sudah dipakai
- Backend: `lsof -i :5000` (Linux/Mac) atau `netstat -ano | findstr :5000` (Windows)
- Frontend: Vite akan auto-use port 3001 jika 3000 sudah pakai

## 📚 Documentation
- Backend: `/backend/README.md`
- Project Structure: `/PROJECT_STRUCTURE.md`
- Features: `/FEATURES.md`

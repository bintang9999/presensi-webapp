# Presensi Web App

Aplikasi web modern untuk auto-presensi Alma Ata, dibangun menggunakan FastAPI (Backend) dan React + Vite + Tailwind CSS (Frontend).

## Persyaratan
- Python 3.10+
- Node.js 18+

## Cara Menjalankan (Development Mode)

### 1. Jalankan Backend (FastAPI)
Buka terminal baru:
```bash
cd web_app/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env dengan kredensial Anda
python main.py
```
Backend akan berjalan di `http://localhost:8000`.

### 2. Jalankan Frontend (React)
Buka terminal baru:
```bash
cd web_app/frontend
npm install
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`. Buka URL tersebut di browser.
Gunakan `WEB_USER` dan `WEB_PASS` dari file `.env` backend untuk login.

---

## Cara Build Production

### Frontend
Untuk mem-build React menjadi file statis yang siap di-serve oleh web server seperti Nginx:
```bash
cd web_app/frontend
npm run build
```
Hasil build akan berada di folder `web_app/frontend/dist`.

---

## Cara Deploy ke Server (Contoh menggunakan Nginx & Systemd di Linux)

### 1. Backend Service (Systemd)
Buat file service systemd `/etc/systemd/system/presensi-backend.service`:
```ini
[Unit]
Description=FastAPI Presensi Backend
After=network.target

[Service]
User=bintang
Group=www-data
WorkingDirectory=/path/to/web_app/backend
Environment="PATH=/path/to/web_app/backend/venv/bin"
ExecStart=/path/to/web_app/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

[Install]
WantedBy=multi-user.target
```
Lalu jalankan:
```bash
sudo systemctl enable presensi-backend
sudo systemctl start presensi-backend
```

### 2. Frontend & Reverse Proxy (Nginx)
Install Nginx, copy folder `dist` dari frontend ke `/var/www/presensi/dist`.
Buat konfigurasi Nginx di `/etc/nginx/sites-available/presensi`:
```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        root /var/www/presensi/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Lalu jalankan:
```bash
sudo ln -s /etc/nginx/sites-available/presensi /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```
Jangan lupa untuk mengubah URL `http://localhost:8000/api` di `frontend/src/api.ts` menjadi `/api` sebelum melakukan build jika menggunakan reverse proxy di atas.

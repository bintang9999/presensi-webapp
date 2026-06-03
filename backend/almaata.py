import requests
from bs4 import BeautifulSoup
import hashlib
import re

BASE_URL = "https://raising.almaata.ac.id"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Origin": BASE_URL
}

# In-memory cache for performance
SESSIONS = {}   # {npm: requests.Session}
NAMESPACES = {} # {npm: namespace}

def get_md5(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()

class AlmaAtaService:
    def __init__(self, npm: str, f1: str, f2: str, id_mahasiswa: str = None):
        self.npm = npm
        self.f1 = f1
        self.f2 = f2
        self.id_mahasiswa = id_mahasiswa
        
        if self.npm not in SESSIONS:
            SESSIONS[self.npm] = requests.Session()
        self.session = SESSIONS[self.npm]

    @property
    def namespace(self):
        return NAMESPACES.get(self.npm)

    @namespace.setter
    def namespace(self, value):
        NAMESPACES[self.npm] = value

    def sync_session_and_namespace(self, force_login=False):
        url_form = f"{BASE_URL}/welcome"
        url_post = f"{BASE_URL}/auth/login"

        if force_login:
            self.session.cookies.clear()
            self.namespace = None

        try:
            r_get = self.session.get(url_form, headers=HEADERS, timeout=30)
            if r_get.status_code != 200:
                return False

            # Cek apakah sudah terautentikasi (hindari POST ulang jika sudah login)
            if "logout" in r_get.text.lower():
                match = re.search(r'almaata\.ac\.id/([a-f0-9]{32,40})/', r_get.url)
                if match:
                    self.namespace = match.group(1)
                    return True

            soup = BeautifulSoup(r_get.text, "html.parser")
            
            csrf_input = soup.find("input", {"name": "csrf_test_name"})
            if csrf_input is None:
                token = self.session.cookies.get("csrf_cookie_name")
                if not token:
                    # Jika tidak ada token CSRF, coba paksa refresh jika belum
                    if not force_login:
                        return self.sync_session_and_namespace(force_login=True)
                    return False
            else:
                token = csrf_input.get("value")

            login_form = soup.find("form")
            if login_form and login_form.get("action"):
                url_post = login_form.get("action")
                if not url_post.startswith("http"):
                    url_post = f"{BASE_URL}/{url_post.lstrip('/')}"
                    
            payload = {
                'csrf_test_name': token,
                'f1': self.f1,
                'f2': self.f2,
                'slogin': 'LOGIN'
            }
            r_post = self.session.post(url_post, data=payload, headers={"Referer": url_form, **HEADERS}, allow_redirects=True)
            
            if self.session.cookies.get("ci_session") and "logout" in r_post.text.lower():
                match = re.search(r'almaata\.ac\.id/([a-f0-9]{32,40})/', r_post.url)
                if match:
                    self.namespace = match.group(1)
                    return True
            
            # Jika gagal dan ini bukan force_login, coba lagi dengan session bersih
            if not force_login:
                return self.sync_session_and_namespace(force_login=True)
                
            return False
        except Exception as e:
            print(f"Error Login Auth: {e}")
            return False

    def extract_id_mahasiswa(self):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return None
                
        try:
            url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
            r = self.session.get(url_dashboard, headers=HEADERS, timeout=30)
            if r.status_code != 200:
                return None
            
            soup = BeautifulSoup(r.text, "html.parser")
            inputs = soup.find_all("input", {"name": "id_mahasiswa"})
            for inp in inputs:
                val = inp.get("value")
                if val and val.strip().isdigit():
                    self.id_mahasiswa = val.strip()
                    return self.id_mahasiswa

            match = re.search(r'name="id_mahasiswa"\s+value="(\d+)"', r.text)
            if match:
                self.id_mahasiswa = match.group(1)
                return self.id_mahasiswa

            match2 = re.search(r'id_mahasiswa\s*:\s*["\']?(\d+)', r.text)
            if match2:
                self.id_mahasiswa = match2.group(1)
                return self.id_mahasiswa
                
            return None
        except Exception as e:
            print(f"Error extracting ID Mahasiswa: {e}")
            return None

    def get_schedule(self):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return []
                
        if not self.id_mahasiswa:
            self.extract_id_mahasiswa()
            
        api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_kuliah_mahasiswa/{self.npm}"
        try:
            r = self.session.get(api_url, headers=HEADERS, timeout=30)
            if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                # Retry login
                if self.sync_session_and_namespace():
                    api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_kuliah_mahasiswa/{self.npm}"
                    r = self.session.get(api_url, headers=HEADERS, timeout=30)
                else:
                    return []
            
            data = r.json().get("data", [])
            formatted_data = []
            for item in data:
                formatted_item = {
                    "id_pertemuan_presensi": str(item.get("id_pertemuan_presensi", "")),
                    "nama_matakuliah": str(item.get("nama_matakuliah", "")),
                    "kode": item.get("kode"),
                    "status_presensi": str(item.get("status_presensi", "0")),
                    "pertemuan_ke": str(item.get("pertemuan_ke")) if item.get("pertemuan_ke") else None,
                    "tanggal": str(item.get("tanggal_pertemuan_presensi")) if item.get("tanggal_pertemuan_presensi") else None,
                    "jam_mulai": str(item.get("jam_awal")) if item.get("jam_awal") else None,
                    "jam_selesai": str(item.get("jam_akhir")) if item.get("jam_akhir") else None,
                    "ruang": item.get("ruang") or item.get("nama_ruang") or item.get("nm_ruang"),
                    "status_pertemuan": item.get("status_pertemuan") or item.get("status")
                }
                formatted_data.append(formatted_item)
            return formatted_data
        except Exception as e:
            print(f"Error fetching schedule: {e}")
            return []

    def submit_attendance(self, id_pertemuan: str, kode: str, matkul: str):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return False, "Sesi kedaluwarsa, gagal login otomatis."

        if not self.id_mahasiswa:
            return False, "ID Mahasiswa tidak ditemukan."

        try:
            url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
            self.session.get(url_dashboard, headers=HEADERS, timeout=30)
            
            token_fresh = self.session.cookies.get("csrf_cookie_name")
            url_api = f"{BASE_URL}/{self.namespace}/api/perkuliahan/create_presensi_mahasiswa_by_kode/{id_pertemuan}"
            
            payload = {
                "id_mahasiswa": self.id_mahasiswa,
                "kode_presensi": kode,
                "csrf_test_name": token_fresh
            }
            
            local_headers = {**HEADERS, "Referer": url_dashboard}
            r = self.session.post(url_api, data=payload, headers=local_headers, timeout=30)
            
            if "json" in r.headers.get("Content-Type", ""):
                js = r.json()
                msg = js.get("message", "No Message")
                if js.get("status") or "berhasil" in msg.lower():
                    return True, "Presensi berhasil dikirim."
                return False, msg
            return False, "Format balasan server tidak dikenali."
        except Exception as e:
            return False, str(e)

    def get_jadwal_ujian(self):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return []
                
        api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_ujian_mahasiswa/{self.npm}"
        try:
            r = self.session.get(api_url, headers=HEADERS, timeout=30)
            if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                if self.sync_session_and_namespace():
                    api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_ujian_mahasiswa/{self.npm}"
                    r = self.session.get(api_url, headers=HEADERS, timeout=30)
                else:
                    return []
            
            # Usually the response format matches schedules, we just return the raw array or 'data' field
            if "data" in r.json():
                return r.json().get("data", [])
            return r.json() # if it's already an array
        except Exception as e:
            print(f"Error fetching jadwal ujian: {e}")
            return []

    def get_tagihan(self, semester: str):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return []
                
        # Tagihan uses POST as requested by the user
        api_url = f"{BASE_URL}/{self.namespace}/api/keuangan/tagihan_data_mhs/{self.npm}/{semester}"
        try:
            # First need to get a fresh CSRF token
            url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
            self.session.get(url_dashboard, headers=HEADERS, timeout=30)
            token_fresh = self.session.cookies.get("csrf_cookie_name")
            
            payload = {
                "csrf_test_name": token_fresh
            }
            local_headers = {**HEADERS, "Referer": url_dashboard}
            r = self.session.post(api_url, data=payload, headers=local_headers, timeout=30)
            
            if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                if self.sync_session_and_namespace():
                    # Retry
                    self.session.get(url_dashboard, headers=HEADERS, timeout=30)
                    token_fresh = self.session.cookies.get("csrf_cookie_name")
                    payload["csrf_test_name"] = token_fresh
                    r = self.session.post(api_url, data=payload, headers=local_headers, timeout=30)
                else:
                    return []

            return r.json()
        except Exception as e:
            print(f"Error fetching tagihan: {e}")
            return []

    def get_kehadiran(self, tahun: str = "2025", semester: str = "2"):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return {}
                
        if not self.id_mahasiswa:
            self.extract_id_mahasiswa()
            if not self.id_mahasiswa:
                return {}

        api_url = f"{BASE_URL}/{self.namespace}/api/cetak/get_kehadiran_mahasiswa_data/{self.id_mahasiswa}?filter_tahun_akademik={tahun}&filter_semester_akademik={semester}"
        try:
            r = self.session.get(api_url, headers=HEADERS, timeout=30)
            if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                if self.sync_session_and_namespace():
                    r = self.session.get(api_url, headers=HEADERS, timeout=30)
                else:
                    return {}
            
            # Count the attendance data
            data = r.json()
            
            with open("/tmp/kehadiran.json", "w") as f:
                import json
                json.dump(data, f)
                
            # Usually the Alma Ata API returns {"data": [...]} where each item is a course
            records = data.get("data", [])
            
            summary = {
                "Hadir": 0,
                "Izin": 0,
                "Sakit": 0,
                "Alpha": 0
            }
            details = []
            
            for course in records:
                summary["Hadir"] += course.get("total_hadir", 0)
                # Because the API doesn't distinguish Izin/Sakit in this summary endpoint,
                # we map all 'tidak hadir' to Alpha for now
                summary["Alpha"] += course.get("total_tidak_hadir", 0)
                
                details.append({
                    "nama_matakuliah": course.get("nama_matakuliah", "Tidak Diketahui"),
                    "total_hadir": course.get("total_hadir", 0),
                    "total_tidak_hadir": course.get("total_tidak_hadir", 0),
                    "presentase_kehadiran": course.get("presentase_kehadiran", 0)
                })
            
            return {
                "summary": summary,
                "details": details
            }
        except Exception as e:
            print(f"Error fetching kehadiran: {e}")
            return {}


import requests
from bs4 import BeautifulSoup
import hashlib
import re
import threading

BASE_URL = "https://raising.almaata.ac.id"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Origin": BASE_URL
}

# In-memory cache for performance
SESSIONS = {}      # {npm: requests.Session}
NAMESPACES = {}    # {npm: namespace}
SESSION_LOCKS = {} # {npm: threading.Lock()}

def get_user_lock(npm: str) -> threading.Lock:
    if npm not in SESSION_LOCKS:
        SESSION_LOCKS[npm] = threading.Lock()
    return SESSION_LOCKS[npm]

def get_md5(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()

def extract_namespace_from_response(response) -> str | None:
    if not response:
        return None
    # 1. Cek final URL
    match = re.search(r'almaata\.ac\.id/(?:index\.php/)?([a-f0-9]{32,40})(?:/|$)', response.url)
    if match:
        return match.group(1)
    # 2. Cek history redirects
    for h in getattr(response, 'history', []):
        match = re.search(r'almaata\.ac\.id/(?:index\.php/)?([a-f0-9]{32,40})(?:/|$)', h.url)
        if match:
            return match.group(1)
        loc = h.headers.get("Location", "")
        match = re.search(r'almaata\.ac\.id/(?:index\.php/)?([a-f0-9]{32,40})(?:/|$)', loc)
        if match:
            return match.group(1)
        match = re.search(r'/([a-f0-9]{32,40})(?:/|$)', loc)
        if match:
            return match.group(1)
    # 3. Cek di dalam konten HTML
    match = re.search(r'/(?:index\.php/)?([a-f0-9]{32,40})/(?:dashboard|api|perkuliahan|auth)', response.text)
    if match:
        return match.group(1)
    return None

class AlmaAtaSessionException(Exception):
    """Exception ketika sesi Alma Ata kedaluwarsa atau gagal terhubung"""
    pass

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

    def check_session_alive(self) -> bool:
        """Memeriksa apakah sesi Alma Ata saat ini masih hidup tanpa logout/login ulang."""
        if not self.namespace:
            return False
        try:
            url_check = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
            r = self.session.get(url_check, headers=HEADERS, timeout=15, allow_redirects=False)
            if r.status_code == 200 and ("logout" in r.text.lower() or "presensi" in r.text.lower()):
                return True
            return False
        except Exception:
            return False

    def sync_session_and_namespace(self, force_login=False):
        url_form = f"{BASE_URL}/welcome"
        url_post = f"{BASE_URL}/auth/login"

        if not force_login:
            # Jika sudah punya namespace dan sesi masih aktif, langsung return True
            if self.namespace and self.check_session_alive():
                return True

        # Bersihkan cookies lama dan namespace untuk login bersih (fresh session)
        self.session.cookies.clear()
        self.namespace = None

        try:
            r_get = self.session.get(url_form, headers=HEADERS, timeout=30)
            if r_get.status_code != 200:
                return False

            # Cek apakah sudah terautentikasi
            if "logout" in r_get.text.lower():
                ns = extract_namespace_from_response(r_get)
                if ns:
                    self.namespace = ns
                    return True

            soup = BeautifulSoup(r_get.text, "html.parser")
            
            csrf_input = soup.find("input", {"name": "csrf_test_name"})
            if csrf_input is None:
                token = self.session.cookies.get("csrf_cookie_name")
                if not token:
                    return False
            else:
                token = csrf_input.get("value")

            login_form = soup.find("form")
            if login_form and login_form.get("action"):
                action_url = login_form.get("action")
                if not action_url.startswith("http"):
                    url_post = f"{BASE_URL}/{action_url.lstrip('/')}"
                else:
                    url_post = action_url
                    
            payload = {
                'csrf_test_name': token,
                'f1': self.f1,
                'f2': self.f2,
                'slogin': 'LOGIN'
            }
            r_post = self.session.post(
                url_post,
                data=payload,
                headers={"Referer": url_form, **HEADERS},
                allow_redirects=True,
                timeout=30
            )
            
            ns = extract_namespace_from_response(r_post)
            if ns and ("logout" in r_post.text.lower() or r_post.status_code == 200):
                self.namespace = ns
                return True
            
            if ns:
                self.namespace = ns
                return True
                
            return False
        except Exception as e:
            print(f"Error Login Auth for {self.npm}: {e}")
            return False

    def extract_id_mahasiswa(self):
        if not self.namespace:
            if not self.sync_session_and_namespace():
                return None
                
        try:
            url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
            r = self.session.get(url_dashboard, headers=HEADERS, timeout=30)
            if r.status_code != 200:
                if self.sync_session_and_namespace(force_login=True):
                    url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
                    r = self.session.get(url_dashboard, headers=HEADERS, timeout=30)
                else:
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
            print(f"Error extracting ID Mahasiswa for {self.npm}: {e}")
            return None

    def get_schedule(self):
        with get_user_lock(self.npm):
            if not self.namespace:
                if not self.sync_session_and_namespace():
                    if not self.sync_session_and_namespace(force_login=True):
                        raise AlmaAtaSessionException("Gagal menghubungkan sesi ke server Alma Ata.")

            if not self.id_mahasiswa:
                self.extract_id_mahasiswa()
                
            api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_kuliah_mahasiswa/{self.npm}"
            try:
                r = self.session.get(api_url, headers=HEADERS, timeout=30)
                
                # Cek jika sesi kedaluwarsa atau dialihkan ke halaman login
                is_invalid = (
                    r.status_code != 200 or 
                    "json" not in r.headers.get("Content-Type", "") or 
                    "welcome" in r.url or 
                    "login" in r.url
                )
                
                if is_invalid:
                    print(f"[{self.npm}] Sesi kedaluwarsa saat get_schedule, mencoba auto re-login...")
                    if self.sync_session_and_namespace(force_login=True):
                        api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_kuliah_mahasiswa/{self.npm}"
                        r = self.session.get(api_url, headers=HEADERS, timeout=30)
                    else:
                        raise AlmaAtaSessionException("Sesi Alma Ata kedaluwarsa dan gagal login otomatis.")
                
                res_data = r.json()
                if isinstance(res_data, dict):
                    if res_data.get("status") is False:
                        msg = str(res_data.get("message", "")).lower()
                        if "session" in msg or "login" in msg or "auth" in msg:
                            if self.sync_session_and_namespace(force_login=True):
                                api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_kuliah_mahasiswa/{self.npm}"
                                r = self.session.get(api_url, headers=HEADERS, timeout=30)
                                res_data = r.json()
                            else:
                                raise AlmaAtaSessionException("Sesi Alma Ata kedaluwarsa.")
                    data = res_data.get("data", [])
                elif isinstance(res_data, list):
                    data = res_data
                else:
                    data = []

                if data is None:
                    data = []

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
            except AlmaAtaSessionException:
                raise
            except Exception as e:
                print(f"Error fetching schedule for {self.npm}: {e}")
                raise AlmaAtaSessionException(f"Gagal memuat jadwal dari server Alma Ata: {str(e)}")

    def submit_attendance(self, id_pertemuan: str, kode: str, matkul: str):
        with get_user_lock(self.npm):
            if not self.namespace:
                if not self.sync_session_and_namespace():
                    if not self.sync_session_and_namespace(force_login=True):
                        return False, "Sesi kedaluwarsa, gagal login otomatis."

            if not self.id_mahasiswa:
                self.extract_id_mahasiswa()
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
        with get_user_lock(self.npm):
            if not self.namespace:
                if not self.sync_session_and_namespace():
                    if not self.sync_session_and_namespace(force_login=True):
                        raise AlmaAtaSessionException("Gagal menghubungkan sesi ke server Alma Ata.")
                    
            api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_ujian_mahasiswa/{self.npm}"
            try:
                r = self.session.get(api_url, headers=HEADERS, timeout=30)
                if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                    if self.sync_session_and_namespace(force_login=True):
                        api_url = f"{BASE_URL}/{self.namespace}/api/perkuliahan/get_jadwal_ujian_mahasiswa/{self.npm}"
                        r = self.session.get(api_url, headers=HEADERS, timeout=30)
                    else:
                        raise AlmaAtaSessionException("Sesi Alma Ata kedaluwarsa.")
                
                res_data = r.json()
                if isinstance(res_data, dict) and "data" in res_data:
                    return res_data.get("data", [])
                elif isinstance(res_data, list):
                    return res_data
                return []
            except AlmaAtaSessionException:
                raise
            except Exception as e:
                print(f"Error fetching jadwal ujian for {self.npm}: {e}")
                raise AlmaAtaSessionException(f"Gagal mengambil jadwal ujian: {str(e)}")

    def get_tagihan(self, semester: str):
        with get_user_lock(self.npm):
            if not self.namespace:
                if not self.sync_session_and_namespace():
                    if not self.sync_session_and_namespace(force_login=True):
                        return []
                    
            api_url = f"{BASE_URL}/{self.namespace}/api/keuangan/tagihan_data_mhs/{self.npm}/{semester}"
            try:
                url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
                self.session.get(url_dashboard, headers=HEADERS, timeout=30)
                token_fresh = self.session.cookies.get("csrf_cookie_name")
                
                payload = {
                    "csrf_test_name": token_fresh
                }
                local_headers = {**HEADERS, "Referer": url_dashboard}
                r = self.session.post(api_url, data=payload, headers=local_headers, timeout=30)
                
                if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                    if self.sync_session_and_namespace(force_login=True):
                        url_dashboard = f"{BASE_URL}/{self.namespace}/dashboard/perkuliahan/presensi"
                        self.session.get(url_dashboard, headers=HEADERS, timeout=30)
                        token_fresh = self.session.cookies.get("csrf_cookie_name")
                        payload["csrf_test_name"] = token_fresh
                        api_url = f"{BASE_URL}/{self.namespace}/api/keuangan/tagihan_data_mhs/{self.npm}/{semester}"
                        r = self.session.post(api_url, data=payload, headers=local_headers, timeout=30)
                    else:
                        return []

                return r.json()
            except Exception as e:
                print(f"Error fetching tagihan for {self.npm}: {e}")
                return []

    def get_kehadiran(self, tahun: str = "2025", semester: str = "2"):
        with get_user_lock(self.npm):
            if not self.namespace:
                if not self.sync_session_and_namespace():
                    if not self.sync_session_and_namespace(force_login=True):
                        return {}
                    
            if not self.id_mahasiswa:
                self.extract_id_mahasiswa()
                if not self.id_mahasiswa:
                    return {}

            api_url = f"{BASE_URL}/{self.namespace}/api/cetak/get_kehadiran_mahasiswa_data/{self.id_mahasiswa}?filter_tahun_akademik={tahun}&filter_semester_akademik={semester}"
            try:
                r = self.session.get(api_url, headers=HEADERS, timeout=30)
                if r.status_code != 200 or "json" not in r.headers.get("Content-Type", ""):
                    if self.sync_session_and_namespace(force_login=True):
                        api_url = f"{BASE_URL}/{self.namespace}/api/cetak/get_kehadiran_mahasiswa_data/{self.id_mahasiswa}?filter_tahun_akademik={tahun}&filter_semester_akademik={semester}"
                        r = self.session.get(api_url, headers=HEADERS, timeout=30)
                    else:
                        return {}
                
                data = r.json()
                records = data.get("data", []) if isinstance(data, dict) else []
                
                summary = {
                    "Hadir": 0,
                    "Izin": 0,
                    "Sakit": 0,
                    "Alpha": 0
                }
                details = []
                
                for course in records:
                    summary["Hadir"] += course.get("total_hadir", 0)
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
                print(f"Error fetching kehadiran for {self.npm}: {e}")
                return {}



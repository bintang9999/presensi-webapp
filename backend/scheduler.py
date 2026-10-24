from apscheduler.schedulers.background import BackgroundScheduler
from almaata import AlmaAtaService
from database import SessionLocal
from models import AttendanceLog, AbsenState, User, MatkulAutoPref
import time

scheduler = BackgroundScheduler()

def check_user_attendance(user_npm: str, db_session=None):
    """Memeriksa dan submit presensi untuk satu user secara spesifik."""
    # Jika db_session tidak diberikan, buat session baru (untuk background task)
    db = db_session if db_session else SessionLocal()
    try:
        user = db.query(User).filter(User.npm == user_npm).first()
        if not user or not user.is_active or not user.is_approved:
            return

        print(f"Checking for User: {user.npm}")
        almaata_service = AlmaAtaService(
            npm=user.npm,
            f1=user.f1,
            f2=user.f2,
            id_mahasiswa=user.id_mahasiswa
        )
        
        schedule_data = almaata_service.get_schedule()
        
        if not schedule_data:
            print(f"[{user.npm}] No schedule data retrieved or failed to login.")
            return

        # Load user's matkul preferences
        prefs = db.query(MatkulAutoPref).filter(MatkulAutoPref.npm == user.npm).all()
        pref_dict = {p.nama_matakuliah: p.is_auto for p in prefs}

        for item in schedule_data:
            idp = str(item.get("id_pertemuan_presensi"))
            matkul = item.get("nama_matakuliah")
            kode = item.get("kode")
            status_presensi = str(item.get("status_presensi", "0"))
            
            # Check preference
            is_auto = pref_dict.get(matkul, True)
            if not is_auto:
                continue
            
            # Cek apakah kode valid dan belum absen
            if kode and kode != "-" and status_presensi == "0":
                # Cek apakah sudah pernah kita proses sukses di database
                state = db.query(AbsenState).filter(
                    AbsenState.id_pertemuan == idp,
                    AbsenState.npm == user.npm
                ).first()
                
                if not state:
                    print(f"[{user.npm}] Auto-submitting attendance for {matkul} (Kode: {kode})")
                    success, msg = almaata_service.submit_attendance(idp, kode, matkul)
                    
                    # Log activity
                    new_log = AttendanceLog(
                        npm=user.npm,
                        matkul=matkul,
                        kode=kode,
                        status="SUCCESS" if success else "FAILED",
                        message=msg
                    )
                    db.add(new_log)
                    
                    if success:
                        new_state = AbsenState(npm=user.npm, id_pertemuan=idp)
                        db.add(new_state)
                    
                    db.commit()
    except Exception as e:
        print(f"Error checking user {user_npm}: {e}")
    finally:
        # Hanya close jika kita yang membuat session-nya di sini
        if not db_session:
            db.close()

def check_and_submit_attendance():
    print(f"[{time.strftime('%H:%M:%S')}] Running automatic attendance check for all users...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.is_active == True, User.is_approved == True).all()
        for user in users:
            check_user_attendance(user.npm, db)
    except Exception as e:
        print(f"Error in scheduler job: {e}")
        # Log error
        try:
            err_log = AttendanceLog(
                npm="SYSTEM",
                matkul="Auto Presensi Scheduler",
                kode="ERROR",
                status="FAILED",
                message=f"Terjadi kesalahan pada scheduler: {str(e)}"
            )
            db.add(err_log)
            db.commit()
        except:
            pass
    finally:
        db.close()

def start_scheduler():
    # Run every 5 minutes
    scheduler.add_job(check_and_submit_attendance, 'interval', minutes=5)
    scheduler.start()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import uvicorn
from contextlib import asynccontextmanager

from config import settings
from database import engine, Base, get_db
from models import AttendanceLog, AbsenState, User, MatkulAutoPref
from schemas import Token, AttendanceLogResponse, ScheduleItem, ToggleMatkulRequest
from auth import create_access_token, get_current_user
from almaata import AlmaAtaService, get_md5
from scheduler import start_scheduler

# Buat tabel database
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield

app = FastAPI(title="Presensi Alma Ata API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    npm = form_data.username
    password = form_data.password
    
    f1 = get_md5(npm)
    f2 = get_md5(password)
    
    almaata_service = AlmaAtaService(npm=npm, f1=f1, f2=f2)
    
    # Coba login ke Alma Ata
    if not almaata_service.sync_session_and_namespace():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Login ke Alma Ata gagal. Periksa NIM dan Password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Ekstrak ID Mahasiswa
    id_mhs = almaata_service.extract_id_mahasiswa()
    if not id_mhs:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Berhasil login, tetapi gagal mendapatkan ID Mahasiswa.",
        )
        
    # Simpan atau update User di Database
    user = db.query(User).filter(User.npm == npm).first()
    if user:
        user.f1 = f1
        user.f2 = f2
        user.id_mahasiswa = id_mhs
    else:
        user = User(npm=npm, f1=f1, f2=f2, id_mahasiswa=id_mhs)
        db.add(user)
    db.commit()

    # Buat JWT Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.npm}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/schedule", response_model=list[ScheduleItem])
async def get_schedule(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    almaata_service = AlmaAtaService(
        npm=current_user.npm, 
        f1=current_user.f1, 
        f2=current_user.f2, 
        id_mahasiswa=current_user.id_mahasiswa
    )
    data = almaata_service.get_schedule()
    
    # Load preferences
    prefs = db.query(MatkulAutoPref).filter(MatkulAutoPref.npm == current_user.npm).all()
    pref_dict = {p.nama_matakuliah: p.is_auto for p in prefs}
    
    for item in data:
        matkul = item.get("nama_matakuliah")
        item["is_auto"] = pref_dict.get(matkul, True)
        
    return data

@app.post("/api/toggle-matkul")
async def toggle_matkul(req: ToggleMatkulRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = db.query(MatkulAutoPref).filter(
        MatkulAutoPref.npm == current_user.npm,
        MatkulAutoPref.nama_matakuliah == req.nama_matakuliah
    ).first()
    
    if pref:
        pref.is_auto = not pref.is_auto
    else:
        pref = MatkulAutoPref(
            npm=current_user.npm,
            nama_matakuliah=req.nama_matakuliah,
            is_auto=False
        )
        db.add(pref)
        
    db.commit()
    return {"status": "success", "matkul": req.nama_matakuliah, "is_auto": pref.is_auto}

@app.post("/api/attendance/{id_pertemuan}")
async def submit_manual_attendance(id_pertemuan: str, kode: str, matkul: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    almaata_service = AlmaAtaService(
        npm=current_user.npm, 
        f1=current_user.f1, 
        f2=current_user.f2, 
        id_mahasiswa=current_user.id_mahasiswa
    )
    
    success, msg = almaata_service.submit_attendance(id_pertemuan, kode, matkul)
    
    new_log = AttendanceLog(
        npm=current_user.npm,
        matkul=matkul,
        kode=kode,
        status="SUCCESS" if success else "FAILED",
        message=msg
    )
    db.add(new_log)
    
    if success:
        state = db.query(AbsenState).filter(
            AbsenState.id_pertemuan == id_pertemuan, 
            AbsenState.npm == current_user.npm
        ).first()
        if not state:
            new_state = AbsenState(npm=current_user.npm, id_pertemuan=id_pertemuan)
            db.add(new_state)
            
    db.commit()
    
    if not success:
        raise HTTPException(status_code=400, detail=msg)
        
    return {"status": "success", "message": msg}

@app.get("/api/logs", response_model=list[AttendanceLogResponse])
async def get_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(AttendanceLog).filter(AttendanceLog.npm == current_user.npm).order_by(AttendanceLog.timestamp.desc()).limit(50).all()
    return logs

@app.get("/api/status")
async def get_status(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.nama:
        try:
            almaata_service = AlmaAtaService(
                npm=current_user.npm, 
                f1=current_user.f1, 
                f2=current_user.f2, 
                id_mahasiswa=current_user.id_mahasiswa
            )
            # Use a dummy semester just to get the profile data
            tagihan_res = almaata_service.get_tagihan("20252")
            if isinstance(tagihan_res, dict) and "data" in tagihan_res and "mhs" in tagihan_res["data"]:
                mhs_nama = tagihan_res["data"]["mhs"].get("nama")
                if mhs_nama:
                    current_user.nama = mhs_nama
                    db.commit()
        except Exception as e:
            print("Error fetching name:", e)

    return {
        "npm": current_user.npm, 
        "is_active": current_user.is_active, 
        "nama": current_user.nama
    }

@app.post("/api/toggle-auto")
async def toggle_auto(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.is_active = not current_user.is_active
    db.commit()
    return {"is_active": current_user.is_active}

@app.get("/api/ujian")
async def get_ujian(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    almaata_service = AlmaAtaService(
        npm=current_user.npm, 
        f1=current_user.f1, 
        f2=current_user.f2, 
        id_mahasiswa=current_user.id_mahasiswa
    )
    data = almaata_service.get_jadwal_ujian()
    return data

@app.get("/api/tagihan/{semester}")
async def get_tagihan(semester: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    almaata_service = AlmaAtaService(
        npm=current_user.npm, 
        f1=current_user.f1, 
        f2=current_user.f2, 
        id_mahasiswa=current_user.id_mahasiswa
    )
    data = almaata_service.get_tagihan(semester)
    return data

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

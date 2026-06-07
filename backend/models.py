from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    npm = Column(String, primary_key=True, index=True)
    f1 = Column(String)
    f2 = Column(String)
    id_mahasiswa = Column(String)
    is_active = Column(Boolean, default=False)
    nama = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)
    role = Column(String, default="user")

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    npm = Column(String, index=True)
    matkul = Column(String, index=True)
    kode = Column(String)
    status = Column(String) # SUCCESS / FAILED
    message = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class AbsenState(Base):
    """Untuk melacak ID pertemuan yang sudah diabsen agar tidak double"""
    __tablename__ = "absen_states"

    id = Column(Integer, primary_key=True, index=True)
    npm = Column(String, index=True)
    id_pertemuan = Column(String, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class MatkulAutoPref(Base):
    """Menyimpan preferensi auto-attendance per mata kuliah per user"""
    __tablename__ = "matkul_auto_prefs"

    id = Column(Integer, primary_key=True, index=True)
    npm = Column(String, index=True)
    nama_matakuliah = Column(String, index=True)
    is_auto = Column(Boolean, default=True)

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class AttendanceLogResponse(BaseModel):
    id: int
    matkul: str
    kode: str
    status: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ScheduleItem(BaseModel):
    id_pertemuan_presensi: str
    nama_matakuliah: str
    kode: str | None
    status_presensi: str
    pertemuan_ke: str | None
    tanggal: str | None
    jam_mulai: str | None
    jam_selesai: str | None
    ruang: str | None = None
    status_pertemuan: str | None = None
    is_auto: bool = True

class ToggleMatkulRequest(BaseModel):
    nama_matakuliah: str

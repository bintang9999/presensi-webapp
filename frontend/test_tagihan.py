from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
sys.path.append('../backend')
from models import User
from almaata import AlmaAtaService

engine = create_engine('sqlite:///../app.db')
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

user = db.query(User).first()
if user:
    svc = AlmaAtaService(npm=user.npm, f1=user.f1, f2=user.f2, id_mahasiswa=user.id_mahasiswa)
    print(svc.get_tagihan("20252"))
else:
    print("No user found")

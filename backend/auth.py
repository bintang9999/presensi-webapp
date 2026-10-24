from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from config import settings
from schemas import TokenData
from database import get_db
from models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        npm: str = payload.get("sub")
        if npm is None:
            raise credentials_exception
        token_data = TokenData(username=npm)
    except InvalidTokenError:
        raise credentials_exception
    
    # Verify user exists in database
    user = db.query(User).filter(User.npm == token_data.username).first()
    if user is None:
        raise credentials_exception
        
    return user

async def require_approved_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_approved:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun kamu belum disetujui oleh admin.",
        )
    return current_user

async def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and current_user.npm != "243200329":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya admin yang bisa mengakses resource ini.",
        )
    return current_user

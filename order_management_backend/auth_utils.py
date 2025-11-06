# app/auth_utils.py
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Dict, Any
from jose import jwt

# config — ideally set via env vars in production
SECRET_KEY = "b6e4a9c5d80f4f1f97b7d8b3c04a7e6e5c3d9a7f4b8c2e1a9d6f8e7c3a5b1d9e"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # e.g., 1 day

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# password helpers
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT helpers
def create_access_token(data: Dict[str, Any], expires_delta: int | None = None) -> str:
    to_encode = data.copy()
    if expires_delta is None:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    else:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

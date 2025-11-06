# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

import database_models, database 
from schemas import UserCreate, UserOut, Token, TokenData
from auth_utils import hash_password, verify_password, create_access_token, decode_access_token, SECRET_KEY, ALGORITHM
import logging
logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # used by Swagger

# DB dependency
def get_db():
    db = database.sessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register route
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for {user}")
    existing = db.query(database_models.User).filter(database_models.User.email == user.email).first()
    count = db.query(database_models.User).count() + 1
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = database_models.User(
        id=count,
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role,
        address=user.address
    )
    db.add(db_user)
    db.commit()
    # db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(database_models.User).filter(database_models.User.email == form_data.username).first()
    if not user or form_data.password != user.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    token_data = {"sub": user.email, "role": user.role}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}
    

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> database_models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        logger.info(f"Decoded payload: {payload}")
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    try:
        user = db.query(database_models.User).filter(database_models.User.email == email).first()
        if user is None:
            raise credentials_exception
    except Exception as e:
        raise credentials_exception
    return user

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: database_models.User = Depends(get_current_user)):
    return current_user

security = HTTPBearer()

def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")



# app/schemas.py
from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"
    address: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    address: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class EmailSchema(BaseModel):
    email: EmailStr
    subject: str
    body: str

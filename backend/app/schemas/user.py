# User schemas
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    peso: Optional[float] = None
    altura: Optional[float] = None
    idade: Optional[int] = None
    foto_perfil: Optional[str] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str # Changed from senha_hash to password for creation
    nome: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None # Allow password update

class UserInDBBase(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Additional properties to return via API
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    senha_hash: str

class UserWithToken(BaseModel):
    id: int
    nome: str
    email: EmailStr
    peso: Optional[float] = None
    altura: Optional[float] = None
    idade: Optional[int] = None
    access_token: str
    token_type: str = "bearer"

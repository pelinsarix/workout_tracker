from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Esquemas compartilhados
class UsuarioBase(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    peso: Optional[float] = None
    altura: Optional[int] = None
    idade: Optional[int] = None

# Esquema para criação
class UsuarioCreate(UsuarioBase):
    email: EmailStr
    nome: str
    password: str

# Esquema para atualização
class UsuarioUpdate(UsuarioBase):
    password: Optional[str] = None

# Esquema para resposta da API
class Usuario(UsuarioBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
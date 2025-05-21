# Exercise schemas
from typing import Optional, List
from pydantic import BaseModel

# Shared properties
class ExercicioBase(BaseModel):
    nome: Optional[str] = None
    grupo_muscular: Optional[str] = None
    equipamento: Optional[str] = None
    descricao: Optional[str] = None
    instrucoes: Optional[str] = None
    dificuldade: Optional[str] = None # iniciante, intermediario, avancado
    imagem_url: Optional[str] = None
    publico: Optional[bool] = False

# Properties to receive via API on creation
class ExercicioCreate(ExercicioBase):
    nome: str
    grupo_muscular: str
    dificuldade: str

# Properties to receive via API on update
class ExercicioUpdate(ExercicioBase):
    pass

class ExercicioInDBBase(ExercicioBase):
    id: int
    usuario_id: Optional[int] = None
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

# Additional properties to return via API
class Exercicio(ExercicioInDBBase):
    pass

# Additional properties stored in DB
class ExercicioInDB(ExercicioInDBBase):
    pass

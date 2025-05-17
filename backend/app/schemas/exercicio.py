from typing import Optional
from pydantic import BaseModel

# Esquemas de exercício
class ExercicioBase(BaseModel):
    nome: str
    grupo_muscular: Optional[str] = None
    equipamento: Optional[str] = None
    instrucoes: Optional[str] = None
    dificuldade: Optional[str] = None
    imagem_url: Optional[str] = None

# Esquema para criação
class ExercicioCreate(ExercicioBase):
    pass

# Esquema para atualização
class ExercicioUpdate(ExercicioBase):
    nome: Optional[str] = None

# Esquema para resposta da API
class Exercicio(ExercicioBase):
    id: str

    class Config:
        orm_mode = True
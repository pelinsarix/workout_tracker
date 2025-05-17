from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

# Esquema para detalhes do exercício dentro do treino
class ExercicioNoTreino(BaseModel):
    id: str
    nome: str
    grupo_muscular: Optional[str] = None
    ordem: int
    series: int
    repeticoes_recomendadas: str
    tempo_descanso: int
    usar_tempo_descanso_global: bool = True

# Esquemas de treino
class TreinoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    tempo_descanso_global: int = 60

# Esquema para criação
class TreinoCreate(TreinoBase):
    exercicios: List[ExercicioNoTreino] = []

# Esquema para atualização
class TreinoUpdate(TreinoBase):
    nome: Optional[str] = None
    exercicios: Optional[List[ExercicioNoTreino]] = None

# Esquema para resposta da API
class Treino(TreinoBase):
    id: str
    exercicios: List[ExercicioNoTreino] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
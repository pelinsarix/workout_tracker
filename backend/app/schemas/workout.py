# Workout schemas (TreinoFixo, ExercicioTreino)
from typing import Optional, List
from pydantic import BaseModel

# --- ExercicioTreino Schemas ---
class ExercicioTreinoBase(BaseModel):
    exercicio_id: int
    series: Optional[int] = 3
    repeticoes_recomendadas: Optional[str] = None
    tempo_descanso: Optional[int] = 60
    usar_tempo_descanso_global: Optional[bool] = True
    ordem: int

class ExercicioTreinoCreate(ExercicioTreinoBase):
    pass

class ExercicioTreinoUpdate(ExercicioTreinoBase):
    id: int # Required for update to identify the specific ExercicioTreino

class ExercicioTreinoInDBBase(ExercicioTreinoBase):
    id: int
    treino_fixo_id: int
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class ExercicioTreino(ExercicioTreinoInDBBase):
    # exercicio: Optional[Exercicio] # If you want to nest Exercicio details
    pass

# --- TreinoFixo Schemas ---
class TreinoFixoBase(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    tempo_descanso_global: Optional[int] = 60

class TreinoFixoCreate(TreinoFixoBase):
    nome: str
    # exercicios: Optional[List[ExercicioTreinoCreate]] = [] # For creating with exercises

class TreinoFixoUpdate(TreinoFixoBase):
    pass
    # exercicios_ordem: Optional[List[dict]] = None # For reordering, e.g. [{"id": 1, "ordem": 3}]

class TreinoFixoInDBBase(TreinoFixoBase):
    id: int
    usuario_id: int
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class TreinoFixo(TreinoFixoInDBBase):
    exercicios_treino: List[ExercicioTreino] = [] # Changed from exercicios to exercicios_treino to match model

class TreinoFixoInDB(TreinoFixoInDBBase):
    pass

# For reordering exercises
class ExercicioOrdemUpdate(BaseModel):
    id: int
    ordem: int

class TreinoExerciciosOrdemUpdate(BaseModel):
    exercicios_ordem: List[ExercicioOrdemUpdate]

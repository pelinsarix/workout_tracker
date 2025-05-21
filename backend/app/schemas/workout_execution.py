# Workout execution schemas
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

# --- Serie Schemas ---
class SerieBase(BaseModel):
    repeticoes: Optional[int] = None
    peso: Optional[float] = None
    concluida: Optional[bool] = False
    ordem: int

class SerieCreate(SerieBase):
    pass

class SerieUpdate(SerieBase):
    id: int # Required for update

class SerieInDBBase(SerieBase):
    id: int
    execucao_exercicio_id: int
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class Serie(SerieInDBBase):
    pass

# --- ExecucaoExercicio Schemas ---
class ExecucaoExercicioBase(BaseModel):
    exercicio_id: int
    exercicio_treino_id: Optional[int] = None # Link to the planned exercise if any

class ExecucaoExercicioCreate(ExecucaoExercicioBase):
    # series: Optional[List[SerieCreate]] = [] # For creating with series
    pass

class ExecucaoExercicioUpdate(ExecucaoExercicioBase):
    id: int # Required for update

class ExecucaoExercicioInDBBase(ExecucaoExercicioBase):
    id: int
    execucao_treino_id: int
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class ExecucaoExercicio(ExecucaoExercicioInDBBase):
    series: List[Serie] = []
    # exercicio: Optional[Exercicio] # If you want to nest Exercicio details

# --- ExecucaoTreino Schemas ---
class ExecucaoTreinoBase(BaseModel):
    treino_fixo_id: int
    peso_usuario: Optional[float] = None
    observacoes: Optional[str] = None

class ExecucaoTreinoCreate(ExecucaoTreinoBase):
    pass

class ExecucaoTreinoUpdate(BaseModel):
    observacoes: Optional[str] = None
    # Potentially other fields that can be updated after start but before finish

class ExecucaoTreinoInDBBase(ExecucaoTreinoBase):
    id: int
    usuario_id: int
    data_inicio: datetime
    data_fim: Optional[datetime] = None
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class ExecucaoTreino(ExecucaoTreinoInDBBase):
    exercicios_executados: List[ExecucaoExercicio] = []
    # treino_fixo: Optional[TreinoFixo] # If you want to nest TreinoFixo details

class ExecucaoTreinoStartResponse(BaseModel):
    id: int
    data_inicio: datetime
    treino_fixo_id: int
    # treino_nome: str # This would require fetching treino_fixo details

class ExecucaoTreinoFinalizar(BaseModel):
    observacoes: Optional[str] = None

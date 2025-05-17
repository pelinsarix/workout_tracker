from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

# Esquema para série
class SerieBase(BaseModel):
    ordem: int
    repeticoes: Optional[int] = None
    peso: Optional[float] = None
    concluida: bool = False
    tempo_descanso_usado: Optional[int] = None

# Esquema para criação de série
class SerieCreate(SerieBase):
    pass

# Esquema para execução de exercício
class ExecucaoExercicioBase(BaseModel):
    exercicio_fixo_id: str
    ordem: int

# Esquema para criação de execução de exercício
class ExecucaoExercicioCreate(ExecucaoExercicioBase):
    series: List[SerieCreate] = []

# Esquema para resposta da API para série
class Serie(SerieBase):
    id: str

    class Config:
        orm_mode = True

# Esquema para resposta da API para execução de exercício
class ExecucaoExercicio(ExecucaoExercicioBase):
    id: str
    series: List[Serie] = []

    class Config:
        orm_mode = True

# Esquema para execução de treino
class ExecucaoTreinoBase(BaseModel):
    treino_fixo_id: str
    peso_usuario: Optional[float] = None

# Esquema para criação de execução de treino
class ExecucaoTreinoCreate(ExecucaoTreinoBase):
    pass

# Esquema para atualização de execução de treino
class ExecucaoTreinoUpdate(BaseModel):
    duracao: Optional[int] = None
    exercicios: Optional[List[ExecucaoExercicioCreate]] = None

# Esquema para resposta da API para execução de treino
class ExecucaoTreino(ExecucaoTreinoBase):
    id: str
    data: datetime
    duracao: Optional[int] = None
    usuario_id: str
    execucoes_exercicios: List[ExecucaoExercicio] = []

    class Config:
        orm_mode = True
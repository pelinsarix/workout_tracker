# CRUD for ExecucaoTreino, ExecucaoExercicio, Serie
from app.crud.base import CRUDBase
from app.models.workout_execution import ExecucaoTreino, ExecucaoExercicio, Serie
from app.schemas.workout_execution import (
    ExecucaoTreinoCreate, ExecucaoTreinoUpdate,
    ExecucaoExercicioCreate, ExecucaoExercicioUpdate,
    SerieCreate, SerieUpdate
)

class CRUDExecucaoTreino(CRUDBase[ExecucaoTreino, ExecucaoTreinoCreate, ExecucaoTreinoUpdate]):
    pass

class CRUDExecucaoExercicio(CRUDBase[ExecucaoExercicio, ExecucaoExercicioCreate, ExecucaoExercicioUpdate]):
    pass

class CRUDSerie(CRUDBase[Serie, SerieCreate, SerieUpdate]):
    pass

execucao_treino = CRUDExecucaoTreino(ExecucaoTreino)
execucao_exercicio = CRUDExecucaoExercicio(ExecucaoExercicio)
serie = CRUDSerie(Serie)

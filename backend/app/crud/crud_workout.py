# CRUD for TreinoFixo and ExercicioTreino
from app.crud.base import CRUDBase
from app.models.workout import TreinoFixo, ExercicioTreino
from app.schemas.workout import TreinoFixoCreate, TreinoFixoUpdate, ExercicioTreinoCreate, ExercicioTreinoUpdate

class CRUDTreinoFixo(CRUDBase[TreinoFixo, TreinoFixoCreate, TreinoFixoUpdate]):
    # Add custom methods if needed
    pass

class CRUDExercicioTreino(CRUDBase[ExercicioTreino, ExercicioTreinoCreate, ExercicioTreinoUpdate]):
    # Add custom methods if needed
    pass

treino_fixo = CRUDTreinoFixo(TreinoFixo)
exercicio_treino = CRUDExercicioTreino(ExercicioTreino)

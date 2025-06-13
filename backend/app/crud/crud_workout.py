# CRUD for TreinoFixo and ExercicioTreino
from typing import List
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.workout import TreinoFixo, ExercicioTreino
from app.schemas.workout import TreinoFixoCreate, TreinoFixoUpdate, ExercicioTreinoCreate, ExercicioTreinoUpdate

class CRUDTreinoFixo(CRUDBase[TreinoFixo, TreinoFixoCreate, TreinoFixoUpdate]):
    # Add custom methods if needed
    def get_multi_by_usuario(
        self, db: Session, *, usuario_id: int, skip: int = 0, limit: int = 100
    ) -> List[TreinoFixo]:
        """Obtém todos os treinos de um usuário específico"""
        return db.query(self.model).filter(
            self.model.usuario_id == usuario_id
        ).offset(skip).limit(limit).all()

class CRUDExercicioTreino(CRUDBase[ExercicioTreino, ExercicioTreinoCreate, ExercicioTreinoUpdate]):
    # Add custom methods if needed
    pass

treino_fixo = CRUDTreinoFixo(TreinoFixo)
exercicio_treino = CRUDExercicioTreino(ExercicioTreino)

# CRUD operations for Exercise model
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional, Union, Dict, Any

from app.crud.base import CRUDBase
from app.models.exercise import Exercicio
from app.schemas.exercise import ExercicioCreate, ExercicioUpdate

class CRUDExercicio(CRUDBase[Exercicio, ExercicioCreate, ExercicioUpdate]):
    def create_with_owner(
        self, db: Session, *, obj_in: ExercicioCreate, user_id: Optional[int] = None
    ) -> Exercicio:
        db_obj = Exercicio(
            **obj_in.model_dump(), 
            usuario_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_owner(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Exercicio]:
        return (
            db.query(self.model)
            .filter(Exercicio.usuario_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_filtered(
        self, 
        db: Session, 
        *, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        grupo_muscular: Optional[str] = None,
        equipamento: Optional[str] = None,
        dificuldade: Optional[str] = None,
        nome: Optional[str] = None
    ) -> List[Exercicio]:
        query = db.query(self.model).filter(
            (Exercicio.publico == True) | (Exercicio.usuario_id == user_id)
        )
        if grupo_muscular:
            query = query.filter(Exercicio.grupo_muscular.ilike(f"%{grupo_muscular}%"))
        if equipamento:
            query = query.filter(Exercicio.equipamento.ilike(f"%{equipamento}%"))
        if dificuldade:
            query = query.filter(Exercicio.dificuldade == dificuldade)
        if nome:
            query = query.filter(Exercicio.nome.ilike(f"%{nome}%"))
        
        return query.offset(skip).limit(limit).all()

    def get_public_or_owner(self, db: Session, *, id: int, user_id: Optional[int]) -> Optional[Exercicio]:
        """Get an exercise if it's public or owned by the user."""
        exercise = db.query(self.model).filter(self.model.id == id).first()
        if not exercise:
            return None
        if exercise.publico or (user_id is not None and exercise.usuario_id == user_id):
            return exercise
        return None

exercicio = CRUDExercicio(Exercicio)

# Workout endpoints
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session, selectinload # Adicionado selectinload
import logging # Adicionado para logging

from app import crud, models, schemas
from app.crud.crud_workout import treino_fixo, exercicio_treino
from app.schemas.workout import TreinoFixo, TreinoFixoCreate, TreinoFixoUpdate, ExercicioTreino, ExercicioTreinoCreate, ExercicioTreinoUpdate
from app.api.deps import get_db, get_current_active_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[TreinoFixo])
def read_treinos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """List all workouts for the current user"""
    # Filtrar treinos pelo usuário atual
    return treino_fixo.get_multi_by_usuario(
        db, usuario_id=current_user.id, skip=skip, limit=limit
    )

@router.get("/{treino_id}", response_model=schemas.TreinoFixo)
def read_treino(
    treino_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a workout by ID"""
    # Modificado para usar eager loading para carregar os detalhes do exercício
    db_obj = (
        db.query(models.TreinoFixo)
        .options(
            selectinload(models.TreinoFixo.exercicios_treino)  # Carrega a lista de ExercicioTreino
            .selectinload(models.ExercicioTreino.exercicio)   # Para cada ExercicioTreino, carrega o Exercicio relacionado
        )
        .filter(models.TreinoFixo.id == treino_id)
        .filter(models.TreinoFixo.usuario_id == current_user.id) # Garantir que o treino pertence ao usuário
        .first()
    )
    
    # Log para depuração
    logging.warning(f"--- Detalhes do Treino Buscado (ID: {treino_id}) ---")
    if not db_obj:
        logging.warning(f"Treino com ID {treino_id} não encontrado ou não pertence ao usuário {current_user.id}.")
        raise HTTPException(status_code=404, detail="Treino não encontrado ou não pertence ao usuário")
    
    logging.warning(f"TreinoFixo ID: {db_obj.id}, Nome: {db_obj.nome}, Usuário ID: {db_obj.usuario_id}")
    logging.warning(f"Número de exercicios_treino: {len(db_obj.exercicios_treino) if db_obj.exercicios_treino else 'Nenhum'}")
    if db_obj.exercicios_treino:
        for i, et in enumerate(db_obj.exercicios_treino):
            logging.warning(f"  ExercicioTreino [{i}]: ID {et.id}, Ordem: {et.ordem}, Exercicio_ID: {et.exercicio_id}")
            if et.exercicio:
                logging.warning(f"    Exercicio Detalhes: ID {et.exercicio.id}, Nome: {et.exercicio.nome}")
            else:
                logging.warning(f"    Exercicio Detalhes: Não carregado ou Nulo")
    logging.warning("--- Fim dos Detalhes do Treino Buscado ---")

    return db_obj

@router.post("/", response_model=TreinoFixo)
def create_treino(
    treino_in: TreinoFixoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new workout"""
    # Criar objeto para passar para o CRUD
    db_obj = treino_fixo.create(
        db, 
        obj_in={"usuario_id": current_user.id, **treino_in.model_dump()}
    )
    return db_obj

@router.put("/{treino_id}", response_model=TreinoFixo)
def update_treino(
    treino_id: int,
    treino_in: TreinoFixoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update an existing workout"""
    db_obj = treino_fixo.get(db, id=treino_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    # Verificar se o treino pertence ao usuário atual
    if db_obj.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso não permitido a este treino")
        
    return treino_fixo.update(db, db_obj=db_obj, obj_in=treino_in)

@router.delete("/{treino_id}", response_model=TreinoFixo)
def delete_treino(
    treino_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a workout"""
    db_obj = treino_fixo.get(db, id=treino_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    # Verificar se o treino pertence ao usuário atual
    if db_obj.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso não permitido a este treino")
        
    return treino_fixo.remove(db, id=treino_id)

# Endpoints para gerenciar exercícios dentro dos treinos
@router.post("/{treino_id}/exercicios", response_model=ExercicioTreino)
def add_exercicio_to_treino(
    treino_id: int,
    exercicio_in: ExercicioTreinoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Adicionar exercício a um treino"""
    treino = treino_fixo.get(db, id=treino_id)
    if not treino:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    # Verificar se o treino pertence ao usuário atual
    if treino.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso não permitido a este treino")
    
    # Verificar se o exercício existe
    exercicio = db.query(models.Exercicio).get(exercicio_in.exercicio_id)
    if not exercicio:
        raise HTTPException(status_code=404, detail="Exercício não encontrado")
    
    # Criar o exercício no treino
    return exercicio_treino.create(db, obj_in={
        "treino_fixo_id": treino_id,
        **exercicio_in.model_dump()
    })

@router.put("/{treino_id}/exercicios/{exercicio_treino_id}", response_model=ExercicioTreino)
def update_exercicio_in_treino(
    treino_id: int,
    exercicio_treino_id: int,
    exercicio_in: ExercicioTreinoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Atualizar informações de um exercício em um treino"""
    treino = treino_fixo.get(db, id=treino_id)
    if not treino:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    # Verificar se o treino pertence ao usuário atual
    if treino.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso não permitido a este treino")
    
    # Buscar o exercício no treino
    ex_treino = exercicio_treino.get(db, id=exercicio_treino_id)
    if not ex_treino:
        raise HTTPException(status_code=404, detail="Exercício não encontrado no treino")
    
    if ex_treino.treino_fixo_id != treino_id:
        raise HTTPException(status_code=400, detail="Este exercício não pertence ao treino informado")
    
    # Atualizar
    return exercicio_treino.update(db, db_obj=ex_treino, obj_in=exercicio_in)

@router.delete("/{treino_id}/exercicios/{exercicio_treino_id}", response_model=ExercicioTreino)
def remove_exercicio_from_treino(
    treino_id: int,
    exercicio_treino_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Remover exercício de um treino"""
    treino = treino_fixo.get(db, id=treino_id)
    if not treino:
        raise HTTPException(status_code=404, detail="Treino não encontrado")
    
    # Verificar se o treino pertence ao usuário atual
    if treino.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acesso não permitido a este treino")
    
    # Buscar o exercício no treino com o relacionamento 'exercicio' pré-carregado
    ex_treino = (
        db.query(models.ExercicioTreino)
        .options(selectinload(models.ExercicioTreino.exercicio))
        .filter(models.ExercicioTreino.id == exercicio_treino_id)
        .first()
    )
    
    if not ex_treino:
        raise HTTPException(status_code=404, detail="Exercício não encontrado no treino")
    
    if ex_treino.treino_fixo_id != treino_id:
        raise HTTPException(status_code=400, detail="Este exercício não pertence ao treino informado")
    
    # Remover
    exercicio_treino.remove(db, id=exercicio_treino_id)
    # Retornar o objeto como estava antes da remoção (com 'exercicio' carregado)
    return ex_treino

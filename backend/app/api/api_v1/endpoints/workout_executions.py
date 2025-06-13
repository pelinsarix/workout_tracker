# Workout execution endpoints
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/start", response_model=schemas.workout_execution.ExecucaoTreino)
def start_workout_execution(
    *,
    db: Session = Depends(deps.get_db),
    start_data: schemas.workout_execution.TreinoExecucaoStart, # Schema para dados de início
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Start a new workout execution (minimal data).
    """
    treino_fixo = crud.treino_fixo.get(db=db, id=start_data.treino_fixo_id)
    if not treino_fixo:
        raise HTTPException(status_code=404, detail=f"Fixed workout with id {start_data.treino_fixo_id} not found")
    # Adicionar verificação de permissão se o treino fixo não pertencer ao usuário (ex: treinos públicos)
    # if treino_fixo.usuario_id != current_user.id and not treino_fixo.publico:
    #     raise HTTPException(status_code=403, detail="Not enough permissions for this fixed workout")

    workout_execution = crud.execucao_treino.start_execution(
        db=db, obj_in=start_data, usuario_id=current_user.id
    )
    return workout_execution


@router.post("/", response_model=schemas.workout_execution.ExecucaoTreino)
def create_full_workout_execution(
    *,
    db: Session = Depends(deps.get_db),
    workout_execution_in: schemas.workout_execution.ExecucaoTreinoCreate, # Corrigido: TreinoExecucaoCreate -> ExecucaoTreinoCreate
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new workout execution with all details (exercises and series).
    Este endpoint pode ser usado se o frontend envia todos os dados de uma vez.
    Alternativamente, o fluxo seria /start e depois / {execucao_id} com PUT.
    """
    treino_fixo = crud.treino_fixo.get(db=db, id=workout_execution_in.treino_fixo_id)
    if not treino_fixo:
        raise HTTPException(status_code=404, detail=f"TreinoFixo with id {workout_execution_in.treino_fixo_id} not found.")
    # Adicionar verificação de permissão

    workout_execution = crud.execucao_treino.create_with_exercicios(
        db=db, obj_in=workout_execution_in, usuario_id=current_user.id
    )
    return workout_execution


@router.get("/by-workout/{treino_fixo_id}", response_model=List[schemas.workout_execution.ExecucaoTreino])
def read_workout_executions_by_workout(
    treino_fixo_id: int,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve workout executions for a specific fixed workout by the current user.
    """
    # Adicionar verificação se o treino_fixo_id existe e se o usuário tem permissão para vê-lo
    treino_fixo = crud.treino_fixo.get(db=db, id=treino_fixo_id)
    if not treino_fixo:
        raise HTTPException(status_code=404, detail=f"Fixed workout with id {treino_fixo_id} not found")
    # if treino_fixo.usuario_id != current_user.id and not treino_fixo.publico: # Exemplo de verificação
    #     raise HTTPException(status_code=403, detail="Not allowed to view executions for this workout")

    workout_executions = crud.execucao_treino.get_multi_by_usuario_and_treino_fixo(
        db=db, usuario_id=current_user.id, treino_fixo_id=treino_fixo_id, skip=skip, limit=limit
    )
    return workout_executions


@router.get("/", response_model=List[schemas.workout_execution.ExecucaoTreino])
def read_all_user_workout_executions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve all workout executions for the current user.
    """
    workout_executions = crud.execucao_treino.get_multi_by_usuario(
        db=db, usuario_id=current_user.id, skip=skip, limit=limit
    )
    return workout_executions


@router.get("/{execucao_id}", response_model=schemas.workout_execution.ExecucaoTreino)
def read_workout_execution_details(
    execucao_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a specific workout execution by ID, ensuring it belongs to the current user.
    """
    workout_execution = crud.execucao_treino.get_full_details(db=db, id=execucao_id, usuario_id=current_user.id)
    if not workout_execution:
        raise HTTPException(status_code=404, detail="Workout execution not found or not owned by user")
    # A verificação de owner já é feita em get_full_details, mas uma dupla verificação não faz mal.
    if workout_execution.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return workout_execution


@router.put("/{execucao_id}", response_model=schemas.workout_execution.ExecucaoTreino)
def update_workout_execution(
    *,
    db: Session = Depends(deps.get_db),
    execucao_id: int,
    workout_execution_in: schemas.workout_execution.ExecucaoTreinoUpdate, # Corrigido: TreinoExecucaoUpdate -> ExecucaoTreinoUpdate
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a workout execution (e.g., mark as finished, update series, observations).
    This is intended to be used to finalize the workout and save all performed series.
    """
    db_obj = crud.execucao_treino.get(db=db, id=execucao_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workout execution not found")
    if db_obj.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Usar a função finalizar_treino do CRUD que deve lidar com a lógica de 
    # atualizar/criar séries e exercícios executados.
    updated_workout_execution = crud.execucao_treino.finalizar_treino(
        db=db, db_obj=db_obj, obj_in=workout_execution_in
    )
    return updated_workout_execution


@router.delete("/{execucao_id}", status_code=204)
def delete_workout_execution(
    *,
    db: Session = Depends(deps.get_db),
    execucao_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> None:
    """
    Delete a workout execution.
    Only the owner can delete their execution.
    """
    db_obj = crud.execucao_treino.get(db=db, id=execucao_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workout execution not found")
    if db_obj.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    crud.execucao_treino.remove(db=db, id=execucao_id)

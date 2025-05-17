from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.utils.dependencies import get_current_user, get_db

router = APIRouter()

@router.get("/me", response_model=schemas.Usuario)
def read_user_me(
    current_user: models.Usuario = Depends(get_current_user),
) -> Any:
    """
    Obter usuário atual.
    """
    return current_user

@router.put("/me", response_model=schemas.Usuario)
def update_user_me(
    *,
    db: Session = Depends(get_db),
    nome: str = Body(None),
    peso: float = Body(None),
    altura: int = Body(None),
    idade: int = Body(None),
    password: str = Body(None),
    current_user: models.Usuario = Depends(get_current_user),
) -> Any:
    """
    Atualizar dados do usuário.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas.UsuarioUpdate(**current_user_data)
    
    if nome is not None:
        user_in.nome = nome
    if peso is not None:
        user_in.peso = peso
    if altura is not None:
        user_in.altura = altura
    if idade is not None:
        user_in.idade = idade
    if password is not None:
        user_in.password = password
        
    user = crud.usuario.update(db, db_obj=current_user, obj_in=user_in)
    return user

@router.get("/stats", response_model=schemas.UsuarioStats)
def get_user_stats(
    *,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
) -> Any:
    """
    Obter estatísticas do usuário para o dashboard.
    """
    # Aqui você implementaria a lógica para coletar as estatísticas do usuário
    # como número de treinos, progresso, etc.
    
    treinos_realizados = db.query(models.ExecucaoTreino).filter(
        models.ExecucaoTreino.usuario_id == current_user.id
    ).count()
    
    # Calcular tempo total de treino (exemplo simplificado)
    tempo_total = db.query(models.ExecucaoTreino).filter(
        models.ExecucaoTreino.usuario_id == current_user.id
    ).with_entities(models.ExecucaoTreino.duracao).all()
    
    tempo_total_segundos = sum([t[0] or 0 for t in tempo_total])
    
    # Contar dias ativos (dias com pelo menos um treino)
    dias_ativos = db.query(models.ExecucaoTreino.data).filter(
        models.ExecucaoTreino.usuario_id == current_user.id
    ).distinct().count()
    
    # Calcular progresso médio (simplificado - pode ser elaborado)
    # Poderia ser o aumento percentual em pesos/repetições ao longo do tempo
    progresso_medio = "+12%"  # Placeholder - implementar cálculo real
    
    return {
        "treinos_realizados": treinos_realizados,
        "tempo_total": tempo_total_segundos,
        "dias_ativos": dias_ativos,
        "progresso_medio": progresso_medio,
        # Adicione mais estatísticas conforme necessário
    }

@router.get("/progress/weight", response_model=List[schemas.PesoHistorico])
def get_weight_progress(
    *,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
) -> Any:
    """
    Obter histórico de peso do usuário.
    """
    # Placeholder - implementar query real para histórico de peso
    # Isso poderia ser registrado em uma tabela separada ou nas execuções de treino
    
    # Exemplo de resposta dummy
    return [
        {"data": "2023-01-01", "peso": 75.0},
        {"data": "2023-02-01", "peso": 74.0},
        {"data": "2023-03-01", "peso": 73.5},
        {"data": "2023-04-01", "peso": 72.0},
        {"data": "2023-05-01", "peso": 71.0},
        {"data": "2023-06-01", "peso": 70.5},
        {"data": "2023-07-01", "peso": 70.0},
    ]

@router.delete("/me", response_model=schemas.Mensagem)
def delete_user_me(
    *,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
) -> Any:
    """
    Excluir conta de usuário atual.
    """
    # Poderia implementar uma exclusão lógica (soft delete) ao invés de remover
    # completamente da base de dados
    crud.usuario.remove(db, id=current_user.id)
    
    return {"message": "Usuário excluído com sucesso"}
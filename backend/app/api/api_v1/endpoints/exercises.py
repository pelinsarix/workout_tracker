# Exercise endpoints
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.post("/", response_model=schemas.Exercicio, status_code=status.HTTP_201_CREATED)
def create_exercicio(
    *, 
    db: Session = Depends(deps.get_db),
    exercicio_in: schemas.ExercicioCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Cria um novo exercício. 
    Se `publico` for True, ele pode ser visto por outros usuários, mas apenas o criador pode editar/excluir.
    Se `publico` for False, apenas o criador pode ver, editar e excluir.
    """
    # Adiciona o usuario_id ao criar o exercício se não for público ou se for público mas criado por um usuário
    # Se um exercício é global (criado por admin, por exemplo), usuario_id pode ser None.
    # Para este escopo, todos os exercícios criados são associados ao usuário.
    return crud.exercicio.create_with_owner(db=db, obj_in=exercicio_in, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Exercicio])
def list_exercicios(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    grupo_muscular: Optional[str] = Query(None, description="Filtrar por grupo muscular"),
    equipamento: Optional[str] = Query(None, description="Filtrar por equipamento"),
    dificuldade: Optional[str] = Query(None, description="Filtrar por dificuldade"),
    nome: Optional[str] = Query(None, description="Buscar por nome (busca parcial)"),
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Lista exercícios. 
    Retorna exercícios públicos e aqueles criados pelo usuário autenticado.
    Permite filtros por grupo_muscular, equipamento, dificuldade e nome.
    """
    exercicios = crud.exercicio.get_multi_filtered(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        grupo_muscular=grupo_muscular,
        equipamento=equipamento,
        dificuldade=dificuldade,
        nome=nome
    )
    return exercicios

@router.get("/{id}", response_model=schemas.Exercicio)
def get_exercicio(
    *, 
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Obtém detalhes de um exercício específico.
    Apenas o criador ou se o exercício for público.
    """
    exercicio = crud.exercicio.get_public_or_owner(db=db, id=id, user_id=current_user.id)
    if not exercicio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercício não encontrado ou acesso negado")
    return exercicio

@router.put("/{id}", response_model=schemas.Exercicio)
def update_exercicio(
    *, 
    db: Session = Depends(deps.get_db),
    id: int,
    exercicio_in: schemas.ExercicioUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Atualiza um exercício.
    Apenas o criador do exercício pode atualizá-lo.
    """
    exercicio = crud.exercicio.get(db=db, id=id)
    if not exercicio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercício não encontrado")
    if exercicio.usuario_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não tem permissão para atualizar este exercício")
    
    # Não permitir que o campo 'publico' seja alterado diretamente por esta rota se houver regras de admin no futuro.
    # Por enquanto, se o usuário é o dono, ele pode mudar a visibilidade.
    # Não permitir que 'usuario_id' seja alterado.
    update_data = exercicio_in.model_dump(exclude_unset=True)
    if "usuario_id" in update_data:
        del update_data["usuario_id"]
        
    return crud.exercicio.update(db=db, db_obj=exercicio, obj_in=update_data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT) # Alterado response_model e status_code
def delete_exercicio(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Exclui um exercício.
    Apenas o criador do exercício pode excluí-lo.
    """
    exercicio = crud.exercicio.get(db=db, id=id)
    if not exercicio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exercício não encontrado")
    if exercicio.usuario_id != current_user.id:
        # Adicionar verificação se o exercício é público e se o usuário é admin, se essa lógica for implementada
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Não tem permissão para excluir este exercício")
    
    crud.exercicio.remove(db=db, id=id)
    # Nenhum corpo de resposta é retornado para 204
    return # Adicionado para FastAPI entender que não há corpo de resposta

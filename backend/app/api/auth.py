from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core import security
from app.core.config import settings
from app.utils.dependencies import get_current_user
from app.db.session import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.Usuario)
def register(
    *,
    db: Session = Depends(get_db),
    user_in: schemas.UsuarioCreate,
) -> Any:
    """
    Registra um novo usuário.
    """
    user = crud.usuario.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Um usuário com esse email já existe no sistema.",
        )
    
    return crud.usuario.create(db, obj_in=user_in)

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    Obtém token de acesso OAuth2 JWT para credenciais válidas.
    """
    user = crud.usuario.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/test-token", response_model=schemas.Usuario)
def test_token(current_user: schemas.Usuario = Depends(get_current_user)) -> Any:
    """
    Testa se o token de acesso é válido.
    """
    return current_user

@router.post("/logout")
def logout():
    """
    Rota para logout do usuário.
    
    Em uma implementação baseada em JWT, geralmente não é necessário
    um endpoint de logout do lado do servidor, já que o token é 
    armazenado no cliente e basta removê-lo.
    
    O frontend deve simplesmente remover o token armazenado localmente.
    """
    return {"message": "Logout realizado com sucesso"}
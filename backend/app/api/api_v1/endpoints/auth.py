# Authentication endpoints
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.api import deps
from app.core import security
from app.core.config import settings
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=schemas.UserWithToken)
def register_new_user(
    *, 
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate
):
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {
        "id": user.id,
        "nome": user.nome,
        "email": user.email,
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/login", response_model=schemas.UserWithToken)
def login_for_access_token(
    db: Session = Depends(deps.get_db), 
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud.user.authenticate(
        db,
        email=form_data.username, # username is the email in this case
        password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {
        "id": user.id,
        "nome": user.nome,
        "email": user.email,
        "peso": user.peso,
        "altura": user.altura,
        "idade": user.idade,
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_active_user)):
    """
    Test access token.
    """
    return current_user

# User test utilities
from typing import Optional

from sqlalchemy.orm import Session

from app import crud, models
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def create_random_user(db: Session) -> models.User:
    email = "test@example.com"
    password = "testpassword"
    user_in = UserCreate(email=email, password=password, nome="Test User")
    user = crud.user.get_by_email(db, email=email)
    if not user:
        return crud.user.create(db, obj_in=user_in)
    return user

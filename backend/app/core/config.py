# Configuration settings
from pydantic import AnyHttpUrl, EmailStr, field_validator  # Alterado de validator para field_validator
from pydantic_settings import BaseSettings
from typing import List, Union, Optional, Any # Adicionado Any
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "a_very_secret_key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 1))

    # Database
    SQLALCHEMY_DATABASE_URI: str = os.getenv("DATABASE_URL", "sqlite:///./fittracker.db") # Alterado para ler DATABASE_URL diretamente

    PROJECT_NAME: str = "FitTracker API"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

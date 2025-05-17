from typing import List, Union
from pydantic import AnyHttpUrl, BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 dias
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    # Nome do projeto
    PROJECT_NAME: str = "FitTracker"
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./fittracker.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
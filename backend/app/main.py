import app.db.base  # Registrar todos os modelos antes de criar tabelas e antes de importar rotas
from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine # Importar engine
from app.db.base_class import Base # Importar Base
from fastapi.middleware.cors import CORSMiddleware

# Cria as tabelas no banco de dados (apenas para desenvolvimento/simplicidade)
# Em produção, você usaria Alembic ou outra ferramenta de migração.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Integrate front-end by enabling CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/ping")
def pong():
    """
    Sanity check.

    This will let the user know that the service is operational.
    And this path operation will: 
    * show up in the OpenAPI UI
    * be included in the generated client code
    """
    return {"ping": "pong!"}

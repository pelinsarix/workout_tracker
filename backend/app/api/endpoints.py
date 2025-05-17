from fastapi import APIRouter

from app.api import auth, usuarios, treinos, exercicios, execucoes

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["autenticação"])
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["usuários"])
api_router.include_router(treinos.router, prefix="/treinos", tags=["treinos"])
api_router.include_router(exercicios.router, prefix="/exercicios", tags=["exercícios"])
api_router.include_router(execucoes.router, prefix="/execucoes", tags=["execuções"])
# API router aggregation
from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, exercises, workouts, workout_executions, statistics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/usuarios", tags=["users"])
api_router.include_router(exercises.router, prefix="/exercicios", tags=["exercises"])
api_router.include_router(workouts.router, prefix="/treinos", tags=["workouts"])
api_router.include_router(workout_executions.router, prefix="/execucoes", tags=["workout_executions"])
api_router.include_router(statistics.router, prefix="/estatisticas", tags=["statistics"])

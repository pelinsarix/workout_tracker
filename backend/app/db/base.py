# Base for SQLAlchemy models
from app.db.base_class import Base  # noqa
# Import all the models, so that Base has them before being
# imported by Alembic
from app.models.user import User  # noqa
from app.models.exercise import Exercicio # noqa
from app.models.workout import TreinoFixo, ExercicioTreino  # noqa: Ensure workout tables are registered
from app.models.workout_execution import ExecucaoTreino, ExecucaoExercicio, Serie  # noqa: Ensure execution tables are registered
# Add other models here as they are created
# from app.models.goal import Meta # noqa

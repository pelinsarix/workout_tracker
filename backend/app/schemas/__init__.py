from .token import Token, TokenPayload
from .user import User, UserCreate, UserUpdate, UserInDB, UserWithToken
from .exercise import Exercicio, ExercicioCreate, ExercicioUpdate, ExercicioInDB
# Add other schemas here as they are created
from .workout import TreinoFixo, TreinoFixoCreate, TreinoFixoUpdate, TreinoFixoInDB, ExercicioTreino, ExercicioTreinoCreate, ExercicioTreinoUpdate, ExercicioTreinoInDB
from .workout_execution import SerieBase, SerieCreate, SerieUpdate, Serie, ExecucaoExercicioBase, ExecucaoExercicioCreate, ExecucaoExercicioUpdate, ExecucaoExercicio, ExecucaoTreinoBase, ExecucaoTreinoCreate, ExecucaoTreinoUpdate, ExecucaoTreino, ExecucaoTreinoIniciado, ExecucaoTreinoHistorico, TreinoExecucaoStart, TreinoFixoBasico
# from .goal import Meta, MetaCreate, MetaUpdate, MetaInDB

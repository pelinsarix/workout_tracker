# Workout execution models (ExecucaoTreino, ExecucaoExercicio, Serie)
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base
from app.models.user import User # Import User
from app.models.workout import TreinoFixo # Import TreinoFixo
from app.models.exercise import Exercicio # Import Exercicio
from app.models.workout import ExercicioTreino # Import ExercicioTreino

class ExecucaoTreino(Base):
    __tablename__ = "execucao_treino"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    treino_fixo_id = Column(Integer, ForeignKey("treino_fixo.id"), nullable=False)
    data_inicio = Column(DateTime, nullable=False, default=func.now())
    data_fim = Column(DateTime, nullable=True)
    duracao_minutos = Column(Integer, nullable=True)  # Duração manual em minutos
    peso_usuario = Column(Float, nullable=True) # Renomeado de peso_corporal para consistência com frontend (ou vice-versa)
    observacoes = Column(Text, nullable=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    usuario = relationship("User", back_populates="execucoes_treino")
    treino_fixo = relationship("TreinoFixo", back_populates="execucoes")
    exercicios_executados = relationship("ExecucaoExercicio", back_populates="execucao_treino", cascade="all, delete-orphan")

class ExecucaoExercicio(Base):
    __tablename__ = "execucao_exercicio"

    id = Column(Integer, primary_key=True, index=True)
    execucao_treino_id = Column(Integer, ForeignKey("execucao_treino.id", ondelete="CASCADE"), nullable=False)
    exercicio_id = Column(Integer, ForeignKey("exercicio.id"), nullable=False)
    # exercicio_treino_id = Column(Integer, ForeignKey("exercicio_treino.id"), nullable=True) # Mantido, mas considerar se é sempre necessário
    ordem = Column(Integer, nullable=False) # Adicionado campo ordem para manter a ordem dos exercícios na execução
    observacoes = Column(Text, nullable=True) # Adicionado campo observacoes para o exercício específico
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    execucao_treino = relationship("ExecucaoTreino", back_populates="exercicios_executados")
    exercicio = relationship("Exercicio") 
    # exercicio_treino_info = relationship("ExercicioTreino") # Opcional
    series = relationship("Serie", back_populates="execucao_exercicio", cascade="all, delete-orphan")

class Serie(Base):
    __tablename__ = "serie"

    id = Column(Integer, primary_key=True, index=True)
    execucao_exercicio_id = Column(Integer, ForeignKey("execucao_exercicio.id", ondelete="CASCADE"), nullable=False)
    repeticoes = Column(Integer, nullable=True)
    peso = Column(Float, nullable=True)
    concluida = Column(Boolean, default=False)
    ordem = Column(Integer, nullable=False)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    execucao_exercicio = relationship("ExecucaoExercicio", back_populates="series")

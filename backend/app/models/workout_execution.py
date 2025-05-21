# Workout execution models (ExecucaoTreino, ExecucaoExercicio, Serie)
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class ExecucaoTreino(Base):
    __tablename__ = "execucao_treino"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    treino_fixo_id = Column(Integer, ForeignKey("treino_fixo.id"), nullable=False)
    data_inicio = Column(DateTime, nullable=False, default=func.now())
    data_fim = Column(DateTime, nullable=True)
    peso_usuario = Column(Float, nullable=True)
    observacoes = Column(Text, nullable=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    # usuario = relationship("User", back_populates="execucoes_treino")
    # treino_fixo = relationship("TreinoFixo", back_populates="execucoes_treino")
    # exercicios_executados = relationship("ExecucaoExercicio", back_populates="execucao_treino", cascade="all, delete-orphan")

class ExecucaoExercicio(Base):
    __tablename__ = "execucao_exercicio"

    id = Column(Integer, primary_key=True, index=True)
    execucao_treino_id = Column(Integer, ForeignKey("execucao_treino.id", ondelete="CASCADE"), nullable=False)
    exercicio_id = Column(Integer, ForeignKey("exercicio.id"), nullable=False)
    exercicio_treino_id = Column(Integer, ForeignKey("exercicio_treino.id"), nullable=True) # Can be null if exercise is added ad-hoc
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    # execucao_treino = relationship("ExecucaoTreino", back_populates="exercicios_executados")
    # exercicio = relationship("Exercicio") # No back_populates needed if not traversing from Exercicio to ExecucaoExercicio
    # exercicio_treino_info = relationship("ExercicioTreino") # If needed
    # series = relationship("Serie", back_populates="execucao_exercicio", cascade="all, delete-orphan")

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

    # execucao_exercicio = relationship("ExecucaoExercicio", back_populates="series")

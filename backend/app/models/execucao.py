from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base

class ExecucaoTreino(Base):
    __tablename__ = "execucoes_treino"

    id = Column(String, primary_key=True, index=True)
    data = Column(DateTime(timezone=True), server_default=func.now())
    duracao = Column(Integer, nullable=True)  # em segundos
    peso_usuario = Column(Float, nullable=True)
    treino_fixo_id = Column(String, ForeignKey("treinos_fixos.id"))
    usuario_id = Column(String, ForeignKey("usuarios.id"))

    # Relacionamentos
    treino_fixo = relationship("TreinoFixo", back_populates="execucoes")
    usuario = relationship("Usuario", back_populates="execucoes_treino")
    execucoes_exercicios = relationship("ExecucaoExercicio", back_populates="execucao_treino")

class ExecucaoExercicio(Base):
    __tablename__ = "execucoes_exercicio"

    id = Column(String, primary_key=True, index=True)
    execucao_treino_id = Column(String, ForeignKey("execucoes_treino.id"))
    exercicio_fixo_id = Column(String, ForeignKey("exercicios_fixos.id"))
    ordem = Column(Integer)
    
    # Relacionamentos
    execucao_treino = relationship("ExecucaoTreino", back_populates="execucoes_exercicios")
    exercicio_fixo = relationship("ExercicioFixo", back_populates="execucoes")
    series = relationship("Serie", back_populates="execucao_exercicio")

class Serie(Base):
    __tablename__ = "series"

    id = Column(String, primary_key=True, index=True)
    execucao_exercicio_id = Column(String, ForeignKey("execucoes_exercicio.id"))
    ordem = Column(Integer)
    repeticoes = Column(Integer)
    peso = Column(Float)
    concluida = Column(Boolean, default=False)
    tempo_descanso_usado = Column(Integer, nullable=True)  # em segundos
    
    # Relacionamento
    execucao_exercicio = relationship("ExecucaoExercicio", back_populates="series")
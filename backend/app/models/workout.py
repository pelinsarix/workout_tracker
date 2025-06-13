# Workout models (TreinoFixo, ExercicioTreino)
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class TreinoFixo(Base):
    __tablename__ = "treino_fixo"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    nome = Column(String(100), nullable=False)
    descricao = Column(Text, nullable=True)
    tempo_descanso_global = Column(Integer, default=60) # em segundos
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    usuario = relationship("User", back_populates="treinos_fixos") # Descomentado para corrigir erro de mapeamento
    exercicios_treino = relationship("ExercicioTreino", back_populates="treino_fixo", cascade="all, delete-orphan")
    execucoes = relationship("ExecucaoTreino", back_populates="treino_fixo", cascade="all, delete-orphan") # Relacionamento para execuções

class ExercicioTreino(Base):
    __tablename__ = "exercicio_treino"

    id = Column(Integer, primary_key=True, index=True)
    treino_fixo_id = Column(Integer, ForeignKey("treino_fixo.id", ondelete="CASCADE"), nullable=False)
    exercicio_id = Column(Integer, ForeignKey("exercicio.id"), nullable=False)
    series = Column(Integer, nullable=False, default=3)
    repeticoes_recomendadas = Column(String(20), nullable=True)
    tempo_descanso = Column(Integer, default=60) # em segundos
    usar_tempo_descanso_global = Column(Boolean, default=True)
    ordem = Column(Integer, nullable=False)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    treino_fixo = relationship("TreinoFixo", back_populates="exercicios_treino")
    exercicio = relationship("Exercicio", back_populates="treinos_exercicios") # Descomentado

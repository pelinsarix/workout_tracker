from sqlalchemy import Column, String, Text, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base

# Tabela de associação entre TreinoFixo e ExercicioFixo
treino_exercicio = Table(
    "treinos_exercicios",
    Base.metadata,
    Column("treino_id", String, ForeignKey("treinos_fixos.id"), primary_key=True),
    Column("exercicio_id", String, ForeignKey("exercicios_fixos.id"), primary_key=True),
    Column("ordem", Integer),
    Column("series", Integer),
    Column("repeticoes_recomendadas", String),
    Column("tempo_descanso", Integer),
    Column("usar_tempo_descanso_global", Boolean, default=True),
)

class TreinoFixo(Base):
    __tablename__ = "treinos_fixos"

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, index=True)
    descricao = Column(Text, nullable=True)
    tempo_descanso_global = Column(Integer, default=60)  # em segundos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    exercicios = relationship(
        "ExercicioFixo", 
        secondary=treino_exercicio, 
        back_populates="treinos"
    )
    execucoes = relationship("ExecucaoTreino", back_populates="treino_fixo")
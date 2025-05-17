from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.treino import treino_exercicio

class ExercicioFixo(Base):
    __tablename__ = "exercicios_fixos"

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, index=True)
    grupo_muscular = Column(String, nullable=True)
    equipamento = Column(String, nullable=True)
    instrucoes = Column(Text, nullable=True)
    dificuldade = Column(String, nullable=True)  # iniciante, intermediario, avancado
    imagem_url = Column(String, nullable=True)

    # Relacionamentos
    treinos = relationship(
        "TreinoFixo", 
        secondary=treino_exercicio, 
        back_populates="exercicios"
    )
    execucoes = relationship("ExecucaoExercicio", back_populates="exercicio_fixo")
# Exercise model
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Exercicio(Base):
    __tablename__ = "exercicio"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    grupo_muscular = Column(String(50), nullable=False)
    equipamento = Column(String(50), nullable=True)
    descricao = Column(Text, nullable=True)
    instrucoes = Column(Text, nullable=True)
    dificuldade = Column(String(20), nullable=False) # iniciante, intermediario, avancado
    imagem_url = Column(String(255), nullable=True)
    publico = Column(Boolean, default=False)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    # usuario = relationship("User", back_populates="exercicios")
    treinos_exercicios = relationship("ExercicioTreino", back_populates="exercicio")

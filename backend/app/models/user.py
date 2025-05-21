# User model
from sqlalchemy import Column, Integer, String, Float, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class User(Base):
    __tablename__ = "usuario" # Explicitly set to match the report

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    peso = Column(Float, nullable=True)
    altura = Column(Float, nullable=True)
    idade = Column(Integer, nullable=True)
    foto_perfil = Column(String(255), nullable=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships (add as needed based on other models)
    # exercicios = relationship("Exercicio", back_populates="usuario")
    # treinos_fixos = relationship("TreinoFixo", back_populates="usuario")
    # execucoes_treino = relationship("ExecucaoTreino", back_populates="usuario")
    # metas = relationship("Meta", back_populates="usuario")

# Goal model (Meta)
from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Meta(Base):
    __tablename__ = "meta"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    tipo = Column(String(50), nullable=False) # treino, peso, carga
    valor_alvo = Column(Float, nullable=False)
    valor_atual = Column(Float, default=0)
    data_inicio = Column(Date, nullable=False)
    data_fim = Column(Date, nullable=True)
    ativa = Column(Boolean, default=True)
    data_criacao = Column(DateTime, default=func.now())
    data_atualizacao = Column(DateTime, default=func.now(), onupdate=func.now())

    # usuario = relationship("User", back_populates="metas")

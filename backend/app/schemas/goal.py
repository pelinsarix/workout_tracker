# Goal schemas (Meta)
from typing import Optional
from pydantic import BaseModel
from datetime import date

class MetaBase(BaseModel):
    tipo: Optional[str] = None # treino, peso, carga
    valor_alvo: Optional[float] = None
    valor_atual: Optional[float] = 0
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    ativa: Optional[bool] = True

class MetaCreate(MetaBase):
    tipo: str
    valor_alvo: float
    data_inicio: date

class MetaUpdate(MetaBase):
    pass

class MetaInDBBase(MetaBase):
    id: int
    usuario_id: int
    # data_criacao: datetime
    # data_atualizacao: datetime

    class Config:
        from_attributes = True

class Meta(MetaInDBBase):
    pass

class MetaInDB(MetaInDBBase):
    pass

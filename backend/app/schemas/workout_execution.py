# Workout execution schemas
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.schemas.exercise import Exercicio # Para aninhar detalhes do exercício, se necessário

# --- Serie Schemas ---
class SerieBase(BaseModel):
    ordem: int
    repeticoes: Optional[int] = None
    peso: Optional[float] = None
    concluida: bool = False

class SerieCreate(SerieBase):
    pass

class SerieUpdate(SerieBase):
    # id: int # Não é necessário para atualizar via nested, mas útil para CRUD direto de Serie
    pass

class Serie(SerieBase):
    id: int
    # execucao_exercicio_id: int # Removido para não expor desnecessariamente

    class Config:
        from_attributes = True

# --- ExecucaoExercicio Schemas ---
class ExecucaoExercicioBase(BaseModel):
    exercicio_id: int
    ordem: int
    # nome_exercicio: Optional[str] = None # Será populado via relationship no schema de resposta
    observacoes: Optional[str] = None

class ExecucaoExercicioCreate(ExecucaoExercicioBase):
    series: List[SerieCreate] = []

class ExecucaoExercicioUpdate(ExecucaoExercicioBase):
    # id: int # Não é necessário para atualizar via nested
    series: Optional[List[SerieUpdate]] = None # Permitir atualização de séries

class ExecucaoExercicio(ExecucaoExercicioBase):
    id: int
    exercicio: Optional[Exercicio] = None # Para mostrar nome, etc.
    series: List[Serie] = []
    # execucao_treino_id: int # Removido para não expor desnecessariamente

    class Config:
        from_attributes = True

# --- ExecucaoTreino Schemas ---
class ExecucaoTreinoBase(BaseModel):
    treino_fixo_id: int
    data_inicio: datetime = Field(default_factory=datetime.now)
    data_fim: Optional[datetime] = None
    duracao_minutos: Optional[int] = None  # Duração manual em minutos
    peso_corporal: Optional[float] = None # Alinhado com o frontend (era peso_usuario no modelo)
    observacoes_gerais: Optional[str] = None # Alinhado com o frontend (era observacoes no modelo)

class ExecucaoTreinoCreate(ExecucaoTreinoBase):
    exercicios_executados: List[ExecucaoExercicioCreate] = []

class ExecucaoTreinoUpdate(BaseModel):
    data_fim: Optional[datetime] = None
    duracao_minutos: Optional[int] = None  # Duração manual em minutos
    peso_corporal: Optional[float] = None
    observacoes_gerais: Optional[str] = None
    exercicios_executados: Optional[List[ExecucaoExercicioUpdate]] = None # Para permitir atualizar exercícios e séries

class ExecucaoTreino(ExecucaoTreinoBase):
    id: int
    usuario_id: int
    exercicios_executados: List[ExecucaoExercicio] = []
    # Incluir dados do treino fixo para facilitar exibição no histórico
    treino_fixo: Optional["TreinoFixoBasico"] = None

    class Config:
        from_attributes = True

# Schema básico do treino fixo para usar na execução (evita dependência circular)
class TreinoFixoBasico(BaseModel):
    id: int
    nome: Optional[str] = None
    descricao: Optional[str] = None
    tempo_descanso_global: Optional[int] = 60
    # Adicionado para garantir que o schema TreinoFixo possa ser usado em ExecucaoTreino
    # sem causar erro de validação se o campo não estiver presente no objeto TreinoFixo retornado pelo DB.
    # Isso pode acontecer se o objeto TreinoFixo não tiver sido atualizado para incluir este campo.
    # Em um cenário ideal, todos os objetos TreinoFixo no DB teriam este campo.
    # Mas para evitar erros de validação em dados existentes, tornamos opcional aqui.
    # Se o campo for essencial para a lógica de negócio, deve ser obrigatório e os dados existentes
    # devem ser migrados.
    # tempo_descanso_entre_series: Optional[int] = None 

    class Config:
        from_attributes = True

# Schema para configuração de série pré-definida
class SerieConfig(BaseModel):
    repeticoes: Optional[int] = None
    peso: Optional[float] = None

# Schema para configuração de exercício pré-definida
class ExercicioConfig(BaseModel):
    series: List[SerieConfig] = []

# Schema para iniciar um treino (input)
class TreinoExecucaoStart(BaseModel):
    treino_fixo_id: int
    data_inicio: datetime = Field(default_factory=datetime.now)
    peso_corporal: Optional[float] = None
    exercicios_config: Optional[dict] = None  # Dict[int, ExercicioConfig] mas simplificado para flexibilidade

# Schema para resposta ao iniciar um treino, pode ser mais simples
class ExecucaoTreinoIniciado(BaseModel):
    id: int
    treino_fixo_id: int
    usuario_id: int
    data_inicio: datetime

# Schema para listar execuções no histórico (pode ser o mesmo que ExecucaoTreino ou um mais leve)
class ExecucaoTreinoHistorico(ExecucaoTreino):
    # Poderia adicionar o nome do treino aqui se fizesse um join na query do CRUD
    # treino_nome: Optional[str] = None
    pass

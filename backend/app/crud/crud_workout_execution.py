# CRUD for ExecucaoTreino, ExecucaoExercicio, Serie
from sqlalchemy.orm import Session, selectinload, joinedload
from typing import List, Optional, Any, Dict

from app.crud.base import CRUDBase
from app.models.workout_execution import ExecucaoTreino, ExecucaoExercicio, Serie
from app.models.exercise import Exercicio as ExercicioModel # Para carregar nome do exercício
from app.models.workout import TreinoFixo, ExercicioTreino # Adicionado para acessar o template
from app.schemas.workout_execution import (
    ExecucaoTreinoCreate, ExecucaoTreinoUpdate,
    ExecucaoExercicioCreate, ExecucaoExercicioUpdate, # Não usado diretamente aqui, mas bom ter
    SerieCreate, SerieUpdate # Não usado diretamente aqui, mas bom ter
)

class CRUDExecucaoTreino(CRUDBase[ExecucaoTreino, ExecucaoTreinoCreate, ExecucaoTreinoUpdate]):
    
    def create_with_exercicios(self, db: Session, *, obj_in: ExecucaoTreinoCreate, usuario_id: int) -> ExecucaoTreino:
        # Mapear nomes de campos do frontend para o modelo, se necessário
        db_obj_data = obj_in.model_dump(exclude={"exercicios_executados"}) # Exclui a lista de exercícios por enquanto
        db_obj_data['usuario_id'] = usuario_id
        # Ajustar nomes de campos se houver divergência entre schema e modelo
        if 'peso_corporal' in db_obj_data:
            db_obj_data['peso_usuario'] = db_obj_data.pop('peso_corporal')
        if 'observacoes_gerais' in db_obj_data:
            db_obj_data['observacoes'] = db_obj_data.pop('observacoes_gerais')

        db_execucao_treino = ExecucaoTreino(**db_obj_data)
        db.add(db_execucao_treino)
        db.flush() # Para obter o ID da execucao_treino antes de adicionar exercícios

        for ex_exec_in in obj_in.exercicios_executados:
            db_ex_exec_data = ex_exec_in.model_dump(exclude={"series"})
            db_ex_exec_data['execucao_treino_id'] = db_execucao_treino.id
            
            db_execucao_exercicio = ExecucaoExercicio(**db_ex_exec_data)
            db.add(db_execucao_exercicio)
            db.flush() # Para obter o ID da execucao_exercicio antes de adicionar séries

            for serie_in in ex_exec_in.series:
                db_serie_data = serie_in.model_dump()
                db_serie_data['execucao_exercicio_id'] = db_execucao_exercicio.id
                db_serie = Serie(**db_serie_data)
                db.add(db_serie)
        
        db.commit()
        db.refresh(db_execucao_treino)
        return db_execucao_treino

    def get_multi_by_usuario_and_treino_fixo(
        self, db: Session, *, usuario_id: int, treino_fixo_id: Optional[int] = None, skip: int = 0, limit: int = 100
    ) -> List[ExecucaoTreino]:
        query = (
            db.query(self.model)
            .filter(ExecucaoTreino.usuario_id == usuario_id)
            .options(
                selectinload(ExecucaoTreino.exercicios_executados)
                .selectinload(ExecucaoExercicio.series),
                selectinload(ExecucaoTreino.exercicios_executados)
                .joinedload(ExecucaoExercicio.exercicio) # Usar joinedload para carregar o nome do exercício
            )
            .order_by(ExecucaoTreino.data_inicio.desc())
        )
        if treino_fixo_id:
            query = query.filter(ExecucaoTreino.treino_fixo_id == treino_fixo_id)
        
        return query.offset(skip).limit(limit).all()

    def get_multi_by_usuario(
        self, db: Session, *, usuario_id: int, skip: int = 0, limit: int = 100
    ) -> List[ExecucaoTreino]:
        return (
            db.query(self.model)
            .filter(ExecucaoTreino.usuario_id == usuario_id)
            .options(
                selectinload(ExecucaoTreino.treino_fixo), # Carregar o TreinoFixo associado
                selectinload(ExecucaoTreino.exercicios_executados)
                .selectinload(ExecucaoExercicio.series),
                selectinload(ExecucaoTreino.exercicios_executados)
                .joinedload(ExecucaoExercicio.exercicio)
            )
            .order_by(ExecucaoTreino.data_inicio.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_full_details(self, db: Session, *, id: int, usuario_id: int) -> Optional[ExecucaoTreino]:
        return (
            db.query(self.model)
            .options(
                selectinload(ExecucaoTreino.exercicios_executados)
                .selectinload(ExecucaoExercicio.series),
                selectinload(ExecucaoTreino.exercicios_executados)
                .joinedload(ExecucaoExercicio.exercicio) # Carrega o objeto Exercicio relacionado
            )
            .filter(ExecucaoTreino.id == id, ExecucaoTreino.usuario_id == usuario_id)
            .first()
        )
    
    # Você pode adicionar um método de atualização mais granular se necessário,
    # por exemplo, para finalizar um treino (atualizar data_fim, observacoes_gerais)
    # e potencialmente atualizar os detalhes dos exercícios e séries.
    def finalizar_treino(self, db: Session, *, db_obj: ExecucaoTreino, obj_in: ExecucaoTreinoUpdate) -> ExecucaoTreino:
        # Atualiza os campos da ExecucaoTreino principal
        update_data = obj_in.model_dump(exclude_unset=True, exclude={"exercicios_executados"})
        if 'peso_corporal' in update_data:
            update_data['peso_usuario'] = update_data.pop('peso_corporal')
        if 'observacoes_gerais' in update_data:
            update_data['observacoes'] = update_data.pop('observacoes_gerais')

        for field, value in update_data.items():
            setattr(db_obj, field, value)        # Atualiza os exercícios executados e suas séries
        if obj_in.exercicios_executados:
            # Criar um mapa dos exercícios existentes por (exercicio_id, ordem)
            exercicios_existentes_map = {(ee.exercicio_id, ee.ordem): ee for ee in db_obj.exercicios_executados}
            
            for ex_update_in in obj_in.exercicios_executados:
                # Buscar o exercício existente por exercicio_id e ordem
                chave_exercicio = (ex_update_in.exercicio_id, ex_update_in.ordem)
                
                if chave_exercicio in exercicios_existentes_map:
                    # Atualizar exercício existente
                    db_execucao_exercicio = exercicios_existentes_map[chave_exercicio]
                    if ex_update_in.observacoes is not None:
                        db_execucao_exercicio.observacoes = ex_update_in.observacoes
                else:
                    # Criar novo exercício se não existe
                    db_ex_exec_data = ex_update_in.model_dump(exclude={"series"})
                    db_ex_exec_data['execucao_treino_id'] = db_obj.id
                    
                    db_execucao_exercicio = ExecucaoExercicio(**db_ex_exec_data)
                    db.add(db_execucao_exercicio)
                    db.flush()  # Para obter o ID antes de adicionar séries
                
                # Atualizar ou criar séries do exercício
                if ex_update_in.series:
                    # Remover séries existentes e criar novas (estratégia mais simples)
                    # Em uma implementação mais sofisticada, você poderia tentar preservar séries existentes
                    for serie_existente in db_execucao_exercicio.series:
                        db.delete(serie_existente)
                    
                    # Adicionar novas séries
                    for serie_in in ex_update_in.series:
                        db_serie_data = serie_in.model_dump()
                        db_serie_data['execucao_exercicio_id'] = db_execucao_exercicio.id
                        db_serie = Serie(**db_serie_data)
                        db.add(db_serie)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def start_execution(self, db: Session, *, obj_in: Any, usuario_id: int) -> ExecucaoTreino:
        """
        Iniciar uma nova execução de treino com dados mínimos (treino_fixo_id, data_inicio, peso_corporal opcional)
        Automaticamente cria os exercícios baseados no template do treino
        """
        # Mapear campos do frontend para o modelo
        db_obj_data = {
            'treino_fixo_id': obj_in.treino_fixo_id,
            'usuario_id': usuario_id,
            'data_inicio': obj_in.data_inicio if hasattr(obj_in, 'data_inicio') else None
        }
        
        # Ajustar nomes de campos se houver divergência entre schema e modelo
        if hasattr(obj_in, 'peso_corporal') and obj_in.peso_corporal is not None:
            db_obj_data['peso_usuario'] = obj_in.peso_corporal
            
        # Criar objeto de execução do treino
        db_execucao_treino = ExecucaoTreino(**db_obj_data)
        db.add(db_execucao_treino)
        db.flush()  # Para obter o ID antes de adicionar exercícios
        
        # Buscar o treino fixo com seus exercícios
        treino_fixo = (
            db.query(TreinoFixo)
            .options(selectinload(TreinoFixo.exercicios_treino))
            .filter(TreinoFixo.id == obj_in.treino_fixo_id)
            .first()
        )
        
        if treino_fixo and treino_fixo.exercicios_treino:
            # Criar exercícios de execução baseados no template
            for exercicio_template in treino_fixo.exercicios_treino:
                # Criar o exercício de execução
                db_execucao_exercicio = ExecucaoExercicio(
                    execucao_treino_id=db_execucao_treino.id,
                    exercicio_id=exercicio_template.exercicio_id,
                    ordem=exercicio_template.ordem,
                    observacoes=""  # Observações vazias para serem preenchidas durante a execução
                )
                db.add(db_execucao_exercicio)
                db.flush()  # Para obter o ID antes de adicionar séries                # Criar séries baseadas no template ou configuração personalizada
                exercicio_config = None
                if hasattr(obj_in, 'exercicios_config') and obj_in.exercicios_config:
                    exercicio_config = obj_in.exercicios_config.get(str(exercicio_template.exercicio_id))
                
                for serie_ordem in range(1, exercicio_template.series + 1):
                    # Inicializar valores padrão
                    repeticoes_padrao = None
                    peso_padrao = None
                    tempo_padrao = None
                    
                    # Verificar se há configuração personalizada para esta série
                    if exercicio_config and len(exercicio_config.get('series', [])) >= serie_ordem:
                        serie_config = exercicio_config['series'][serie_ordem - 1]
                        repeticoes_padrao = serie_config.get('repeticoes')
                        peso_padrao = serie_config.get('peso')
                        tempo_padrao = serie_config.get('tempo')
                    
                    # Se não há configuração personalizada, usar valores recomendados do template
                    if repeticoes_padrao is None and exercicio_template.repeticoes_recomendadas:
                        rep_rec = exercicio_template.repeticoes_recomendadas.strip()
                        try:
                            if '-' in rep_rec:
                                # Range como "8-12"
                                min_rep, max_rep = map(int, rep_rec.split('-'))
                                repeticoes_padrao = (min_rep + max_rep) // 2
                            else:
                                # Número simples como "10"
                                repeticoes_padrao = int(rep_rec)
                        except (ValueError, AttributeError):
                            # Se não conseguir converter, deixa None
                            pass
                    
                    db_serie = Serie(
                        execucao_exercicio_id=db_execucao_exercicio.id,
                        ordem=serie_ordem,
                        repeticoes=repeticoes_padrao,
                        peso=peso_padrao,
                        tempo=tempo_padrao,
                        concluida=False
                    )
                    db.add(db_serie)
        
        db.commit()
        db.refresh(db_execucao_treino)
        return db_execucao_treino

class CRUDExecucaoExercicio(CRUDBase[ExecucaoExercicio, ExecucaoExercicioCreate, ExecucaoExercicioUpdate]):
    pass

class CRUDSerie(CRUDBase[Serie, SerieCreate, SerieUpdate]):
    pass

execucao_treino = CRUDExecucaoTreino(ExecucaoTreino)
execucao_exercicio = CRUDExecucaoExercicio(ExecucaoExercicio)
serie = CRUDSerie(Serie)

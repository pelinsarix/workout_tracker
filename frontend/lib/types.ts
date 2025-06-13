// Definição dos tipos baseados na estrutura atualizada

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  peso?: number;
  altura?: number;
  idade?: number;
  fotoPerfil?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  usuario: Usuario | null;
}

// Novo tipo para corresponder ao schema do backend Exercicio
export interface Exercicio {
  id: number;
  nome: string;
  grupo_muscular?: string;
  // Adicione outros campos relevantes do exercício que você pode querer exibir
}

// --- Tipos de Treino ---
export interface ExercicioTreino {
  id: number;
  treino_fixo_id: number;
  exercicio_id: number;
  // nome_exercicio?: string; // Removido - usaremos o objeto aninhado abaixo
  exercicio?: Exercicio; // Adicionado para aninhar os detalhes do exercício
  series: number;
  repeticoes_recomendadas?: string;
  tempo_descanso?: number;
  usar_tempo_descanso_global?: boolean;
  ordem: number;
}

export interface TreinoFixo {
  id: number;
  usuario_id: number;
  nome: string;
  descricao?: string;
  tempo_descanso_global?: number;
  exercicios_treino: ExercicioTreino[];
}

// --- Tipos de Execução de Treino (Histórico) ---
export interface SerieExecutada {
  id: number;
  ordem: number;
  repeticoes?: number;
  peso?: number;
  tempo?: number; // Para exercícios baseados em tempo
  concluida: boolean;
}

export interface ExecucaoExercicio {
  id: number;
  exercicio_id: number;
  exercicio?: Exercicio; // Para mostrar nome, etc.
  ordem: number;
  series: SerieExecutada[];
  observacoes?: string;
}

export interface TreinoExecucao {
  id: number; // ID da instância da execução do treino
  treino_fixo_id: number;
  treino_fixo?: TreinoFixo; // Adicionado para incluir detalhes do treino fixo
  usuario_id: number;
  data_inicio: string; // Idealmente, string ISO (e.g., new Date().toISOString())
  data_fim?: string; // Idealmente, string ISO
  duracao_minutos?: number; // Duração manual do treino em minutos
  peso_corporal?: number;
  observacoes_gerais?: string;
  exercicios_executados: ExecucaoExercicio[];
}

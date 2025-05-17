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

export interface TreinoFixo {
  id: string
  nome: string
  descricao?: string
  exercicios: ExercicioFixo[]
}

export interface ExercicioFixo {
  id: string
  nome: string
  grupoMuscular?: string
  instrucoes?: string
}

export interface ExecucaoTreino {
  id: string
  data: Date
  treinoFixoId: string
  userId: string
  execucoesExercicios: ExecucaoExercicio[]
}

export interface ExecucaoExercicio {
  id: string
  exercicioFixoId: string
  series: Serie[]
}

export interface Serie {
  repeticoes: number
  peso: number
  concluida: boolean
}

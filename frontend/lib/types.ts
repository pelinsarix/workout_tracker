// Definição dos tipos baseados na estrutura atualizada

export interface Usuario {
  id: string
  nome: string
  peso: number
  altura: number
  idade: number
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

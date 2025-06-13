import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor to attach token if present
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('fittracker_token') : null;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Funções auxiliares para interações com a API
export const TreinosApi = {
  // Obter todos os treinos do usuário
  listarTreinos: async () => {
    const response = await api.get('/treinos/');
    return response.data;
  },

  // Obter um treino específico por ID
  obterTreino: async (id: string | number) => {
    const response = await api.get(`/treinos/${id}`); 
    return response.data;
  },

  // Criar um novo treino
  criarTreino: async (dados: any) => {
    const response = await api.post('/treinos/', dados);
    return response.data;
  },

  // Atualizar um treino existente
  atualizarTreino: async (id: string | number, dados: any) => {
    const response = await api.put(`/treinos/${id}`, dados);
    return response.data;
  },

  // Excluir um treino
  excluirTreino: async (id: string | number) => {
    const response = await api.delete(`/treinos/${id}`);
    return response.data;
  },

  // Adicionar exercício a um treino
  adicionarExercicio: async (treinoId: string | number, dados: any) => {
    const response = await api.post(`/treinos/${treinoId}/exercicios`, dados);
    return response.data;
  },
  
  // Atualizar exercício em um treino
  atualizarExercicio: async (treinoId: string | number, exercicioId: string | number, dados: any) => {
    const response = await api.put(`/treinos/${treinoId}/exercicios/${exercicioId}`, dados);
    return response.data;
  },
  
  // Remover exercício de um treino
  removerExercicio: async (treinoId: string | number, exercicioId: string | number) => {
    const response = await api.delete(`/treinos/${treinoId}/exercicios/${exercicioId}`);
    return response.data;
  }
};

// API para exercícios
export const ExerciciosApi = {
  // Listar todos os exercícios
  listarExercicios: async (params?: any) => {
    const response = await api.get('/exercicios/', { params });
    return response.data;
  },

  // Obter um exercício específico
  obterExercicio: async (id: string | number) => {
    const response = await api.get(`/exercicios/${id}`);
    return response.data;
  },

  // Criar um novo exercício
  criarExercicio: async (dados: any) => {
    const response = await api.post('/exercicios/', dados);
    return response.data;
  },

  // Atualizar um exercício existente
  atualizarExercicio: async (id: string | number, dados: any) => {
    const response = await api.put(`/exercicios/${id}`, dados);
    return response.data;
  },

  // Excluir um exercício
  excluirExercicio: async (id: string | number) => {
    const response = await api.delete(`/exercicios/${id}`);
    return response.data;
  }
};

export const ExecucoesTreinoApi = {
  // Iniciar uma nova execução de treino
  iniciarExecucao: async (dados: { 
    treino_fixo_id: number; 
    data_inicio?: string; 
    peso_corporal?: number;
    exercicios_config?: {[exercicioId: number]: {series: {repeticoes?: number, peso?: number, tempo?: number}[]}}
  }) => {
    const response = await api.post('/execucoes/start', dados);
    return response.data;
  },

  // Criar uma execução de treino completa
  criarExecucaoCompleta: async (dados: any) => { // Substitua 'any' pelo schema apropriado
    const response = await api.post('/execucoes/', dados);
    return response.data;
  },

  // Obter todas as execuções de um treino específico para o usuário atual
  listarExecucoesPorTreino: async (treinoFixoId: number, skip: number = 0, limit: number = 100) => {
    const response = await api.get(`/execucoes/by-workout/${treinoFixoId}`, { params: { skip, limit } });
    return response.data;
  },

  // Obter todas as execuções de treino para o usuário atual
  listarTodasExecucoesUsuario: async (skip: number = 0, limit: number = 100) => {
    const response = await api.get('/execucoes/', { params: { skip, limit } });
    return response.data;
  },

  // Obter detalhes de uma execução específica
  obterDetalhesExecucao: async (execucaoId: number) => {
    const response = await api.get(`/execucoes/${execucaoId}`);
    return response.data;
  },

  // Atualizar/Finalizar uma execução de treino
  atualizarExecucao: async (execucaoId: number, dados: any) => { // Substitua 'any' pelo schema apropriado
    const response = await api.put(`/execucoes/${execucaoId}`, dados);
    return response.data;
  },

  // Excluir uma execução de treino
  excluirExecucao: async (execucaoId: number) => {
    const response = await api.delete(`/execucoes/${execucaoId}`);
    return response.data;
  }
};

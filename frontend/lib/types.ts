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

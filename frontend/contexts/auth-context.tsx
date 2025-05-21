"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario, AuthState } from "@/lib/types";
import axios from "axios";

// URL base da API - corrigindo para usar a porta correta do FastAPI
const API_URL = 'http://localhost:8000/api/v1';

interface AuthContextType extends AuthState {
  login: (email: string, senha: string) => Promise<boolean>;
  cadastro: (usuario: { nome: string; email: string; senha: string }) => Promise<boolean>;
  logout: () => void;
  atualizarPerfil: (dadosUsuario: Partial<Usuario>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    usuario: null,
  });
  
  const router = useRouter();

  // Configurar o axios para incluir o token em todas as requisições
  const setupAxiosInterceptors = (token: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  // Verificar se o usuário está autenticado no carregamento inicial
  useEffect(() => {
    const verificarAuth = async () => {
      try {
        // Verificar se há um token no localStorage
        const token = localStorage.getItem("fittracker_token");
        
        if (!token) {
          setState({ isAuthenticated: false, isLoading: false, usuario: null });
          return;
        }

        // Configurar axios com o token
        setupAxiosInterceptors(token);

        try {
          // Verificar token com o backend
          const { data } = await axios.post(`${API_URL}/auth/test-token`);
          
          // Converter para o formato do nosso modelo
          const usuario: Usuario = {
            id: data.id,
            nome: data.nome,
            email: data.email,
            peso: data.peso,
            altura: data.altura,
            idade: data.idade,
          };

          setState({
            isAuthenticated: true,
            isLoading: false,
            usuario,
          });
        } catch (error) {
          console.error("Token inválido:", error);
          localStorage.removeItem("fittracker_token");
          setState({ isAuthenticated: false, isLoading: false, usuario: null });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem("fittracker_token");
        setState({ isAuthenticated: false, isLoading: false, usuario: null });
      }
    };

    verificarAuth();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // FormData é necessário para o endpoint OAuth2 do FastAPI
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', senha);
      
      const { data } = await axios.post(`${API_URL}/auth/login`, formData);
      
      // Armazenar token
      localStorage.setItem("fittracker_token", data.access_token);
      
      // Configurar axios com o token
      setupAxiosInterceptors(data.access_token);
      
      // Converter para o formato do nosso modelo
      const usuario: Usuario = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        peso: data.peso,
        altura: data.altura,
        idade: data.idade,
      };
      
      setState({
        isAuthenticated: true,
        isLoading: false,
        usuario,
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const cadastro = async (dadosCadastro: { nome: string; email: string; senha: string }): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      console.log("Enviando requisição para:", `${API_URL}/auth/register`);
      
      // No nosso esquema backend, renomeamos 'senha' para 'password'
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
        password: dadosCadastro.senha,
      }, {
        // Adicionando timeouts e configurações para debug
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("Resposta do registro:", data);
      
      // Depois do registro, precisamos fazer login
      return await login(dadosCadastro.email, dadosCadastro.senha);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      // Log detalhado do erro para debug
      if (axios.isAxiosError(error)) {
        console.log("Detalhes do erro:", {
          message: error.message,
          response: error.response ? {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers
          } : 'No response',
          request: error.request ? 'Request was made but no response received' : 'No request made'
        });
      }
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fittracker_token");
    // Limpar cabeçalho de autorização
    delete axios.defaults.headers.common['Authorization'];
    setState({ isAuthenticated: false, isLoading: false, usuario: null });
    router.push("/login");
  };

  const atualizarPerfil = async (dadosUsuario: Partial<Usuario>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Mapear os dados para o formato da API
      const dadosAPI = {
        nome: dadosUsuario.nome,
        peso: dadosUsuario.peso,
        altura: dadosUsuario.altura,
        idade: dadosUsuario.idade,
      };
      
      const { data } = await axios.put(`${API_URL}/usuarios/me`, dadosAPI);
      
      // Converter para o formato do nosso modelo
      const usuarioAtualizado: Usuario = {
        ...state.usuario!,
        nome: data.nome,
        peso: data.peso,
        altura: data.altura,
        idade: data.idade,
      };
      
      setState({
        isAuthenticated: true,
        isLoading: false,
        usuario: usuarioAtualizado,
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, cadastro, logout, atualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

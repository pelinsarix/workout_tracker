"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario, AuthState } from "@/lib/types";
import api from "@/lib/api";

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

        try {
          // Verificar token com o backend
          const { data } = await api.post(`/auth/test-token`);
          
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
      
      // URL-encoded body para OAuth2PasswordRequestForm
      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', senha);
      const { data } = await api.post('/auth/login', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      // Armazenar token
      localStorage.setItem("fittracker_token", data.access_token);
      
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
      
      // No nosso esquema backend, renomeamos 'senha' para 'password'
      const { data } = await api.post('/auth/register', {
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
        password: dadosCadastro.senha,
      });
      
      // Após registro, fazer login
      return await login(dadosCadastro.email, dadosCadastro.senha);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fittracker_token");
    // Token será removido automaticamente pelo interceptor ao não encontrá-lo
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
      
      const { data } = await api.put(`/usuarios/me`, dadosAPI);
      
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

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Usuario, AuthState } from "@/lib/types";

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

        // Em um ambiente real, verificaríamos o token com o backend
        // Aqui vamos simular obtendo o usuário do localStorage
        const userStr = localStorage.getItem("fittracker_user");
        if (userStr) {
          const usuario = JSON.parse(userStr);
          setState({ isAuthenticated: true, isLoading: false, usuario });
        } else {
          setState({ isAuthenticated: false, isLoading: false, usuario: null });
          localStorage.removeItem("fittracker_token");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setState({ isAuthenticated: false, isLoading: false, usuario: null });
        localStorage.removeItem("fittracker_token");
        localStorage.removeItem("fittracker_user");
      }
    };

    verificarAuth();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simular uma chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, verificaríamos as credenciais com o backend
      // Simulação: se o email terminar com @teste.com e a senha tiver mais de 5 caracteres, login bem-sucedido
      if (email.endsWith("@teste.com") && senha.length > 5) {
        const usuario: Usuario = {
          id: "1",
          nome: email.split("@")[0],
          email,
          peso: 75,
          altura: 180,
          idade: 30
        };
        
        // Armazenar dados de autenticação
        localStorage.setItem("fittracker_token", "token_simulado_" + Date.now());
        localStorage.setItem("fittracker_user", JSON.stringify(usuario));
        
        setState({
          isAuthenticated: true,
          isLoading: false,
          usuario
        });
        return true;
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const cadastro = async (dadosCadastro: { nome: string; email: string; senha: string }): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simular uma chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em um ambiente real, enviaríamos os dados para o backend
      const usuario: Usuario = {
        id: "user_" + Date.now(),
        nome: dadosCadastro.nome,
        email: dadosCadastro.email,
      };
      
      // Armazenar dados de autenticação
      localStorage.setItem("fittracker_token", "token_simulado_" + Date.now());
      localStorage.setItem("fittracker_user", JSON.stringify(usuario));
      
      setState({
        isAuthenticated: true,
        isLoading: false,
        usuario
      });
      return true;
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("fittracker_token");
    localStorage.removeItem("fittracker_user");
    setState({ isAuthenticated: false, isLoading: false, usuario: null });
    router.push("/login");
  };

  const atualizarPerfil = async (dadosUsuario: Partial<Usuario>): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simular uma chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!state.usuario) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
      
      // Atualizar dados do usuário
      const usuarioAtualizado = { ...state.usuario, ...dadosUsuario };
      
      // Armazenar dados atualizados
      localStorage.setItem("fittracker_user", JSON.stringify(usuarioAtualizado));
      
      setState({
        isAuthenticated: true,
        isLoading: false,
        usuario: usuarioAtualizado
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

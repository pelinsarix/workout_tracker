"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/login', '/cadastro'];
    
    // Se não estiver autenticado e não estiver em uma rota pública
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      // Salvar a URL atual para redirecionamento após login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.push('/login');
    }
    
    // Se estiver autenticado e em uma rota de autenticação, redirecionar para a home
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Mostrar indicador de carregamento enquanto verifica a autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return <>{children}</>;
}

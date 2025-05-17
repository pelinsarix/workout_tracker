"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

/**
 * Hook para redirecionar usuários com base no estado de autenticação.
 * 
 * @param redirectAuthenticated - Rota para redirecionar se o usuário estiver autenticado
 * @param redirectUnauthenticated - Rota para redirecionar se o usuário não estiver autenticado
 * @returns Um objeto que indica se o redirecionamento está em andamento
 */
export function useAuthRedirect(redirectAuthenticated?: string, redirectUnauthenticated?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && redirectAuthenticated) {
      router.push(redirectAuthenticated);
    } else if (!isAuthenticated && redirectUnauthenticated) {
      router.push(redirectUnauthenticated);
    }
  }, [isAuthenticated, isLoading, redirectAuthenticated, redirectUnauthenticated, router]);

  return { isLoading };
}

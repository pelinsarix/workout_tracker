"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, LogOut } from "lucide-react"

export default function PerfilPage() {
  const { usuario, atualizarPerfil, logout } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do formulário baseado nos dados do usuário autenticado
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: usuario?.nome || "",
    peso: usuario?.peso?.toString() || "",
    altura: usuario?.altura?.toString() || "",
    idade: usuario?.idade?.toString() || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadosUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Converter valores numéricos
      const dadosAtualizados = {
        nome: dadosUsuario.nome,
        peso: dadosUsuario.peso ? parseFloat(dadosUsuario.peso) : undefined,
        altura: dadosUsuario.altura ? parseFloat(dadosUsuario.altura) : undefined,
        idade: dadosUsuario.idade ? parseInt(dadosUsuario.idade) : undefined,
      };
      
      const success = await atualizarPerfil(dadosAtualizados);
      
      if (success) {
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      } else {
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar seu perfil. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Perfil do Usuário</CardTitle>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={dadosUsuario.nome} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={usuario?.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">O e-mail não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input 
                id="peso" 
                name="peso" 
                type="number" 
                value={dadosUsuario.peso} 
                onChange={handleChange}
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input 
                id="altura" 
                name="altura" 
                type="number" 
                value={dadosUsuario.altura} 
                onChange={handleChange} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input 
                id="idade" 
                name="idade" 
                type="number" 
                value={dadosUsuario.idade} 
                onChange={handleChange} 
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

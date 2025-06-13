"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExerciciosApi } from '@/lib/api';
import { Exercicio } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Adicionado CardFooter
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react'; // Adicionado Trash2 e Edit3
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'; // Para feedback ao usuário

export default function ExercicioDetailPage() {
  const router = useRouter();
  const params = useParams();
  const exercicioId = params.id as string;
  const { toast } = useToast();

  const [exercicio, setExercicio] = useState<Exercicio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (exercicioId) {
      const fetchExercicio = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await ExerciciosApi.obterExercicio(exercicioId);
          setExercicio(data);
        } catch (err) {
          console.error("Erro ao buscar exercício:", err);
          let errorMessage = "Não foi possível carregar os detalhes do exercício.";
          if (err.response && err.response.status === 404) {
            errorMessage = "Exercício não encontrado.";
          } else if (err.response && err.response.status === 403) {
            errorMessage = "Você não tem permissão para ver este exercício.";
          }
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
      fetchExercicio();
    }
  }, [exercicioId]);

  const handleExcluir = async () => {
    if (!exercicio) return;
    setIsDeleting(true);
    try {
      await ExerciciosApi.excluirExercicio(exercicio.id);
      toast({
        title: "Exercício excluído!",
        description: `O exercício "${exercicio.nome}" foi excluído com sucesso.`,
        variant: "success",
      });
      router.push('/exercicios'); // Redireciona para a lista de exercícios
    } catch (err) {
      console.error("Erro ao excluir exercício:", err);
      let errorMessage = "Não foi possível excluir o exercício.";
      if (err.response && err.response.status === 403) {
        errorMessage = "Você não tem permissão para excluir este exercício.";
      }
      toast({
        title: "Erro ao excluir",
        description: errorMessage,
        variant: "destructive",
      });
      setError(errorMessage); // Pode ser útil mostrar o erro na página também
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-1/4 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
    );
  }

  if (!exercicio) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        {/* Mantém a mensagem de erro se houver, ou "Exercício não encontrado" se não houver erro mas o exercício for nulo */}
        <p className={error ? "text-red-500" : ""}>{error || 'Exercício não encontrado.'}</p>
        <Button onClick={() => router.push('/exercicios')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button onClick={() => router.push('/exercicios')} variant="outline" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para lista de exercícios
      </Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{exercicio.nome}</CardTitle>
              {exercicio.grupo_muscular && (
                <CardDescription>
                  <Badge variant="secondary">{exercicio.grupo_muscular}</Badge>
                </CardDescription>
              )}
            </div>
            {/* Botões de Ação - verificar se o usuário é o dono para mostrar */}
            {/* A lógica de "dono" precisaria vir da API ou ser inferida */}
            {/* Por enquanto, vamos assumir que se pode ver, pode tentar editar/excluir */}
            {/* Idealmente, a API não retornaria o exercício se não fosse o dono (a menos que público) */}
            {/* e o endpoint de delete/put falharia com 403 se não for o dono */} 
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => router.push(`/exercicios/${exercicio.id}/editar`)}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o exercício "{exercicio.nome}"? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExcluir} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                      {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campos adicionais do exercício podem ser adicionados aqui */}
          {/* Exemplo:
          {exercicio.equipamento && <p><strong>Equipamento:</strong> {exercicio.equipamento}</p>}
          {exercicio.dificuldade && <p><strong>Dificuldade:</strong> {exercicio.dificuldade}</p>}
          {exercicio.descricao && <p><strong>Descrição:</strong> {exercicio.descricao}</p>}
          */}
          <p><strong>ID:</strong> {exercicio.id}</p>
          {exercicio.descricao && <p><strong>Descrição:</strong> {exercicio.descricao}</p>}
          {exercicio.equipamento && <p><strong>Equipamento:</strong> {exercicio.equipamento}</p>}
          {exercicio.dificuldade && <p><strong>Dificuldade:</strong> {exercicio.dificuldade}</p>}
          {exercicio.instrucoes && <p><strong>Instruções:</strong> {exercicio.instrucoes}</p>}
          {exercicio.video_url && 
            <p><strong>Vídeo:</strong> <a href={exercicio.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Assistir</a></p>
          }
          <p><strong>Público:</strong> {exercicio.publico ? 'Sim' : 'Não'}</p>
          {/* Adicionar mais detalhes conforme necessário */}
        </CardContent>
        {/* CardFooter pode ser usado para ações adicionais se necessário */}
      </Card>
    </div>
  );
}

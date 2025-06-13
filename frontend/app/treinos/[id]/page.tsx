"use client"
import { useState, useEffect } from "react";
import React from "react";
import { useParams, useRouter } from 'next/navigation'; // Adicionado useRouter
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { PlayIcon, PencilIcon, DumbbellIcon, PlusIcon, Trash2Icon } from "lucide-react" // Adicionado Trash2Icon
import { TreinosApi } from "@/lib/api";
import { TreinoFixo } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog" // Importar AlertDialog

export default function TreinoDetalhePage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const routeParams = useParams(); 
  const router = useRouter(); // Adicionado router
  const treinoId = routeParams.id as string; 

  const [treino, setTreino] = useState<TreinoFixo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Estado para o processo de exclusão
  
  useEffect(() => {
    const fetchTreino = async () => {
      try {
        setIsLoading(true);
        const data = await TreinosApi.obterTreino(treinoId);
        setTreino(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar detalhes do treino:", err);
        setError("Não foi possível carregar os detalhes deste treino");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (treinoId) { // Adicionada verificação para garantir que treinoId existe
      fetchTreino();
    }
  }, [treinoId]);
  
  // Função para lidar com a exclusão do treino
  const handleExcluirTreino = async () => {
    if (!treinoId) return;
    setIsDeleting(true);
    try {
      await TreinosApi.excluirTreino(treinoId);
      toast({
        title: "Sucesso!",
        description: "Treino excluído com sucesso.",
      });
      router.push("/treinos"); // Redirecionar para a lista de treinos
    } catch (err) {
      console.error("Erro ao excluir treino:", err);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o treino. Tente novamente.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // Renderizar estado de carregamento
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-32 mb-4" />
            
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-3">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            ))}
            
            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Renderizar erro
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <div className="mb-4 text-red-500">
              <DumbbellIcon className="mx-auto h-12 w-12 opacity-30" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{error}</h3>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Tentar novamente
            </Button>
            <div className="mt-4">
              <Link href="/treinos">Voltar para lista de treinos</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!treino) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{treino.nome}</CardTitle>
              <CardDescription>{treino.descricao || "Sem descrição"}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href={`/treinos/${treinoId}/editar`}> 
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PencilIcon className="h-4 w-4" />
                  Editar
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1" disabled={isDeleting}>
                    <Trash2Icon className="h-4 w-4" />
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o treino "{treino.nome}"? Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExcluirTreino} disabled={isDeleting}>
                      {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {treino.exercicios_treino && treino.exercicios_treino.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Exercícios</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/treinos/${treinoId}/exercicios/adicionar`}> {/* Modificado para usar treinoId */}
                    <PlusIcon className="h-4 w-4 mr-1" /> Adicionar Exercício
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {treino.exercicios_treino.sort((a, b) => a.ordem - b.ordem).map((exercicioTreino, index) => (
                  <div key={exercicioTreino.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {/* Modificado para exibir o nome do exercício a partir do objeto aninhado */}
                        <h4 className="font-semibold">
                          {exercicioTreino.exercicio ? exercicioTreino.exercicio.nome : `Exercício ID: ${exercicioTreino.exercicio_id}`}
                        </h4>
                        <div className="mt-1 text-sm">
                          <span className="text-gray-600">
                            {exercicioTreino.series} séries {exercicioTreino.repeticoes_recomendadas ? `× ${exercicioTreino.repeticoes_recomendadas} repetições` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                        {index + 1}/{treino.exercicios_treino.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <DumbbellIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">Este treino ainda não possui exercícios</p>
              <Button className="mt-4" asChild>
                <Link href={`/treinos/${treinoId}/exercicios/adicionar`}>
                  Adicionar Exercícios
                </Link>
              </Button>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href={`/treinos/${treinoId}/iniciar`}>
              <Button className="flex items-center gap-2">
                <PlayIcon className="h-5 w-5" />
                Iniciar Treino
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

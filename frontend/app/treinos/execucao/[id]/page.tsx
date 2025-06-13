"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/alert-dialog";
import { ChevronLeftIcon, ClockIcon, CalendarIcon, WeightIcon, CheckCircle2, XCircle, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExecucoesTreinoApi } from "@/lib/api";
import { TreinoExecucao } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function DetalhesExecucaoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  
  const execucaoId = params?.id;
  const [execucao, setExecucao] = useState<TreinoExecucao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (!execucaoId) {
      setError("ID da execução não fornecido.");
      setLoading(false);
      return;
    }

    const carregarDetalhesExecucao = async () => {
      try {
        setLoading(true);
        const detalhes = await ExecucoesTreinoApi.obterDetalhesExecucao(parseInt(execucaoId));
        setExecucao(detalhes);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar detalhes da execução:", err);
        setError("Não foi possível carregar os detalhes da execução.");
        toast({
          title: "Erro",
          description: "Falha ao carregar os detalhes da execução.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };    carregarDetalhesExecucao();
  }, [execucaoId, toast]);

  const handleExcluirExecucao = async () => {
    if (!execucaoId) return;
    
    try {
      setExcluindo(true);
      await ExecucoesTreinoApi.excluirExecucao(parseInt(execucaoId));
      
      toast({
        title: "Sucesso",
        description: "Execução excluída com sucesso!",
        variant: "default",
      });
      
      // Redirecionar para o histórico após exclusão
      router.push('/treinos/historico');
    } catch (err) {
      console.error("Erro ao excluir execução:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a execução.",
        variant: "destructive",
      });
    } finally {
      setExcluindo(false);
    }
  };

  const calcularDuracao = (dataInicio: string, dataFim?: string) => {
    if (!dataFim) return "Em andamento";
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diferencaMs = fim.getTime() - inicio.getTime();
    const diferencaMinutos = Math.floor(diferencaMs / (1000 * 60));
    
    if (diferencaMinutos < 60) {
      return `${diferencaMinutos} min`;
    } else {
      const horas = Math.floor(diferencaMinutos / 60);
      const minutosRestantes = diferencaMinutos % 60;
      return `${horas}h ${minutosRestantes}min`;
    }
  };

  const contarSeriesRealizadas = (execucao: TreinoExecucao) => {
    if (!execucao.exercicios_executados) return { realizadas: 0, total: 0 };
    
    let realizadas = 0;
    let total = 0;
    
    execucao.exercicios_executados.forEach(exercicio => {
      if (exercicio.series) {
        exercicio.series.forEach(serie => {
          total++;
          if (serie.concluida) realizadas++;
        });
      }
    });
    
    return { realizadas, total };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Carregando detalhes da execução...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push('/treinos/historico')}>
          Voltar ao Histórico
        </Button>
      </div>
    );
  }

  if (!execucao) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Execução não encontrada.</p>
        <Button onClick={() => router.push('/treinos/historico')}>
          Voltar ao Histórico
        </Button>
      </div>
    );
  }

  const { realizadas, total } = contarSeriesRealizadas(execucao);
  const duracao = calcularDuracao(execucao.data_inicio, execucao.data_fim);

  return (
    <div className="container mx-auto px-4 py-8">      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/treinos/historico')}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao Histórico
          </Button>
          
          {/* Botão de Excluir */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={excluindo}>
                {excluindo ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Excluir Execução
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta execução de treino? 
                  Esta ação não pode ser desfeita e todos os dados da execução serão perdidos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleExcluirExecucao}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sim, Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <h1 className="text-3xl font-bold">
          {execucao.treino_fixo?.nome || "Treino"} 
        </h1>
        <p className="text-gray-600">Detalhes da execução</p>
      </div>

      {/* Resumo da Execução */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo da Execução</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Data/Hora</p>
                <p className="font-medium">
                  {format(new Date(execucao.data_inicio), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Duração</p>
                <p className="font-medium">{duracao}</p>
              </div>
            </div>
            
            {execucao.peso_corporal && (
              <div className="flex items-center gap-2">
                <WeightIcon className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Peso Corporal</p>
                  <p className="font-medium">{execucao.peso_corporal} kg</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Séries Realizadas</p>
                <p className="font-medium">{realizadas}/{total}</p>
              </div>
            </div>
          </div>
          
          {execucao.data_fim && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Treino Finalizado
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercícios Executados */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Exercícios Executados</h2>
        
        {execucao.exercicios_executados && execucao.exercicios_executados.length > 0 ? (
          execucao.exercicios_executados.map((exercicioExec, index) => (
            <Card key={exercicioExec.id || index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{exercicioExec.exercicio?.nome || `Exercício ${index + 1}`}</span>
                  <Badge variant="outline">
                    Ordem: {exercicioExec.ordem}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exercicioExec.series && exercicioExec.series.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">Séries Realizadas:</h4>
                    <div className="grid gap-2">
                      {exercicioExec.series.map((serie, serieIndex) => (
                        <div
                          key={serie.id || serieIndex}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            serie.concluida 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {serie.concluida ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="font-medium">Série {serie.ordem}</span>
                          </div>
                          
                          <div className="flex gap-4 text-sm">
                            {serie.repeticoes && (
                              <span className="text-gray-600">
                                <strong>{serie.repeticoes}</strong> reps
                              </span>
                            )}
                            {serie.peso && (
                              <span className="text-gray-600">
                                <strong>{serie.peso}</strong> kg
                              </span>
                            )}
                            {serie.tempo && (
                              <span className="text-gray-600">
                                <strong>{serie.tempo}</strong>s
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhuma série registrada para este exercício.</p>
                )}
                
                {exercicioExec.observacoes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Observações:</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {exercicioExec.observacoes}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">Nenhum exercício foi executado neste treino.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Observações Gerais */}
      {execucao.observacoes_gerais && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Observações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{execucao.observacoes_gerais}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TreinosApi, ExecucoesTreinoApi } from "@/lib/api";
import { TreinoFixo, ExercicioTreino, TreinoExecucao } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon, CheckCircle2, XCircle, TimerIcon, Zap, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
} from "@/components/ui/alert-dialog";

// Placeholder para dados de execução do treino
interface SerieExecutada {
  serie: number;
  repeticoes?: number;
  peso?: number;
  tempo?: number; // para exercícios baseados em tempo
  concluida: boolean;
}

interface ExercicioEmExecucao extends ExercicioTreino {
  seriesExecutadas: SerieExecutada[];
  observacoes?: string;
}

export default function ExecucaoTreinoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const treinoId = params.id;
  const execucaoId = searchParams.get('execucao_id');

  const [treino, setTreino] = useState<TreinoFixo | null>(null);
  const [execucao, setExecucao] = useState<TreinoExecucao | null>(null);
  const [exerciciosEmExecucao, setExerciciosEmExecucao] = useState<ExercicioEmExecucao[]>([]);
  const [exercicioAtualIndex, setExercicioAtualIndex] = useState(0);  const [loading, setLoading] = useState(true);
  const [salvandoProgresso, setSalvandoProgresso] = useState(false);
  const [finalizandoTreino, setFinalizandoTreino] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostrarDialogoFinalizar, setMostrarDialogoFinalizar] = useState(false);
  const [duracaoMinutos, setDuracaoMinutos] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!treinoId) {
      setError("ID do treino não fornecido.");
      setLoading(false);
      return;
    }

    if (!execucaoId) {
      setError("ID da execução não fornecido. Inicie o treino primeiro.");
      setLoading(false);
      return;
    }

    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Buscar dados do treino
        const dadosTreino = await TreinosApi.obterTreino(treinoId);
        setTreino(dadosTreino);

        if (!dadosTreino.exercicios_treino || dadosTreino.exercicios_treino.length === 0) {
          setError("Este treino não possui exercícios para executar.");
          setLoading(false);
          return;
        }        // Buscar dados da execução (se necessário para progresso salvo)
        // Por enquanto, vamos inicializar com dados do treino
        const exerciciosParaExecutar: ExercicioEmExecucao[] = dadosTreino.exercicios_treino.map((et: ExercicioTreino) => ({
          ...et,
          seriesExecutadas: Array.from({ length: et.series || 3 }, (_, i) => ({
            serie: i + 1,
            concluida: false,
          })),
        }));
        
        setExerciciosEmExecucao(exerciciosParaExecutar);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar dados do treino:", err);
        setError("Falha ao carregar o treino. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [treinoId, execucaoId]);

  const exercicioAtual = exerciciosEmExecucao[exercicioAtualIndex];

  const handleProximoExercicio = () => {
    if (exercicioAtualIndex < exerciciosEmExecucao.length - 1) {
      setExercicioAtualIndex(exercicioAtualIndex + 1);
    } else {
      // Último exercício, mostrar diálogo de finalização
      setMostrarDialogoFinalizar(true);
    }
  };

  const handleExercicioAnterior = () => {
    if (exercicioAtualIndex > 0) {
      setExercicioAtualIndex(exercicioAtualIndex - 1);
    }
  };  const handleFinalizarTreino = async () => {
    if (!execucaoId) {
      toast({
        title: "Erro",
        description: "ID da execução não encontrado.",
        variant: "destructive",
      });
      return;
    }

    setFinalizandoTreino(true);

    try {
      // Preparar dados dos exercícios executados no formato correto
      const exerciciosExecutados = exerciciosEmExecucao.map((exercicio, index) => ({
        exercicio_id: exercicio.exercicio?.id || 0,
        ordem: exercicio.ordem || index + 1,
        observacoes: exercicio.observacoes || null,
        series: exercicio.seriesExecutadas.map((serie) => ({
          ordem: serie.serie,
          repeticoes: serie.repeticoes || null,
          peso: serie.peso || null,
          tempo: serie.tempo || null,
          concluida: serie.concluida,
        }))
      }));      // Finalizar execução no backend com o formato correto
      const dadosFinalizacao = {
        data_fim: new Date().toISOString(),
        peso_corporal: null, // Pode ser usado se você quiser permitir atualizar peso corporal na finalização
        observacoes_gerais: null, // Pode adicionar campo para observações gerais se necessário
        duracao_minutos: duracaoMinutos, // Adicionar duração informada pelo usuário
        exercicios_executados: exerciciosExecutados,
      };

      await ExecucoesTreinoApi.atualizarExecucao(parseInt(execucaoId), dadosFinalizacao);

      toast({
        title: "Treino finalizado!",
        description: "Seus dados foram salvos com sucesso.",
      });

      setMostrarDialogoFinalizar(false);
      router.push(`/treinos/historico`);
      
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);
      toast({
        title: "Erro ao finalizar treino",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setFinalizandoTreino(false);
    }
  };
  
  const toggleSerieConcluida = (serieIndex: number) => {
    const novosExercicios = [...exerciciosEmExecucao];
    const serie = novosExercicios[exercicioAtualIndex].seriesExecutadas[serieIndex];
    serie.concluida = !serie.concluida;
    // Opcional: preencher reps/peso se estiver marcando como concluída
    if (serie.concluida && !serie.repeticoes && exercicioAtual.exercicio) {
        // Tenta preencher com as repetições recomendadas, se houver
        const repsRecomendadas = parseInt(exercicioAtual.repeticoes_recomendadas || "0");
        if (repsRecomendadas > 0) {
            serie.repeticoes = repsRecomendadas;
        }
    }
    setExerciciosEmExecucao(novosExercicios);
  };

  const atualizarDetalhesSerie = (serieIndex: number, campo: 'repeticoes' | 'peso', valor: string) => {
    const novosExercicios = [...exerciciosEmExecucao];
    const valorNumerico = parseInt(valor);
    if (!isNaN(valorNumerico) || valor === "") {
      (novosExercicios[exercicioAtualIndex].seriesExecutadas[serieIndex] as any)[campo] = valorNumerico >= 0 ? valorNumerico : undefined;
      setExerciciosEmExecucao(novosExercicios);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Carregando treino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>{error}</p>
        <Button 
          onClick={() => router.push('/treinos')} 
          className="mt-4"
        >
          Voltar para Treinos
        </Button>
      </div>
    );
  }

  if (!treino || !exercicioAtual || !exercicioAtual.exercicio) {
    return <div className="container mx-auto p-4 text-center">Treino ou exercício não encontrado.</div>;
  }
  
  const progressoGeral = Math.round(((exercicioAtualIndex + 1) / exerciciosEmExecucao.length) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {treino.nome} - {exercicioAtual.exercicio.nome}
          </CardTitle>
          <div className="text-center text-sm text-gray-500 mt-1">
            Exercício {exercicioAtualIndex + 1} de {exerciciosEmExecucao.length}
          </div>
          <Progress value={progressoGeral} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Detalhes do Exercício:</h3>
            <p><Zap className="inline-block mr-2 h-4 w-4 text-yellow-500" />Séries: {exercicioAtual.series}</p>
            {exercicioAtual.repeticoes_recomendadas && <p><TimerIcon className="inline-block mr-2 h-4 w-4 text-blue-500" />Repetições: {exercicioAtual.repeticoes_recomendadas}</p>}
            {exercicioAtual.tempo_descanso && <p><TimerIcon className="inline-block mr-2 h-4 w-4 text-green-500" />Descanso: {exercicioAtual.tempo_descanso}s</p>}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-2">Registre suas séries:</h3>
            {exercicioAtual.seriesExecutadas.map((serie, sIndex) => (
              <div key={sIndex} className={`p-3 rounded-lg border flex items-center gap-4 ${serie.concluida ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleSerieConcluida(sIndex)}
                  className={serie.concluida ? "text-green-600 hover:text-green-700" : "text-gray-400 hover:text-gray-600"}
                >
                  {serie.concluida ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </Button>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`reps-${sIndex}`} className="block text-xs font-medium text-gray-700 mb-1">Repetições</label>
                    <input
                      id={`reps-${sIndex}`}
                      type="number"
                      placeholder={exercicioAtual.repeticoes_recomendadas || "Reps"}
                      value={serie.repeticoes ?? ""}
                      onChange={(e) => atualizarDetalhesSerie(sIndex, 'repeticoes', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      disabled={serie.concluida}
                    />
                  </div>
                  <div>
                    <label htmlFor={`peso-${sIndex}`} className="block text-xs font-medium text-gray-700 mb-1">Peso (Kg)</label>
                    <input
                      id={`peso-${sIndex}`}
                      type="number"
                      placeholder="Kg"
                      value={serie.peso ?? ""}
                      onChange={(e) => atualizarDetalhesSerie(sIndex, 'peso', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      disabled={serie.concluida}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional):</label>
            <textarea
              id="observacoes"
              rows={2}
              className="w-full p-2 border rounded-md text-sm"
              placeholder="Alguma observação sobre este exercício?"
              value={exercicioAtual.observacoes || ""}
              onChange={(e) => {
                const novosExercicios = [...exerciciosEmExecucao];
                novosExercicios[exercicioAtualIndex].observacoes = e.target.value;
                setExerciciosEmExecucao(novosExercicios);
              }}
            />
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleExercicioAnterior} disabled={exercicioAtualIndex === 0}>
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button onClick={handleProximoExercicio}>
            {exercicioAtualIndex === exerciciosEmExecucao.length - 1 ? "Finalizar Treino" : "Próximo Exercício"}
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>      <AlertDialog open={mostrarDialogoFinalizar} onOpenChange={setMostrarDialogoFinalizar}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Você completou todos os exercícios. Deseja finalizar o treino agora?
              Os dados registrados serão salvos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {/* Campo para duração */}
          <div className="space-y-2">
            <label htmlFor="duracao" className="block text-sm font-medium text-gray-700">
              Duração do treino (minutos):
            </label>
            <input
              id="duracao"
              type="number"
              min="1"
              max="300"
              placeholder="Ex: 45"
              value={duracaoMinutos || ''}
              onChange={(e) => setDuracaoMinutos(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500">
              Informe quantos minutos durou seu treino (opcional)
            </p>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={finalizandoTreino}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalizarTreino} disabled={finalizandoTreino}>
              {finalizandoTreino ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Finalizando...
                </>
              ) : (
                "Finalizar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

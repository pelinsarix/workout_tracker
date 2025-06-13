"use client";

import { useState, useEffect } from "react";
import React from "react"; 
import { useParams, useRouter } from 'next/navigation'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TreinosApi, ExerciciosApi } from "@/lib/api"; // Corrigido o caminho da importação da API
import { ExercicioTreino, TreinoFixo } from "@/lib/types"; // Importando tipos relevantes

// Interface estendida para incluir o nome do exercício
interface ExercicioTreinoDetalhes extends ExercicioTreino {
  nomeExercicio?: string;
  // adicionar outros campos que possam vir da junção com a tabela de exercícios
}

export default function DetalheExercicioTreinoPage({ params }: { params: { id: string, exercicioId: string } }) {
  const { toast } = useToast();
  const routeParams = useParams();
  const treinoId = routeParams.id as string;
  const exercicioId = routeParams.exercicioId as string; 
  const router = useRouter(); 

  const [exercicioTreino, setExercicioTreino] = useState<ExercicioTreinoDetalhes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para edição local dos campos
  const [seriesEdit, setSeriesEdit] = useState<number | string>("");
  const [repeticoesEdit, setRepeticoesEdit] = useState<string>("");
  const [tempoDescansoEdit, setTempoDescansoEdit] = useState<number | string>("");
  const [observacoesEdit, setObservacoesEdit] = useState<string>("");


  useEffect(() => {
    const fetchDetalhesExercicio = async () => {
      if (!treinoId || !exercicioId) return; 
      try {
        setIsLoading(true);
        const treinoData: TreinoFixo = await TreinosApi.obterTreino(treinoId);
        const exercicioNoTreino = treinoData.exercicios_treino?.find(
          (et) => String(et.exercicio_id) === exercicioId || String(et.id) === exercicioId
        );

        if (exercicioNoTreino) {
          const exercicioInfo = await ExerciciosApi.obterExercicio(String(exercicioNoTreino.exercicio_id));
          const detalhesCompletos: ExercicioTreinoDetalhes = {
            ...exercicioNoTreino,
            nomeExercicio: exercicioInfo.nome,
          };
          setExercicioTreino(detalhesCompletos);
          // Inicializar estados de edição com os valores carregados
          setSeriesEdit(detalhesCompletos.series);
          setRepeticoesEdit(detalhesCompletos.repeticoes_recomendadas || "");
          setTempoDescansoEdit(detalhesCompletos.tempo_descanso || "");
          setObservacoesEdit((detalhesCompletos as any).observacoes || ""); // Cast para any se observacoes não estiver em ExercicioTreino
        } else {
          toast({
            title: "Erro",
            description: "Exercício não encontrado neste treino.",
            variant: "destructive",
          });
          router.push(`/treinos/${treinoId}`); // Redirecionar se o exercício não for encontrado
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do exercício do treino:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do exercício.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetalhesExercicio();
  }, [treinoId, exercicioId, toast, router]);

  const handleSalvarAlteracoes = async () => {
    if (!exercicioTreino) return;
    setIsSubmitting(true);
    try {
      const dadosAtualizados = {
        series: Number(seriesEdit),
        repeticoes_recomendadas: repeticoesEdit,
        tempo_descanso: Number(tempoDescansoEdit),
        observacoes: observacoesEdit,
        // Manter outros campos obrigatórios da API, se houver
        exercicio_id: exercicioTreino.exercicio_id, 
        ordem: exercicioTreino.ordem, // Exemplo, se ordem for necessária
      };
      // Supondo que a API espera o ID do item da tabela associativa (exercicios_treino.id)
      // ou o ID do exercício (exercicio.id) para atualizar.
      // A API `atualizarExercicio` em `TreinosApi` precisa ser verificada.
      // Se for para atualizar o item da tabela associativa:
      // await TreinosApi.atualizarExercicioNoTreino(treinoId, exercicioTreino.id, dadosAtualizados);
      // Se for para atualizar os detalhes do exercício em si (menos provável neste contexto):
      // await ExerciciosApi.atualizarExercicio(exercicioTreino.exercicio_id, { /* dados do exercicio */ });

      // Placeholder para a chamada de API correta - verificar qual ID usar
      // Esta chamada parece mais apropriada se TreinosApi.atualizarExercicio espera o ID do registro em exercicios_treino
      await TreinosApi.atualizarExercicio(treinoId, exercicioTreino.id, dadosAtualizados); 

      toast({
        title: "Sucesso!",
        description: "Detalhes do exercício atualizados."
      });
      router.push(`/treinos/${treinoId}`);
    } catch (error) {
      console.error("Erro ao atualizar exercício:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os detalhes do exercício.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>Carregando detalhes do exercício...</p>;
  }

  if (!exercicioTreino) {
    return <p>Exercício não encontrado.</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Exercício: {exercicioTreino.nomeExercicio}</CardTitle>
          <CardDescription>
            Ajuste os detalhes deste exercício para o treino atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seriesEdit">Séries</Label>
            <Input 
              id="seriesEdit" 
              type="number" 
              value={seriesEdit} 
              onChange={(e) => setSeriesEdit(e.target.value)} 
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="repeticoesEdit">Repetições</Label>
            <Input 
              id="repeticoesEdit" 
              type="text" // Pode ser texto para formatos como "8-12"
              value={repeticoesEdit} 
              onChange={(e) => setRepeticoesEdit(e.target.value)} 
            />
          </div>
          <div>
            <Label htmlFor="tempoDescansoEdit">Tempo de Descanso (segundos)</Label>
            <Input 
              id="tempoDescansoEdit" 
              type="number" 
              value={tempoDescansoEdit} 
              onChange={(e) => setTempoDescansoEdit(e.target.value)} 
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="observacoesEdit">Observações</Label>
            <Textarea 
              id="observacoesEdit" 
              value={observacoesEdit} 
              onChange={(e) => setObservacoesEdit(e.target.value)} 
              placeholder="Ex: Fazer com pegada supinada"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push(`/treinos/${treinoId}`)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSalvarAlteracoes} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

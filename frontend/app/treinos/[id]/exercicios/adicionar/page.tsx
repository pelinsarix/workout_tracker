"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useParams, useRouter } from 'next/navigation'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ExerciciosApi, TreinosApi } from "@/lib/api"; 
import Link from 'next/link'; // Importar Link
import { PlusCircleIcon } from 'lucide-react'; // Ícone opcional

// Interface local para Exercicio, já que não está em types.ts
interface Exercicio { 
  id: string;
  nome: string;
  // Adicione outros campos conforme necessário
}

export default function AdicionarExercicioTreinoPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const routeParams = useParams();
  const treinoId = routeParams.id as string;
  const router = useRouter();

  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState<Exercicio[]>([]);
  const [exercicioSelecionadoId, setExercicioSelecionadoId] = useState<string | null>(null);
  const [series, setSeries] = useState<number>(3);
  const [repeticoes, setRepeticoes] = useState<number>(10);
  const [tempoDescanso, setTempoDescanso] = useState<number>(60); // em segundos
  const [observacoes, setObservacoes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingExercicioId, setSubmittingExercicioId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercicios = async () => {
      try {
        const data = await ExerciciosApi.listarExercicios();
        // Ajustado para mapear o id para string, caso venha como número da API
        setExerciciosDisponiveis(data.map((ex: any) => ({ ...ex, id: String(ex.id) }))); 
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os exercícios disponíveis.",
          variant: "destructive",
        });
      }
    };
    fetchExercicios();
  }, [toast]);

  const handleAddExercicio = async (exercicioId: string) => {
    if (!treinoId || !exercicioId) {
      toast({
        title: "Erro",
        description: "ID do treino ou do exercício não encontrado.",
        variant: "destructive",
      });
      return;
    }
    setSubmittingExercicioId(exercicioId);
    setIsSubmitting(true); 
    try {
      // Corrigido o nome do método para adicionarExercicio e o payload
      const respostaApi = await TreinosApi.adicionarExercicio(treinoId, { 
        exercicio_id: parseInt(exercicioId, 10), // Convertido para número
        series: series,
        repeticoes_recomendadas: String(repeticoes),
        tempo_descanso: tempoDescanso,
        // observacoes: observacoes, // Removido - não existe no schema backend ExercicioTreinoBase
        ordem: 0, // Placeholder - Idealmente, calcular a ordem correta ou o backend lida com isso
        usar_tempo_descanso_global: true // Adicionado valor padrão, ajuste se necessário
      });
      console.log("Resposta da API ao adicionar exercício:", respostaApi); // Log da resposta
      toast({
        title: "Sucesso!",
        description: "Exercício adicionado ao treino.",
      });
      router.push(`/treinos/${treinoId}`);
    } catch (error) {
      console.error("Erro ao adicionar exercício ao treino:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o exercício ao treino.",
        variant: "destructive",
      });
    } finally {
      setSubmittingExercicioId(null);
      setIsSubmitting(false); 
    }
  };

  const exercicioSelecionado = exerciciosDisponiveis.find(ex => ex.id === exercicioSelecionadoId);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Adicionar Exercício ao Treino</CardTitle>
            <Link href="/exercicios/novo" passHref>
              <Button variant="outline" size="sm">
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Criar Novo Exercício
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="exercicio">Selecione um Exercício</Label>
            <Select onValueChange={setExercicioSelecionadoId} value={exercicioSelecionadoId || ""}>
              <SelectTrigger id="exercicio">
                <SelectValue placeholder="Selecione o exercício" />
              </SelectTrigger>
              <SelectContent>
                {exerciciosDisponiveis.map((exercicio) => (
                  <SelectItem key={exercicio.id} value={exercicio.id!}>
                    {exercicio.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exercicioSelecionado && (
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium text-lg">Detalhes do Exercício no Treino</h3>
              <div>
                <Label htmlFor="series">Séries</Label>
                <Input id="series" type="number" value={series} onChange={(e) => setSeries(Number(e.target.value))} min="1" />
              </div>
              <div>
                <Label htmlFor="repeticoes">Repetições</Label>
                <Input id="repeticoes" type="number" value={repeticoes} onChange={(e) => setRepeticoes(Number(e.target.value))} min="1" />
              </div>
              <div>
                <Label htmlFor="tempoDescanso">Tempo de Descanso (segundos)</Label>
                <Input id="tempoDescanso" type="number" value={tempoDescanso} onChange={(e) => setTempoDescanso(Number(e.target.value))} min="0" />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Ex: Aumentar carga progressivamente" />
              </div>
              <Button 
                onClick={() => handleAddExercicio(exercicioSelecionado.id!)} 
                disabled={isSubmitting || submittingExercicioId === exercicioSelecionado.id}
              >
                {submittingExercicioId === exercicioSelecionado.id ? "Adicionando..." : "Adicionar ao Treino"}
              </Button>
            </div>
          )}

          {!exercicioSelecionadoId && exerciciosDisponiveis.length > 0 && (
             <p className="text-sm text-muted-foreground">Selecione um exercício da lista para configurar os detalhes.</p>
          )}

          {exerciciosDisponiveis.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum exercício disponível para adicionar. Crie exercícios primeiro.</p>
          )}

        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.back()} className="mt-4">
        Voltar
      </Button>
    </div>
  );
}

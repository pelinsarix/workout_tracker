"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Added
import { Label } from "@/components/ui/label" // Added
import { useRouter, useParams, useSearchParams } from "next/navigation" // Added useSearchParams
import { ChevronRightIcon, CalendarIcon, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns" // Added parseISO
import { ptBR } from "date-fns/locale"
import { TreinosApi, ExecucoesTreinoApi } from "@/lib/api"
import { TreinoFixo, ExercicioTreino, TreinoExecucao } from "@/lib/types" // Added TreinoExecucao
import { useToast } from "@/hooks/use-toast"

// Helper function to parse recommended repetitions string (e.g., "8-12" or "10")
const parseRepeticoesSugeridas = (rec?: string): string => {
  if (!rec) return "";
  const cleanedRec = rec.trim();
  if (cleanedRec.includes('-')) {
    const parts = cleanedRec.split('-').map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return Math.round((parts[0] + parts[1]) / 2).toString();
    }
  } else {
    const singleRep = parseInt(cleanedRec, 10);
    if (!isNaN(singleRep)) {
      return singleRep.toString();
    }
  }
  return "";
};

interface SerieConfigData {
  ordem: number;
  repeticoes: string;
  peso: string;
  tempo: string;
}

interface ConfiguracaoExercicio {
  [exercicioId: number]: {
    seriesDetails: SerieConfigData[];
  };
}

export default function IniciarTreinoPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const searchParams = useSearchParams() // Added
  const { toast } = useToast()

  const [treino, setTreino] = useState<TreinoFixo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [iniciandoTreino, setIniciandoTreino] = useState(false)
  const [pesoCorporal, setPesoCorporal] = useState("") // Renamed from 'peso' for clarity
  const [dataExecucao, setDataExecucao] = useState<string>("") // Added for date input

  const [configuracaoExercicios, setConfiguracaoExercicios] = useState<ConfiguracaoExercicio>({}); // Added

  // Effect to fetch treino details
  useEffect(() => {
    const treinoId = params?.id;
    if (treinoId) {
      const fetchTreino = async () => {
        try {
          setLoading(true);
          const dadosTreino = await TreinosApi.obterTreino(treinoId);
          setTreino(dadosTreino);
          setError(null);
        } catch (err) {
          console.error("Erro ao buscar treino:", err);
          setError("Falha ao carregar o treino. Tente novamente.");
        } finally {
          setLoading(false);
        }
      };
      fetchTreino();
    }
  }, [params?.id]);

  // Effect to initialize execution date
  useEffect(() => {
    const dataQuery = searchParams.get("data");
    if (dataQuery) {
      try {
        // Ensure the date from query is valid and format it to yyyy-MM-dd
        setDataExecucao(format(parseISO(dataQuery), "yyyy-MM-dd"));
      } catch (e) {
        console.warn("Invalid date in query parameter, defaulting to today:", dataQuery);
        setDataExecucao(format(new Date(), "yyyy-MM-dd"));
      }
    } else {
      setDataExecucao(format(new Date(), "yyyy-MM-dd"));
    }
  }, [searchParams]);

  // Effect to initialize exercise configurations once treino data is loaded
  useEffect(() => {
    if (treino?.exercicios_treino) {
      const initialConfig: ConfiguracaoExercicio = {};
      treino.exercicios_treino.forEach(et => {
        if (et.exercicio?.id) {
          const seriesDetails: SerieConfigData[] = [];
          const repSugerida = parseRepeticoesSugeridas(et.repeticoes_recomendadas);
          for (let i = 0; i < et.series; i++) {
            seriesDetails.push({
              ordem: i + 1,
              repeticoes: repSugerida,
              peso: "",
              tempo: ""
            });
          }
          initialConfig[et.exercicio.id] = { seriesDetails };
        }
      });
      setConfiguracaoExercicios(initialConfig);
    }
  }, [treino]);

  const handleConfigChange = (
    exercicioId: number,
    serieIndex: number,
    field: keyof SerieConfigData,
    value: string
  ) => {
    setConfiguracaoExercicios(prevConfig => {
      const newConfig = { ...prevConfig };
      if (newConfig[exercicioId] && newConfig[exercicioId].seriesDetails[serieIndex]) {
        newConfig[exercicioId].seriesDetails[serieIndex] = {
          ...newConfig[exercicioId].seriesDetails[serieIndex],
          [field]: value,
        };
      }
      return newConfig;
    });
  };

  const handleIniciar = async () => {
    if (!treino || !treino.exercicios_treino || treino.exercicios_treino.length === 0) {
      toast({
        title: "Erro",
        description: "Não é possível iniciar um treino sem exercícios.",
        variant: "destructive",
      });
      return;
    }
    if (!dataExecucao) {
        toast({ title: "Erro", description: "Por favor, selecione uma data para o treino.", variant: "destructive" });
        return;
    }

    setIniciandoTreino(true);

    const exercicios_config_payload: Record<string, { series: Array<{ ordem: number; repeticoes?: number; peso?: number; tempo?: number; }> }> = {};
    if (treino?.exercicios_treino) {
      for (const et of treino.exercicios_treino) {
        if (et.exercicio?.id && configuracaoExercicios[et.exercicio.id]) {
          const configuredSeries = configuracaoExercicios[et.exercicio.id].seriesDetails.map(s => ({
            ordem: s.ordem,
            repeticoes: s.repeticoes ? parseInt(s.repeticoes, 10) : undefined,
            peso: s.peso ? parseFloat(s.peso) : undefined,
            tempo: s.tempo ? parseFloat(s.tempo) : undefined,
          })).filter(s => s.repeticoes !== undefined || s.peso !== undefined || s.tempo !== undefined || et.series > 0); // Send series even if empty if it's part of the plan
          
          // Ensure all planned series are included, even if empty, so backend can create them
          const allSeriesPayload = [];
          for (let i = 0; i < et.series; i++) {
            const existingConfiguredSerie = configuredSeries.find(cs => cs.ordem === i + 1);
            if (existingConfiguredSerie) {
              allSeriesPayload.push(existingConfiguredSerie);
            } else {
              // Add a placeholder for series that weren't explicitly configured but are part of the template
              allSeriesPayload.push({ ordem: i + 1 });
            }
          }
          exercicios_config_payload[et.exercicio.id.toString()] = { series: allSeriesPayload };
        }
      }
    }
    
    try {
      const execucaoData = {
        treino_fixo_id: treino.id,
        data_inicio: dataExecucao ? new Date(dataExecucao).toISOString() : new Date().toISOString(),
        peso_corporal: pesoCorporal ? parseFloat(pesoCorporal) : undefined,
        exercicios_config: exercicios_config_payload,
      };
      
      console.log("Enviando para iniciar execução:", JSON.stringify(execucaoData, null, 2)); // Debug log

      const execucao: TreinoExecucao = await ExecucoesTreinoApi.iniciarExecucao(execucaoData);
      
      toast({
        title: "Treino iniciado!",
        description: `Treino "${treino.nome}" iniciado com sucesso para ${format(parseISO(execucao.data_inicio), "dd/MM/yyyy")}.`,
      });

      router.push(`/treinos/execucao/${execucao.id}`); // Corrected redirect
      
    } catch (error: any) {
      console.error("Erro ao iniciar treino:", error);
      const errorMsg = error.response?.data?.detail || "Não foi possível iniciar o treino. Tente novamente.";
      toast({
        title: "Erro ao iniciar treino",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIniciandoTreino(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">Carregando detalhes do treino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
        <Button onClick={() => router.push('/treinos')} className="mt-4">Voltar para Treinos</Button>
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        <p>Treino não encontrado ou não foi possível carregar.</p>
        <Button onClick={() => router.push('/treinos')} className="mt-4">Voltar para Treinos</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Treino: {treino.nome}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="data-execucao" className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
              <CalendarIcon className="h-5 w-5" />
              Data da Execução
            </Label>
            <Input
              id="data-execucao"
              type="date"
              value={dataExecucao}
              onChange={(e) => setDataExecucao(e.target.value)}
              className="w-full md:w-1/2"
            />
          </div>

          {treino.exercicios_treino && treino.exercicios_treino.length > 0 ? (
            treino.exercicios_treino.map((et: ExercicioTreino, index) => (
              <div key={et.exercicio?.id || `exercicio-${index}`} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg text-blue-700">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-1 rounded-full mr-2">
                    {et.ordem !== undefined ? et.ordem : index + 1}
                  </span>
                  {et.exercicio?.nome || 'Nome do exercício indisponível'}
                </h3>
                <p className="text-sm text-gray-600">
                  Recomendação: {et.series} séries, {et.repeticoes_recomendadas || 'N/A'} reps, {et.tempo_descanso ? `${et.tempo_descanso}s descanso` : 'Descanso global'}
                </p>
                
                {configuracaoExercicios[et.exercicio!.id]?.seriesDetails.map((serie, serieIndex) => (
                  <div key={serie.ordem} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end p-2 border-t">
                    <Label className="md:col-span-1 text-sm font-medium self-center">Série {serie.ordem}:</Label>
                    <div className="md:col-span-2">
                      <Label htmlFor={`reps-${et.exercicio!.id}-${serie.ordem}`} className="text-xs text-gray-500">Repetições</Label>
                      <Input
                        id={`reps-${et.exercicio!.id}-${serie.ordem}`}
                        type="number"
                        placeholder={parseRepeticoesSugeridas(et.repeticoes_recomendadas) || "Reps"}
                        value={serie.repeticoes}
                        onChange={(e) => handleConfigChange(et.exercicio!.id, serieIndex, 'repeticoes', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`peso-${et.exercicio!.id}-${serie.ordem}`} className="text-xs text-gray-500">Peso (kg)</Label>
                      <Input
                        id={`peso-${et.exercicio!.id}-${serie.ordem}`}
                        type="number"
                        placeholder="Peso"
                        value={serie.peso}
                        onChange={(e) => handleConfigChange(et.exercicio!.id, serieIndex, 'peso', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor={`tempo-${et.exercicio!.id}-${serie.ordem}`} className="text-xs text-gray-500">Tempo (s)</Label>
                      <Input
                        id={`tempo-${et.exercicio!.id}-${serie.ordem}`}
                        type="number"
                        placeholder="Tempo"
                        value={serie.tempo}
                        onChange={(e) => handleConfigChange(et.exercicio!.id, serieIndex, 'tempo', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum exercício cadastrado para este treino.</p>
          )}

          <div className="border rounded-lg p-4">
            <Label htmlFor="peso-corporal" className="font-medium mb-2 block">Seu peso hoje (opcional):</Label>
            <div className="flex items-center gap-2">
              <Input
                id="peso-corporal"
                type="number"
                value={pesoCorporal}
                onChange={(e) => setPesoCorporal(e.target.value)}
                placeholder="Kg"
                className="w-full"
              />
              <span className="text-gray-700">kg</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleIniciar} disabled={iniciandoTreino || loading || !treino?.exercicios_treino?.length} className="flex items-center gap-1">
            {iniciandoTreino ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                Começar Treino
                <ChevronRightIcon className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

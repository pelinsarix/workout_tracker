"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TreinosApi } from '@/lib/api'; // Supondo que você terá uma função para buscar histórico
import { TreinoExecucao, ExercicioExecutadoDetalhes, SerieExecutadaDetalhes } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Weight, ListOrdered, Repeat, Edit3, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock da função da API para buscar histórico de um treino específico
// Você precisará implementar isso de verdade na sua api.ts e no backend
const MockTreinoExecucaoApi = {
  obterHistoricoTreino: async (treinoId: string): Promise<TreinoExecucao[]> => {
    console.log(`Buscando histórico para o treino ID: ${treinoId}`);
    // Simular um delay da API
    await new Promise(resolve => setTimeout(resolve, 700));

    // Dados mockados - substitua pela chamada real da API
    // Normalmente, você buscaria execuções associadas ao treino_fixo_id
    const mockExecucoes: TreinoExecucao[] = [
      {
        id: 101,
        treino_fixo_id: parseInt(treinoId),
        usuario_id: 1, // Exemplo
        data_inicio: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        data_fim: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hora depois
        peso_corporal: 75.5,
        observacoes_gerais: "Senti um pouco de dor no ombro esquerdo durante o supino.",
        exercicios_executados: [
          {
            exercicio_id: 1,
            nome_exercicio: "Supino Reto",
            ordem: 1,
            series_executadas: [
              { serie: 1, repeticoes: 10, peso: 80, concluida: true },
              { serie: 2, repeticoes: 8, peso: 80, concluida: true },
              { serie: 3, repeticoes: 6, peso: 80, concluida: false, tempo: undefined },
            ],
            observacoes: "Aumentar o peso na próxima vez."
          },
          {
            exercicio_id: 2,
            nome_exercicio: "Agachamento Livre",
            ordem: 2,
            series_executadas: [
              { serie: 1, repeticoes: 12, peso: 100, concluida: true },
              { serie: 2, repeticoes: 10, peso: 100, concluida: true },
              { serie: 3, repeticoes: 10, peso: 100, concluida: true },
            ],
          }
        ]
      },
      {
        id: 102,
        treino_fixo_id: parseInt(treinoId),
        usuario_id: 1,
        data_inicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
        data_fim: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(), // 50 min depois
        peso_corporal: 75.0,
        exercicios_executados: [
          {
            exercicio_id: 1,
            nome_exercicio: "Supino Reto",
            ordem: 1,
            series_executadas: [
              { serie: 1, repeticoes: 8, peso: 75, concluida: true },
              { serie: 2, repeticoes: 8, peso: 75, concluida: true },
              { serie: 3, repeticoes: 7, peso: 75, concluida: true },
            ],
          }
        ]
      }
    ];
    // Filtrar para retornar apenas execuções do treinoId (se o mock fosse mais genérico)
    return mockExecucoes.filter(ex => ex.treino_fixo_id === parseInt(treinoId)); 
  }
};

export default function HistoricoTreinoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const treinoId = params.id;

  const [historico, setHistorico] = useState<TreinoExecucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treinoNome, setTreinoNome] = useState<string>("");

  useEffect(() => {
    if (treinoId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // 1. Buscar o nome do treino
          const infoTreino = await TreinosApi.obterTreino(treinoId);
          setTreinoNome(infoTreino.nome || "Treino");

          // 2. Buscar o histórico de execuções (usando o mock por enquanto)
          const execucoes = await MockTreinoExecucaoApi.obterHistoricoTreino(treinoId);
          setHistorico(execucoes.sort((a, b) => parseISO(b.data_inicio).getTime() - parseISO(a.data_inicio).getTime())); // Mais recentes primeiro
          setError(null);
        } catch (err) {
          console.error("Erro ao buscar histórico do treino:", err);
          setError("Falha ao carregar o histórico. Tente novamente.");
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [treinoId]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Carregando histórico...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <h1 className="text-3xl font-bold mb-2">Histórico de Execuções</h1>
      <h2 className="text-xl text-gray-600 mb-8">{treinoNome}</h2>

      {historico.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma execução encontrada para este treino.</p>
      ) : (
        <div className="space-y-6">
          {historico.map((execucao) => (
            <Card key={execucao.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <CardTitle className="flex items-center justify-between">
                  <span>Execução de {format(parseISO(execucao.data_inicio), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  {/* <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4" /> Editar</Button> // Funcionalidade futura */}
                </CardTitle>
                {execucao.data_fim && (
                  <CardDescription>
                    Finalizado em: {format(parseISO(execucao.data_fim), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {execucao.peso_corporal && (
                  <div className="mb-4 pb-4 border-b">
                    <h4 className="font-semibold text-sm mb-1 flex items-center"><Weight className="mr-2 h-4 w-4 text-blue-500" /> Peso Corporal Registrado:</h4>
                    <p className="text-gray-700 dark:text-gray-300">{execucao.peso_corporal} kg</p>
                  </div>
                )}
                
                <h4 className="font-semibold text-md mb-3 flex items-center"><ListOrdered className="mr-2 h-5 w-5 text-green-500" />Exercícios Realizados:</h4>
                <div className="space-y-4">
                  {execucao.exercicios_executados.map((exDetalhe) => (
                    <div key={`${execucao.id}-${exDetalhe.exercicio_id}-${exDetalhe.ordem}`} className="p-3 border rounded-md bg-white dark:bg-gray-700/50">
                      <h5 className="font-medium text-gray-800 dark:text-gray-200">{exDetalhe.ordem}. {exDetalhe.nome_exercicio}</h5>
                      <ul className="mt-2 space-y-1 pl-4 text-sm">
                        {exDetalhe.series_executadas.map((serie) => (
                          <li key={serie.serie} className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                            <span className="flex items-center">
                              {serie.concluida ? 
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : 
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                              }
                              Série {serie.serie}:
                              {serie.repeticoes !== undefined && <span className="ml-2">{serie.repeticoes} reps</span>}
                              {serie.peso !== undefined && <span className="ml-1">@ {serie.peso} kg</span>}
                              {serie.tempo !== undefined && <span className="ml-2">{serie.tempo}s</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {exDetalhe.observacoes && (
                        <p className="mt-2 text-xs text-gray-500 italic flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1.5" /> {exDetalhe.observacoes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {execucao.observacoes_gerais && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-1 flex items-center"><MessageSquare className="mr-2 h-4 w-4 text-purple-500" />Observações Gerais do Treino:</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm italic">{execucao.observacoes_gerais}</p>
                  </div>
                )}
              </CardContent>
              {/* <CardFooter>
                <p>Footer, se necessário</p>
              </CardFooter> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

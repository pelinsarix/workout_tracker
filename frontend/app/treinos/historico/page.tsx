"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, differenceInMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ClockIcon, DumbbellIcon, Loader2 } from "lucide-react"
import { ExecucoesTreinoApi } from "@/lib/api"
import { TreinoExecucao } from "@/lib/types" // Corrigido para TreinoExecucao
import Link from 'next/link';

export default function HistoricoPage() {
  const [historicoTreinos, setHistoricoTreinos] = useState<TreinoExecucao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        setLoading(true)
        const data = await ExecucoesTreinoApi.listarTodasExecucoesUsuario()
        setHistoricoTreinos(data)
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar histórico de treinos:", err)
        setError("Falha ao carregar o histórico de treinos. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }
    fetchHistorico()
  }, [])

  const calcularDuracao = (dataInicio?: string | Date, dataFim?: string | Date): string => {
    if (!dataInicio || !dataFim) return "N/A"
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    const diff = differenceInMinutes(fim, inicio)
    if (isNaN(diff) || diff < 0) return "N/A"
    return `${diff} minutos`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          {historicoTreinos.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum treino executado ainda.</p>
          ) : (
            <Tabs defaultValue="todos">
              {/* <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="semana">Esta Semana</TabsTrigger>
                <TabsTrigger value="mes">Este Mês</TabsTrigger>
              </TabsList> */}
              {/* TODO: Implementar filtros de semana/mês se necessário */}
              
              <TabsContent value="todos" className="pt-4">
                <div className="space-y-4">
                  {historicoTreinos.map((execucao) => (
                    <Link key={execucao.id} href={`/treinos/execucao/${execucao.id}`} passHref>
                      <div className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {execucao.treino_fixo?.nome || "Treino Concluído"}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {execucao.data_inicio 
                                  ? format(new Date(execucao.data_inicio), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
                                  : "Data não registrada"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                              <ClockIcon className="h-4 w-4" />
                              <span>{calcularDuracao(execucao.data_inicio, execucao.data_fim)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mt-1">
                              <DumbbellIcon className="h-4 w-4" />
                              <span>{execucao.exercicios_executados?.length || 0} exercícios</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Conteúdo para 'semana' e 'mes' pode ser adicionado aqui */}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

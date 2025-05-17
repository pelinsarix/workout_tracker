"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Clock, Dumbbell, BarChart3, TrendingUp, Award, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"

export default function HistoricoDetalhadoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [treino, setTreino] = useState<any>(null)

  // Carregar dados do treino (simulação)
  useEffect(() => {
    // Simulando carregamento de dados
    setIsLoading(true)

    setTimeout(() => {
      // Dados de exemplo para um treino específico
      const treinoData = {
        id: params.id,
        nome: "Treino de Perna",
        data: new Date(),
        duracao: "45 minutos",
        tipo: "pernas",
        peso: "72kg",
        exercicios: [
          {
            nome: "Agachamento",
            grupoMuscular: "Quadríceps, Glúteos",
            series: [
              { repeticoes: 12, peso: 60, concluida: true },
              { repeticoes: 10, peso: 70, concluida: true },
              { repeticoes: 8, peso: 80, concluida: true },
            ],
            progresso: 15, // % de aumento em relação ao último treino
          },
          {
            nome: "Leg Press",
            grupoMuscular: "Quadríceps, Glúteos",
            series: [
              { repeticoes: 15, peso: 120, concluida: true },
              { repeticoes: 12, peso: 140, concluida: true },
              { repeticoes: 10, peso: 160, concluida: true },
            ],
            progresso: 8,
          },
          {
            nome: "Cadeira Extensora",
            grupoMuscular: "Quadríceps",
            series: [
              { repeticoes: 12, peso: 50, concluida: true },
              { repeticoes: 12, peso: 55, concluida: true },
              { repeticoes: 10, peso: 60, concluida: true },
            ],
            progresso: 5,
          },
          {
            nome: "Stiff",
            grupoMuscular: "Posteriores",
            series: [
              { repeticoes: 12, peso: 40, concluida: true },
              { repeticoes: 10, peso: 50, concluida: true },
              { repeticoes: 8, peso: 60, concluida: true },
            ],
            progresso: 10,
          },
        ],
        estatisticas: {
          volumeTotal: 1850, // kg
          recordes: 2,
          cargaMedia: 61.7, // kg
          repeticoesTotal: 121,
        },
      }

      setTreino(treinoData)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton className="h-5 w-60 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-6 w-32 mt-6" />

              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!treino) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500">Treino não encontrado.</p>
            <Button variant="link" onClick={() => router.back()}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dataFormatada = format(new Date(treino.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>{treino.nome}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {dataFormatada}
              <Badge variant="outline" className="capitalize ml-2">
                {treino.tipo}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-blue-50 rounded-lg p-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Duração</span>
                  </div>
                  <span className="text-lg font-bold">{treino.duracao}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-green-50 rounded-lg p-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Dumbbell className="h-4 w-4" />
                    <span className="text-sm font-medium">Volume Total</span>
                  </div>
                  <span className="text-lg font-bold">{treino.estatisticas.volumeTotal} kg</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-purple-50 rounded-lg p-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Repetições</span>
                  </div>
                  <span className="text-lg font-bold">{treino.estatisticas.repeticoesTotal}</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-amber-50 rounded-lg p-4"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-medium">Recordes</span>
                  </div>
                  <span className="text-lg font-bold">{treino.estatisticas.recordes}</span>
                </div>
              </motion.div>
            </div>

            {/* Detalhes dos exercícios */}
            <div>
              <h3 className="text-lg font-medium mb-4">Exercícios Realizados</h3>

              <div className="space-y-4">
                {treino.exercicios.map((exercicio: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{exercicio.nome}</h4>
                        <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp
                          className={`h-4 w-4 ${exercicio.progresso > 0 ? "text-green-500" : "text-red-500"}`}
                        />
                        <span
                          className={`text-sm font-medium ${exercicio.progresso > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {exercicio.progresso > 0 ? "+" : ""}
                          {exercicio.progresso}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {exercicio.series.map((serie: any, serieIndex: number) => (
                        <div key={serieIndex} className="bg-gray-50 rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                                Série {serieIndex + 1}
                              </span>
                              <span className="text-sm">
                                {serie.repeticoes} reps × {serie.peso} kg
                              </span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {serie.peso * serie.repeticoes} kg
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/calendario")}>
              Voltar ao Calendário
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

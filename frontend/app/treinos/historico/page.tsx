"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ClockIcon, DumbbellIcon } from "lucide-react"

export default function HistoricoPage() {
  // Dados de exemplo do histórico de treinos
  const historicoTreinos = [
    {
      id: "1",
      treinoNome: "Perna I",
      data: new Date(2023, 4, 15),
      duracao: "45 minutos",
      exercicios: 4,
      series: 12,
    },
    {
      id: "2",
      treinoNome: "Peito",
      data: new Date(2023, 4, 13),
      duracao: "50 minutos",
      exercicios: 5,
      series: 15,
    },
    {
      id: "3",
      treinoNome: "Costas",
      data: new Date(2023, 4, 11),
      duracao: "40 minutos",
      exercicios: 4,
      series: 12,
    },
    {
      id: "4",
      treinoNome: "Perna II",
      data: new Date(2023, 4, 9),
      duracao: "55 minutos",
      exercicios: 5,
      series: 15,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Treinos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="semana">Esta Semana</TabsTrigger>
              <TabsTrigger value="mes">Este Mês</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="pt-4">
              <div className="space-y-4">
                {historicoTreinos.map((treino) => (
                  <div key={treino.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{treino.treinoNome}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(treino.data, "dd 'de' MMMM", { locale: ptBR })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          <span>{treino.duracao}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <DumbbellIcon className="h-4 w-4" />
                          <span>{treino.exercicios} exercícios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="semana" className="pt-4">
              <div className="space-y-4">
                {historicoTreinos.slice(0, 2).map((treino) => (
                  <div key={treino.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{treino.treinoNome}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(treino.data, "dd 'de' MMMM", { locale: ptBR })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          <span>{treino.duracao}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <DumbbellIcon className="h-4 w-4" />
                          <span>{treino.exercicios} exercícios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mes" className="pt-4">
              <div className="space-y-4">
                {historicoTreinos.map((treino) => (
                  <div key={treino.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{treino.treinoNome}</h3>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{format(treino.data, "dd 'de' MMMM", { locale: ptBR })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-600">
                          <ClockIcon className="h-4 w-4" />
                          <span>{treino.duracao}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <DumbbellIcon className="h-4 w-4" />
                          <span>{treino.exercicios} exercícios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

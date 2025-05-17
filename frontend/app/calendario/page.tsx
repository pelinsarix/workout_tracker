"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  FilterIcon,
  DumbbellIcon,
  ClockIcon,
  BarChart3Icon,
} from "lucide-react"
import Link from "next/link"
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [filter, setFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)

  // Dados de exemplo - treinos realizados
  const [treinosRealizados, setTreinosRealizados] = useState<any[]>([])

  // Gerar dados de exemplo para demonstração
  useEffect(() => {
    // Simulando carregamento de dados
    setIsLoading(true)

    setTimeout(() => {
      // Gerar alguns treinos aleatórios nos últimos 60 dias
      const hoje = new Date()
      const treinos = []

      // Tipos de treino para exemplo
      const tiposTreino = ["Perna I", "Perna II", "Peito", "Costas", "Ombros", "Braços", "Full Body"]

      // Gerar treinos para os últimos 60 dias (alguns dias terão treinos, outros não)
      for (let i = 0; i < 60; i++) {
        // Decidir aleatoriamente se este dia terá treino (70% de chance)
        if (Math.random() < 0.4) {
          const dataExercicio = new Date(hoje)
          dataExercicio.setDate(hoje.getDate() - i)

          // Alguns dias podem ter mais de um treino
          const numTreinos = Math.random() < 0.2 ? 2 : 1

          for (let j = 0; j < numTreinos; j++) {
            const tipoTreino = tiposTreino[Math.floor(Math.random() * tiposTreino.length)]
            const duracao = Math.floor(Math.random() * 30) + 30 // 30-60 minutos
            const exercicios = Math.floor(Math.random() * 4) + 3 // 3-6 exercícios
            const series = exercicios * 3 // 3 séries por exercício

            treinos.push({
              id: `treino-${i}-${j}`,
              data: dataExercicio,
              nome: tipoTreino,
              duracao: `${duracao} minutos`,
              exercicios,
              series,
              peso: `${Math.floor(Math.random() * 10) + 65}kg`, // Peso entre 65-75kg
              tipo: tipoTreino.toLowerCase().includes("perna")
                ? "pernas"
                : tipoTreino.toLowerCase().includes("peito")
                  ? "peito"
                  : tipoTreino.toLowerCase().includes("costas")
                    ? "costas"
                    : tipoTreino.toLowerCase().includes("ombro")
                      ? "ombros"
                      : tipoTreino.toLowerCase().includes("braço")
                        ? "braços"
                        : "completo",
            })
          }
        }
      }

      setTreinosRealizados(treinos)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Funções para navegação do calendário
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  // Filtrar treinos com base na data selecionada
  const treinosDoDiaSelecionado = selectedDate
    ? treinosRealizados.filter((treino) => isSameDay(new Date(treino.data), selectedDate))
    : []

  // Filtrar treinos com base no filtro selecionado
  const treinosFiltrados =
    filter === "todos" ? treinosRealizados : treinosRealizados.filter((treino) => treino.tipo === filter)

  // Obter dias com treinos para o mês atual
  const diasComTreino = treinosRealizados.map((treino) => new Date(treino.data))

  // Função para renderizar o conteúdo do dia no calendário
  const renderDayContent = (day: Date) => {
    const treinosNoDia = treinosRealizados.filter((treino) => isSameDay(new Date(treino.data), day))
    const temTreino = treinosNoDia.length > 0

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`${isToday(day) ? "font-bold" : ""}`}>{day.getDate()}</span>
        {temTreino && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="flex gap-0.5">
              {treinosNoDia.slice(0, 3).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-blue-500" />
              ))}
              {treinosNoDia.length > 3 && <div className="h-1 w-1 rounded-full bg-blue-300" />}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Função para renderizar o calendário personalizado
  const renderCalendario = () => {
    // Obter todos os dias do mês atual
    const diasDoMes = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    })

    // Obter o nome do mês e ano
    const nomeMes = format(currentDate, "MMMM", { locale: ptBR })
    const nomeAno = format(currentDate, "yyyy")

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">
            {nomeMes} de {nomeAno}
          </h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-14 rounded-md"></div>
          ))}

          {diasDoMes.map((day) => {
            const treinosNoDia = treinosRealizados.filter((treino) => isSameDay(new Date(treino.data), day))
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  h-14 rounded-md border cursor-pointer flex items-center justify-center relative
                  ${isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}
                  ${isToday(day) ? "border-blue-300" : ""}
                  ${!isSameMonth(day, currentDate) ? "text-gray-300" : ""}
                `}
              >
                {renderDayContent(day)}

                {treinosNoDia.length > 0 && (
                  <div className="absolute top-1 right-1">
                    <Badge variant="outline" className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px]">
                      {treinosNoDia.length}
                    </Badge>
                  </div>
                )}
              </motion.div>
            )
          })}

          {Array.from({ length: 6 - endOfMonth(currentDate).getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-14 rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  // Renderizar lista de treinos
  const renderListaTreinos = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (treinosFiltrados.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Nenhum treino encontrado.</p>
          <p className="text-sm">Tente mudar o filtro ou adicionar novos treinos.</p>
        </div>
      )
    }

    // Agrupar treinos por data
    const treinosAgrupados: Record<string, any[]> = {}

    treinosFiltrados.forEach((treino) => {
      const dataFormatada = format(new Date(treino.data), "yyyy-MM-dd")
      if (!treinosAgrupados[dataFormatada]) {
        treinosAgrupados[dataFormatada] = []
      }
      treinosAgrupados[dataFormatada].push(treino)
    })

    return (
      <div className="space-y-6">
        {Object.entries(treinosAgrupados).map(([dataStr, treinos]) => {
          const data = new Date(dataStr)
          const dataFormatada = format(data, "dd 'de' MMMM", { locale: ptBR })
          const ehHoje = isToday(data)

          return (
            <div key={dataStr}>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`px-2 py-1 rounded-md text-sm font-medium ${ehHoje ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}
                >
                  {dataFormatada}
                </div>
                {ehHoje && <Badge variant="default">Hoje</Badge>}
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {treinos.map((treino, index) => (
                    <motion.div
                      key={treino.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={`/treinos/historico/${treino.id}`}
                        className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{treino.nome}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <ClockIcon className="h-3.5 w-3.5" />
                                <span>{treino.duracao}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <DumbbellIcon className="h-3.5 w-3.5" />
                                <span>{treino.exercicios} exercícios</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <BarChart3Icon className="h-3.5 w-3.5" />
                                <span>{treino.peso}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {treino.tipo}
                          </Badge>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Renderizar detalhes do dia selecionado
  const renderDetalhesDia = () => {
    if (!selectedDate) return null

    const dataFormatada = format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
    const ehHoje = isToday(selectedDate)

    return (
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold">Treinos em {dataFormatada}</h3>
          {ehHoje && <Badge>Hoje</Badge>}
        </div>

        {treinosDoDiaSelecionado.length === 0 ? (
          <div className="text-center py-6 border rounded-lg bg-gray-50">
            <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">Nenhum treino registrado neste dia.</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/treinos/novo">
                <PlusIcon className="h-4 w-4 mr-1" />
                Adicionar Treino
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {treinosDoDiaSelecionado.map((treino, index) => (
                <motion.div
                  key={treino.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    href={`/treinos/historico/${treino.id}`}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{treino.nome}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <ClockIcon className="h-3.5 w-3.5" />
                            <span>{treino.duracao}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <DumbbellIcon className="h-3.5 w-3.5" />
                            <span>{treino.exercicios} exercícios</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 text-sm">
                            <BarChart3Icon className="h-3.5 w-3.5" />
                            <span>{treino.peso}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {treino.tipo}
                      </Badge>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendário de Treinos</CardTitle>
          <div className="flex gap-2">
            <Link href="/treinos/novo">
              <Button size="sm" className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                <span>Novo Treino</span>
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendario" onValueChange={(value) => setView(value as "calendar" | "list")}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="calendario" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Calendário
                </TabsTrigger>
                <TabsTrigger value="lista" className="flex items-center gap-1">
                  <DumbbellIcon className="h-4 w-4" />
                  Lista
                </TabsTrigger>
              </TabsList>

              {view === "lista" && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <FilterIcon className="h-4 w-4 text-gray-500" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os treinos</SelectItem>
                      <SelectItem value="pernas">Pernas</SelectItem>
                      <SelectItem value="peito">Peito</SelectItem>
                      <SelectItem value="costas">Costas</SelectItem>
                      <SelectItem value="ombros">Ombros</SelectItem>
                      <SelectItem value="braços">Braços</SelectItem>
                      <SelectItem value="completo">Full Body</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <TabsContent value="calendario" className="mt-0">
              {renderCalendario()}
              {renderDetalhesDia()}
            </TabsContent>

            <TabsContent value="lista" className="mt-0">
              {renderListaTreinos()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

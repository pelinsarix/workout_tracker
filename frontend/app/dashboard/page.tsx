"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts"
import {
  CalendarIcon,
  TrendingUpIcon,
  BarChart3Icon,
  PieChartIcon,
  ActivityIcon,
  DumbbellIcon,
  ClockIcon,
  CalendarDaysIcon,
  FilterIcon,
  DownloadIcon,
  ArrowRightIcon,
  Target,
  Award,
  Flame,
  Plus,
} from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para os gráficos
const treinoData = [
  { name: "Jan", Peso: 65, Repetições: 20, Carga: 30 },
  { name: "Fev", Peso: 68, Repetições: 22, Carga: 35 },
  { name: "Mar", Peso: 67, Repetições: 25, Carga: 40 },
  { name: "Abr", Peso: 70, Repetições: 28, Carga: 45 },
  { name: "Mai", Peso: 72, Repetições: 30, Carga: 50 },
  { name: "Jun", Peso: 74, Repetições: 32, Carga: 55 },
  { name: "Jul", Peso: 75, Repetições: 35, Carga: 60 },
]

const checkInsData = [
  { name: "Jan", CheckIns: 12 },
  { name: "Fev", CheckIns: 15 },
  { name: "Mar", CheckIns: 18 },
  { name: "Abr", CheckIns: 16 },
  { name: "Mai", CheckIns: 20 },
  { name: "Jun", CheckIns: 22 },
  { name: "Jul", CheckIns: 24 },
]

const exerciciosData = [
  { name: "Agachamento", valor: 85 },
  { name: "Supino", valor: 70 },
  { name: "Leg Press", valor: 90 },
  { name: "Puxada", valor: 65 },
  { name: "Stiff", valor: 75 },
]

const gruposMuscularesData = [
  { name: "Pernas", value: 35 },
  { name: "Peito", value: 25 },
  { name: "Costas", value: 20 },
  { name: "Ombros", value: 10 },
  { name: "Braços", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const desempenhoRadarData = [
  { subject: "Força", A: 80, B: 60 },
  { subject: "Resistência", A: 70, B: 50 },
  { subject: "Frequência", A: 90, B: 70 },
  { subject: "Intensidade", A: 65, B: 45 },
  { subject: "Consistência", A: 85, B: 65 },
]

// Dados para o gráfico de progresso semanal
const progressoSemanalData = [
  { day: "Dom", volume: 0, meta: 1000 },
  { day: "Seg", volume: 1200, meta: 1000 },
  { day: "Ter", volume: 800, meta: 1000 },
  { day: "Qua", volume: 1500, meta: 1000 },
  { day: "Qui", volume: 1100, meta: 1000 },
  { day: "Sex", volume: 1300, meta: 1000 },
  { day: "Sáb", volume: 0, meta: 1000 },
]

// Dados para o gráfico de evolução de peso
const evolucaoPesoData = [
  { date: "Jan", peso: 75 },
  { date: "Fev", peso: 74 },
  { date: "Mar", peso: 73.5 },
  { date: "Abr", peso: 72 },
  { date: "Mai", peso: 71 },
  { date: "Jun", peso: 70.5 },
  { date: "Jul", peso: 70 },
]

// Dados para o gráfico de metas
const metasData = [
  { name: "Treinos", completado: 80, meta: 100 },
  { name: "Carga", completado: 65, meta: 100 },
  { name: "Cardio", completado: 45, meta: 100 },
  { name: "Proteína", completado: 90, meta: 100 },
]

// Dados para o gráfico de exercícios mais realizados
const exerciciosMaisRealizadosData = [
  { name: "Agachamento", count: 24 },
  { name: "Supino", count: 20 },
  { name: "Leg Press", count: 18 },
  { name: "Puxada", count: 16 },
  { name: "Stiff", count: 14 },
]

export default function DashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [periodo, setPeriodo] = useState("mes")
  const [metrica, setMetrica] = useState("peso")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("visao-geral")

  // Simular carregamento
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Estatísticas resumidas
  const estatisticas = [
    { titulo: "Treinos Realizados", valor: "45", icone: DumbbellIcon, cor: "bg-blue-100 text-blue-600" },
    { titulo: "Tempo Total", valor: "32h 15m", icone: ClockIcon, cor: "bg-green-100 text-green-600" },
    { titulo: "Dias Ativos", valor: "28", icone: CalendarDaysIcon, cor: "bg-purple-100 text-purple-600" },
    { titulo: "Progresso Médio", valor: "+12%", icone: TrendingUpIcon, cor: "bg-orange-100 text-orange-600" },
  ]

  // Renderizar skeleton loader
  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[100px] rounded-lg" />
        ))}
      </div>

      <Skeleton className="h-[400px] rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seu progresso e desempenho</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="progresso">Progresso</TabsTrigger>
              <TabsTrigger value="metas">Metas</TabsTrigger>
            </TabsList>

            <TabsContent value="visao-geral" className="space-y-6">
              {/* Cards de estatísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {estatisticas.map((stat, index) => (
                  <motion.div
                    key={stat.titulo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">{stat.titulo}</p>
                            <p className="text-2xl font-bold mt-1">{stat.valor}</p>
                          </div>
                          <div className={`p-3 rounded-full ${stat.cor}`}>
                            <stat.icone className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Card className="w-full sm:w-auto flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <FilterIcon className="h-5 w-5 text-gray-500" />
                      <div className="flex flex-col sm:flex-row gap-2 flex-1">
                        <Select value={periodo} onValueChange={setPeriodo}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="semana">Última Semana</SelectItem>
                            <SelectItem value="mes">Último Mês</SelectItem>
                            <SelectItem value="trimestre">Último Trimestre</SelectItem>
                            <SelectItem value="ano">Último Ano</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={metrica} onValueChange={setMetrica}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Métrica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="peso">Peso</SelectItem>
                            <SelectItem value="repeticoes">Repetições</SelectItem>
                            <SelectItem value="carga">Carga</SelectItem>
                            <SelectItem value="volume">Volume Total</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráfico principal - Evolução por treino com área preenchida */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                      Evolução por Treino
                    </CardTitle>
                    <CardDescription>Acompanhe seu progresso ao longo do tempo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={treinoData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value, name) => [
                              `${value} ${name === "Peso" ? "kg" : name === "Repetições" ? "reps" : "kg"}`,
                            ]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="Peso"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                            activeDot={{ r: 8 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="Repetições"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.3}
                          />
                          <Area type="monotone" dataKey="Carga" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Gráficos secundários */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3Icon className="h-5 w-5 text-green-600" />
                        Desempenho por Exercício
                      </CardTitle>
                      <CardDescription>Comparação entre seus principais exercícios</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={exerciciosData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                              formatter={(value) => [`${value}%`]}
                            />
                            <Bar dataKey="valor" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-orange-600" />
                        Distribuição de Treinos
                      </CardTitle>
                      <CardDescription>Por grupo muscular</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={gruposMuscularesData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {gruposMuscularesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              }}
                              formatter={(value) => [`${value}%`]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Gráfico de análise de desempenho */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ActivityIcon className="h-5 w-5 text-red-600" />
                      Análise de Desempenho
                    </CardTitle>
                    <CardDescription>Atual vs. Mês Anterior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius={80} data={desempenhoRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Atual" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                          <Radar name="Mês Anterior" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                          <Legend />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="progresso" className="space-y-6">
              {/* Progresso semanal */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                      Progresso Semanal
                    </CardTitle>
                    <CardDescription>Volume de treino por dia da semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={progressoSemanalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value} kg`]}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="volume"
                            name="Volume"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                            activeDot={{ r: 8 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="meta"
                            name="Meta"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.2}
                            strokeDasharray="5 5"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Evolução de peso */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5 text-green-600" />
                      Evolução de Peso Corporal
                    </CardTitle>
                    <CardDescription>Acompanhamento mensal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={evolucaoPesoData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value} kg`]}
                          />
                          <Area
                            type="monotone"
                            dataKey="peso"
                            name="Peso"
                            stroke="#ff7300"
                            fill="#ff7300"
                            fillOpacity={0.3}
                            activeDot={{ r: 8 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Exercícios mais realizados */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DumbbellIcon className="h-5 w-5 text-purple-600" />
                      Exercícios Mais Realizados
                    </CardTitle>
                    <CardDescription>Frequência de execução</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={exerciciosMaisRealizadosData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value} vezes`]}
                          />
                          <Bar dataKey="count" name="Frequência" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="metas" className="space-y-6">
              {/* Cards de metas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Target className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-medium">Meta de Treinos</h3>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          80%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">12/15 treinos</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Award className="h-5 w-5 text-green-600" />
                          </div>
                          <h3 className="font-medium">Meta de Peso</h3>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          65%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">70kg / 68kg</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <Flame className="h-5 w-5 text-red-600" />
                          </div>
                          <h3 className="font-medium">Meta de Calorias</h3>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          45%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span className="font-medium">1350/3000 kcal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Gráfico de metas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Progresso das Metas
                    </CardTitle>
                    <CardDescription>Visão geral de todas as metas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metasData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value) => [`${value}%`]}
                          />
                          <Legend />
                          <Bar dataKey="completado" name="Completado" stackId="a" fill="#8884d8" />
                          <Bar dataKey="meta" name="Meta" stackId="a" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Adicionar nova meta */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-3">
                      <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">Adicionar Nova Meta</h3>
                    <p className="text-gray-500 mb-4">
                      Defina novas metas para acompanhar seu progresso e manter-se motivado.
                    </p>
                    <Button asChild>
                      <Link href="/metas/nova" className="flex items-center gap-1">
                        Criar Meta
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

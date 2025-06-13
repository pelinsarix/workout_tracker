"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  DumbbellIcon,
  ClockIcon,
  CalendarDaysIcon,
  ActivityIcon,
  Award,
  Flame,
  Target,
  BarChart3Icon,
} from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExecucoesTreinoApi, TreinosApi } from "@/lib/api"
import { TreinoExecucao, TreinoFixo } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [periodoFiltro, setPeriodoFiltro] = useState("30d") // 7d, 30d, 90d, 365d
  const { toast } = useToast()

  // Estados para dados
  const [execucoesTreino, setExecucoesTreino] = useState<TreinoExecucao[]>([])
  const [treinosFixos, setTreinosFixos] = useState<TreinoFixo[]>([])

  // Carregar dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        const [execucoes, treinos] = await Promise.all([
          ExecucoesTreinoApi.listarTodasExecucoesUsuario(0, 1000),
          TreinosApi.listarTreinos()
        ])
        setExecucoesTreino(execucoes)
        setTreinosFixos(treinos)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados do dashboard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    carregarDados()
  }, [])

  // Filtrar execuções por período
  const getDataInicio = () => {
    const hoje = new Date()
    switch (periodoFiltro) {
      case "7d": return subDays(hoje, 7)
      case "30d": return subDays(hoje, 30)
      case "90d": return subDays(hoje, 90)
      case "365d": return subDays(hoje, 365)
      default: return subDays(hoje, 30)
    }
  }

  const execucoesFiltradas = execucoesTreino.filter(execucao => {
    const dataExecucao = new Date(execucao.data_inicio)
    const dataInicio = getDataInicio()
    return dataExecucao >= dataInicio // Mostrar todas as execuções no período
  })

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const totalTreinos = execucoesFiltradas.length
    
    const tempoTotal = execucoesFiltradas.reduce((total, execucao) => {
      if (execucao.duracao_minutos) {
        return total + execucao.duracao_minutos
      }
      if (execucao.data_fim) {
        const inicio = new Date(execucao.data_inicio)
        const fim = new Date(execucao.data_fim)
        const diferencaMs = fim.getTime() - inicio.getTime()
        const minutos = Math.floor(diferencaMs / (1000 * 60))
        return total + minutos
      }
      // Para execuções em andamento, calcular o tempo até agora
      if (execucao.data_inicio) {
        const inicio = new Date(execucao.data_inicio)
        const agora = new Date()
        const diferencaMs = agora.getTime() - inicio.getTime()
        const minutos = Math.floor(diferencaMs / (1000 * 60))
        return total + minutos
      }
      return total
    }, 0)

    const diasUnicos = new Set(
      execucoesFiltradas.map(execucao => 
        format(new Date(execucao.data_inicio), "yyyy-MM-dd")
      )
    ).size

    const totalExercicios = execucoesFiltradas.reduce((total, execucao) => 
      total + (execucao.exercicios_executados?.length || 0), 0
    )

    const totalSeries = execucoesFiltradas.reduce((total, execucao) => 
      total + (execucao.exercicios_executados?.reduce((subTotal, ex) => 
        subTotal + (ex.series?.length || 0), 0
      ) || 0), 0
    )

    return {
      totalTreinos,
      tempoTotal,
      diasUnicos,
      totalExercicios,
      totalSeries,
      mediaTreinosPorDia: diasUnicos > 0 ? (totalTreinos / diasUnicos).toFixed(1) : "0"
    }
  }

  const stats = calcularEstatisticas()

  // Dados para gráfico de treinos por dia
  const dadosTreinosPorDia = () => {
    const agrupados: Record<string, number> = {}
    
    execucoesFiltradas.forEach(execucao => {
      const data = format(new Date(execucao.data_inicio), "dd/MM")
      agrupados[data] = (agrupados[data] || 0) + 1
    })

    return Object.entries(agrupados)
      .map(([data, quantidade]) => ({ data, quantidade }))
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-'))
        const dateB = new Date(b.data.split('/').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })
      .slice(-14) // Últimos 14 dias
  }

  // Dados para gráfico de tipos de treino
  const dadosTiposTreino = () => {
    const tipos: Record<string, number> = {}
    
    execucoesFiltradas.forEach(execucao => {
      const tipo = execucao.treino_fixo?.nome || 'Sem nome'
      tipos[tipo] = (tipos[tipo] || 0) + 1
    })

    return Object.entries(tipos).map(([name, value]) => ({ name, value }))
  }

  // Dados para gráfico de duração por treino
  const dadosDuracaoTreinos = () => {
    return execucoesFiltradas.slice(-10).map((execucao, index) => {
      let duracao = 0
      if (execucao.duracao_minutos) {
        duracao = execucao.duracao_minutos
      } else if (execucao.data_fim) {
        const inicio = new Date(execucao.data_inicio)
        const fim = new Date(execucao.data_fim)
        duracao = Math.floor((fim.getTime() - inicio.getTime()) / (1000 * 60))
      } else if (execucao.data_inicio) {
        // Para execuções em andamento, calcular o tempo até agora
        const inicio = new Date(execucao.data_inicio)
        const agora = new Date()
        duracao = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60))
      }
      
      return {
        treino: `#${index + 1}`,
        duracao,
        nome: execucao.treino_fixo?.nome || 'Sem nome'
      }
    })
  }

  // Estatísticas de cards
  const estatisticas = [
    { 
      titulo: "Treinos Realizados", 
      valor: stats.totalTreinos.toString(), 
      icone: DumbbellIcon, 
      cor: "bg-blue-100 text-blue-600",
      descricao: `${stats.mediaTreinosPorDia} por dia em média`
    },
    { 
      titulo: "Tempo Total", 
      valor: `${Math.floor(stats.tempoTotal / 60)}h ${stats.tempoTotal % 60}m`, 
      icone: ClockIcon, 
      cor: "bg-green-100 text-green-600",
      descricao: `${Math.round(stats.tempoTotal / stats.totalTreinos || 0)}min por treino`
    },
    { 
      titulo: "Dias Ativos", 
      valor: stats.diasUnicos.toString(), 
      icone: CalendarDaysIcon, 
      cor: "bg-purple-100 text-purple-600",
      descricao: `${Math.round((stats.diasUnicos / parseInt(periodoFiltro)) * 100)}% do período`
    },
    { 
      titulo: "Total de Séries", 
      valor: stats.totalSeries.toString(), 
      icone: ActivityIcon, 
      cor: "bg-orange-100 text-orange-600",
      descricao: `${Math.round(stats.totalSeries / stats.totalTreinos || 0)} por treino`
    },
  ]

  // Renderizar skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Acompanhe seu progresso e desempenho</p>
          </div>
        </div>
        {renderSkeleton()}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seu progresso e desempenho</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">3 meses</SelectItem>
              <SelectItem value="365d">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/treinos/novo">
            <Button size="sm">Novo Treino</Button>
          </Link>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icone
          return (
            <motion.div
              key={stat.titulo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
                      <p className="text-2xl font-bold">{stat.valor}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.descricao}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.cor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Gráficos */}
      <div className="space-y-6">
        {/* Treinos por Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-5 w-5" />
              Treinos por Dia
            </CardTitle>
            <CardDescription>
              Frequência de treinos nos últimos 14 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosTreinosPorDia()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipos de Treino */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Treino</CardTitle>
              <CardDescription>
                Distribuição por tipo de treino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosTiposTreino()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosTiposTreino().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Duração dos Treinos */}
          <Card>
            <CardHeader>
              <CardTitle>Duração dos Treinos</CardTitle>
              <CardDescription>
                Tempo gasto nos últimos 10 treinos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosDuracaoTreinos()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="treino" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} min`,
                        props.payload.nome
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duracao" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo e Ações Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivo Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalTreinos}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  treinos realizados este mês
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((stats.totalTreinos / 20) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Meta: 20 treinos/mês
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Sequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.diasUnicos}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  dias ativos no período
                </p>
                <Badge variant={stats.diasUnicos >= 7 ? "default" : "secondary"}>
                  {stats.diasUnicos >= 7 ? "🔥 Em chamas!" : "💪 Continue assim!"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Primeira semana</span>
                  <Badge variant={stats.totalTreinos >= 3 ? "default" : "outline"}>
                    {stats.totalTreinos >= 3 ? "✅" : "⏳"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">10 treinos</span>
                  <Badge variant={stats.totalTreinos >= 10 ? "default" : "outline"}>
                    {stats.totalTreinos >= 10 ? "✅" : "⏳"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Maratonista</span>
                  <Badge variant={stats.tempoTotal >= 600 ? "default" : "outline"}>
                    {stats.tempoTotal >= 600 ? "✅" : "⏳"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <DumbbellIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Novo Treino</h3>
                  <p className="text-sm text-gray-600 mb-3">Criar um novo treino personalizado</p>
                  <Link href="/treinos/novo">
                    <Button size="sm" className="w-full">Criar Treino</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CalendarDaysIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Ver Calendário</h3>
                  <p className="text-sm text-gray-600 mb-3">Visualizar treinos no calendário</p>
                  <Link href="/calendario">
                    <Button size="sm" variant="outline" className="w-full">Abrir Calendário</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <ActivityIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Histórico</h3>
                  <p className="text-sm text-gray-600 mb-3">Ver todos os treinos realizados</p>
                  <Link href="/treinos">
                    <Button size="sm" variant="outline" className="w-full">Ver Histórico</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Filter, Dumbbell, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ExerciciosApi } from "@/lib/api"

export default function ExerciciosPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercicios, setExercicios] = useState<any[]>([])
  const [pesquisa, setPesquisa] = useState("")
  const [filtroGrupo, setFiltroGrupo] = useState("todos")
  const [filtroEquipamento, setFiltroEquipamento] = useState("todos")
  const [ordenacao, setOrdenacao] = useState("nome-asc")

  // Carregar dados dos exercícios da API
  useEffect(() => {
    const carregarExercicios = async () => {
      setIsLoading(true);
      try {
        const { ExerciciosApi } = await import('@/lib/api');
        const data = await ExerciciosApi.listarExercicios();
        
        // Convertendo os campos para o formato esperado pelo frontend (camelCase)
        const exerciciosFormatados = data.map((exercicio: any) => ({
          id: exercicio.id,
          nome: exercicio.nome,
          grupoMuscular: exercicio.grupo_muscular,
          equipamento: exercicio.equipamento,
          dificuldade: exercicio.dificuldade,
          descricao: exercicio.descricao,
          imagem: exercicio.imagem_url || "/placeholder.svg?height=200&width=200",
        }));
        
        setExercicios(exerciciosFormatados);
      } catch (error) {
        console.error("Erro ao carregar exercícios:", error);
        // Em caso de falha, usar dados de exemplo para não quebrar a interface
        const exerciciosData = [
          {
            id: "1",
            nome: "Agachamento",
            grupoMuscular: "quadríceps",
            equipamento: "barra",
            dificuldade: "intermediario",
            imagem: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "2",
            nome: "Supino Reto",
            grupoMuscular: "peitoral",
            equipamento: "barra",
            dificuldade: "intermediario",
            imagem: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "3",
            nome: "Puxada Frontal",
            grupoMuscular: "costas",
            equipamento: "máquina",
            dificuldade: "iniciante",
            imagem: "/placeholder.svg?height=200&width=200",
          }
        ];
        setExercicios(exerciciosData);
      } finally {
        setIsLoading(false);
      }
    };

    carregarExercicios();
  }, [])

  // Filtrar e ordenar exercícios
  const exerciciosFiltrados = exercicios
    .filter((ex) => {
      const matchPesquisa = ex.nome.toLowerCase().includes(pesquisa.toLowerCase())
      const matchGrupo = filtroGrupo === "todos" || ex.grupoMuscular === filtroGrupo
      const matchEquipamento = filtroEquipamento === "todos" || ex.equipamento === filtroEquipamento
      return matchPesquisa && matchGrupo && matchEquipamento
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "nome-asc":
          return a.nome.localeCompare(b.nome)
        case "nome-desc":
          return b.nome.localeCompare(a.nome)
        case "dificuldade-asc":
          const dificuldadeOrdem = { iniciante: 1, intermediario: 2, avancado: 3 }
          return (
            dificuldadeOrdem[a.dificuldade as keyof typeof dificuldadeOrdem] -
            dificuldadeOrdem[b.dificuldade as keyof typeof dificuldadeOrdem]
          )
        case "dificuldade-desc":
          const dificuldadeOrdemDesc = { iniciante: 1, intermediario: 2, avancado: 3 }
          return (
            dificuldadeOrdemDesc[b.dificuldade as keyof typeof dificuldadeOrdemDesc] -
            dificuldadeOrdemDesc[a.dificuldade as keyof typeof dificuldadeOrdemDesc]
          )
        default:
          return 0
      }
    })

  // Agrupar exercícios por grupo muscular
  const exerciciosPorGrupo: Record<string, any[]> = {}
  exerciciosFiltrados.forEach((ex) => {
    if (!exerciciosPorGrupo[ex.grupoMuscular]) {
      exerciciosPorGrupo[ex.grupoMuscular] = []
    }
    exerciciosPorGrupo[ex.grupoMuscular].push(ex)
  })

  // Obter grupos musculares únicos para o filtro, removendo valores vazios ou nulos
  const gruposMusculares = Array.from(
    new Set(exercicios.map((ex) => ex.grupoMuscular).filter(Boolean))
  ) as string[];

  // Obter equipamentos únicos para o filtro, removendo valores vazios ou nulos
  const equipamentos = Array.from(
    new Set(exercicios.map((ex) => ex.equipamento).filter(Boolean))
  ) as string[];

  // Renderizar lista de exercícios
  const renderExercicios = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-40 w-full rounded-md mb-3" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )
    }

    if (exerciciosFiltrados.length === 0) {
      return (
        <div className="text-center py-10">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Nenhum exercício encontrado.</p>
          <p className="text-sm text-gray-400 mb-4">Tente mudar os filtros ou adicionar novos exercícios.</p>
          <Button asChild>
            <Link href="/exercicios/novo">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Exercício
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {exerciciosFiltrados.map((exercicio, index) => (
            <motion.div
              key={exercicio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link
                href={`/exercicios/${exercicio.id}`}
                className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow p-4" // Adicionado padding e removida imagem
              >
                {/* Seção da imagem removida 
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={exercicio.imagem || "/placeholder.svg"}
                    alt={exercicio.nome}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    variant="outline"
                    className={`absolute top-2 right-2 capitalize ${
                      exercicio.dificuldade === "iniciante"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : exercicio.dificuldade === "intermediario"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {exercicio.dificuldade === "iniciante"
                      ? "Iniciante"
                      : exercicio.dificuldade === "intermediario"
                        ? "Intermediário"
                        : "Avançado"}
                  </Badge>
                </div>
                */}
                <div className="pt-2"> {/* Ajustado para remover espaço extra da imagem */}
                  <h3 className="font-semibold text-lg truncate mb-1">{exercicio.nome}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {exercicio.grupoMuscular && (
                      <Badge variant="secondary" className="capitalize">{exercicio.grupoMuscular}</Badge>
                    )}
                    {exercicio.equipamento && (
                      <Badge variant="secondary" className="capitalize">{exercicio.equipamento}</Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize w-full justify-center ${ // Badge de dificuldade agora ocupa largura total
                      exercicio.dificuldade === "iniciante"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : exercicio.dificuldade === "intermediario"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {exercicio.dificuldade === "iniciante"
                      ? "Iniciante"
                      : exercicio.dificuldade === "intermediario"
                        ? "Intermediário"
                        : "Avançado"}
                  </Badge>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  // Renderizar exercícios agrupados
  const renderExerciciosAgrupados = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-6 w-40 mb-3" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (Object.keys(exerciciosPorGrupo).length === 0) {
      return (
        <div className="text-center py-10">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Nenhum exercício encontrado.</p>
          <p className="text-sm text-gray-400 mb-4">Tente mudar os filtros ou adicionar novos exercícios.</p>
          <Button asChild>
            <Link href="/exercicios/novo">
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Exercício
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        {Object.entries(exerciciosPorGrupo).map(([grupo, exercicios]) => (
          <motion.div
            key={grupo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-3 capitalize">{grupo}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {exercicios.map((exercicio, index) => (
                  <motion.div
                    key={exercicio.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={`/exercicios/${exercicio.id}`}
                      className="flex items-center gap-3 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={exercicio.imagem || "/placeholder.svg"}
                          alt={exercicio.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{exercicio.nome}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="capitalize text-xs">
                            {exercicio.equipamento}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${
                              exercicio.dificuldade === "iniciante"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : exercicio.dificuldade === "intermediario"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {exercicio.dificuldade === "iniciante"
                              ? "Iniciante"
                              : exercicio.dificuldade === "intermediario"
                                ? "Intermediário"
                                : "Avançado"}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exercícios</CardTitle>
          <Button asChild>
            <Link href="/exercicios/novo" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Novo Exercício
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* Barra de pesquisa e filtros */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar exercícios..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Grupo Muscular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os grupos</SelectItem>
                    {gruposMusculares.map((grupo) => (
                      <SelectItem key={grupo} value={grupo}>
                        {grupo.charAt(0).toUpperCase() + grupo.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <Dumbbell className="h-4 w-4 text-gray-500" />
                <Select value={filtroEquipamento} onValueChange={setFiltroEquipamento}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os equipamentos</SelectItem>
                    {equipamentos.map((equip) => (
                      <SelectItem key={equip} value={equip}>
                        {equip.charAt(0).toUpperCase() + equip.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <ArrowUpDown className="h-4 w-4 text-gray-500" />
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="dificuldade-asc">Dificuldade (Fácil → Difícil)</SelectItem>
                    <SelectItem value="dificuldade-desc">Dificuldade (Difícil → Fácil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tabs para alternar entre visualizações */}
          <Tabs defaultValue="grid">
            <TabsList className="mb-4">
              <TabsTrigger value="grid">Grade</TabsTrigger>
              <TabsTrigger value="grouped">Agrupados</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">{renderExercicios()}</TabsContent>

            <TabsContent value="grouped">{renderExerciciosAgrupados()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

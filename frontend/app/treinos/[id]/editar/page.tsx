"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { GripVertical, Save, Trash2, Plus, Search, ArrowLeft, AlertCircle, Clock, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditarTreinoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  // Estado para o treino
  const [treino, setTreino] = useState({
    id: params.id,
    nome: "",
    descricao: "",
    tempoDescansoGlobal: 60, // Tempo de descanso global em segundos
    exercicios: [] as any[],
  })

  // Estado para o diálogo de adicionar exercício
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pesquisa, setPesquisa] = useState("")
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState<string[]>([])

  // Estado para confirmação de exclusão
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [exercicioParaExcluir, setExercicioParaExcluir] = useState<number | null>(null)

  // Lista de exercícios disponíveis (poderia vir de uma API)
  const exerciciosDisponiveis = [
    { id: "1", nome: "Agachamento", grupoMuscular: "Quadríceps, Glúteos" },
    { id: "2", nome: "Leg Press", grupoMuscular: "Quadríceps, Glúteos" },
    { id: "3", nome: "Cadeira Extensora", grupoMuscular: "Quadríceps" },
    { id: "4", nome: "Stiff", grupoMuscular: "Posteriores" },
    { id: "5", nome: "Supino Reto", grupoMuscular: "Peitoral" },
    { id: "6", nome: "Crucifixo", grupoMuscular: "Peitoral" },
    { id: "7", nome: "Puxada Frontal", grupoMuscular: "Costas" },
    { id: "8", nome: "Remada Baixa", grupoMuscular: "Costas" },
    { id: "9", nome: "Desenvolvimento", grupoMuscular: "Ombros" },
    { id: "10", nome: "Elevação Lateral", grupoMuscular: "Ombros" },
    { id: "11", nome: "Rosca Direta", grupoMuscular: "Bíceps" },
    { id: "12", nome: "Tríceps Corda", grupoMuscular: "Tríceps" },
  ]

  // Filtrar exercícios disponíveis com base na pesquisa
  const exerciciosFiltrados = exerciciosDisponiveis.filter(
    (ex) =>
      ex.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      ex.grupoMuscular.toLowerCase().includes(pesquisa.toLowerCase()),
  )

  // Carregar dados do treino (simulação)
  useEffect(() => {
    // Aqui você faria uma chamada à API para buscar os dados do treino
    // Simulando dados para demonstração
    const treinoData = {
      id: params.id,
      nome: params.id === "1" ? "Perna I" : params.id === "2" ? "Perna II" : params.id === "3" ? "Peito" : "Costas",
      descricao: "Treino focado em desenvolvimento muscular e força",
      tempoDescansoGlobal: 60, // 60 segundos de descanso padrão
      exercicios: [
        {
          id: "1",
          nome: "Agachamento",
          grupoMuscular: "Quadríceps, Glúteos",
          series: 3,
          repeticoesRecomendadas: "10-12",
          tempoDescanso: 90, // Tempo de descanso específico para este exercício
          usarTempoDescansoGlobal: false,
        },
        {
          id: "2",
          nome: "Leg Press",
          grupoMuscular: "Quadríceps, Glúteos",
          series: 3,
          repeticoesRecomendadas: "12-15",
          tempoDescanso: 60,
          usarTempoDescansoGlobal: true,
        },
        {
          id: "3",
          nome: "Cadeira Extensora",
          grupoMuscular: "Quadríceps",
          series: 3,
          repeticoesRecomendadas: "12-15",
          tempoDescanso: 60,
          usarTempoDescansoGlobal: true,
        },
        {
          id: "4",
          nome: "Stiff",
          grupoMuscular: "Posteriores",
          series: 3,
          repeticoesRecomendadas: "10-12",
          tempoDescanso: 60,
          usarTempoDescansoGlobal: true,
        },
      ],
    }

    setTreino(treinoData)
  }, [params.id])

  // Manipuladores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTreino((prev) => ({ ...prev, [name]: value }))
  }

  const handleTempoDescansoGlobalChange = (value: number[]) => {
    const novoTempo = value[0]
    setTreino((prev) => ({
      ...prev,
      tempoDescansoGlobal: novoTempo,
      // Atualizar o tempo de descanso para todos os exercícios que usam o tempo global
      exercicios: prev.exercicios.map((ex) => (ex.usarTempoDescansoGlobal ? { ...ex, tempoDescanso: novoTempo } : ex)),
    }))
  }

  const handleExercicioChange = (index: number, field: string, value: any) => {
    const updatedExercicios = [...treino.exercicios]

    // Caso especial para o toggle de usar tempo global
    if (field === "usarTempoDescansoGlobal") {
      updatedExercicios[index] = {
        ...updatedExercicios[index],
        [field]: value,
        // Se estiver ativando o uso do tempo global, atualizar o tempo de descanso
        ...(value ? { tempoDescanso: treino.tempoDescansoGlobal } : {}),
      }
    } else {
      updatedExercicios[index] = { ...updatedExercicios[index], [field]: value }
    }

    setTreino((prev) => ({ ...prev, exercicios: updatedExercicios }))
  }

  const handleTempoDescansoChange = (index: number, value: number[]) => {
    const updatedExercicios = [...treino.exercicios]
    updatedExercicios[index] = {
      ...updatedExercicios[index],
      tempoDescanso: value[0],
      usarTempoDescansoGlobal: false, // Desativar o uso do tempo global quando o usuário ajusta manualmente
    }
    setTreino((prev) => ({ ...prev, exercicios: updatedExercicios }))
  }

  const handleRemoveExercicio = (index: number) => {
    setExercicioParaExcluir(index)
    setConfirmDeleteOpen(true)
  }

  const confirmRemoveExercicio = () => {
    if (exercicioParaExcluir !== null) {
      const updatedExercicios = treino.exercicios.filter((_, i) => i !== exercicioParaExcluir)
      setTreino((prev) => ({ ...prev, exercicios: updatedExercicios }))
      setConfirmDeleteOpen(false)
      setExercicioParaExcluir(null)

      toast({
        title: "Exercício removido",
        description: "O exercício foi removido do treino com sucesso.",
      })
    }
  }

  const handleAddExercicios = () => {
    // Filtrar apenas os exercícios que ainda não estão no treino
    const exerciciosParaAdicionar = exerciciosDisponiveis
      .filter((ex) => exerciciosSelecionados.includes(ex.id))
      .filter((ex) => !treino.exercicios.some((e) => e.id === ex.id))
      .map((ex) => ({
        ...ex,
        series: 3,
        repeticoesRecomendadas: "10-12",
        tempoDescanso: treino.tempoDescansoGlobal,
        usarTempoDescansoGlobal: true,
      }))

    if (exerciciosParaAdicionar.length === 0) {
      toast({
        title: "Atenção",
        description: "Nenhum exercício novo foi selecionado.",
        variant: "destructive",
      })
      return
    }

    setTreino((prev) => ({
      ...prev,
      exercicios: [...prev.exercicios, ...exerciciosParaAdicionar],
    }))

    setDialogOpen(false)
    setExerciciosSelecionados([])
    setPesquisa("")

    toast({
      title: "Exercícios adicionados",
      description: `${exerciciosParaAdicionar.length} exercício(s) adicionado(s) ao treino.`,
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(treino.exercicios)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTreino((prev) => ({ ...prev, exercicios: items }))
  }

  const handleSave = () => {
    // Validação básica
    if (!treino.nome.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O nome do treino é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (treino.exercicios.length === 0) {
      toast({
        title: "Erro ao salvar",
        description: "Adicione pelo menos um exercício ao treino.",
        variant: "destructive",
      })
      return
    }

    // Aqui você enviaria os dados para a API
    console.log("Salvando treino:", treino)

    toast({
      title: "Treino salvo",
      description: "As alterações foram salvas com sucesso.",
    })

    // Redirecionar para a página de detalhes do treino
    router.push(`/treinos/${params.id}`)
  }

  const toggleExercicio = (id: string) => {
    if (exerciciosSelecionados.includes(id)) {
      setExerciciosSelecionados(exerciciosSelecionados.filter((exId) => exId !== id))
    } else {
      setExerciciosSelecionados([...exerciciosSelecionados, id])
    }
  }

  // Formatar o tempo de descanso para exibição
  const formatTempoDescanso = (segundos: number) => {
    if (segundos < 60) {
      return `${segundos} seg`
    } else {
      const minutos = Math.floor(segundos / 60)
      const segs = segundos % 60
      return segs > 0 ? `${minutos}:${segs.toString().padStart(2, "0")} min` : `${minutos} min`
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Editar Treino</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações básicas do treino */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Treino</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={treino.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Treino de Perna, Peito e Tríceps, etc."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição (opcional)</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  value={treino.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva o objetivo deste treino"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Tempo de descanso global */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="tempoDescansoGlobal" className="font-medium">
                    Tempo de Descanso Padrão
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Este é o tempo de descanso padrão entre séries. Você pode definir tempos específicos para cada
                          exercício.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Slider
                      id="tempoDescansoGlobal"
                      value={[treino.tempoDescansoGlobal]}
                      min={10}
                      max={180}
                      step={5}
                      onValueChange={handleTempoDescansoGlobalChange}
                    />
                  </div>
                  <div className="w-20 text-center font-medium">{formatTempoDescanso(treino.tempoDescansoGlobal)}</div>
                </div>
              </div>
            </div>

            {/* Lista de exercícios */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Exercícios</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/exercicios/novo")}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Exercício
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Adicionar Exercícios
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Exercícios</DialogTitle>
                        <DialogDescription>Selecione os exercícios que deseja adicionar ao treino.</DialogDescription>
                      </DialogHeader>

                      <div className="mt-4 mb-4">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            placeholder="Buscar por nome ou grupo muscular..."
                            value={pesquisa}
                            onChange={(e) => setPesquisa(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto pr-1">
                        <div className="space-y-2">
                          {exerciciosFiltrados.map((exercicio) => (
                            <div
                              key={exercicio.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                exerciciosSelecionados.includes(exercicio.id)
                                  ? "bg-blue-50 border-blue-200"
                                  : "hover:bg-gray-50"
                              } ${
                                treino.exercicios.some((e) => e.id === exercicio.id)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!treino.exercicios.some((e) => e.id === exercicio.id)) {
                                  toggleExercicio(exercicio.id)
                                }
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{exercicio.nome}</p>
                                  <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                                </div>
                                <div className="flex items-center">
                                  {treino.exercicios.some((e) => e.id === exercicio.id) && (
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2">
                                      Já adicionado
                                    </span>
                                  )}
                                  {!treino.exercicios.some((e) => e.id === exercicio.id) && (
                                    <div
                                      className={`w-5 h-5 rounded-full border ${
                                        exerciciosSelecionados.includes(exercicio.id)
                                          ? "bg-blue-500 border-blue-500"
                                          : "border-gray-300"
                                      } flex items-center justify-center`}
                                    >
                                      {exerciciosSelecionados.includes(exercicio.id) && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {exerciciosFiltrados.length === 0 && (
                            <div className="text-center py-4 text-gray-500">Nenhum exercício encontrado.</div>
                          )}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddExercicios} disabled={exerciciosSelecionados.length === 0}>
                          Adicionar ({exerciciosSelecionados.length})
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {treino.exercicios.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Este treino não possui exercícios. Adicione exercícios para continuar.
                  </AlertDescription>
                </Alert>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="exercicios">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        <AnimatePresence>
                          {treino.exercicios.map((exercicio, index) => (
                            <Draggable key={exercicio.id} draggableId={exercicio.id} index={index}>
                              {(provided) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                    >
                                      <GripVertical className="h-5 w-5" />
                                    </div>

                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <div>
                                          <h4 className="font-semibold">{exercicio.nome}</h4>
                                          <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                                        </div>

                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleRemoveExercicio(index)}
                                          className="h-8 w-8 text-gray-500 hover:text-red-500"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3 mt-3">
                                        <div>
                                          <Label htmlFor={`series-${index}`}>Séries</Label>
                                          <Input
                                            id={`series-${index}`}
                                            type="number"
                                            value={exercicio.series}
                                            onChange={(e) =>
                                              handleExercicioChange(index, "series", Number.parseInt(e.target.value))
                                            }
                                            min={1}
                                            className="mt-1"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`repeticoes-${index}`}>Repetições</Label>
                                          <Input
                                            id={`repeticoes-${index}`}
                                            value={exercicio.repeticoesRecomendadas}
                                            onChange={(e) =>
                                              handleExercicioChange(index, "repeticoesRecomendadas", e.target.value)
                                            }
                                            placeholder="Ex: 10-12"
                                            className="mt-1"
                                          />
                                        </div>
                                      </div>

                                      {/* Tempo de descanso por exercício */}
                                      <div className="mt-4 border-t pt-3">
                                        <div className="flex items-center justify-between mb-2">
                                          <Label className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            Tempo de Descanso
                                          </Label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="checkbox"
                                              id={`usar-global-${index}`}
                                              checked={exercicio.usarTempoDescansoGlobal}
                                              onChange={(e) =>
                                                handleExercicioChange(
                                                  index,
                                                  "usarTempoDescansoGlobal",
                                                  e.target.checked,
                                                )
                                              }
                                              className="rounded border-gray-300"
                                            />
                                            <Label htmlFor={`usar-global-${index}`} className="text-sm font-normal">
                                              Usar padrão
                                            </Label>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                          <div className="flex-1">
                                            <Slider
                                              value={[exercicio.tempoDescanso]}
                                              min={10}
                                              max={180}
                                              step={5}
                                              onValueChange={(value) => handleTempoDescansoChange(index, value)}
                                              disabled={exercicio.usarTempoDescansoGlobal}
                                              className={exercicio.usarTempoDescansoGlobal ? "opacity-50" : ""}
                                            />
                                          </div>
                                          <div className="w-20 text-center font-medium">
                                            {formatTempoDescanso(exercicio.tempoDescanso)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Diálogo de confirmação para excluir exercício */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este exercício do treino? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemoveExercicio}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente Check para o ícone de check
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

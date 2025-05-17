"use client"

import type React from "react"
import { useState, useEffect, use } from "react" // Adicionado 'use'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  PlusIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  TimerIcon,
  InfoIcon,
  RotateCcwIcon,
  CheckIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function ExecucaoExercicioPage({
  params: paramsPromise, // Renomeado para indicar que é uma Promise
}: {
  params: { id: string; exercicioId: string }
}) {
  const params = use(paramsPromise) // Desembrulha a Promise de params
  const router = useRouter()
  const { toast } = useToast()
  const exercicioId = Number.parseInt(params.exercicioId)

  // Dados de exemplo do treino e exercício atual
  const treino = {
    id: params.id,
    nome: params.id === "1" ? "Perna I" : params.id === "2" ? "Perna II" : params.id === "3" ? "Peito" : "Costas",
    exercicios: [
      {
        id: "1",
        nome: "Agachamento",
        grupoMuscular: "Quadríceps, Glúteos",
        instrucoes: "Mantenha a coluna reta e desça até que as coxas fiquem paralelas ao chão.",
      },
      {
        id: "2",
        nome: "Leg Press",
        grupoMuscular: "Quadríceps, Glúteos",
        instrucoes: "Posicione os pés na plataforma na largura dos ombros e empurre até estender as pernas.",
      },
      {
        id: "3",
        nome: "Cadeira Extensora",
        grupoMuscular: "Quadríceps",
        instrucoes: "Ajuste o equipamento para que o joelho fique alinhado com o eixo de rotação da máquina.",
      },
      {
        id: "4",
        nome: "Stiff",
        grupoMuscular: "Posteriores",
        instrucoes:
          "Mantenha as pernas estendidas e incline o tronco para frente, sentindo o alongamento nos posteriores.",
      },
    ],
  }

  const exercicioAtual = treino.exercicios[exercicioId - 1]
  const totalExercicios = treino.exercicios.length
  const isLastExercicio = exercicioId === totalExercicios
  const progresso = (exercicioId / totalExercicios) * 100

  // Estado para as séries
  const [series, setSeries] = useState([
    { repeticoes: "", peso: "", concluida: false },
    { repeticoes: "", peso: "", concluida: false },
    { repeticoes: "", peso: "", concluida: false },
  ])

  // Estado para o timer de descanso
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60) // 60 segundos de descanso
  const [showInstrucoes, setShowInstrucoes] = useState(false)
  const [lastCompletedSerie, setLastCompletedSerie] = useState<number | null>(null)

  // Efeito para o timer de descanso
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      setTimerActive(false)
      toast({
        title: "Descanso concluído!",
        description: "Você pode iniciar a próxima série agora.",
      })
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timeRemaining, toast])

  const handleSerieChange = (index: number, field: "repeticoes" | "peso", value: string) => {
    const newSeries = [...series]
    newSeries[index][field] = value
    setSeries(newSeries)
  }

  const handleCheckSerie = (index: number, checked: boolean) => {
    const newSeries = [...series]
    newSeries[index].concluida = checked
    setSeries(newSeries)

    if (checked) {
      setLastCompletedSerie(index)
      // Iniciar timer de descanso automaticamente
      setTimeRemaining(60)
      setTimerActive(true)

      toast({
        title: "Série concluída!",
        description: "Timer de descanso iniciado: 60 segundos.",
      })
    }
  }

  const handleAddSerie = () => {
    setSeries([...series, { repeticoes: "", peso: "", concluida: false }])
  }

  const handleNext = () => {
    // Verificar se pelo menos uma série foi concluída
    const algumaSerieConcluida = series.some((serie) => serie.concluida)

    if (!algumaSerieConcluida) {
      toast({
        title: "Atenção!",
        description: "Complete pelo menos uma série antes de avançar.",
        variant: "destructive",
      })
      return
    }

    // Aqui você salvaria os dados da execução
    toast({
      title: "Progresso salvo!",
      description: `Exercício ${exercicioAtual.nome} registrado com sucesso.`,
    })

    if (isLastExercicio) {
      router.push(`/treinos/${params.id}/finalizar`)
    } else {
      router.push(`/treinos/${params.id}/execucao/${exercicioId + 1}`)
    }
  }

  const handlePrevious = () => {
    if (exercicioId > 1) {
      router.push(`/treinos/${params.id}/execucao/${exercicioId - 1}`)
    } else {
      router.push(`/treinos/${params.id}/iniciar`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const resetTimer = () => {
    setTimeRemaining(60)
    setTimerActive(false)
  }

  const toggleTimer = () => {
    setTimerActive(!timerActive)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl md:text-2xl">{exercicioAtual.nome}</CardTitle>
                <p className="text-sm text-gray-600">{exercicioAtual.grupoMuscular}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {exercicioId}/{totalExercicios}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowInstrucoes(!showInstrucoes)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <InfoIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ver instruções</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress value={progresso} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {showInstrucoes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <InfoIcon className="h-4 w-4 text-blue-600" />
                      Instruções
                    </h3>
                    <p className="text-sm text-gray-700">{exercicioAtual.instrucoes}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer de descanso */}
            <div className="mb-4">
              <div className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TimerIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium">Descanso</h3>
                    <p className={`text-xl font-bold ${timeRemaining < 10 && timerActive ? "text-red-600" : ""}`}>
                      {formatTime(timeRemaining)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetTimer} className="h-8 w-8 p-0">
                    <RotateCcwIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={timerActive ? "destructive" : "default"}
                    size="sm"
                    onClick={toggleTimer}
                    className="h-8 w-8 p-0"
                  >
                    {timerActive ? <span className="font-bold">II</span> : <PlayIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {series.map((serie, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${lastCompletedSerie === index ? "border-green-300 bg-green-50" : ""}`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Série {index + 1}</h3>
                    <div className="flex items-center">
                      <Checkbox
                        id={`serie-${index}`}
                        checked={serie.concluida}
                        onCheckedChange={(checked) => handleCheckSerie(index, checked as boolean)}
                      />
                      <label htmlFor={`serie-${index}`} className="ml-2 text-sm text-gray-600">
                        Concluída
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Repetições</label>
                      <Input
                        type="number"
                        placeholder="Repetições"
                        value={serie.repeticoes}
                        onChange={(e) => handleSerieChange(index, "repeticoes", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Peso (kg)</label>
                      <Input
                        type="number"
                        placeholder="Peso"
                        value={serie.peso}
                        onChange={(e) => handleSerieChange(index, "peso", e.target.value)}
                      />
                    </div>
                  </div>

                  {serie.concluida && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-3 flex items-center gap-2 text-green-600 text-sm"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>Série registrada com sucesso!</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleAddSerie}>
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>Adicionar Série</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} className="flex items-center">
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button onClick={handleNext} className="flex items-center">
              {isLastExercicio ? "Finalizar" : "Próximo"}
              {!isLastExercicio && <ChevronRightIcon className="h-4 w-4 ml-1" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

// Componente PlayIcon para o botão de play do timer
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

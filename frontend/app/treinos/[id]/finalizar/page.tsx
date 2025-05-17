"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  BarChart3Icon,
  HomeIcon,
  Share2Icon,
  CalendarIcon,
  ClockIcon,
  DumbbellIcon,
  TrendingUpIcon,
  StarIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function FinalizarPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [showStats, setShowStats] = useState(false)

  // Dados de exemplo do treino concluído
  const treino = {
    id: params.id,
    nome: params.id === "1" ? "Perna I" : params.id === "2" ? "Perna II" : params.id === "3" ? "Peito" : "Costas",
    duracao: "45 minutos",
    exerciciosConcluidos: 4,
    totalSeries: 12,
    cargaTotal: "1250 kg",
    recordes: 2,
  }

  // Efeito para disparar confetti quando a página carrega
  useEffect(() => {
    // Dispara o confetti
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Dispara confetti de ambos os lados
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    // Mostrar estatísticas após um pequeno delay
    const statsTimer = setTimeout(() => {
      setShowStats(true)
    }, 800)

    return () => {
      clearInterval(interval)
      clearTimeout(statsTimer)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardContent className="pt-10 pb-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="bg-green-100 p-4 rounded-full mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold mb-2"
            >
              Parabéns!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-6 text-center"
            >
              Você completou o treino <strong>{treino.nome}</strong> com sucesso!
            </motion.p>

            {showStats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-full bg-gray-50 rounded-lg p-4 mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex justify-center mb-1">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm">Duração</p>
                    <p className="font-semibold">{treino.duracao}</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex justify-center mb-1">
                      <DumbbellIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-gray-600 text-sm">Exercícios</p>
                    <p className="font-semibold">{treino.exerciciosConcluidos}</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="flex justify-center mb-1">
                      <TrendingUpIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-gray-600 text-sm">Carga Total</p>
                    <p className="font-semibold">{treino.cargaTotal}</p>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="flex justify-center mb-1">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-gray-600 text-sm">Recordes</p>
                    <p className="font-semibold">{treino.recordes}</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex justify-center gap-2 mb-4"
            >
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Agendar próximo
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2Icon className="h-4 w-4" />
                Compartilhar
              </Button>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" />
              Início
            </Button>
            <Button onClick={() => router.push("/dashboard")} className="flex items-center gap-1">
              <BarChart3Icon className="h-4 w-4" />
              Dashboard
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

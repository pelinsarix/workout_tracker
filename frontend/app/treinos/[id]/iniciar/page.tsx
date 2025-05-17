"use client"

import { useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ChevronRightIcon, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function IniciarTreinoPage({ params: paramsPromise }: { params: { id: string } }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })

  // Dados de exemplo do treino fixo
  const treino = {
    id: params.id,
    nome: params.id === "1" ? "Perna I" : params.id === "2" ? "Perna II" : params.id === "3" ? "Peito" : "Costas",
    exercicios: [
      { id: "1", nome: "Agachamento" },
      { id: "2", nome: "Leg Press" },
      { id: "3", nome: "Cadeira Extensora" },
      { id: "4", nome: "Stiff" },
    ],
  }

  const [peso, setPeso] = useState("")

  const handleIniciar = () => {
    // Aqui você salvaria os dados iniciais do treino
    router.push(`/treinos/${params.id}/execucao/1`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Treino: {treino.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6 text-gray-600">
            <CalendarIcon className="h-5 w-5" />
            <span>{dataAtual}</span>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Exercícios neste treino:</h3>
              <ul className="space-y-2">
                {treino.exercicios.map((exercicio, index) => (
                  <li key={exercicio.id} className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {index + 1}
                    </span>
                    {exercicio.nome}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Seu peso hoje (opcional):</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Kg"
                  className="border rounded-md p-2 w-full"
                />
                <span>kg</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleIniciar} className="flex items-center gap-1">
            Começar
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

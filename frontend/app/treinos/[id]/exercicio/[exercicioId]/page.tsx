"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ExercicioPage({
  params,
}: {
  params: { id: string; exercicioId: string }
}) {
  const router = useRouter()
  const exercicioId = Number.parseInt(params.exercicioId)

  // Dados de exemplo
  const exercicio = {
    nome: "Exercício",
    series: [
      { id: 1, repeticoes: "" },
      { id: 2, repeticoes: "" },
      { id: 3, repeticoes: "" },
    ],
  }

  const [series, setSeries] = useState(exercicio.series)

  const handleRepChange = (index: number, value: string) => {
    const newSeries = [...series]
    newSeries[index].repeticoes = value
    setSeries(newSeries)
  }

  const handleNext = () => {
    // Aqui você salvaria os dados
    // Navegar para o próximo exercício ou finalizar
    const nextExercicioId = exercicioId + 1
    router.push(`/treinos/${params.id}/exercicio/${nextExercicioId}`)
  }

  const handleAddSerie = () => {
    setSeries([...series, { id: series.length + 1, repeticoes: "" }])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{exercicio.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {series.map((serie, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Série {index + 1}</label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id={`serie-${index}`} />
                    <Input
                      type="number"
                      placeholder="Repetições"
                      value={serie.repeticoes}
                      onChange={(e) => handleRepChange(index, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-2 flex items-center justify-center" onClick={handleAddSerie}>
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Adicionar Série</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/treinos/${params.id}`}>
            <Button variant="outline">Voltar</Button>
          </Link>
          <Button onClick={handleNext}>Próximo</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

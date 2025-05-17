"use client"
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlayIcon, PencilIcon } from "lucide-react"

export default function TreinoDetalhePage({ params: paramsPromise }: { params: { id: string } }) {
  const params = use(paramsPromise);

  // Dados de exemplo do treino fixo
  const treino = {
    id: params.id,
    nome: params.id === "1" ? "Perna I" : params.id === "2" ? "Perna II" : params.id === "3" ? "Peito" : "Costas",
    descricao: "Treino focado em desenvolvimento muscular e força",
    exercicios: [
      {
        id: "1",
        nome: "Agachamento",
        grupoMuscular: "Quadríceps, Glúteos",
        series: 3,
        repeticoesRecomendadas: "10-12",
      },
      {
        id: "2",
        nome: "Leg Press",
        grupoMuscular: "Quadríceps, Glúteos",
        series: 3,
        repeticoesRecomendadas: "12-15",
      },
      {
        id: "3",
        nome: "Cadeira Extensora",
        grupoMuscular: "Quadríceps",
        series: 3,
        repeticoesRecomendadas: "12-15",
      },
      {
        id: "4",
        nome: "Stiff",
        grupoMuscular: "Posteriores",
        series: 3,
        repeticoesRecomendadas: "10-12",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{treino.nome}</CardTitle>
              <CardDescription>{treino.descricao}</CardDescription>
            </div>
            <Link href={`/treinos/${params.id}/editar`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <PencilIcon className="h-4 w-4" />
                Editar
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium text-lg mb-4">Exercícios</h3>

          <div className="space-y-3">
            {treino.exercicios.map((exercicio, index) => (
              <div key={exercicio.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{exercicio.nome}</h4>
                    <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                    <div className="mt-1 text-sm">
                      <span className="text-gray-600">
                        {exercicio.series} séries × {exercicio.repeticoesRecomendadas} repetições
                      </span>
                    </div>
                  </div>
                  <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                    {index + 1}/{treino.exercicios.length}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href={`/treinos/${params.id}/iniciar`}>
              <Button className="flex items-center gap-2">
                <PlayIcon className="h-5 w-5" />
                Iniciar Treino
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

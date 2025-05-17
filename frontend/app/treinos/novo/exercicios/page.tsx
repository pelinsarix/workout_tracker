"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon, XIcon, SaveIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NovoTreinoExerciciosPage() {
  const router = useRouter()

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
  ]

  // Estado para os exercícios selecionados
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState<string[]>([])
  const [pesquisa, setPesquisa] = useState("")

  const exerciciosFiltrados = exerciciosDisponiveis.filter(
    (ex) =>
      ex.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      ex.grupoMuscular.toLowerCase().includes(pesquisa.toLowerCase()),
  )

  const toggleExercicio = (id: string) => {
    if (exerciciosSelecionados.includes(id)) {
      setExerciciosSelecionados(exerciciosSelecionados.filter((exId) => exId !== id))
    } else {
      setExerciciosSelecionados([...exerciciosSelecionados, id])
    }
  }

  const handleSalvar = () => {
    // Aqui você salvaria o treino com os exercícios selecionados
    router.push("/treinos")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Exercícios ao Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="pesquisa">Pesquisar exercícios</Label>
            <Input
              id="pesquisa"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Nome ou grupo muscular..."
              className="mt-1"
            />
          </div>

          <div className="space-y-2 mb-6">
            <h3 className="font-medium">Exercícios selecionados ({exerciciosSelecionados.length})</h3>
            {exerciciosSelecionados.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum exercício selecionado</p>
            ) : (
              <div className="space-y-2">
                {exerciciosSelecionados.map((id) => {
                  const exercicio = exerciciosDisponiveis.find((ex) => ex.id === id)
                  if (!exercicio) return null

                  return (
                    <div key={id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">{exercicio.nome}</p>
                        <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExercicio(id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-3">Exercícios disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exerciciosFiltrados.map((exercicio) => (
                <div
                  key={exercicio.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    exerciciosSelecionados.includes(exercicio.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExercicio(exercicio.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{exercicio.nome}</p>
                      <p className="text-sm text-gray-600">{exercicio.grupoMuscular}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={exerciciosSelecionados.includes(exercicio.id) ? "text-blue-500" : "text-gray-400"}
                    >
                      {exerciciosSelecionados.includes(exercicio.id) ? (
                        <XIcon className="h-4 w-4" />
                      ) : (
                        <PlusIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={exerciciosSelecionados.length === 0}
            className="flex items-center gap-1"
          >
            <SaveIcon className="h-4 w-4" />
            Salvar Treino
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

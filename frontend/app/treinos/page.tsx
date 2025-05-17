"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DumbbellIcon, PlayIcon, HistoryIcon } from "lucide-react"

export default function TreinosPage() {
  // Dados de exemplo dos treinos fixos
  const treinosFixos = [
    { id: "1", nome: "Perna I", descricao: "Foco em quadríceps e glúteos", ultimaExecucao: "2 dias atrás" },
    { id: "2", nome: "Perna II", descricao: "Foco em posteriores e panturrilhas", ultimaExecucao: "5 dias atrás" },
    { id: "3", nome: "Peito", descricao: "Desenvolvimento completo do peitoral", ultimaExecucao: "1 dia atrás" },
    { id: "4", nome: "Costas", descricao: "Foco em latíssimo e trapézio", ultimaExecucao: "3 dias atrás" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Treinos</h1>
        <Link href="/treinos/historico">
          <Button variant="outline" className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            Histórico
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {treinosFixos.map((treino) => (
          <Card key={treino.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-2">
              <CardTitle className="flex items-center gap-2">
                <DumbbellIcon className="h-5 w-5 text-blue-600" />
                {treino.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-3">{treino.descricao}</p>
              <div className="text-sm text-gray-500 mb-4">Última execução: {treino.ultimaExecucao}</div>

              <div className="flex justify-between">
                <Link href={`/treinos/${treino.id}`}>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </Link>
                <Link href={`/treinos/${treino.id}/iniciar`}>
                  <Button size="sm" className="flex items-center gap-1">
                    <PlayIcon className="h-4 w-4" />
                    Iniciar
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/treinos/novo">
          <Button className="w-full">Criar Novo Treino</Button>
        </Link>
      </div>
    </div>
  )
}

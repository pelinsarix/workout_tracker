"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { DumbbellIcon, PlayIcon, HistoryIcon } from "lucide-react"
import api from "@/lib/api"
import { TreinoFixo } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TreinosPage() {
  const [treinos, setTreinos] = useState<TreinoFixo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTreinos = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/treinos/")
        setTreinos(response.data)
        setError(null)
      } catch (err) {
        console.error("Erro ao buscar treinos:", err)
        setError("Não foi possível carregar seus treinos. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreinos()
  }, [])

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="pt-4">
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      ) : treinos.length === 0 ? (
        <div className="text-center py-10">
          <DumbbellIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold">Nenhum treino encontrado</h3>
          <p className="text-gray-500 mb-6">Vamos começar criando seu primeiro treino!</p>
          <Link href="/treinos/novo">
            <Button>Criar Meu Primeiro Treino</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treinos.map((treino) => (
            <Card key={treino.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <DumbbellIcon className="h-5 w-5 text-blue-600" />
                  {treino.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600 mb-3">{treino.descricao || "Sem descrição"}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {treino.exercicios_treino?.length || 0} exercício(s)
                </div>

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
      )}

      {!isLoading && !error && treinos.length > 0 && (
        <div className="mt-8">
          <Link href="/treinos/novo">
            <Button className="w-full">Criar Novo Treino</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

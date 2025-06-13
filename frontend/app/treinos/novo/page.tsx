"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { TreinosApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function NovoTreinoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [tempoDescanso, setTempoDescanso] = useState("60")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o treino",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const novoTreino = await TreinosApi.criarTreino({
        nome,
        descricao: descricao || undefined,
        tempo_descanso_global: parseInt(tempoDescanso) || 60
      })
      
      toast({
        title: "Treino criado com sucesso!",
        description: "Agora você pode adicionar exercícios ao seu treino."
      })
      
      // Redirecionar para a página do treino recém-criado
      router.push(`/treinos/${novoTreino.id}`)
    } catch (error) {
      console.error("Erro ao criar treino:", error)
      toast({
        title: "Erro ao criar treino",
        description: "Ocorreu um erro ao criar o treino. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Treino</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Treino de Perna, Peito e Tríceps, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o objetivo deste treino"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempoDescanso">Tempo de Descanso Global (segundos)</Label>
              <Input
                id="tempoDescanso"
                type="number"
                value={tempoDescanso}
                onChange={(e) => setTempoDescanso(e.target.value)}
                placeholder="60"
                min={0}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Treino"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

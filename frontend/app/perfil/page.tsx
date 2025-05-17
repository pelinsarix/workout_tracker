"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function PerfilPage() {
  // Dados de exemplo do usuário
  const [usuario, setUsuario] = useState({
    nome: "João Silva",
    peso: "75",
    altura: "180",
    idade: "30",
  })

  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você salvaria os dados
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" value={usuario.nome} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input id="peso" name="peso" type="number" value={usuario.peso} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input id="altura" name="altura" type="number" value={usuario.altura} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input id="idade" name="idade" type="number" value={usuario.idade} onChange={handleChange} />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

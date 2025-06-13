"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import { motion } from "framer-motion"
import { ExerciciosApi } from "@/lib/api"

export default function NovoExercicioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para o exercício
  const [exercicio, setExercicio] = useState({
    nome: "",
    grupo_muscular: "",
    equipamento: "",
    descricao: "",
    instrucoes: "",
    dificuldade: "intermediario",
    publico: false
  })

  // Grupos musculares disponíveis
  const gruposMusculares = [
    "Quadríceps",
    "Glúteos",
    "Posteriores",
    "Panturrilhas",
    "Peitoral",
    "Costas",
    "Ombros",
    "Bíceps",
    "Tríceps",
    "Antebraço",
    "Abdômen",
    "Lombar",
  ]

  // Equipamentos disponíveis
  const equipamentos = [
    "Barra",
    "Halteres",
    "Máquina",
    "Cabo",
    "Kettlebell",
    "Peso Corporal",
    "Elástico",
    "Banco",
    "TRX",
    "Bola Suíça",
    "Outro",
  ]

  // Manipuladores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExercicio((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setExercicio((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    // Validação básica
    if (!exercicio.nome.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O nome do exercício é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!exercicio.grupo_muscular) {
      toast({
        title: "Erro ao salvar",
        description: "Selecione pelo menos um grupo muscular.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Enviar dados para a API
      await ExerciciosApi.criarExercicio(exercicio)
      
      toast({
        title: "Exercício salvo",
        description: "O exercício foi cadastrado com sucesso.",
      })

      // Redirecionar para a lista de exercícios
      router.push("/exercicios")
    } catch (error) {
      console.error("Erro ao salvar exercício:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o exercício. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Novo Exercício</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna da esquerda - Informações básicas */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Exercício</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={exercicio.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Agachamento, Supino Reto, etc."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="grupoMuscular">Grupo Muscular Principal</Label>
                  <Select
                    value={exercicio.grupo_muscular}
                    onValueChange={(value) => handleSelectChange("grupo_muscular", value)}
                  >
                    <SelectTrigger id="grupoMuscular" className="mt-1">
                      <SelectValue placeholder="Selecione o grupo muscular" />
                    </SelectTrigger>
                    <SelectContent>
                      {gruposMusculares.map((grupo) => (
                        <SelectItem key={grupo} value={grupo.toLowerCase()}>
                          {grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="equipamento">Equipamento</Label>
                  <Select
                    value={exercicio.equipamento}
                    onValueChange={(value) => handleSelectChange("equipamento", value)}
                  >
                    <SelectTrigger id="equipamento" className="mt-1">
                      <SelectValue placeholder="Selecione o equipamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipamentos.map((equip) => (
                        <SelectItem key={equip} value={equip.toLowerCase()}>
                          {equip}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dificuldade">Nível de Dificuldade</Label>
                  <Select
                    value={exercicio.dificuldade}
                    onValueChange={(value) => handleSelectChange("dificuldade", value)}
                  >
                    <SelectTrigger id="dificuldade" className="mt-1">
                      <SelectValue placeholder="Selecione a dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Coluna da direita - Descrições */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={exercicio.descricao}
                    onChange={handleInputChange}
                    placeholder="Breve descrição do exercício e seus benefícios"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="instrucoes">Instruções de Execução</Label>
                  <Textarea
                    id="instrucoes"
                    name="instrucoes"
                    value={exercicio.instrucoes}
                    onChange={handleInputChange}
                    placeholder="Descreva passo a passo como executar o exercício corretamente"
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Salvando..." : "Salvar Exercício"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

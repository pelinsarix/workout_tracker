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
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import { motion } from "framer-motion"

export default function NovoExercicioPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Estado para o exercício
  const [exercicio, setExercicio] = useState({
    nome: "",
    grupoMuscular: "",
    equipamento: "",
    descricao: "",
    instrucoes: "",
    dificuldade: "intermediario",
  })

  // Estado para a imagem
  const [imagem, setImagem] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)
  const [arrastando, setArrastando] = useState(false)

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

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImagem(file)
      setImagemPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastando(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastando(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setArrastando(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setImagem(file)
      setImagemPreview(URL.createObjectURL(file))
    }
  }

  const removerImagem = () => {
    setImagem(null)
    if (imagemPreview) {
      URL.revokeObjectURL(imagemPreview)
      setImagemPreview(null)
    }
  }

  const handleSubmit = () => {
    // Validação básica
    if (!exercicio.nome.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O nome do exercício é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!exercicio.grupoMuscular) {
      toast({
        title: "Erro ao salvar",
        description: "Selecione pelo menos um grupo muscular.",
        variant: "destructive",
      })
      return
    }

    // Aqui você enviaria os dados para a API
    console.log("Salvando exercício:", exercicio)
    console.log("Imagem:", imagem)

    toast({
      title: "Exercício salvo",
      description: "O exercício foi cadastrado com sucesso.",
    })

    // Redirecionar para a lista de exercícios
    router.push("/exercicios")
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
                    value={exercicio.grupoMuscular}
                    onValueChange={(value) => handleSelectChange("grupoMuscular", value)}
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

              {/* Coluna da direita - Imagem e descrições */}
              <div className="space-y-4">
                <div>
                  <Label>Imagem ou GIF do Exercício</Label>
                  <div
                    className={`mt-1 border-2 border-dashed rounded-lg p-4 text-center ${
                      arrastando ? "border-primary bg-primary/5" : "border-gray-300"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagemPreview ? (
                      <div className="relative">
                        <img
                          src={imagemPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-md object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={removerImagem}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Arraste e solte uma imagem aqui, ou{" "}
                          <label className="text-primary cursor-pointer hover:underline">
                            selecione um arquivo
                            <input type="file" className="hidden" accept="image/*" onChange={handleImagemChange} />
                          </label>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG ou GIF (máx. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={exercicio.descricao}
                    onChange={handleInputChange}
                    placeholder="Breve descrição do exercício e seus benefícios"
                    rows={2}
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
            <Button onClick={handleSubmit} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Salvar Exercício
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

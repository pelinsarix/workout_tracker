"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2Icon, GripVerticalIcon, PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TreinosApi, ExerciciosApi } from "@/lib/api"; // Corrigido o caminho da API
import { TreinoFixo, ExercicioTreino } from "@/lib/types"; // Importado TreinoFixo e ExercicioTreino
// import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"; // Comentado temporariamente devido a problemas de tipo

// Interface local para um exercício disponível para adição
interface ExercicioDisponivel {
  id: string; // ou number, dependendo da API
  nome: string;
  // outros campos relevantes do exercício
}

// Interface para o estado do treino, incluindo os exercícios já formatados para o frontend
interface TreinoEditState extends Omit<TreinoFixo, 'exercicios_treino' | 'id' | 'usuario_id'> {
  id?: number; // id pode ser opcional se estiver criando um novo
  usuario_id?: number;
  exercicios: ExercicioTreinoEdit[];
}

// Interface para um exercício dentro do formulário de edição do treino
interface ExercicioTreinoEdit extends ExercicioTreino {
  nomeExercicio?: string; // Para exibir o nome do exercício
  // Campos que podem ser editados diretamente na lista
}

export default function EditarTreinoPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const routeParams = useParams();
  const treinoId = routeParams.id as string;
  const router = useRouter();

  const [treino, setTreino] = useState<TreinoEditState | null>(null); // Estado para o treino sendo editado
  const [exerciciosDisponiveis, setExerciciosDisponiveis] = useState<ExercicioDisponivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddExercicioModal, setShowAddExercicioModal] = useState(false);
  const [exercicioParaAdicionar, setExercicioParaAdicionar] = useState<string | null>(null);
  const [detalhesNovoExercicio, setDetalhesNovoExercicio] = useState({ series: 3, repeticoes: "10", tempoDescanso: 60, observacoes: "" });

  useEffect(() => {
    const fetchTreinoEExercicios = async () => {
      if (!treinoId) return;
      try {
        setIsLoading(true);
        const [treinoData, listaExercicios] = await Promise.all([
          TreinosApi.obterTreino(treinoId),
          ExerciciosApi.listarExercicios()
        ]);

        // Mapear exercicios_treino para incluir nomeExercicio
        const exerciciosFormatados: ExercicioTreinoEdit[] = await Promise.all(
          treinoData.exercicios_treino.map(async (et: ExercicioTreino) => {
            try {
              const infoEx = await ExerciciosApi.obterExercicio(String(et.exercicio_id));
              return { ...et, nomeExercicio: infoEx.nome };
            } catch (error) {
              console.error(`Erro ao buscar nome do exercício ${et.exercicio_id}:`, error);
              return { ...et, nomeExercicio: "Nome não encontrado" };
            }
          })
        );

        setTreino({ 
          ...treinoData,
          exercicios: exerciciosFormatados.sort((a, b) => a.ordem - b.ordem) // Ordenar pela ordem
        });
        setExerciciosDisponiveis(listaExercicios.map((ex: any) => ({ id: String(ex.id), nome: ex.nome })));
        console.log("[Editar Treino Page] Lista de todos os exercícios da API (listaExercicios):", listaExercicios); // LOG ADICIONADO
      } catch (error) {
        console.error("Erro ao buscar dados para edição do treino:", error);
        toast({
          title: "Erro ao carregar treino",
          description: "Não foi possível buscar os dados do treino para edição.",
          variant: "destructive",
        });
        router.push("/treinos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTreinoEExercicios();
  }, [treinoId, toast, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTreino(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleExercicioDetailChange = (index: number, field: keyof ExercicioTreinoEdit, value: any) => {
    if (!treino) return;
    const updatedExercicios = [...treino.exercicios];
    (updatedExercicios[index] as any)[field] = value;
    setTreino({ ...treino, exercicios: updatedExercicios });
  };

  const handleExcluirExercicio = async (exercicioTreinoId: number) => {
    if (!treino || !treino.id) return;
    // Aqui, precisamos chamar a API para remover o exercício da tabela associativa
    // Ex: await TreinosApi.removerExercicioDoTreino(treino.id, exercicioTreinoId);
    // Por enquanto, apenas remove do estado local para demonstração
    try {
      // Supondo que TreinosApi.removerExercicioDoTreino existe e recebe (treinoId, exercicioTreinoId)
      // Onde exercicioTreinoId é o ID da entrada na tabela associativa (exercicios_treino.id)
      await TreinosApi.removerExercicio(treino.id, exercicioTreinoId); 
      setTreino(prev => prev ? ({
        ...prev,
        exercicios: prev.exercicios.filter(ex => ex.id !== exercicioTreinoId)
      }) : null);
      toast({ title: "Exercício Removido", description: "O exercício foi removido do treino." });
    } catch (error) {
      console.error("Erro ao remover exercício do treino:", error);
      toast({ title: "Erro", description: "Não foi possível remover o exercício.", variant: "destructive" });
    }
  };

  const abrirModalAdicionarExercicio = () => {
    setExercicioParaAdicionar(null); // Resetar seleção
    setDetalhesNovoExercicio({ series: 3, repeticoes: "10", tempoDescanso: 60, observacoes: "" });
    setShowAddExercicioModal(true);
  };

  const confirmarAdicionarExercicio = async () => {
    if (!treino || !treino.id || !exercicioParaAdicionar) return;
    setIsSubmitting(true);
    try {
      const payload = {
        exercicio_id: parseInt(exercicioParaAdicionar, 10),
        series: detalhesNovoExercicio.series,
        repeticoes_recomendadas: detalhesNovoExercicio.repeticoes,
        tempo_descanso: detalhesNovoExercicio.tempoDescanso,
        observacoes: detalhesNovoExercicio.observacoes,
        ordem: (treino.exercicios.length > 0 ? Math.max(...treino.exercicios.map(ex => ex.ordem)) : 0) + 1,
      };
      // Chamar a API para adicionar o exercício ao treino
      const novoExercicioAdicionado = await TreinosApi.adicionarExercicio(treino.id, payload);
      
      // Para atualizar a UI, precisamos do nome do exercício
      const exercicioInfo = exerciciosDisponiveis.find(ex => ex.id === exercicioParaAdicionar);
      
      const novoExercicioParaEstado: ExercicioTreinoEdit = {
        ...novoExercicioAdicionado, // Dados retornados pela API (incluindo o novo ID da tabela associativa)
        exercicio_id: parseInt(exercicioParaAdicionar, 10),
        nomeExercicio: exercicioInfo?.nome || "Exercício adicionado",
        series: detalhesNovoExercicio.series,
        repeticoes_recomendadas: detalhesNovoExercicio.repeticoes,
        tempo_descanso: detalhesNovoExercicio.tempoDescanso,
        observacoes: detalhesNovoExercicio.observacoes,
        ordem: payload.ordem,
        // id: novoExercicioAdicionado.id, // Garantir que o ID da tabela associativa está aqui
        // treino_fixo_id: treino.id
      };

      setTreino(prev => prev ? ({
        ...prev,
        exercicios: [...prev.exercicios, novoExercicioParaEstado].sort((a,b) => a.ordem - b.ordem)
      }) : null);
      toast({ title: "Exercício Adicionado", description: "O novo exercício foi adicionado ao treino." });
      setShowAddExercicioModal(false);
    } catch (error) {
      console.error("Erro ao adicionar exercício ao treino:", error);
      toast({ title: "Erro", description: "Não foi possível adicionar o exercício.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // const onDragEnd = (result: DropResult) => {
  //   if (!result.destination || !treino) return;
  //   const items = Array.from(treino.exercicios);
  //   const [reorderedItem] = items.splice(result.source.index, 1);
  //   items.splice(result.destination.index, 0, reorderedItem);
  //   // Atualizar a ordem dos exercícios
  //   const updatedExerciciosComOrdem = items.map((item, index) => ({ ...item, ordem: index + 1 }));
  //   setTreino({ ...treino, exercicios: updatedExerciciosComOrdem });
  // };

  const handleSubmit = async (e?: React.MouseEvent<HTMLButtonElement>) => { // Modificado para aceitar evento de clique
    if (e) e.preventDefault(); // Prevenir comportamento padrão se for de um formulário
    if (!treino || !treino.id) return;

    const treinoDataParaApi = {
      nome: treino.nome,
      descricao: treino.descricao,
      tempo_descanso_global: Number(treino.tempo_descanso_global),
      exercicios_treino: treino.exercicios.map(et => ({
        id: et.id, // ID da tabela associativa exercicios_treino
        exercicio_id: et.exercicio_id,
        series: Number(et.series),
        repeticoes_recomendadas: String(et.repeticoes_recomendadas),
        tempo_descanso: Number(et.tempo_descanso),
        usar_tempo_descanso_global: et.usar_tempo_descanso_global,
        ordem: et.ordem,
        observacoes: (et as any).observacoes || "" // Se observacoes não estiver no tipo ExercicioTreino
      }))
    };

    setIsSubmitting(true);
    try {
      await TreinosApi.atualizarTreino(treinoId, treinoDataParaApi);
      toast({
        title: "Sucesso!",
        description: "Treino atualizado com sucesso.",
      });
      router.push(`/treinos/${treinoId}`);
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações do treino.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !treino) {
    return <div className="container mx-auto py-8 px-4 md:px-6">Carregando editor do treino...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Editar Treino: {treino.nome}</CardTitle>
          <CardDescription>Modifique os detalhes e os exercícios do seu treino.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Treino</Label>
            <Input id="nome" name="nome" value={treino.nome || ""} onChange={handleInputChange} placeholder="Ex: Treino de Peito e Tríceps" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={treino.descricao || ""} onChange={handleInputChange} placeholder="Qualquer observação sobre o treino" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tempo_descanso_global">Tempo de Descanso Global (segundos)</Label>
            <Input id="tempo_descanso_global" name="tempo_descanso_global" type="number" value={treino.tempo_descanso_global || 60} onChange={handleInputChange} min="0" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Exercícios do Treino</h3>
              <Button variant="outline" size="sm" onClick={abrirModalAdicionarExercicio}>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Adicionar Exercício
              </Button>
            </div>

            {/* Modal de Adicionar Exercício */} 
            {showAddExercicioModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Adicionar Novo Exercício</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="select-exercicio">Exercício</Label>
                      <Select onValueChange={setExercicioParaAdicionar} value={exercicioParaAdicionar || ""}>
                        <SelectTrigger id="select-exercicio">
                          <SelectValue placeholder="Selecione um exercício" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            if (!treino) {
                              console.log("[Modal Adicionar Exercício] Estado 'treino' é null, não renderizando opções.");
                              return null;
                            }
                            console.log("[Modal Adicionar Exercício] Exercícios Disponíveis (antes do filtro - exerciciosDisponiveis):", exerciciosDisponiveis);
                            console.log("[Modal Adicionar Exercício] Exercícios já no treino (treino.exercicios):", treino.exercicios);
                            
                            const exerciciosFiltrados = exerciciosDisponiveis
                              .filter(exDisp => !treino.exercicios.some(exTreino => {
                                const estaNoTreino = String(exTreino.exercicio_id) === exDisp.id;
                                // Descomente para depuração detalhada da comparação:
                                // console.log(`Comparando: exDisp.id=${exDisp.id} (tipo ${typeof exDisp.id}) com exTreino.exercicio_id=${exTreino.exercicio_id} (String: ${String(exTreino.exercicio_id)}). Está no treino? ${estaNoTreino}`);
                                return estaNoTreino;
                              }));
                            
                            console.log("[Modal Adicionar Exercício] Exercícios Filtrados para Dropdown:", exerciciosFiltrados);
                            
                            if (exerciciosFiltrados.length === 0) {
                              // Adiciona uma mensagem se não houver exercícios para mostrar
                              return <div className="p-2 text-sm text-muted-foreground">Nenhum exercício novo para adicionar.</div>;
                            }

                            return exerciciosFiltrados.map(ex => (
                              <SelectItem key={ex.id} value={ex.id}>{ex.nome}</SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                    </div>
                    {exercicioParaAdicionar && (
                      <>
                        <div>
                          <Label htmlFor="novo-series">Séries</Label>
                          <Input id="novo-series" type="number" value={detalhesNovoExercicio.series} onChange={e => setDetalhesNovoExercicio(d => ({ ...d, series: parseInt(e.target.value) }))} min="1" />
                        </div>
                        <div>
                          <Label htmlFor="novo-repeticoes">Repetições</Label>
                          <Input id="novo-repeticoes" value={detalhesNovoExercicio.repeticoes} onChange={e => setDetalhesNovoExercicio(d => ({ ...d, repeticoes: e.target.value }))} placeholder="Ex: 8-12"/>
                        </div>
                        <div>
                          <Label htmlFor="novo-tempoDescanso">Tempo de Descanso (s)</Label>
                          <Input id="novo-tempoDescanso" type="number" value={detalhesNovoExercicio.tempoDescanso} onChange={e => setDetalhesNovoExercicio(d => ({ ...d, tempoDescanso: parseInt(e.target.value) }))} min="0" />
                        </div>
                        <div>
                          <Label htmlFor="novo-observacoes">Observações</Label>
                          <Textarea id="novo-observacoes" value={detalhesNovoExercicio.observacoes} onChange={e => setDetalhesNovoExercicio(d => ({ ...d, observacoes: e.target.value }))} />
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddExercicioModal(false)} disabled={isSubmitting}>Cancelar</Button>
                    <Button onClick={confirmarAdicionarExercicio} disabled={!exercicioParaAdicionar || isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Confirmar Adição"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Lista de Exercícios (Drag and Drop comentado) */} 
            {/* <DragDropContext onDragEnd={onDragEnd}> */} 
            {/*   <Droppable droppableId="exercicios"> */} 
            {/*     {(provided) => ( */} 
            {/*       <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3"> */} 
            {/*         {treino.exercicios.map((exercicio, index) => ( */} 
            {/*           <Draggable key={String(exercicio.id)} draggableId={String(exercicio.id)} index={index}> */} 
            {/*             {(provided) => ( */} 
            {/*               <Card */} 
            {/*                 ref={provided.innerRef} */} 
            {/*                 {...provided.draggableProps} */} 
            {/*                 className="p-0" // Remover padding do Card para o conteúdo preencher */} 
            {/*               > */} 
            {/*                 <div className="flex items-stretch"> */} 
            {/*                   <div {...provided.dragHandleProps} className="p-3 bg-muted hover:bg-muted-foreground/20 cursor-grab flex items-center rounded-l-md"> */} 
            {/*                     <GripVerticalIcon className="h-5 w-5 text-muted-foreground" /> */} 
            {/*                   </div> */} 
            {/*                   <CardContent className="flex-grow p-3 space-y-2"> */} 
            {/*                     <p className="font-medium">{exercicio.nomeExercicio || `Exercício ID: ${exercicio.exercicio_id}`}</p> */} 
            {/*                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm"> */} 
            {/*                       <div> */} 
            {/*                         <Label htmlFor={`series-${index}`}>Séries</Label> */} 
            {/*                         <Input id={`series-${index}`} type="number" value={exercicio.series} onChange={(e) => handleExercicioDetailChange(index, 'series', parseInt(e.target.value))} /> */} 
            {/*                       </div> */} 
            {/*                       <div> */} 
            {/*                         <Label htmlFor={`reps-${index}`}>Repetições</Label> */} 
            {/*                         <Input id={`reps-${index}`} value={exercicio.repeticoes_recomendadas || ""} onChange={(e) => handleExercicioDetailChange(index, 'repeticoes_recomendadas', e.target.value)} /> */} 
            {/*                       </div> */} 
            {/*                       <div> */} 
            {/*                         <Label htmlFor={`descanso-${index}`}>Descanso (s)</Label> */} 
            {/*                         <Input id={`descanso-${index}`} type="number" value={exercicio.tempo_descanso || ""} onChange={(e) => handleExercicioDetailChange(index, 'tempo_descanso', parseInt(e.target.value))} disabled={exercicio.usar_tempo_descanso_global} /> */} 
            {/*                       </div> */} 
            {/*                       <div className="flex items-end"> */} 
            {/*                         <Checkbox id={`usar-global-${index}`} checked={exercicio.usar_tempo_descanso_global} onCheckedChange={(checked) => handleExercicioDetailChange(index, 'usar_tempo_descanso_global', checked)} /> */} 
            {/*                         <Label htmlFor={`usar-global-${index}`} className="ml-2">Usar global</Label> */} 
            {/*                       </div> */} 
            {/*                     </div> */} 
            {/*                     <div> */} 
            {/*                        <Label htmlFor={`obs-${index}`}>Observações</Label> */} 
            {/*                        <Textarea id={`obs-${index}`} value={(exercicio as any).observacoes || ""} onChange={(e) => handleExercicioDetailChange(index, 'observacoes' as keyof ExercicioTreinoEdit, e.target.value)} placeholder="Observações específicas"/> */} 
            {/*                     </div> */} 
            {/*                   </CardContent> */} 
            {/*                   <div className="p-3 flex items-center"> */} 
            {/*                     <Button variant="ghost" size="icon" onClick={() => handleExcluirExercicio(exercicio.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/80"> */} 
            {/*                       <Trash2Icon className="h-4 w-4" /> */} 
            {/*                     </Button> */} 
            {/*                   </div> */} 
            {/*                 </div> */} 
            {/*               </Card> */} 
            {/*             )} */} 
            {/*           </Draggable> */} 
            {/*         ))} */} 
            {/*         {provided.placeholder} */} 
            {/*       </div> */} 
            {/*     )} */} 
            {/*   </Droppable> */} 
            {/* </DragDropContext> */} 

            {/* Lista de Exercícios SEM Drag and Drop (para simplificar e evitar erro de tipo) */} 
            <div className="space-y-3">
              {treino.exercicios.map((exercicio, index) => (
                <Card key={String(exercicio.id)} className="p-0">
                  <div className="flex items-stretch">
                    {/* <div className="p-3 bg-muted flex items-center rounded-l-md"><GripVerticalIcon className="h-5 w-5 text-muted-foreground" /></div> */} {/* Handle do Drag removido */} 
                    <CardContent className="flex-grow p-3 space-y-2">
                      <p className="font-medium">{exercicio.nomeExercicio || `Exercício ID: ${exercicio.exercicio_id}`}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <Label htmlFor={`series-${index}`}>Séries</Label>
                          <Input id={`series-${index}`} type="number" value={exercicio.series} onChange={(e) => handleExercicioDetailChange(index, 'series', parseInt(e.target.value))} />
                        </div>
                        <div>
                          <Label htmlFor={`reps-${index}`}>Repetições</Label>
                          <Input id={`reps-${index}`} value={exercicio.repeticoes_recomendadas || ""} onChange={(e) => handleExercicioDetailChange(index, 'repeticoes_recomendadas', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor={`descanso-${index}`}>Descanso (s)</Label>
                          <Input id={`descanso-${index}`} type="number" value={exercicio.tempo_descanso || ""} onChange={(e) => handleExercicioDetailChange(index, 'tempo_descanso', parseInt(e.target.value))} disabled={exercicio.usar_tempo_descanso_global} />
                        </div>
                        <div className="flex items-end">
                          <Checkbox id={`usar-global-${index}`} checked={!!exercicio.usar_tempo_descanso_global} onCheckedChange={(checked) => handleExercicioDetailChange(index, 'usar_tempo_descanso_global', checked)} />
                          <Label htmlFor={`usar-global-${index}`} className="ml-2">Usar global</Label>
                        </div>
                      </div>
                      <div>
                         <Label htmlFor={`obs-${index}`}>Observações</Label>
                         <Textarea id={`obs-${index}`} value={(exercicio as any).observacoes || ""} onChange={(e) => handleExercicioDetailChange(index, 'observacoes' as keyof ExercicioTreinoEdit, e.target.value)} placeholder="Observações específicas"/>
                      </div>
                    </CardContent>
                    <div className="p-3 flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => handleExcluirExercicio(exercicio.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive/80">
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {treino.exercicios.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum exercício neste treino. Adicione alguns!</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push(`/treinos/${treinoId}`)} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

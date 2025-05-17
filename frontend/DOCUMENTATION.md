# FitTracker - Documentação

## Visão Geral

FitTracker é um aplicativo de acompanhamento de treinos que permite aos usuários gerenciar seus treinos de musculação, registrar seu progresso e visualizar estatísticas de desempenho. O aplicativo foi desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## Índice

1. [Arquitetura](#arquitetura)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Fluxos Principais](#fluxos-principais)
4. [Componentes](#componentes)
5. [Instalação e Configuração](#instalação-e-configuração)
6. [Guia de Contribuição](#guia-de-contribuição)
7. [Micro Interações](#micro-interações)

## Arquitetura

O FitTracker utiliza a arquitetura do Next.js App Router, que organiza o aplicativo em rotas baseadas em pastas. A estrutura principal inclui:

- `app/`: Contém todas as rotas e páginas do aplicativo
- `components/`: Componentes reutilizáveis
- `lib/`: Utilitários, tipos e funções auxiliares
- `hooks/`: Hooks personalizados do React

### Tecnologias Principais

- **Frontend**: Next.js, React, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui
- **Gráficos**: Recharts
- **Gerenciamento de Estado**: React Hooks (useState, useContext)
- **Roteamento**: Next.js App Router

## Estrutura de Dados

O aplicativo utiliza a seguinte estrutura de dados:

### Usuário

\`\`\`typescript
interface Usuario {
  id: string;
  nome: string;
  peso: number;
  altura: number;
  idade: number;
}
\`\`\`

### Treino Fixo

\`\`\`typescript
interface TreinoFixo {
  id: string;
  nome: string;
  descricao?: string;
  exercicios: ExercicioFixo[];
}
\`\`\`

### Exercício Fixo

\`\`\`typescript
interface ExercicioFixo {
  id: string;
  nome: string;
  grupoMuscular?: string;
  instrucoes?: string;
}
\`\`\`

### Execução de Treino

\`\`\`typescript
interface ExecucaoTreino {
  id: string;
  data: Date;
  treinoFixoId: string;
  userId: string;
  execucoesExercicios: ExecucaoExercicio[];
}
\`\`\`

### Execução de Exercício

\`\`\`typescript
interface ExecucaoExercicio {
  id: string;
  exercicioFixoId: string;
  series: Serie[];
}
\`\`\`

### Série

\`\`\`typescript
interface Serie {
  repeticoes: number;
  peso: number;
  concluida: boolean;
}
\`\`\`

## Fluxos Principais

### 1. Gerenciamento de Treinos

- Visualizar lista de treinos fixos
- Criar novo treino
- Adicionar exercícios a um treino
- Editar treino existente

### 2. Execução de Treino

- Iniciar um treino
- Registrar séries e repetições para cada exercício
- Marcar séries como concluídas
- Finalizar treino e visualizar resumo

### 3. Acompanhamento de Progresso

- Visualizar histórico de treinos
- Analisar estatísticas no dashboard
- Acompanhar evolução por exercício
- Monitorar frequência de treinos

## Componentes

### Componentes Principais

- **Navbar**: Navegação principal do aplicativo
- **TreinoCard**: Card para exibir informações resumidas de um treino
- **ExercicioItem**: Item de lista para exibir um exercício
- **SerieForm**: Formulário para registrar séries e repetições
- **ProgressChart**: Gráfico para visualizar progresso
- **HistoricoList**: Lista de treinos realizados

### Páginas Principais

- **Home**: Página inicial com acesso rápido às funcionalidades
- **Treinos**: Lista de treinos disponíveis
- **Dashboard**: Visualização de estatísticas e progresso
- **Perfil**: Gerenciamento de informações do usuário
- **Execução de Treino**: Interface para realizar um treino

## Instalação e Configuração

### Requisitos

- Node.js 18.0.0 ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
   \`\`\`bash
   git clone https://github.com/seu-usuario/fittracker.git
   cd fittracker
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install
   # ou
   yarn install
   \`\`\`

3. Execute o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev
   # ou
   yarn dev
   \`\`\`

4. Acesse o aplicativo em `http://localhost:3000`

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

\`\`\`
NEXT_PUBLIC_API_URL=sua_api_url
DATABASE_URL=sua_database_url
\`\`\`

## Guia de Contribuição

### Fluxo de Trabalho

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-funcionalidade`
3. Faça commit das suas alterações: `git commit -m 'Adiciona nova funcionalidade'`
4. Envie para o seu fork: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para todos os arquivos
- Siga o padrão de nomenclatura kebab-case para arquivos
- Use PascalCase para componentes React
- Use camelCase para funções e variáveis
- Adicione comentários para código complexo
- Escreva testes para novas funcionalidades

## Micro Interações

O FitTracker implementa diversas micro interações para melhorar a experiência do usuário:

### Feedback Visual

- Animações de transição entre páginas
- Efeitos de hover em botões e cards
- Indicadores de progresso durante carregamentos
- Feedback visual ao concluir ações

### Gestos e Toques

- Swipe para navegar entre exercícios
- Toque duplo para marcar série como concluída
- Pull-to-refresh para atualizar dados

### Notificações e Alertas

- Toast notifications para confirmações
- Alertas contextuais para ações importantes
- Badges para indicar novos itens ou atualizações

### Animações

- Animações de celebração ao concluir treinos
- Animações de progresso em gráficos
- Transições suaves entre estados de componentes

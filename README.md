# HimeFit Hub (76)

Crie o HimeFit Manager, um ecossistema premium de gestão para academias. A aplicação deve ser desenvolvida em React, utilizando Tailwind CSS, Shadcn/UI e Lucide Icons, com foco em uma experiência de alta performance e dashboard dinâmico.

### 1. Visão Geral da Interface

Tema: Dark Modern com acentos em Neon Violet/Cyan (estética gamer/high-tech).

Layout: Sidebar colapsável com navegação inteligente. Dashboard central com widgets em tempo real para: Alunos ativos, faturamento diário, status da rádio e alertas de acesso (catraca).

### 2. Módulos Core (Implementação Completa):

CRM & Gestão de Alunos: Cadastro avançado com fotos, modalidades, histórico de pagamentos e métricas de frequência. Incluir sistema de filtros e busca otimizada.

Financeiro & PDV: Tela de faturamento com suporte a mensalidades e um Ponto de Venda (PDV) para produtos da academia. Gráficos de fluxo de caixa (entrada/saída) usando Recharts.

Central de IA & WhatsApp: Interface de monitoramento de chat (human-takeover) para o bot integrado à API da Gemini. Exibir transcrições de áudio e análise de sentimento das mensagens.

Gamificação (HimeQuest): Sistema de níveis, conquistas e ranking de alunos baseado em frequência e desafios superados.

Painel de Controle de Acesso: Visualização de logs de biometria/catraca em tempo real via WebSockets/Supabase Realtime.

Central de Mídia: Controle da 'Rádio Oxigênio' com playlist atual e anúncios agendados por IA.

### 3. Especificações Técnicas:

Estado: Utilize React Query para cache e gerenciamento de dados assíncronos.

Banco de Dados: Estruture as tabelas no Supabase para: profiles, subscriptions, transactions, gamification_logs e access_control.

Componentização: Use DataTable para listagens, Dialogs para formulários de cadastro e Skeleton para estados de carregamento.

Responsividade: Mobile-first, garantindo que o instrutor possa gerenciar a academia pelo celular.

### 4. Funcionalidades de UX:

Adicione feedback visual instantâneo (Sonner/Toast) para ações críticas.

Implemente 'Command Palette' (Ctrl+K) para navegação rápida entre alunos e comandos financeiros.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://himefit.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/481542d9-49a9-48d6-bf1f-609bccf5e46a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

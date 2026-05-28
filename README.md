# Task Manager — Frontend

Interface web em React + TypeScript para gerenciamento de tarefas, consumindo a API REST do backend em .NET 8.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior

---

## Instalação

```bash
npm install
```

---

## Rodando em desenvolvimento

```bash
npm run dev
```

Acesse em: **http://localhost:5173**

---

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam na pasta `dist/`.

Para visualizar o build localmente:

```bash
npm run preview
```

---

## Funcionalidades

- Criar tarefas com título e descrição
- Listar tarefas com badge de status colorido
- Filtrar por status: Todas, Pendentes, Em andamento, Concluídas
- Editar título, descrição e status de tarefas abertas
- Concluir tarefa com um clique
- Excluir com modal de confirmação
- Tarefas concluídas (`done`) não podem ser editadas
- Indicador de loading e mensagens de erro
- Layout responsivo (mobile e desktop)


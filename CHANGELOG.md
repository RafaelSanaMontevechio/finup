# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

- Suporte a parcelamento de compras no cartão de crédito: ao informar o
  número de parcelas, o valor total é dividido e lançado como N gastos
  mensais (um por mês), ligados por um `installmentGroupId`, para que o
  dashboard some corretamente o valor de cada mês sem lógica especial
- Badge de parcela (`3/10`) na listagem de gastos
- Opção "Excluir esta e as futuras" ao apagar uma parcela, além da exclusão
  de uma parcela avulsa

## [1.0.1] - 2026-09-26

### Removido

- Remoção de arquivos não utilizados

## [1.0.0] - 2026-09-29

### Adicionado

- MVP do sistema de controle financeiro pessoal: login, dashboard, gastos,
  entradas e categorias, com arquitetura feature-based (Next.js 15 App
  Router + TypeScript + Tailwind + Zustand + React Hook Form + Zod)
- Dashboard com cards de totais, saldo atual, gráficos (gastos por
  categoria, entradas vs. gastos por mês, evolução do saldo) e resumos
- Filtros, paginação e CRUD completo de gastos e entradas
- Cadastro de categorias com cor e ícone
- Exibição da versão do app no rodapé da barra lateral

### Alterado

- Migração da persistência de Google Sheets para **Firebase**: dados no
  Firestore (escopados por `userId`) e autenticação real via Firebase Auth
  (e-mail/senha), com sessão por cookie `httpOnly` criada no servidor

### Corrigido

- Tratamento de erros nas rotas de API: qualquer exceção não tratada agora
  sempre retorna um JSON válido em vez de uma resposta vazia (o que causava
  `Unexpected end of JSON input` no cliente) — o erro real passa a aparecer
  no terminal do servidor

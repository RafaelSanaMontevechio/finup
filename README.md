# Controle Financeiro

MVP de sistema de controle financeiro pessoal — Next.js 15 (App Router) + TypeScript + Tailwind + shadcn-style UI + Zustand + Firebase (Firestore + Auth).

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Firebase
npm run dev
```

Abra http://localhost:3000.

## Configurando o Firebase

1. Crie um projeto no [console do Firebase](https://console.firebase.google.com).
2. **Authentication** → habilite o provedor "E-mail/senha" e crie ao menos um usuário (esse será o login do app).
3. **Firestore Database** → crie o banco (modo produção ou teste, tanto faz — as regras de segurança não importam aqui porque todo acesso passa pelo Admin SDK no servidor).
4. **Configurações do projeto → Contas de serviço** → gere uma nova chave privada (arquivo JSON). Dele você usa:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (mantenha as quebras de linha como `\n`)
5. **Configurações do projeto → Geral** → copie a "Chave de API da Web" para `FIREBASE_WEB_API_KEY`.

Nenhum SDK do Firebase roda no navegador: o login é feito via API REST do Identity Toolkit a partir da Route Handler `/api/auth/login`, que em seguida cria um **cookie de sessão** (`httpOnly`, via Admin SDK) — é esse cookie que autentica as chamadas seguintes. Todas as leituras/escritas no Firestore acontecem só no servidor, através do Admin SDK, escopadas pelo `uid` do usuário logado (um usuário nunca vê dados de outro).

## Arquitetura

Feature-based, como pedido:

```
src/
├── app/            → apenas páginas e Route Handlers (API)
├── features/       → regra de negócio, componentes, hooks, services por domínio
├── components/     → ui (shadcn-style), layout, shared
├── stores/         → Zustand (um store por domínio)
├── lib/
│   ├── firebase/   → admin.ts (SDK), auth-rest.ts (login), session.ts (cookie), firestore-client.ts (CRUD genérico)
│   ├── api/        → fetch wrapper do cliente + require-user (guarda de sessão nas rotas)
│   ├── validations/→ zod
│   └── utils/
└── types/          → tipos compartilhados
```

## Observações

- Como o app não tem tela de cadastro, novos usuários precisam ser criados direto no console do Firebase (Authentication → Users).
- `lib/firebase/firestore-client.ts` foi desenhado como a única camada que conhece o Firestore — trocar de banco no futuro (Postgres, etc.) não deve exigir mudanças nas features.
- Sessão dura 5 dias (configurável em `lib/firebase/session.ts`); depois disso o usuário precisa logar de novo.

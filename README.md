# Lúa & Lis — Ateliê de Laços

E-commerce premium de laços infantis artesanais. Site construído com Next.js 14, Tailwind CSS e Framer Motion, com estética romântica, sofisticada e mobile-first.

---

## 🚀 Como rodar

### 1. Setup do Supabase (uma vez, via CLI)

O Supabase CLI já vem como devDependency (`npx supabase ...` funciona após `npm install`).

```bash
# Login no Supabase (abre o navegador)
npx supabase login

# Vincula este repo ao seu projeto hospedado
# (project ref aparece em Settings → General → Reference ID)
npx supabase link --project-ref SEU_PROJECT_REF

# Aplica todas as migrations do diretório supabase/migrations/
npm run db:push
```

Pronto — as tabelas `orders`, `site_content` e `encomenda_styles` são criadas com RLS habilitado. A migration vive em [supabase/migrations/20260523000000_init.sql](supabase/migrations/20260523000000_init.sql).

**Storage** (criar manualmente no dashboard — o CLI não cria buckets em projetos hospedados):

Vá em **Storage → New bucket**:
- Name: `lacos`
- Public bucket: **ON**
- File size limit: `5 MB`
- Allowed MIME types: `image/*`

Em **Settings → API**, copie:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **service_role** key (NÃO a anon key) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
# edite .env.local com os valores reais
```

Mínimo necessário:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
SUPABASE_STORAGE_BUCKET=lacos
ADMIN_PASSWORD=sua-senha-do-atelie
ADMIN_SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
```

### 3. Rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) (loja) ou [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (admin).

---

## 🎨 Design System

Todos os tokens estão centralizados em [tailwind.config.ts](tailwind.config.ts) e [app/globals.css](app/globals.css).

### Paleta

| Token            | Hex       | Uso                                              |
| ---------------- | --------- | ------------------------------------------------ |
| `cream` / `cream-100` | `#FAF6F2` | Background principal                       |
| `blush-100..400` | `#F9E7E3` → `#E8B4B8` | Rosa millennial (acentos, fundos suaves) |
| `nude`           | `#F0E0D6` | Nude rosado                                      |
| `bordeaux-500`   | `#8B4B5C` | CTA principal, links, marca                      |
| `champagne-500`  | `#C9A876` | Acentos dourados, ornamentos                     |
| `ink-600`        | `#3D2B2E` | Texto principal (marrom suave, nunca preto puro) |
| `sage-500`       | `#A8B5A0` | Cor complementar (indicadores positivos)         |

### Tipografia (carregadas via `next/font/google`)

- **`font-serif` — Playfair Display** · títulos principais
- **`font-display` — Cormorant Garamond** · destaques em itálico
- **`font-sans` — Inter** · corpo
- **`font-script` — Allura** · citações emocionais e CTAs especiais (usar com moderação)

### Tokens extras

- Sombras suaves e difusas: `shadow-soft`, `shadow-soft-lg`, `shadow-soft-xl`, `shadow-glow`
- Cantos generosos: `rounded-3xl`, `rounded-4xl`, `rounded-5xl`
- Animações on-brand: `animate-fade-up`, `animate-float`, `animate-soft-pulse`, `animate-marquee`
- Easing: `ease-out-expo` para todas as transições — mais sofisticado que `ease-in-out`
- Classes helper: `.container-boutique`, `.eyebrow`, `.divider-ornament`, `.grain`, `.text-balance`

---

## 📁 Estrutura

```
app/
├── layout.tsx          → Root layout + fontes + metadata
├── page.tsx            → Home composta pelas seções
├── globals.css         → Reset + tokens base + utilitários
└── fonts.ts            → Configuração next/font

components/
├── ui/
│   ├── button.tsx      → CVA (primary, secondary, gold, ghost, outline, link)
│   └── badge.tsx       → Disponibilidade (ready, order, scarcity, gold, neutral)
├── icons/
│   └── decorative.tsx  → SVGs delicados: laço, coração, flor, sparkle, divider
├── layout/
│   ├── header.tsx      → Sticky com mobile drawer + announcement bar
│   ├── footer.tsx      → 4 colunas + redes + ornamento
│   └── whatsapp-float.tsx
└── home/
    ├── hero.tsx
    ├── how-it-works.tsx
    ├── featured-products.tsx
    ├── emotional-banner.tsx
    ├── categories.tsx
    ├── testimonials.tsx
    ├── customer-gallery.tsx
    ├── custom-orders.tsx
    └── newsletter.tsx

lib/
├── utils.ts            → cn() + formatPrice()
└── mock-data.ts        → Produtos, categorias, depoimentos, galeria
```

---

## 🧠 Aplicação dos Gatilhos Psicológicos

Onde cada gatilho aparece (mantido com sutileza, nunca agressivo):

| Gatilho | Onde |
| ------- | ---- |
| **Exclusividade** | Hero ("Edição Primavera · peças limitadas"), CustomOrders ("nº 12 de 30"), Badge "Última peça" |
| **Conexão emocional** | Hero ("para a princesa da sua vida"), Banner ("Pequenos gestos. Memórias eternas."), copy em segunda pessoa |
| **Prova social** | Stat flutuante na hero ("+1.200 princesinhas"), Testimonials, Gallery #nossasprincesinhas |
| **Reciprocidade** | Newsletter ("10% off na primeira encomenda") |
| **Ancoragem** | Preço antigo riscado em produtos |
| **Aversão à perda** | Newsletter copy: "Cupom válido por 48h" |

---

## 🖼️ Imagens

As imagens estão mockadas via **Unsplash**, configuradas em [next.config.mjs](next.config.mjs) (`images.unsplash.com` + `plus.unsplash.com`).

**Antes de produção, substitua todas as URLs em [lib/mock-data.ts](lib/mock-data.ts) por fotos próprias** — luz natural, tons pastéis, consistência de filtro. A experiência boutique depende disso.

Recomendação de fluxo:
1. Upload das fotos no Supabase Storage (ou Cloudinary)
2. Substituir as URLs em `mock-data.ts`
3. Adicionar o hostname em `next.config.mjs` se necessário

---

## 🛒 Fluxo de Encomendas (implementado)

Três páginas conectadas que formam a esteira completa de uma encomenda artesanal:

### 1. Cliente → `/encomenda`
Formulário multi-step (6 etapas) que captura: estilo de referência, paleta de cores, materiais, personalização, ocasião, dados da criança, prazo e contato. Ao enviar, gera um pedido (`LL-2026-NNNN`) e mostra o link de acompanhamento.

Componentes: [components/encomenda/form.tsx](components/encomenda/form.tsx) e [components/encomenda/progress.tsx](components/encomenda/progress.tsx).

### 2. Cliente → `/pedido/[id]`
Página privada (no-index) onde a cliente acompanha:
- Header personalizado com o primeiro nome
- Resumo do pedido + barra de progresso
- **Timeline vertical animada** com 4 estágios (Recebido → Em produção → Enviado → Entregue)
- Cada estágio mostra: status, data, descrição, mensagem em script (escrita pela Bruna) e **fotos do processo**
- CTA de WhatsApp direto

Componentes: [components/pedido/timeline.tsx](components/pedido/timeline.tsx).

### 3. Admin → `/admin`
Painel para a Bruna gerenciar a esteira **e** o conteúdo do site, sem precisar acionar programador:

#### Pedidos
- **`/admin/pedidos`** — lista de todos os pedidos com status, progresso e links rápidos
- **`/admin/pedidos/[id]`** — editor completo onde dá para:
  - Avançar etapas (botão "Avançar para próxima etapa" promove a current para completed e ativa a próxima)
  - Editar título e descrição de cada etapa
  - Escrever uma **mensagem em script** que aparece em destaque para a cliente
  - **Upload de fotos do processo** direto do celular (ficam visíveis na hora para a cliente)
  - Notas internas, código de rastreio dos correios, valor total
  - Copiar link de acompanhamento da cliente
  - Excluir pedido

#### Conteúdo do site (`/admin/conteudo`)
A Bruna troca imagens e textos da home **sem precisar de programador**. Editáveis:

- **Hero** (foto principal)
- **Banner emocional** (foto widescreen + legenda em script)
- **Fundadora** (foto + citação)
- **Produtos em destaque** — 6 cards na home: foto, nome, coleção, cor, preço, preço antigo, disponibilidade, badge. Adicionar/remover livremente
- **Categorias** — cards verticais com imagem, nome, descrição, link, reordenáveis
- **Galeria #nossasprincesinhas** — grid com upload em massa e reordenação por foto

Cada slot de imagem aceita **upload direto do dispositivo** (vai para Supabase Storage, salva só a URL) **ou colar URL externa** (qualquer host HTTPS). Tem botão "Restaurar padrão" para reverter ao seed do projeto. Salvar publica imediatamente (`PUT /api/site`).

#### Modelos de encomenda (`/admin/modelos`)
CRUD completo dos modelos que aparecem na **primeira etapa do formulário** de encomenda em `/encomenda`. Adicionar, editar (foto, nome, descrição), remover, restaurar lista padrão. As mudanças refletem na hora no formulário público.

Componentes: [components/admin/content-editor.tsx](components/admin/content-editor.tsx), [components/admin/styles-editor.tsx](components/admin/styles-editor.tsx), [components/admin/image-picker.tsx](components/admin/image-picker.tsx) (reutilizável).

### Persistência — Supabase

Todo o estado vai para o Postgres do Supabase, com fotos em Storage:

| Onde | O que guarda |
| ---- | ------------ |
| `public.orders` | Pedidos completos. JSON aninhado (cliente, peça, etapas) em colunas tipadas. `stages` como `JSONB`. |
| `public.site_content` | Conteúdo da home — uma linha só (`id = 1`) com tudo em `JSONB`. |
| `public.encomenda_styles` | Um row por modelo do formulário de encomenda. |
| Storage `lacos/` | Fotos (hero, banner, fundadora, galeria, produtos, categorias, modelos, **process/{order-id}/...** para fotos do processo). |

**Segurança:**
- RLS habilitado em todas as tabelas, **sem policies permissivas** — nenhum cliente (anon ou authenticated) pode acessar.
- O servidor usa `service_role` (configurado em `SUPABASE_SERVICE_ROLE_KEY`) que bypassa RLS.
- Storage bucket é **público para leitura** (URLs funcionam em `<img>` sem signed URLs) e **escrita só pelo servidor** via service_role.

**Camada de acesso** — três módulos com `import "server-only"` que falham no build se algum client tentar importar:
- [lib/orders.ts](lib/orders.ts) — `listOrders`, `getOrder`, `createOrder`, `updateOrder`, `deleteOrder`
- [lib/site-content.ts](lib/site-content.ts) — `getSiteContent`, `saveSiteContent`, `getDefaultSiteContent`
- [lib/encomenda-styles.ts](lib/encomenda-styles.ts) — `listStyles`, `createStyle`, `updateStyle`, `deleteStyle`, `resetStyles` (com lazy seed dos defaults na primeira leitura)

**Upload de imagens** — [/api/admin/upload](app/api/admin/upload/route.ts) recebe `FormData` com `file` + `prefix` (hero/banner/founder/gallery/products/categories/styles/process), valida tipo e tamanho (6 MB max), envia para Storage e retorna a URL pública. Componentes que usam:
- [ImagePicker](components/admin/image-picker.tsx) — todos os slots de imagem do admin
- Galeria de fotos do processo em [OrderEditor](components/admin/order-editor.tsx) — fotos vão para `process/{order-id}/...`

Pronto para deploy na Vercel — não usa mais filesystem.

### 🛠️ Workflow Supabase CLI

O CLI fica instalado como devDependency. Atalhos no `package.json`:

| Script | Equivalente | Para que serve |
| --- | --- | --- |
| `npm run db:push` | `supabase db push` | Aplica migrations pendentes no projeto vinculado |
| `npm run db:pull` | `supabase db pull` | Importa schema atual do remoto para uma nova migration |
| `npm run db:diff` | `supabase db diff -f nome` | Gera arquivo de migration com as mudanças (precisa Docker para local diff) |
| `npm run db:reset` | `supabase db reset` | **Destrói** dados locais e re-aplica migrations |
| `npm run db:types` | `supabase gen types typescript --linked` | Gera tipos TS do schema → `lib/database.types.ts` |
| `npm run supabase:link` | `supabase link` | Vincula este repo a um projeto Supabase |
| `npm run supabase:start` | `supabase start` | Sobe stack Supabase local (precisa Docker) |
| `npm run supabase:status` | `supabase status` | URLs e chaves da stack local |

**Fluxo típico para mudar o schema:**

1. Edite um arquivo SQL em `supabase/migrations/{timestamp}_descricao.sql` (ou crie via `npx supabase migration new descricao`)
2. Teste no banco local com `npm run db:reset` (precisa Docker)
3. Aplica no remoto: `npm run db:push`
4. Regenera tipos TS: `npm run db:types`

**Estrutura:**
- [supabase/config.toml](supabase/config.toml) — config do CLI (porta local, bucket, etc.)
- [supabase/migrations/](supabase/migrations/) — migrations versionadas (commitadas no git)
- `supabase/.branches/`, `supabase/.temp/`, `supabase/.env` — gerados localmente, ignorados pelo git

### 🔐 Autenticação do admin

Implementação simples baseada em **senha única + cookie HMAC** assinado (sem banco de usuários):

- Tela de login em [/admin/login](app/admin/login/page.tsx)
- Páginas protegidas dentro de `app/admin/(authed)/*` (route group)
- API de auth em [/api/admin/auth](app/api/admin/auth/route.ts) (POST = login, DELETE = logout)
- Cookie `lacos_session` httpOnly + secure (em produção), assinado com HMAC-SHA256, válido por 30 dias
- [middleware.ts](middleware.ts) roda no edge e protege:
  - Todas as rotas `/admin/*` (exceto `/admin/login`) → redireciona para login com `?next=`
  - `/api/orders` GET, `/api/orders/[id]/*`, `/api/site/*`, `/api/encomenda-styles/*` → retorna 401
  - **Exceção**: `POST /api/orders` fica público porque é usado pelo formulário de encomenda da cliente

Configuração via env vars ([.env.example](.env.example)):

```bash
ADMIN_PASSWORD=...          # senha que a Bruna usa
ADMIN_SESSION_SECRET=...    # string aleatória para assinar tokens
```

Sem essas vars o app funciona em dev com a senha `admin` (e imprime warning).

**Para um cenário multi-usuário** (várias artesãs do ateliê), migre para NextAuth/Clerk/Supabase Auth — a estrutura de middleware e route group já está pronta para receber isso.

### Próximos passos sugeridos

1. **Catálogo** (`/colecao`) e **PDP** (`/produto/[slug]`) para os produtos de pronta entrega
2. **Carrinho drawer + Checkout** em etapas (Mercado Pago com Pix)
3. **Conta da cliente** com lista de pedidos
4. **Notificações por email** em cada mudança de etapa (Resend)
5. **Migração para Supabase** (Postgres + Auth + Storage para fotos do processo)

### Stack recomendada para implementação completa

- **Backend & Auth**: Supabase (Postgres + Auth + Storage)
- **Pagamento**: Mercado Pago (Pix nativo + cartão) ou Stripe
- **Estado do carrinho**: Zustand (já incluído no `package.json`)
- **Formulários**: React Hook Form + Zod (já incluídos)
- **Email transacional**: Resend
- **Deploy**: Vercel (após migrar storage para Supabase)

---

## ♿ Acessibilidade

- Contraste mínimo AA respeitado (texto `ink-600` em fundos rosa)
- Estrutura semântica de headings
- `alt` em todas as imagens
- `aria-label` em botões de ícone
- Foco visível com `focus-visible:ring`
- Reduce-motion: respeitado pelo Framer Motion automaticamente

---

## 📱 Responsividade

Mobile-first em todos os componentes. Pontos de atenção já implementados:
- Header com drawer animado
- Hero reordenado em coluna no mobile
- WhatsApp flutuante sempre visível
- Tipografia fluida (`clamp()` nos tamanhos `display-*`)

---

## 🎯 O grande diferencial

A página de **acompanhamento de pedido em tempo real com fotos do processo** é o que vai transformar a espera em antecipação encantada — e gerar conteúdo orgânico para Instagram Stories. Essa página merece atenção especial quando avançarmos para as próximas telas.

---

Feito com 🎀 para princesinhas.

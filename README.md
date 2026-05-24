# Lúa & Lis — Ateliê de Laços

E-commerce premium de laços infantis artesanais. Site construído com Next.js 14, Tailwind CSS e Framer Motion, com estética romântica, sofisticada e mobile-first.

---

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

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

### 3. Admin → `/admin/pedidos`
Painel para a Bruna gerenciar a esteira:

- **`/admin/pedidos`** — lista de todos os pedidos com status, progresso e links rápidos
- **`/admin/novo`** — criar pedido manualmente (quando a venda fecha por WhatsApp/Instagram)
- **`/admin/pedidos/[id]`** — editor completo onde dá para:
  - Avançar etapas (botão "Avançar para próxima etapa" promove a current para completed e ativa a próxima)
  - Editar título e descrição de cada etapa
  - Escrever uma **mensagem em script** que aparece em destaque para a cliente
  - **Upload de fotos do processo** direto do celular (ficam visíveis na hora para a cliente)
  - Notas internas, código de rastreio dos correios, valor total
  - Copiar link de acompanhamento da cliente
  - Excluir pedido

### Persistência

Os pedidos ficam em **`data/orders.json`** (ignorado pelo git). Funciona em dev e em qualquer host Node persistente.

⚠️ **Não vai para Vercel sem ajuste** — o filesystem da Vercel é read-only entre requisições. Antes do deploy, troque [lib/orders.ts](lib/orders.ts) por Supabase mantendo a mesma assinatura (`listOrders`, `getOrder`, `createOrder`, `updateOrder`, `deleteOrder`). As API routes e a UI não precisam mudar.

⚠️ **Admin sem autenticação** — `/admin/*` está aberto. Antes de publicar:
- Adicionar middleware com NextAuth/Clerk/Supabase Auth
- Restringir acesso aos emails autorizados

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

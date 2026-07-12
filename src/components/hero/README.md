# HeroSection — Kariri Valley

Componente Hero principal da Home do site Kariri Valley.

## Localização

```
src/
└── components/
    └── hero/
        └── HeroSection.tsx
```

## Uso

```tsx
import HeroSection from "@/components/hero/HeroSection";

// Uso com defaults (recomendado para o MVP)
<HeroSection />

// Uso com props customizadas
<HeroSection
  badgeText="Comunidade de inovação do Cariri"
  headline="O mapa vivo da inovação no Cariri."
  subheadline="Conectamos startups, talentos..."
  primaryCTA={{ label: "Entrar para a comunidade", href: "/como-participar" }}
  secondaryCTA={{ label: "Conhecer membros", href: "/membros" }}
  metrics={myMetrics}
  communityCards={myCards}
/>
```

## Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `badgeText` | `string` | `"Comunidade de inovação do Cariri"` | Texto do badge superior |
| `headline` | `string` | `"O mapa vivo da inovação no Cariri."` | Título principal (h1) |
| `subheadline` | `string` | Texto completo | Subtítulo descritivo |
| `primaryCTA` | `{ label: string; href: string }` | `{ label: "Entrar para a comunidade", href: "/como-participar" }` | Botão CTA principal |
| `secondaryCTA` | `{ label: string; href: string }` | `{ label: "Conhecer membros", href: "/membros" }` | Botão CTA secundário |
| `metrics` | `HeroMetric[]` | 4 métricas padrão | Indicadores do ecossistema |
| `communityCards` | `HeroCommunityCard[]` | 6 cards padrão | Cards de membros no visual lateral |

## Estrutura interna

```
HeroSection
├── Background (ChapatiShape, NetworkLines, gradientes)
├── Left Column
│   ├── Badge (com pulse dot animado)
│   ├── Headline (h1 com shimmer gradient)
│   ├── Subheadline
│   ├── CTAs (primário dourado + secundário outline)
│   ├── Ecosystem Tags (grid de pills)
│   └── Metrics (2x2 grid de cards)
└── Right Column (hidden em mobile)
    ├── Central KV Logo Mark
    ├── Pulse Rings (animados)
    ├── NetworkLines SVG
    ├── CommunityMemberCards (6, flutuantes)
    └── Floating Status Badge
```

## Critérios de aceite ✅

- [x] Transmite claramente o propósito da Kariri Valley
- [x] CTA principal visível e forte
- [x] Layout responsivo (mobile: coluna única, desktop: 2 colunas)
- [x] Visual moderno, regional e tecnológico
- [x] Componente isolado e reutilizável
- [x] Sem exposição de dados falsos como definitivos (usa "Em breve", "em mapeamento", etc.)
- [x] Incentiva o visitante a se cadastrar

## Paleta de cores (Design System)

| Token | Valor | Uso |
|-------|-------|-----|
| `--kv-bg` | `#2C2221` | Fundo principal |
| `--kv-gold` | `#E9B23C` | CTA primário, destaques |
| `--kv-teal` | `#239D8C` | Acento, avatar, dot |
| `--kv-coral` | `#E0715A` | Detalhe, setas logo |
| `--kv-cream` | `#F4EDDF` | Texto principal |

## Animações disponíveis (via globals.css)

- `.kv-float` — flutua suavemente para cima
- `.kv-float-reverse` — flutua suavemente para baixo
- `.kv-pulse-ring` — anel pulsante expandindo
- `.kv-ping` — dot piscando (estilo Tailwind ping)
- `.kv-fade-in-up` — fade + slide up ao montar
- `.kv-shimmer-text` — gradiente animado no texto

## Para dados reais (pós-MVP)

Substituir os `DEFAULT_METRICS` e `DEFAULT_COMMUNITY_CARDS` com dados vindos da API:

```tsx
// Exemplo
const { data: metrics } = useQuery(["metrics"], fetchEcosystemMetrics);
<HeroSection metrics={metrics} />
```

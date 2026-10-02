# Kariri Valley — Sistema editorial "Imprensa do Vale"

Direção visual única do projeto. Todo trabalho de interface segue estas regras — não invente padrões fora delas.

## Conceito

O site é uma **publicação impressa viva** do ecossistema do Cariri: papel, tinta, linhas, tipografia como interface e fotografias reais em cor. A ideia central — *sertão × tecnologia* — é comunicada pela hero de pixels e chapada, jornadas ilustradas, colagens orgânicas, fotografias e o diamante. O refinamento conserva esses assets e a sequência original, fundindo-os com os textos comunitários e registros reais.

## Princípios (em ordem de prioridade)

1. **Propósito por seção.** Cada seção existe por um motivo único e tem um arquétipo próprio. Se duas seções dizem a mesma coisa, funda ou corte. Nunca componha duas seções seguidas com o mesmo arquétipo.
2. **Pessoas como evidência.** Fotografias reais de encontros em cor têm protagonismo; títulos e legendas ajudam a entender o movimento. Números, nomes e empresas precisam de fonte real.
3. **Ritmo.** Alterne arquétipos: banda full-bleed → split assimétrico foto+texto → lista-índice → banda de números → ticker. Monotonia é bug.
4. **Cor com função.** Verde-mata = ação/estrutura · mostarda = destaque · terracota = oportunidades · turquesa = agenda/comunidade. Cor não preenche superfícies grandes (exceção: bandas declaradas — footer, CTA final).
5. **Hairline estrutura.** Separação é linha de 1px, não sombra. Sombras duras só no hover/press (`--shadow-nb-press`).

## Tokens (`src/app/globals.css`)

Paleta base: `--nb-sand` (papel), `--nb-ink` (tinta), `--nb-forest`, `--nb-mustard`, `--nb-terracotta`, `--nb-turquoise`, `--nb-cream`, `--nb-sand-2`.

Camada semântica (consumir estas, não as brutas, em componentes): `--nb-page-bg`, `--nb-heading`, `--nb-body`, `--nb-body-strong`, `--nb-line` (hairline forte), `--nb-line-soft` (hairline suave), `--nb-card-*` (bg/border/radius/divider), `--nb-btn-*`, `--nb-label-accent`, `--nb-dot` (trama halftone). Tema claro único; componentes consomem os tokens sem ramificações de tema em JavaScript.

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | **Fraunces** (`.kv-display`, `font-display`) | Títulos gigantes; palavras-chave em *itálico* |
| Estrutural | **Space Grotesk** (`font-geo`) | Nav, botões, subtítulos, corpo de UI |
| Metadado | **Space Mono** (`.kv-kicker`, `.kv-meta`, `.kv-index-num`) | Kickers, datas, números, tags, legendas — sempre caixa-alta, tracking largo |

Regras: kicker mono + hairline abrem toda seção · títulos em sentence case (não CAIXA ALTA) · números tabulares (`.kv-index-num`).

## Componentes e utilitários

- `src/components/ui/editorial.tsx` — `SectionIndex` (número + kicker + título + hairline), `Ticker`, `PhotoFrame` (foto `.kv-photo` + legenda mono), `DiamondMark`, `MetaDot` (ponto ◆ de cor com função).
- Botões públicos: EditorialButton, verde-mata ou ghost de linha suave, Space Grotesk em sentence case, cantos retos com raio de 2px, preservando os CTAs originais. Controles principais com pelo menos 44px de altura.
- Superfícies: fundo semântico de papel + linha suave, raios contidos de 4–20px. Sombra só quando explica a sobreposição de fotografias; sem glass/blur.
- Fotos de pessoas: cor natural e proporção preservada, com dimensões e sizes definidos. `.kv-photo`/PhotoFrame continuam disponíveis para tratamentos gráficos pontuais, sem obrigatoriedade sobre fotos de grupo.

## Assets (`public/media/`)

- `gallery/` — os 45 registros importados de Photos-1-001, com 7 favoritos; WebP principal e thumbnail. Manifesto em src/lib/gallery.ts, gerado por scripts/import-gallery.mjs.
- DESIGN.md registra a preferência aprovada: fusão dos textos comunitários e fotos reais com a riqueza ilustrada da base, mantendo os assets, paleta, tipografia e arquétipos existentes.

- `halftone-*.{jpg,avif}` — imagens meio-tom (assinatura gráfica; placeholders do NewLab serão substituídos).
- `comunidade-1..7` — fotos reais de eventos (hero, sobre, seções "quem faz").
- `logo-anim.mp4` — animação do logo (momento de marca; use `prefers-reduced-motion`).

## Movimento

Reveals de linha (`.kv-line-up`), ticker (`.kv-ticker`, máscara nas bordas), press físico no hover (`--shadow-nb-press`). Decorativo animado nunca sem fallback em `prefers-reduced-motion`. A hero original mantém o PixelField e a textura de vídeo; seu controle Pausar/Retomar também pausa o ticker. Sem acrescentar aurora/glow/partículas.

## Áreas fora do site público

- **Área do membro** e **auth/onboarding**: mesma fundação em tema claro (tokens `--nb-*`). Proibido hex hardcoded (`#2C2221` etc.).
- **Admin**: estrutura shadcn mantida; re-skin leve com hairlines + kickers mono + cores da marca.

### Preferência confirmada — outubro de 2026

O site mantém somente o tema claro, sem seletor nem preferência persistida. O header volta à marca textual “Kariri Valley” em Fraunces, 22px, peso 700, conforme a composição original. Botões públicos usam cantos de 2px.

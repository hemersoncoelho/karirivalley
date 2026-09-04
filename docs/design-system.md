# Kariri Valley — Sistema editorial "Imprensa do Vale"

Direção visual única do projeto. Todo trabalho de interface segue estas regras — não invente padrões fora delas.

## Conceito

O site é uma **publicação impressa viva** do ecossistema do Cariri: papel, tinta, hairlines, tipografia como interface e fotografia tratada em meio-tom (halftone). A ideia central — *sertão × tecnologia* — é comunicada por elementos visuais (trama de pontos, fotos reais, números, o diamante), não por blocos de texto.

## Princípios (em ordem de prioridade)

1. **Propósito por seção.** Cada seção existe por um motivo único e tem um arquétipo próprio. Se duas seções dizem a mesma coisa, funda ou corte. Nunca componha duas seções seguidas com o mesmo arquétipo.
2. **Elemento visual > texto.** A ideia passa por foto halftone, número gigante, hairline, diamante ou ícone — a legenda (mono, curta) complementa, nunca explica em parágrafo.
3. **Ritmo.** Alterne arquétipos: banda full-bleed → split assimétrico foto+texto → lista-índice → banda de números → ticker. Monotonia é bug.
4. **Cor com função.** Verde-mata = ação/estrutura · mostarda = destaque · terracota = oportunidades · turquesa = agenda/comunidade. Cor não preenche superfícies grandes (exceção: bandas declaradas — footer, CTA final).
5. **Hairline estrutura.** Separação é linha de 1px, não sombra. Sombras duras só no hover/press (`--shadow-nb-press`).

## Tokens (`src/app/globals.css`)

Paleta base: `--nb-sand` (papel), `--nb-ink` (tinta), `--nb-forest`, `--nb-mustard`, `--nb-terracotta`, `--nb-turquoise`, `--nb-cream`, `--nb-sand-2`.

Camada semântica (consumir estas, não as brutas, em componentes): `--nb-page-bg`, `--nb-heading`, `--nb-body`, `--nb-body-strong`, `--nb-line` (hairline forte), `--nb-line-soft` (hairline suave), `--nb-card-*` (bg/border/radius/divider), `--nb-btn-*`, `--nb-label-accent`, `--nb-dot` (trama halftone). Tema escuro = impressão noturna, via `[data-nb-theme="dark"]` — nunca faça branch de cor em JS (`isDark ? x : y` é dívida).

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | **Fraunces** (`.kv-display`, `font-display`) | Títulos gigantes; palavras-chave em *itálico* |
| Estrutural | **Space Grotesk** (`font-geo`) | Nav, botões, subtítulos, corpo de UI |
| Metadado | **Space Mono** (`.kv-kicker`, `.kv-meta`, `.kv-index-num`) | Kickers, datas, números, tags, legendas — sempre caixa-alta, tracking largo |

Regras: kicker mono + hairline abrem toda seção · títulos em sentence case (não CAIXA ALTA) · números tabulares (`.kv-index-num`).

## Componentes e utilitários

- `src/components/ui/editorial.tsx` — `SectionIndex` (número + kicker + título + hairline), `Ticker`, `PhotoFrame` (foto `.kv-photo` + legenda mono), `DiamondMark`, `MetaDot` (ponto ◆ de cor com função).
- Buttons: primário = fundo sólido verde-mata sem borda visível; ghost = hairline 1px; caixa-alta Space Grotesk; raio 2px.
- Cards: fundo transparente/papel + hairline 1px + raio 2px. Nada de glass/blur.
- Fotos: sempre dentro de `.kv-photo` (P&B + trama de pontos) com legenda `.kv-meta`; use `PhotoFrame`.

## Assets (`public/media/`)

- `halftone-*.{jpg,avif}` — imagens meio-tom (assinatura gráfica; placeholders do NewLab serão substituídos).
- `comunidade-1..7` — fotos reais de eventos (hero, sobre, seções "quem faz").
- `logo-anim.mp4` — animação do logo (momento de marca; use `prefers-reduced-motion`).

## Movimento

Reveals de linha (`.kv-line-up`), ticker (`.kv-ticker`, máscara nas bordas), press físico no hover (`--shadow-nb-press`). Decorativo animado nunca sem fallback em `prefers-reduced-motion`. Sem aurora/glow/partículas.

## Áreas fora do site público

- **Área do membro** e **auth/onboarding**: mesma fundação em pele noturna (tokens `--nb-*` escuros). Proibido hex hardcoded (`#2C2221` etc.).
- **Admin**: estrutura shadcn mantida; re-skin leve com hairlines + kickers mono + cores da marca.

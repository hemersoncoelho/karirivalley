---
version: alpha
name: "Kariri Valley"
description: "Uma comunidade de inovação do Cariri, contada pelas pessoas e pelos encontros que a constroem."
colors:
  primary: "#1E4D3A"
  background: "#F4EEE1"
  surface: "#FBF8EF"
  ink: "#16140F"
  mustard: "#E9B23C"
  terracotta: "#C25A2E"
  turquoise: "#239D8C"
  community: "#196E60"
  community-surface: "#E8EBDD"
  opportunity-text: "#9B4220"
typography:
  sans:
    fontFamily: "Inter, Arial, sans-serif"
  display:
    fontFamily: "Fraunces, Georgia, serif"
  structural:
    fontFamily: "Space Grotesk, Arial, sans-serif"
  mono:
    fontFamily: "Space Mono, ui-monospace, monospace"
rounded:
  DEFAULT: "12px"
  sm: "4px"
  md: "8px"
  lg: "20px"
  action: "2px"
spacing:
  section-gap: "96px"
  section-gap-mobile: "60px"
  page-max: "1172px"
components:
  button: {}
  navigation: {}
  photograph: {}
  gallery-dialog: {}
---

# Kariri Valley Design System

## Overview

### Creative North Star

Preservar a publicação ilustrada original do Cariri: hero central com campo de pixels e chapada, jornadas desenhadas, colagens orgânicas, paisagens e faixas editoriais. Fundir essa riqueza visual com fotografias reais e os textos comunitários revisados. O pedido do responsável é refinamento e fusão; não substituir a base por uma landing page mais simples.

### Product context and register

- Audience and primary job: quem vive, cria, pesquisa, empreende ou quer colaborar no Cariri; entender o movimento e encontrar como participar.
- Target market and evidence: Cariri, Ceará, Brasil; pedido do responsável pelo site, texto histórico fornecido e registros fotográficos em Photos-1-001.
- Locale and language policy: pt-BR, tom humano e direto; datas de encontros em America/Fortaleza, datas de fotografias como datas civis sem deslocamento de fuso.
- Usage scene: visita pelo celular, descoberta da comunidade, agenda e memória dos encontros; leitura acessível também no desktop.
- Register: site público de comunidade nas rotas /, /sobre, /galeria, /como-participar, /membros, /agenda e /oportunidades/publicas. Área autenticada/admin mantém seus contratos existentes.
- Memorable signature: sertão × tecnologia na hero de pixels e paisagem, nas jornadas ilustradas e nas fotografias sobrepostas da comunidade.
- Restraint: preservar os assets e arquétipos originais. Movimento da hero pode ser pausado; reduced-motion mantém a composição estática. Não remover seções ilustradas para simplificar o visual.
- Anti-references: catálogo corporativo com métricas fictícias, perfis de demonstração apresentados como reais, fotos tratadas a ponto de esconder rostos e texto que reduz a comunidade a uma plataforma.
- Token ownership/runtime mapping: modelo B; src/app/globals.css é a fonte de valores. Este documento espelha os valores e a intenção, sem gerar outro sistema. home.module.css e gallery.module.css consomem os tokens semânticos. docs/design-system.md registra os componentes herdados.

## Colors

Papel claro, tinta, verde da região e detalhes em mostarda, terracota e turquesa da marca. Fotografias mantêm cor natural. Fundo e texto usam --nb-page-bg, --nb-card-bg, --nb-heading, --nb-body e --nb-body-strong no tema claro único. Preferências antigas de modo escuro são ignoradas.

| Papel | Token neste documento | Runtime | Consumidores |
|---|---|---|---|
| Ação principal | colors.primary | --nb-forest → --nb-btn-primary-bg | EditorialButton e navegação |
| Papel | colors.background | --nb-sand → --nb-page-bg | Páginas públicas |
| Superfície | colors.surface | --nb-cream → --nb-card-bg | Fotos, estado vazio, botões |
| Texto | colors.ink | --nb-ink → --nb-heading | Títulos e links |
| Destaque | colors.mustard | --nb-mustard | Marca e convite final |
| Oportunidades | colors.terracotta | --nb-terracotta | Chamadas e detalhes |
| Comunidade | colors.community | --nb-community-accent | Links, ícones e foco no tema claro |
| Fundo comunitário | colors.community-surface | --nb-community-surface | Seção de participação |

Linhas suaves organizam o conteúdo. Scrollbars usam --nb-scrollbar-thumb/track/hover/active em todos os elementos; forced-colors retorna ao sistema. O foco usa outline visível de 3px, com espaçamento de 4px.

## Typography

Fraunces nos títulos e nos pequenos registros de álbum; Inter no corpo, Space Grotesk nas ações e títulos menores, Space Mono nas datas e rótulos. Itálico destaca uma ideia, com uso contido. O corpo público usa 14–18px, entrelinha 1.7–1.8 e largura de leitura controlada. Títulos se recompõem por clamp e text-wrap: balance. Rótulos curtos ficam em caixa alta; parágrafos e ações usam sentence case.

## Layout

Homepage com contêiner de 1300px e área útil de 1172px no desktop, margens de 24px no celular. Manter a sequência original: hero, ecossistema/jornada, públicos, benefícios/trilha, agenda, oportunidades, rostos, construção coletiva e marcos; a galeria complementa essa base. Seções de aproximadamente 96px desktop/60px mobile; demais páginas seguem o contêiner existente de 1300px. Colunas de texto e imagem se empilham abaixo de 768px; a navegação desktop aparece a partir de 1024px. O menu em telas menores tem altura limitada e rolagem própria. A galeria preserva a proporção de cada fotografia; um documento rolável mostra todos os registros e filtros por ano.

Reservar proporção/dimensões de imagens antes do carregamento. Evitar cortes de pessoas; fotos de grupo usam proporção original. A grade de oportunidades recompõe tipo, título, prazo e seta em linhas no celular. Não esconder ações, texto ou scrollbars para obter encaixe.

## Elevation & Depth

Linhas e fundos organizam as seções. Sombras discretas das composições e cards originais; a foto sobreposta tem função de álbum. Preservar a profundidade original sem acrescentar glassmorphism. O diálogo de fotografia usa backdrop escuro e ocupa a camada superior nativa do navegador.

## Shapes

Fotos e superfícies têm raios de 4–20px, com formas orgânicas nas colagens e recortes ilustrados originais. Fotos de grupo ficam inteiras dentro das molduras. Botões públicos mantêm cantos retos com raio de 2px, conforme a preferência do responsável e os CTAs originais. O símbolo da marca permanece geométrico; ícones de interface não substituem texto.

## Components

### Foundational visual states

Ações usam link ou botão nativo. Hover altera contraste ou borda, foco é sempre visível, active tem feedback curto. Estados de filtro usam aria-pressed e texto. Estados vazios não afirmam números inexistentes. Falha de agenda/oportunidades mantém a página com mensagem e tentativa de recuperação.

### Buttons and actions

EditorialButton é o componente canônico público. Ação dominante: Fazer parte; caminhos secundários: história, galeria e login. Cantos de 2px, altura mínima de 44px para controles principais e 52px no hero. Botões do diálogo têm nomes acessíveis. Evitar animações espaciais quando reduced-motion estiver ativo.

### Navigation and data display

Navbar usa “Kariri Valley” em Fraunces 22px, peso 700, como no header original. Footer mantém a marca oficial. O site oferece somente o tema claro, sem seletor de tema; Agenda e Galeria sempre alcançáveis. Rotas públicas de oportunidades mantêm a navegação pública. Diretório de pessoas continua protegido para membros aprovados; o site explica essa condição antes da inscrição. Skip link aponta para conteudo nas páginas públicas.

### Forms and overlays

O cadastro existente e a aprovação manual permanecem. A página de participação explica o processo real, sem prometer senha dispensável ou prazo garantido. GalleryArchive usa dialog.showModal: fundo inerte, foco contido, Escape, retorno ao botão de origem e navegação por setas. Fotografias com falha oferecem abrir a imagem separadamente.

### Iconography

Lucide, traço contido de 1.5–2px, 16–28px; ícones decorativos com aria-hidden. Símbolo KaririMark e /logo-element-b.png preservam a identidade existente.

### Motion

Feedback de hover entre 150–350ms. A hero mantém o PixelField, o vídeo da marca como textura e o ticker originais, com controle Pausar/Retomar animação. Reduced-motion pausa o canvas e o vídeo, elimina movimento decorativo e scroll suave. O conteúdo deve ser visível sem depender de reveal.

### Content and data visualization

Falar de pessoas, encontros, ideias e contribuição. Nomes e números só vêm de dados reais; as 45 fotografias e 7 destaques são contagens do manifesto gerado. História segue o texto revisado pelo responsável: 2016, 2017, 2018, 2019, 2020, 2022, 2023 até o momento. Não inventar nomes de eventos a partir de filenames; alt descreve o que se vê.

## Do's and Don'ts

- Do: mostrar pessoas reais, encontros e contribuição concreta.
- Do: manter a mesma navegação, foco, vocabulário e hierarquia nas páginas públicas.
- Don't: publicar perfis, empresas ou métricas de demonstração como evidência da comunidade.
- Don't: aplicar meio-tom a ponto de esconder pessoas ou carregar originais enormes na galeria.
- Don't: remover a jornada, as paisagens, as colagens e a trilha ilustrada quando o pedido for refinamento.
- Do: manter os textos novos aprovados pelo responsável e fundi-los com a riqueza visual existente.

### Ajustes visuais confirmados

A base geométrica da hero continua até as bordas por repetição da faixa original. Cantos inferiores em verde-mata com presença forte; a paisagem central mantém seu tamanho e tem transparência gradual nas extremidades. As duas fotos do ecossistema usam moldura retangular bege com linha tracejada terracota, inspirada na trilha ilustrada. Fotos dos cards de públicos ficam em cor natural, sem filtros ou trama, preenchendo a área em proporção 2:1 com recorte ajustado para preservar rostos.

Nos sete cards de Muitas vozes e Rostos do vale, a moldura envolve o card inteiro: fundo bege contínuo entre foto e texto, borda tracejada terracota ao redor de todo o conteúdo. Sem moldura duplicada na foto; rostos preservados por ajustes de recorte.

### Ilustrações das quatro hélices

A seção Diferentes caminhos usa quatro ilustrações próprias, geradas com imagegen, em public/media/quadrupla-helice/: setor-publico.png, setor-privado.png, academia.png e sociedade.png. Série de colagens em papel, pessoas brasileiras, chapada, vegetação regional e paleta da marca; cada cena expressa o papel do respectivo ator. Transparência preservada e entrega responsiva por next/image, sem filtros. São ilustrações simbólicas, não fotografias documentais da comunidade. Prompts registrados em .design/illustration-prompts.json.

A prévia da galeria na home usa duas colunas independentes com 20px entre fotos, respeitando as proporções originais. Não usar linhas de grade compartilhadas nem margens alternadas, que geram vazios sob fotografias mais baixas. No mobile, uma coluna com intervalo de 16px.

Header público compacto com altura mínima de 56px, preservando controles de 44px. Navegação inclui Início no desktop e no menu mobile, além do retorno à home pela marca textual. Altura da hero e limite do menu acompanham esse header.

O pequeno ornamento geométrico da hero é SVG nativo, com os três losangos, chevrons e raios nas cores da marca. Um pulso discreto percorre os centros turquesa e os raios dourados a cada oito segundos. Respeitar a pausa da hero e a preferência por movimento reduzido; manter estáticos os demais contornos.

Na home, Próximos encontros e O que está aberto agora só aparecem quando a consulta está disponível e existem registros. Sem dados ou com indisponibilidade temporária, ocultar a seção inteira, incluindo título, link e espaçamento.

A transição dentro de Benefícios usa uma faixa em --nb-community-surface para O que sustenta o vale, com borda superior fina e respiro próprio. A colagem de pessoas pertence apenas ao bloco O que a gente faz circular, sem avançar sobre as cinco paradas ilustradas. Preservar o conteúdo e a trilha pontilhada.

A faixa animada de palavras da comunidade fica depois da galeria, antes do convite final; não pertence à hero. Não tem botão de pausa: ocupa toda a largura, mantém a altura de 60px e pausa ao receber hover ou foco pelo teclado. A paisagem termina na base da hero, que mantém seu controle de pausa próprio.

Os cards de Muitas vozes, Rostos do vale e Diferentes caminhos compartilham .framedCard em fusion.module.css: fundo, raio, sombra e contorno tracejado têm uma única definição. Os valores podem ser refinados diretamente nessa regra; evitar sobreposições inline nos componentes.

Movimento público: manter todas as seções visíveis durante a rolagem, sem efeitos de entrada ou saída. Hovers discretos nos cards (elevação de 3px, zoom de 1,8% nas fotos), botões (2px) e setas (3px), com tempos de 220–760ms e desaceleração suave. Hovers com movimento só em dispositivos com ponteiro preciso; preferência por movimento reduzido desativa deslocamentos. Variáveis e transições de controles ficam em src/app/motion.css; cards e fotos nos módulos compartilhados. O menu usa transição curta de abertura/fechamento, mantendo o comportamento nativo de hidden e foco.

Apenas a hero tem animação de abertura: ornamento, identificação, título, descrição e botões aparecem em uma sequência de até 900ms, com deslocamento de 8px e opacidade suave. Acontece uma vez ao abrir a página, sem gatilho de rolagem. Movimento reduzido mantém tudo visível desde o início; foco nos botões encerra sua entrada imediatamente.

O campo de pixels participa da abertura: cada ponto ganha opacidade durante 800ms, com intervalos de até 180ms distribuídos pela trama. O tempo começa no primeiro quadro do canvas, evitando uma entrada brusca depois da hidratação. Redimensionar, pausar e retomar não repetem a abertura concluída; movimento reduzido mostra a trama estática imediatamente.

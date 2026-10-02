# Verificação do site público — 01/10/2026

## Escopo

Homepage, história, galeria, participação, apresentação das pessoas, agenda e oportunidades públicas. Também foram revisadas a navegação pública, as páginas de autenticação em telas pequenas e as respostas de erro/404. A identidade visual prioriza pessoas e fotografias reais da comunidade.

## Conteúdo e imagens

- As 45 fotografias de `Photos-1-001` constam no manifesto; nenhuma ficou de fora. Os 7 arquivos com `_fav` são os destaques.
- Foram gerados 90 WebPs: uma imagem de até 2000 px e uma miniatura de até 720 px para cada original. Os arquivos de origem permanecem intactos.
- Todas as fotos têm descrição alternativa; as datas vêm do nome do arquivo ou do EXIF. Não foram atribuídos eventos sem evidência na imagem.
- História com os períodos 2016, 2017, 2018, 2019, 2020, 2022 e 2023 até o momento, conforme o texto fornecido pelo responsável.
- Métricas, pessoas e empresas de demonstração foram retiradas da homepage.

## Verificação funcional e visual

- Layouts públicos verificados no navegador em 320 e 390 px e na largura desktop. Sem rolagem horizontal nas páginas verificadas.
- Fotos de grupo preservam a proporção; textos, navegação e linha do tempo se recompõem no celular.
- Temas claro/escuro, menu móvel, fechamento por Escape, retorno de foco e navegação entre rotas verificados.
- Galeria: 45 registros, filtro com 7 destaques e filtro de 2023 com 21 registros. Ampliação, setas, Escape, ciclo de foco e retorno ao registro de origem verificados.
- Falha de imagem e recuperação da galeria verificadas; o arquivo usado para simular a falha foi restaurado.
- Agenda e oportunidades preservam a navegação e oferecem recuperação em falha de serviço. Falha é distinta de lista vazia.
- Cadastro sem configuração do Supabase exibe um estado recuperável, com nova tentativa e caminhos para início/galeria.
- Regressões da retomada do cadastro verificadas em código: sem sessão retorna à etapa 1; sessão sem registro de membro retorna à etapa 2; rascunho de outra conta não fornece dados ao novo cadastro, inclusive após recarregamento ou confirmação de e-mail em outra aba.
- CSS respeita `prefers-reduced-motion`; foco visível, link para pular ao conteúdo e controles principais de pelo menos 44 px.

## Checks

- `npm run lint`: passou.
- `npx tsc --noEmit --incremental false`: passou.
- `npm run build`: passou, com compilação e geração das páginas de produção.
- `git diff --check`: passou.
- Lint de `DESIGN.md`: zero erros; avisos de tokens sem referência estrutural, cujo mapeamento para CSS está documentado no arquivo.

O resultado do audit estático está em `launch-static-audit.json`. Ele aponta contratos de componentes e controles antigos da área autenticada/admin que não pertencem à reformulação do site público. Não representa certificação completa dessa área.

## Configuração antes da publicação

Este checkout não tem `.env` com a configuração do Supabase. O cadastro completo, o login e a leitura de eventos/oportunidades reais ainda precisam de validação em ambiente configurado. As respostas de indisponibilidade foram verificadas localmente.

Os links do cadastro para `/termos` e `/privacidade` não têm páginas no projeto. São necessários os textos ou links aprovados pelo responsável; a solicitação foi enviada durante a revisão. Nenhuma conta foi criada e nenhuma publicação foi realizada nesta revisão.

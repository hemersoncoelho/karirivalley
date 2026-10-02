# Verificação da fusão e preferências visuais

- Preservadas as composições originais: hero com pixels e chapada, jornada ilustrada, colagens, trilha de benefícios, paisagens e faixas editoriais. Textos comunitários e fotos reais incorporados.
- Header restaurado para Kariri Valley em Fraunces, 22px, peso 700, sem imagem de logo.
- Botões públicos com cantos de 2px. Tema claro único; seletor, provider, hook e script de preferência antiga removidos.
- Prévia http://127.0.0.1:3001/ verificada no navegador: marca textual, nenhuma imagem no header e nenhum seletor de tema.
- Desktop e mobile 390px conferidos visualmente; largura 320px sem rolagem horizontal. Menu mobile abre e fecha com Escape.
- npm run lint: aprovado. TypeScript sem emissão: aprovado. npm run build: aprovado, 34 páginas geradas. git diff --check: aprovado.
- Evidência visual: header-claro.jpg.
- Integrações de agenda e oportunidades continuam dependendo da configuração Supabase; fallback de indisponibilidade mantido.

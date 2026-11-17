# Herança Digital · Protótipo

Protótipo navegável de alta fidelidade do projeto **Herança Digital** (trabalho de faculdade — UC HUB).
Site estático, sem dependência do claude.ai. Publicado via **GitHub Pages** (branch `main`, pasta `/docs`).

> _"SEUS DADOS, SUA HISTÓRIA, SEU FUTURO."_

Todos os dados exibidos são fictícios (Maria Souza, Lucas etc.).

## Estrutura

```
docs/
  index.html      → página inicial com grade de miniaturas (6 grupos)
  estilo.css      → tema teal + Montserrat, compartilhado por todas as telas
  telas/<Nome>.html → uma página por tela (29 telas)
  assets/<Nome>.png → imagem de cada tela
```

Grupos: **Entrada · Titular · Herdeiro · Validador/Advogado · Segurança · Celular.**
As telas de celular são exibidas em moldura de ~390 px.

## Como atualizar uma tela

1. Substitua a imagem em `docs/assets/<Nome>.png` (mesmo nome de arquivo).
2. Se mudar o título ou o fluxo de uma tela, edite o mapa `S` em `tools/gen.mjs` e rode:
   ```bash
   node tools/gen.mjs
   ```
   Isso regera `index.html` e todas as páginas em `docs/telas/`.
3. Commit e push:
   ```bash
   git add -A && git commit -m "Atualiza tela X" && git push
   ```
   O GitHub Pages republica sozinho em ~1 min.

## Observação sobre fidelidade

O export original do Claude Design (arquivos `.dc.html` + `canvas.json` + `support.js`) **não estava
disponível** na máquina — apenas as imagens renderizadas de cada tela. Por isso o protótipo usa as
imagens, e a navegação entre telas é reconstruída pelos botões **"Fluxo sugerido"** no rodapé de cada
tela (além de ← Anterior / Próxima → e setas do teclado). Conteúdo, textos e dados não foram alterados.
Tela ausente no export: **Mobile-Login**.

# Herança Digital · Protótipo

Protótipo navegável de alta fidelidade do projeto **Herança Digital** (trabalho de faculdade — UC HUB).
Site estático, **independente do claude.ai**. Publicado via **GitHub Pages** (branch `main`, pasta `/docs`).

> _"SEUS DADOS, SUA HISTÓRIA, SEU FUTURO."_

Todos os dados exibidos são fictícios (Maria Souza, Lucas etc.).

## O que é

Cada uma das **30 telas** abre **ao vivo** (HTML real renderizado, não imagem), com os mesmos botões,
fontes e **animações** do protótipo original do Claude Design, e **transições (cross-fade) entre as telas**.
As telas de celular aparecem dentro de uma **moldura de aparelho** (390 px). Há uma pílula de navegação
flutuante (Índice · ‹ anterior · próxima ›) e atalhos de teclado (← → e Esc).

## Estrutura

```
docs/
  index.html        → capa com a grade de telas (6 grupos)
  estilo.css        → estilo da capa
  dc-runtime.js     → runtime do Claude Design que renderiza cada tela (.dc.html)
  transicao.css/js  → transições entre telas, moldura de celular e navegação
  telas/<Nome>.html → as 30 telas (geradas a partir dos .dc.html originais)
  assets/           → imagens das telas (miniaturas) e logotipos
```

Grupos: **Entrada · Titular · Herdeiro · Validador/Advogado · Segurança · Celular.**

## Como atualizar

As telas em `docs/telas/*.html` são **geradas** a partir dos arquivos-fonte `.dc.html` do Claude Design.
O gerador (`tools/gen.mjs`) faz 3 coisas em cada tela: troca `support.js` pelo `dc-runtime.js`, troca as
imagens `/_blob/...` pelas de `assets/`, e reescreve os links `.dc.html` → `.html`.

Para atualizar uma tela:

1. Exporte de novo o `.dc.html` da tela e coloque na pasta de origem que o gerador lê.
2. Rode o gerador:
   ```bash
   node tools/gen.mjs
   ```
3. Commit e push:
   ```bash
   git add -A && git commit -m "Atualiza tela X" && git push
   ```
   O GitHub Pages republica sozinho em ~1 min.

> Para trocar só a **miniatura** de uma tela na capa, substitua `docs/assets/<Nome>.png`.

## Observações de fidelidade

- As telas são os arquivos-fonte originais renderizados pelo próprio runtime do Claude Design — portanto
  fiéis ao original, incluindo animações de entrada e microinterações.
- A navegação segue os **links reais** do protótipo (`<a href>`), inclusive os construídos em código.
- Avisos transitórios no console (ex.: `d: Expected moveto… "{{n.d}}"`) vêm dos *placeholders* de
  carregamento do runtime enquanto os dados chegam; não afetam o resultado final nem o funcionamento.
- Conteúdo, textos e dados **não foram alterados**. Nenhum preço/valor foi adicionado.

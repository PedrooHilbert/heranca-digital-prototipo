import fs from 'node:fs';
import path from 'node:path';

const DOCS = 'C:/Users/user1/Desktop/heranca-digital-prototipo/docs';
const TELAS = path.join(DOCS, 'telas');

// ---- Metadata ---------------------------------------------------------------
// label = título em pt-BR, m = tela de celular, go = fluxo sugerido (botões)
const S = {
  Main:            { label: 'Entrada / Boas-vindas',        go: [['Entrar', 'Dashboard'], ['Verificar código', 'Codigo2FA'], ['Convite', 'Convite']] },
  Codigo2FA:       { label: 'Código de verificação (2FA)',  go: [['Continuar', 'Configurar']] },
  Convite:         { label: 'Convite de herdeiro',          go: [['Configurar', 'Configurar'], ['Aceitar no celular', 'Mobile-Convite']] },
  Configurar:      { label: 'Configuração inicial',         go: [['Ir para o painel', 'Dashboard']] },

  Dashboard:       { label: 'Painel do titular',            go: [['Ativos', 'Inventario'], ['Herdeiros', 'Herdeiros'], ['Regras', 'Regras'], ['Segurança', 'Seguranca']] },
  Inventario:      { label: 'Inventário de ativos',         go: [['Novo ativo', 'NovoAtivo'], ['Estados', 'Estados'], ['Voltar ao painel', 'Dashboard']] },
  NovoAtivo:       { label: 'Novo ativo',                   go: [['Salvar', 'Inventario']] },
  Estados:         { label: 'Estados do ativo',             go: [['Voltar', 'Inventario']] },
  Herdeiros:       { label: 'Herdeiros',                    go: [['Ver herdeiro', 'HerdeiroDetalhe'], ['Convidar', 'Convite'], ['Acesso liberado', 'AcessoLiberado']] },
  HerdeiroDetalhe: { label: 'Detalhe do herdeiro',          go: [['Proteger', 'HerdeiroProteger'], ['Voltar', 'Herdeiros']] },
  Regras:          { label: 'Regras de liberação',          go: [['Voltar ao painel', 'Dashboard']] },

  AbrirPedido:     { label: 'Abrir pedido de acesso',       go: [['Enviar pedido', 'Solicitacao']] },
  Solicitacao:     { label: 'Solicitação em análise',       go: [['Acesso liberado', 'AcessoLiberado'], ['Contestar', 'Contestacao'], ['Acompanhar no celular', 'Mobile-Solicitacao']] },
  Contestacao:     { label: 'Contestação',                  go: [['Voltar', 'Solicitacao']] },
  AcessoLiberado:  { label: 'Acesso liberado',              go: [['Abrir cofre', 'CofreTrancado'], ['Voltar ao início', 'Main']] },
  HerdeiroProteger:{ label: 'Proteger herdeiro',            go: [['Concluir', 'Herdeiros']] },

  Validador:       { label: 'Validador',                    go: [['Confirmar', 'Confirmar'], ['Aviso de óbito', 'AvisoObito']] },
  Advogado:        { label: 'Advogado',                     go: [['Validar', 'Validador'], ['Confirmar', 'Confirmar']] },
  AvisoObito:      { label: 'Aviso de óbito',               go: [['Encaminhar', 'Validador']] },
  Confirmar:       { label: 'Confirmação',                  go: [['Concluir', 'AcessoLiberado']] },

  Seguranca:       { label: 'Segurança',                    go: [['Cofre', 'CofreTrancado'], ['Aparelho novo', 'AparelhoNovo']] },
  CofreTrancado:   { label: 'Cofre trancado',               go: [['Desbloquear', 'AcessoLiberado']] },
  AparelhoNovo:    { label: 'Aparelho novo',                go: [['Confirmar kit', 'KitConfirmar']] },
  KitConfirmar:    { label: 'Confirmar kit',                go: [['Concluir', 'Seguranca']] },

  'Mobile-Painel':     { label: 'Celular · Painel',      m: true, go: [['Pedido', 'Mobile-Pedido'], ['Convite', 'Mobile-Convite'], ['Acesso', 'Mobile-Acesso']] },
  'Mobile-Convite':    { label: 'Celular · Convite',     m: true, go: [['Aceitar', 'Mobile-Painel']] },
  'Mobile-Pedido':     { label: 'Celular · Pedido',      m: true, go: [['Enviar', 'Mobile-Solicitacao']] },
  'Mobile-Solicitacao':{ label: 'Celular · Solicitação', m: true, go: [['Acesso', 'Mobile-Acesso']] },
  'Mobile-Acesso':     { label: 'Celular · Acesso',      m: true, go: [['Painel', 'Mobile-Painel']] },
};

const GROUPS = [
  ['Entrada',             ['Main', 'Codigo2FA', 'Convite', 'Configurar']],
  ['Titular',             ['Dashboard', 'Inventario', 'NovoAtivo', 'Estados', 'Herdeiros', 'HerdeiroDetalhe', 'Regras']],
  ['Herdeiro',            ['AbrirPedido', 'Solicitacao', 'Contestacao', 'AcessoLiberado', 'HerdeiroProteger']],
  ['Validador / Advogado',['Validador', 'Advogado', 'AvisoObito', 'Confirmar']],
  ['Segurança',           ['Seguranca', 'CofreTrancado', 'AparelhoNovo', 'KitConfirmar']],
  ['Celular',             ['Mobile-Painel', 'Mobile-Convite', 'Mobile-Pedido', 'Mobile-Solicitacao', 'Mobile-Acesso']],
];

// flat order for prev/next
const ORDER = GROUPS.flatMap(([, arr]) => arr);
const groupOf = {};
for (const [g, arr] of GROUPS) for (const n of arr) groupOf[n] = g;

const HEAD = (title) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="ESTILO">`;

// ---- CSS --------------------------------------------------------------------
const CSS = `:root{
  --teal-900:#0B3F3D; --teal-700:#0E5A57; --mint:#7FD1C5; --bg:#F3F6F4;
  --ink:#0B3F3D; --muted:#5a726f; --line:#dfe7e4; --card:#ffffff;
}
*{box-sizing:border-box}
html,body{margin:0}
body{font-family:'Montserrat',system-ui,sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}

/* top bar */
.bar{position:sticky;top:0;z-index:10;background:var(--teal-900);color:#fff;
  display:flex;align-items:center;gap:14px;padding:12px 20px;box-shadow:0 2px 14px rgba(11,63,61,.18)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.3px}
.dot{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--mint),#fff);display:grid;place-items:center;color:var(--teal-900);font-weight:800}
.bar .sep{opacity:.4}
.bar .tag{margin-left:auto;background:rgba(127,209,197,.18);color:var(--mint);
  border:1px solid rgba(127,209,197,.4);padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600}
.bar a.back{color:var(--mint);font-weight:600;font-size:14px}

/* index hero */
.hero{padding:54px 20px 26px;text-align:center;background:
  radial-gradient(1200px 400px at 50% -120px, rgba(127,209,197,.35), transparent),var(--bg)}
.hero h1{margin:0;font-size:40px;font-weight:800;color:var(--teal-900)}
.hero .tl{margin:12px auto 0;max-width:620px;color:var(--teal-700);font-weight:700;
  letter-spacing:2px;font-size:13px}
.hero .sub{margin:16px auto 0;max-width:640px;color:var(--muted);font-size:14px;line-height:1.6}

.wrap{max-width:1180px;margin:0 auto;padding:10px 20px 70px}
.group{margin-top:40px}
.group h2{font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;
  color:var(--teal-700);display:flex;align-items:center;gap:12px;margin:0 0 18px}
.group h2::after{content:"";flex:1;height:1px;background:var(--line)}

.grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(11,63,61,.16);border-color:var(--mint)}
.thumb{height:168px;background:#eef3f1;overflow:hidden;display:block}
.thumb img{width:100%;height:100%;object-fit:cover;object-position:top}
.card .cap{padding:12px 14px;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.card .cap small{color:var(--muted);font-weight:500}

/* phone frame cards */
.grid.phones{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.phones .thumb{height:360px;background:#0b3f3d0d;display:grid;place-items:center;padding:14px 0}
.phones .thumb img{width:150px;height:auto;object-fit:cover;object-position:top;border-radius:18px;
  box-shadow:0 10px 26px rgba(11,63,61,.22);border:4px solid #0B3F3D}

.note{max-width:1180px;margin:36px auto 0;padding:16px 20px;color:var(--muted);font-size:13px;
  border-top:1px solid var(--line);line-height:1.6}

/* screen viewer */
.stage{display:grid;place-items:start center;padding:26px 16px}
.shot{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;
  box-shadow:0 18px 44px rgba(11,63,61,.14);max-width:1080px;width:100%}
.shot.phone{max-width:390px;border-radius:30px;border:10px solid #0B3F3D;box-shadow:0 20px 50px rgba(11,63,61,.3)}
.shot img{width:100%;height:auto}

/* flow bar */
.flow{position:sticky;bottom:0;background:#fff;border-top:1px solid var(--line);
  box-shadow:0 -6px 20px rgba(11,63,61,.08);padding:12px 16px}
.flow .inner{max-width:1080px;margin:0 auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.flow .lbl{font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:999px;
  font-weight:700;font-size:14px;border:1px solid var(--teal-700);color:var(--teal-700);background:#fff;cursor:pointer}
.btn:hover{background:var(--teal-700);color:#fff}
.btn.primary{background:var(--teal-700);color:#fff}
.btn.primary:hover{background:var(--teal-900);border-color:var(--teal-900)}
.btn.ghost{border-color:var(--line);color:var(--muted)}
.btn.ghost:hover{background:var(--bg);color:var(--teal-900)}
.spacer{flex:1}
@media(max-width:560px){.hero h1{font-size:30px}.flow .lbl{width:100%}}
`;

// ---- Screen page ------------------------------------------------------------
function screenPage(name, i) {
  const d = S[name];
  const prev = ORDER[(i - 1 + ORDER.length) % ORDER.length];
  const next = ORDER[(i + 1) % ORDER.length];
  const go = (d.go || []).map(([lbl, t], k) =>
    `<a class="btn ${k === 0 ? 'primary' : ''}" href="${t}.html">${lbl}</a>`).join('\n      ');
  return HEAD(`${d.label} · Herança Digital`).replace('ESTILO', '../estilo.css') + `
</head>
<body>
  <div class="bar">
    <a class="back" href="../index.html">← Protótipo</a>
    <span class="sep">/</span>
    <div class="brand"><span class="dot">H</span> ${d.label}</div>
    <span class="tag">${groupOf[name]}</span>
  </div>

  <div class="stage">
    <div class="shot ${d.m ? 'phone' : ''}">
      <img src="../assets/${name}.png" alt="${d.label}">
    </div>
  </div>

  <div class="flow">
    <div class="inner">
      <span class="lbl">Fluxo sugerido</span>
      ${go || '<span class="lbl" style="color:var(--teal-700)">tela final</span>'}
      <span class="spacer"></span>
      <a class="btn ghost" href="${prev}.html">← Anterior</a>
      <a class="btn ghost" href="${next}.html">Próxima →</a>
    </div>
  </div>

  <script>
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')location.href='${prev}.html';
    if(e.key==='ArrowRight')location.href='${next}.html';
    if(e.key==='Escape')location.href='../index.html';
  });
  </script>
</body>
</html>`;
}

// ---- Index ------------------------------------------------------------------
function indexPage() {
  const groups = GROUPS.map(([g, arr]) => {
    const isPhones = g === 'Celular';
    const cards = arr.map(n => {
      const d = S[n];
      return `      <a class="card" href="telas/${n}.html">
        <span class="thumb"><img src="assets/${n}.png" alt="${d.label}" loading="lazy"></span>
        <span class="cap">${d.label}<small>${n}</small></span>
      </a>`;
    }).join('\n');
    return `    <section class="group">
      <h2>${g}</h2>
      <div class="grid${isPhones ? ' phones' : ''}">
${cards}
      </div>
    </section>`;
  }).join('\n');

  return HEAD('Herança Digital · Protótipo').replace('ESTILO', 'estilo.css') + `
</head>
<body>
  <div class="bar">
    <div class="brand"><span class="dot">H</span> Herança Digital</div>
    <span class="tag">Protótipo · UC HUB</span>
  </div>

  <header class="hero">
    <h1>Herança Digital · Protótipo</h1>
    <p class="tl">SEUS DADOS, SUA HISTÓRIA, SEU FUTURO.</p>
    <p class="sub">Protótipo navegável de alta fidelidade. ${ORDER.length} telas agrupadas por jornada —
    clique em qualquer miniatura para abrir a tela e seguir o fluxo. Todos os dados são fictícios.</p>
  </header>

  <main class="wrap">
${groups}
    <p class="note"><strong>Sobre esta publicação:</strong> as telas são as versões renderizadas (imagem) do
    protótipo feito no Claude Design. Os botões “Fluxo sugerido” em cada tela reproduzem a navegação principal
    entre as telas; não substituem clique por clique o original. Conteúdo, textos e dados não foram alterados.</p>
  </main>
</body>
</html>`;
}

// ---- Write ------------------------------------------------------------------
fs.writeFileSync(path.join(DOCS, 'estilo.css'), CSS);
fs.writeFileSync(path.join(DOCS, 'index.html'), indexPage());
ORDER.forEach((n, i) => fs.writeFileSync(path.join(TELAS, n + '.html'), screenPage(n, i)));
console.log('OK:', ORDER.length, 'telas +', 'index.html + estilo.css');

/* Gera docs/ (site estático animado) a partir dos .dc.html em tools/fonte/.
   Uso:  node tools/gen.mjs   (rode a partir da raiz do repositório) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'tools', 'fonte');     // .dc.html originais
const RT  = path.join(ROOT, 'tools', 'vendor');    // dc-runtime.js + logos
const PNG = 'C:/Users/user1/Desktop/pitch-heranca-digital/public/screens'; // miniaturas (opcional)
const DOCS = path.join(ROOT, 'docs');
const TELAS = path.join(DOCS, 'telas');
const ASSETS = path.join(DOCS, 'assets');

const TITLE = {
  Main:'Entrar', Codigo2FA:'Entrar · Código de verificação', Convite:'Herdeiro · Convite recebido',
  Configurar:'Titular · Primeiros passos', Dashboard:'Titular · Início', Inventario:'Titular · Ativos',
  NovoAtivo:'Titular · Adicionar ativo', Estados:'Titular · Lista vazia e confirmação', Herdeiros:'Titular · Herdeiros',
  HerdeiroDetalhe:'Titular · Detalhe do herdeiro', Regras:'Titular · Liberação', Seguranca:'Titular · Segurança',
  AbrirPedido:'Herdeiro · Abrir pedido', Solicitacao:'Herdeiro · Acompanhar pedido', Contestacao:'Herdeiro · Contestar',
  AcessoLiberado:'Herdeiro · Acesso liberado', Validador:'Validador · Pedidos', Advogado:'Advogado · Inventário',
  AvisoObito:'Titular · Aviso de óbito (e-mail)', Confirmar:'Titular · Confirme que é você',
  CofreTrancado:'Titular · Cofre trancado', AparelhoNovo:'Titular · Aprovar aparelho novo',
  KitConfirmar:'Titular · Confirmar kit de recuperação', HerdeiroProteger:'Herdeiro · Proteger a conta',
  'Mobile-Painel':'Titular · Início (celular)', 'Mobile-Convite':'Herdeiro · Convite (celular)',
  'Mobile-Pedido':'Herdeiro · Abrir pedido (celular)', 'Mobile-Solicitacao':'Herdeiro · Acompanhar (celular)',
  'Mobile-Acesso':'Herdeiro · Acesso liberado (celular)', 'Mobile-Login':'Titular · Entrar (celular)',
};

const GROUPS = [
  ['Entrada', ['Main','Codigo2FA','Convite','Configurar']],
  ['Titular', ['Dashboard','Inventario','NovoAtivo','Estados','Herdeiros','HerdeiroDetalhe','Regras']],
  ['Herdeiro', ['AbrirPedido','Solicitacao','Contestacao','AcessoLiberado','HerdeiroProteger']],
  ['Validador / Advogado', ['Validador','Advogado','AvisoObito','Confirmar']],
  ['Segurança', ['Seguranca','CofreTrancado','AparelhoNovo','KitConfirmar']],
  ['Celular', ['Mobile-Painel','Mobile-Convite','Mobile-Pedido','Mobile-Solicitacao','Mobile-Acesso','Mobile-Login']],
];
const ORDER = GROUPS.flatMap(([,a])=>a);
const isMobile = n => n.startsWith('Mobile-');
// telas de painel (menu lateral + conteúdo largo) ocupam a largura inteira; o resto fica centralizado
const APP = new Set(['Dashboard','Inventario','Herdeiros','HerdeiroDetalhe','Regras','Seguranca','Estados','NovoAtivo']);
const layoutOf = n => isMobile(n) ? 'mobile' : (APP.has(n) ? 'app' : 'card');

fs.mkdirSync(TELAS, {recursive:true});
fs.mkdirSync(ASSETS, {recursive:true});

for (const name of ORDER) {
  let h = fs.readFileSync(path.join(SRC, name + '.dc.html'), 'utf8');
  h = h.replace(/\.\/support\.js/g, '../dc-runtime.js');
  h = h.replace(/\/_blob\/([0-9a-f]{32})/g, '../assets/$1.png');
  h = h.replace(/\.dc\.html/g, '.html');
  // min-height do tamanho do quadro (>=600px) vira 100vh: sem vão em branco, mas cresce com o conteúdo
  h = h.replace(/min-height:\s*(\d+)px/g, (m, n) => (+n >= 600 ? 'min-height:100vh' : m));
  h = h.replace(/<html lang="pt-BR">/,
    `<html lang="pt-BR" data-name="${name}" data-kind="${isMobile(name)?'mobile':'desktop'}" data-layout="${layoutOf(name)}">`);
  h = h.replace(/<\/head>/,
    `<link rel="stylesheet" href="../transicao.css">\n<script defer src="../transicao.js"></script>\n</head>`);
  fs.writeFileSync(path.join(TELAS, name + '.html'), h);
}

fs.writeFileSync(path.join(DOCS, 'transicao.css'), `/* Transições entre telas + moldura de celular + navegação flutuante */
html{background:#EAF1EE}
body{opacity:0}
body.hd-in{opacity:1;transition:opacity .30s ease}
body.hd-out{opacity:0;transition:opacity .16s ease}
html[data-kind="mobile"]{background:radial-gradient(1200px 600px at 50% -10%,#0E5A57,#0B3F3D)}
html[data-kind="mobile"] body{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:30px 16px 90px;box-sizing:border-box}
html[data-kind="mobile"] #dc-root{width:390px;max-width:100%;border:12px solid #0B3F3D;border-radius:44px;overflow:hidden;background:#fff;box-shadow:0 36px 80px rgba(0,0,0,.45);outline:1px solid rgba(255,255,255,.08)}
/* telas de cartão (login, código, confirmações): centraliza o conteúdo do <main> */
html[data-layout="card"] main>div{margin-left:auto;margin-right:auto}
/* telas de painel (menu lateral): o conteúdo ocupa a largura inteira, sem faixa branca */
html[data-layout="app"] main>div{max-width:none!important;margin:0!important}
#hd-nav{position:fixed;right:18px;bottom:18px;z-index:99999;
  display:flex;align-items:center;gap:4px;padding:6px;border-radius:999px;
  background:rgba(11,63,61,.92);backdrop-filter:blur(8px);box-shadow:0 12px 34px rgba(11,63,61,.4);
  font-family:'Montserrat',system-ui,sans-serif}
#hd-nav a,#hd-nav span{display:flex;align-items:center;justify-content:center;min-width:38px;height:38px;
  padding:0 12px;border-radius:999px;color:#DCEBE7;font-size:15px;font-weight:700;text-decoration:none;cursor:pointer;user-select:none}
#hd-nav a:hover{background:rgba(127,209,197,.22);color:#fff}
#hd-nav .lbl{font-size:12px;font-weight:600;color:#7FD1C5;letter-spacing:.04em;cursor:default}
#hd-nav .home{background:#7FD1C5;color:#0B3F3D}
#hd-nav .home:hover{background:#9bded4;color:#0B3F3D}
#hd-nav .off{opacity:.3;cursor:default}
@media print{#hd-nav{display:none}}
`);

fs.writeFileSync(path.join(DOCS, 'transicao.js'),
`// Transições entre telas (cross-fade) + navegação do protótipo
var ORDER = ${JSON.stringify(ORDER)};
var TITLE = ${JSON.stringify(TITLE)};
(function(){
  var cur = document.documentElement.dataset.name;
  function go(url){ document.body.classList.remove('hd-in'); document.body.classList.add('hd-out'); setTimeout(function(){ location.href = url; }, 150); }
  function start(){
    requestAnimationFrame(function(){ document.body.classList.add('hd-in'); });
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href]');
      if(!a) return;
      var href = a.getAttribute('href');
      if(!href || href.charAt(0)==='#' || /^https?:/i.test(href) || a.target==='_blank') return;
      e.preventDefault(); go(href);
    }, true);
    var i = ORDER.indexOf(cur);
    var prev = i>0 ? ORDER[i-1] : null;
    var next = (i>=0 && i<ORDER.length-1) ? ORDER[i+1] : null;
    var nav = document.createElement('div'); nav.id='hd-nav';
    nav.innerHTML =
      '<a class="home" href="../index.html" title="Índice de telas">⌂</a>' +
      (prev ? '<a data-go="'+prev+'.html" title="'+(TITLE[prev]||prev)+'">‹</a>' : '<span class="off">‹</span>') +
      '<span class="lbl">'+(i+1)+' / '+ORDER.length+'</span>' +
      (next ? '<a data-go="'+next+'.html" title="'+(TITLE[next]||next)+'">›</a>' : '<span class="off">›</span>');
    document.body.appendChild(nav);
    nav.addEventListener('click', function(e){ var t = e.target.closest('[data-go]'); if(t){ e.preventDefault(); go(t.getAttribute('data-go')); } });
    document.addEventListener('keydown', function(e){
      if(e.key==='ArrowLeft' && prev) go(prev+'.html');
      else if(e.key==='ArrowRight' && next) go(next+'.html');
      else if(e.key==='Escape') go('../index.html');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
`);

const cards = GROUPS.map(([g, arr]) => {
  const phones = g === 'Celular';
  const items = arr.map(n => {
    const thumb = fs.existsSync(path.join(PNG, n + '.png'))
      ? `<span class="thumb"><img src="assets/${n}.png" alt="${TITLE[n]}" loading="lazy"></span>`
      : `<span class="thumb ph"><span>${TITLE[n]}</span></span>`;
    return `      <a class="card" href="telas/${n}.html">
        ${thumb}
        <span class="cap">${TITLE[n]}<small>${n}</small></span>
      </a>`;
  }).join('\n');
  return `    <section class="group">
      <h2>${g}</h2>
      <div class="grid${phones?' phones':''}">
${items}
      </div>
    </section>`;
}).join('\n');

fs.writeFileSync(path.join(DOCS, 'index.html'), `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Herança Digital · Protótipo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="estilo.css">
</head>
<body>
  <div class="bar">
    <div class="brand"><span class="dot">H</span> Herança Digital</div>
    <a class="play" href="telas/Main.html">▶ Iniciar protótipo</a>
  </div>
  <header class="hero">
    <h1>Herança Digital · Protótipo</h1>
    <p class="tl">SEUS DADOS, SUA HISTÓRIA, SEU FUTURO.</p>
    <p class="sub">Protótipo navegável de alta fidelidade — ${ORDER.length} telas que se abrem de verdade, com as mesmas
    animações do original e transições entre as telas. Clique em qualquer tela para entrar no fluxo. Dados fictícios.</p>
    <a class="cta" href="telas/Main.html">Começar por “Entrar” →</a>
  </header>
  <main class="wrap">
${cards}
    <p class="note"><strong>Como funciona:</strong> cada tela é renderizada ao vivo (não é imagem), com os botões e
    animações do protótipo original; os links levam de uma tela a outra com transição. Conteúdo, textos e dados não
    foram alterados. Protótipo independente do claude.ai.</p>
  </main>
</body>
</html>`);

fs.writeFileSync(path.join(DOCS, 'estilo.css'), `:root{--teal-900:#0B3F3D;--teal-700:#0E5A57;--mint:#7FD1C5;--bg:#F3F6F4;--ink:#0B3F3D;--muted:#5a726f;--line:#dfe7e4;--card:#fff}
*{box-sizing:border-box}html,body{margin:0}
body{font-family:'Montserrat',system-ui,sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
.bar{position:sticky;top:0;z-index:10;background:var(--teal-900);color:#fff;display:flex;align-items:center;gap:14px;padding:12px 20px;box-shadow:0 2px 14px rgba(11,63,61,.18)}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.3px}
.dot{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--mint),#fff);display:grid;place-items:center;color:var(--teal-900);font-weight:800}
.bar .play{margin-left:auto;background:rgba(127,209,197,.16);color:var(--mint);border:1px solid rgba(127,209,197,.4);padding:7px 16px;border-radius:999px;font-size:13px;font-weight:700}
.bar .play:hover{background:var(--mint);color:var(--teal-900)}
.hero{padding:54px 20px 30px;text-align:center;background:radial-gradient(1200px 400px at 50% -120px,rgba(127,209,197,.35),transparent),var(--bg)}
.hero h1{margin:0;font-size:40px;font-weight:800;color:var(--teal-900)}
.hero .tl{margin:12px auto 0;max-width:620px;color:var(--teal-700);font-weight:700;letter-spacing:2px;font-size:13px}
.hero .sub{margin:16px auto 0;max-width:660px;color:var(--muted);font-size:14px;line-height:1.6}
.hero .cta{display:inline-block;margin-top:22px;background:var(--teal-700);color:#fff;padding:12px 24px;border-radius:999px;font-weight:700;font-size:15px;box-shadow:0 12px 26px rgba(14,90,87,.26)}
.hero .cta:hover{background:var(--teal-900)}
.wrap{max-width:1180px;margin:0 auto;padding:10px 20px 80px}
.group{margin-top:40px}
.group h2{font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--teal-700);display:flex;align-items:center;gap:12px;margin:0 0 18px}
.group h2::after{content:"";flex:1;height:1px;background:var(--line)}
.grid{display:grid;gap:22px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:transform .18s,box-shadow .18s,border-color .18s}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 36px rgba(11,63,61,.16);border-color:var(--mint)}
.thumb{height:168px;background:#eef3f1;overflow:hidden;display:block}
.thumb img{width:100%;height:100%;object-fit:cover;object-position:top}
.cap{padding:12px 14px;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.cap small{color:var(--muted);font-weight:500;white-space:nowrap}
.grid.phones{grid-template-columns:repeat(auto-fill,minmax(205px,1fr))}
.phones .thumb{height:360px;background:#0b3f3d0d;display:grid;place-items:center;padding:14px 0}
.phones .thumb img{width:150px;height:auto;max-height:332px;object-fit:cover;object-position:top;border-radius:18px;box-shadow:0 10px 26px rgba(11,63,61,.22);border:4px solid #0B3F3D}
.thumb.ph{display:grid;place-items:center;background:linear-gradient(160deg,#0E5A57,#0B3F3D);color:#CFE3DF;text-align:center;font-weight:700;font-size:14px;padding:18px}
.thumb.ph span{display:block;max-width:170px}
.note{max-width:1180px;margin:36px auto 0;padding:16px 20px;color:var(--muted);font-size:13px;border-top:1px solid var(--line);line-height:1.6}
@media(max-width:560px){.hero h1{font-size:30px}}
`);

fs.copyFileSync(path.join(RT, 'dc-runtime.js'), path.join(DOCS, 'dc-runtime.js'));
for (const id of ['93b931a4abcc42f7acfdd50e33a206b6','b8637202c7a49cb5856b6a0cf382b5b7'])
  fs.copyFileSync(path.join(RT, id + '.png'), path.join(ASSETS, id + '.png'));
for (const n of ORDER) {
  const p = path.join(PNG, n + '.png');
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(ASSETS, n + '.png'));
}
console.log('OK:', ORDER.length, 'telas geradas em', DOCS);

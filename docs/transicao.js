// Transições entre telas (cross-fade) + navegação do protótipo
var ORDER = ["Main","Codigo2FA","Convite","Configurar","Dashboard","Inventario","NovoAtivo","Estados","Herdeiros","HerdeiroDetalhe","Regras","AbrirPedido","Solicitacao","Contestacao","AcessoLiberado","HerdeiroProteger","Validador","Advogado","AvisoObito","Confirmar","Seguranca","CofreTrancado","AparelhoNovo","KitConfirmar","Mobile-Painel","Mobile-Convite","Mobile-Pedido","Mobile-Solicitacao","Mobile-Acesso","Mobile-Login"];
var TITLE = {"Main":"Entrar","Codigo2FA":"Entrar · Código de verificação","Convite":"Herdeiro · Convite recebido","Configurar":"Titular · Primeiros passos","Dashboard":"Titular · Início","Inventario":"Titular · Ativos","NovoAtivo":"Titular · Adicionar ativo","Estados":"Titular · Lista vazia e confirmação","Herdeiros":"Titular · Herdeiros","HerdeiroDetalhe":"Titular · Detalhe do herdeiro","Regras":"Titular · Liberação","Seguranca":"Titular · Segurança","AbrirPedido":"Herdeiro · Abrir pedido","Solicitacao":"Herdeiro · Acompanhar pedido","Contestacao":"Herdeiro · Contestar","AcessoLiberado":"Herdeiro · Acesso liberado","Validador":"Validador · Pedidos","Advogado":"Advogado · Inventário","AvisoObito":"Titular · Aviso de óbito (e-mail)","Confirmar":"Titular · Confirme que é você","CofreTrancado":"Titular · Cofre trancado","AparelhoNovo":"Titular · Aprovar aparelho novo","KitConfirmar":"Titular · Confirmar kit de recuperação","HerdeiroProteger":"Herdeiro · Proteger a conta","Mobile-Painel":"Titular · Início (celular)","Mobile-Convite":"Herdeiro · Convite (celular)","Mobile-Pedido":"Herdeiro · Abrir pedido (celular)","Mobile-Solicitacao":"Herdeiro · Acompanhar (celular)","Mobile-Acesso":"Herdeiro · Acesso liberado (celular)","Mobile-Login":"Titular · Entrar (celular)"};
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

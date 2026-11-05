/* ==========================================================
   Ponto GIM | código só da página inicial
   1. Montador de caneca (prévia ao vivo)
   2. Formulário de orçamento
   (WhatsApp, menu e fotos opcionais ficam em comum.js)
   ========================================================== */

/* ---------- 1. Montador de caneca ---------- */
const FONTES = {
  forte:      { familia: "'Anton', sans-serif",        largura: 0.46, estilo: 'normal', peso: '400', caixaAlta: true  },
  manuscrita: { familia: "'Yellowtail', cursive",      largura: 0.42, estilo: 'normal', peso: '400', caixaAlta: false },
  classica:   { familia: "'Playfair Display', serif",  largura: 0.56, estilo: 'italic', peso: '700', caixaAlta: false },
};

const NS = 'http://www.w3.org/2000/svg';
const formCaneca = document.getElementById('builder');
const campoTexto = document.getElementById('mug-text');
const rotulo = document.getElementById('mug-label');
const corpo = document.getElementById('mug-body');
const alca = document.getElementById('mug-handle');
const borda = document.getElementById('mug-rim');

// Escolhe texto claro ou escuro conforme a cor da caneca
function corDoTexto(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminancia > 0.6 ? '#1b1625' : '#ffffff';
}

// Quebra o texto em até 3 linhas de ~12 caracteres
function quebrarLinhas(texto, maxPorLinha = 12, maxLinhas = 3) {
  const palavras = texto.trim().split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = '';
  palavras.forEach((p) => {
    const tentativa = atual ? atual + ' ' + p : p;
    if (tentativa.length <= maxPorLinha || !atual) {
      atual = tentativa;
    } else {
      linhas.push(atual);
      atual = p;
    }
  });
  if (atual) linhas.push(atual);
  // Se passou do limite, junta o que sobrou na última linha
  while (linhas.length > maxLinhas) {
    const ultima = linhas.pop();
    linhas[linhas.length - 1] += ' ' + ultima;
  }
  return linhas;
}

function desenharCaneca() {
  const cor = formCaneca.elements['cor'].value;
  const chaveFonte = formCaneca.elements['fonte'].value;
  const fonte = FONTES[chaveFonte];

  let texto = campoTexto.value;
  if (fonte.caixaAlta) texto = texto.toUpperCase();
  const linhas = quebrarLinhas(texto);

  // Cores da caneca
  corpo.style.fill = cor;
  alca.style.stroke = cor;
  borda.style.fill = cor;

  // Tamanho da letra: cabe na largura (190) e na altura (180)
  const maior = Math.max(1, ...linhas.map((l) => l.length));
  const porLargura = 190 / (maior * fonte.largura);
  const porAltura = 180 / (Math.max(1, linhas.length) * 1.12);
  const tamanho = Math.min(76, porLargura, porAltura);

  // Monta as linhas dentro do <text>
  rotulo.textContent = '';
  rotulo.setAttribute('fill', corDoTexto(cor));
  rotulo.style.fontFamily = fonte.familia;
  rotulo.style.fontStyle = fonte.estilo;
  rotulo.style.fontWeight = fonte.peso;

  linhas.forEach((linha) => {
    const t = document.createElementNS(NS, 'tspan');
    t.setAttribute('x', '170');
    t.textContent = linha;
    rotulo.appendChild(t);
  });

  // Posiciona as linhas para um tamanho de letra
  function aplicarTamanho(px) {
    const alturaLinha = px * 1.08;
    rotulo.style.fontSize = px + 'px';
    rotulo.setAttribute('y', 182 - ((linhas.length - 1) * alturaLinha) / 2 + px * 0.34);
    rotulo.querySelectorAll('tspan').forEach((t, i) => {
      t.setAttribute('dy', i === 0 ? '0' : String(alturaLinha));
    });
  }

  aplicarTamanho(tamanho);

  // Confere o tamanho real medido no navegador e encolhe se passar do corpo da caneca
  const LARGURA_MAX = 196;
  const largura = rotulo.getBBox().width;
  if (largura > LARGURA_MAX) {
    aplicarTamanho(tamanho * (LARGURA_MAX / largura) * 0.98);
  }
}

formCaneca.addEventListener('input', desenharCaneca);

formCaneca.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = campoTexto.value.trim() || '(vou combinar o texto com vocês)';
  const cor = formCaneca.querySelector('input[name="cor"]:checked').dataset.nome;
  const fonte = formCaneca.querySelector('input[name="fonte"]:checked').dataset.nome;
  const mensagem =
    'Oi! Vim pelo site da Ponto GIM e quero uma caneca personalizada.\n' +
    'Texto: "' + texto + '"\n' +
    'Cor: ' + cor + '\n' +
    'Letra: ' + fonte + '\n' +
    'Pode me passar valor e prazo?';
  window.open(linkWhatsApp(mensagem), '_blank', 'noopener');
});

// Desenha de novo quando as fontes terminarem de carregar
desenharCaneca();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(desenharCaneca);
}

/* ---------- 2. Formulário de orçamento ---------- */
const formOrcamento = document.getElementById('quote');

formOrcamento.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(formOrcamento);
  const empresa = (dados.get('empresa') || '').toString().trim();
  const qtd = (dados.get('qtd') || '').toString().trim();
  const detalhes = (dados.get('detalhes') || '').toString().trim();

  const linhas = [
    'Oi! Vim pelo site da Ponto GIM e gostaria de um orçamento.',
    'Nome: ' + dados.get('nome'),
  ];
  if (empresa) linhas.push('Empresa: ' + empresa);
  linhas.push('Produto: ' + dados.get('produto'));
  if (qtd) linhas.push('Quantidade: ' + qtd);
  if (detalhes) linhas.push('Detalhes: ' + detalhes);

  window.open(linkWhatsApp(linhas.join('\n')), '_blank', 'noopener');
});

/* ==========================================================
   Ponto GIM | código da página do catálogo
   Lê CATEGORIAS e PRODUTOS (js/produtos.js), monta os filtros
   e os cartões, e liga cada "Pedir" ao WhatsApp.
   ========================================================== */

const listaEl = document.getElementById('lista');
const filtrosEl = document.getElementById('filtros');
const contagemEl = document.getElementById('contagem');
const vazioEl = document.getElementById('vazio');
const galeriaCanecasEl = document.getElementById('galeria-canecas');

let categoriaAtiva = 'todos';

const linkConsultarCaneca = document.getElementById('consultar-caneca');
const statusSelecaoCaneca = document.getElementById('caneca-selecao-status');
const opcoesCoracaoEl = document.getElementById('coracao-cor-opcoes');
const MODELO_ALCA_CORACAO = 'Caneca colorida com alça de coração';

function desativarConsultaCaneca(mensagem) {
  statusSelecaoCaneca.textContent = mensagem;
  linkConsultarCaneca.href = '#';
  linkConsultarCaneca.setAttribute('aria-disabled', 'true');
  linkConsultarCaneca.setAttribute('tabindex', '-1');
  linkConsultarCaneca.removeAttribute('target');
  linkConsultarCaneca.removeAttribute('rel');
}

function atualizarConsultaCaneca(opcao) {
  if (!opcao) {
    opcoesCoracaoEl.hidden = true;
    desativarConsultaCaneca('Selecione um modelo acima para consultar com a loja.');
    return;
  }

  const precisaCor = opcao.value === MODELO_ALCA_CORACAO;
  opcoesCoracaoEl.hidden = !precisaCor;
  if (!precisaCor) {
    document.querySelectorAll('input[name="cor-caneca-coracao"]').forEach((cor) => {
      cor.checked = false;
    });
  }

  const corSelecionada = document.querySelector('input[name="cor-caneca-coracao"]:checked');
  if (precisaCor && !corSelecionada) {
    desativarConsultaCaneca('Modelo selecionado: ' + opcao.value + '. Escolha uma cor para continuar.');
    return;
  }

  const detalheCor = precisaCor ? '\nCor escolhida para a alça de coração: ' + corSelecionada.value + '.' : '';
  statusSelecaoCaneca.textContent = 'Modelo selecionado: ' + opcao.value + (precisaCor ? ', na cor ' + corSelecionada.value : '') + '.';
  linkConsultarCaneca.href = linkWhatsApp(
    'Oi! Vim pelo catálogo da Ponto GIM e quero consultar este modelo de caneca: ' + opcao.value + '.' + detalheCor
  );
  linkConsultarCaneca.target = '_blank';
  linkConsultarCaneca.rel = 'noopener';
  linkConsultarCaneca.setAttribute('aria-disabled', 'false');
  linkConsultarCaneca.removeAttribute('tabindex');
}

function limparSelecaoCaneca() {
  document.querySelectorAll('input[name="modelo-caneca"]').forEach((opcao) => {
    opcao.checked = false;
  });
  document.querySelectorAll('input[name="cor-caneca-coracao"]').forEach((cor) => {
    cor.checked = false;
  });
  document.querySelectorAll('.inspiracao-card').forEach((cartao) => {
    cartao.classList.remove('is-selected');
  });
  atualizarConsultaCaneca(null);
}

document.querySelectorAll('input[name="modelo-caneca"]').forEach((opcao) => {
  opcao.addEventListener('change', () => {
    document.querySelectorAll('.inspiracao-card').forEach((cartao) => {
      cartao.classList.toggle('is-selected', cartao.querySelector('input').checked);
    });

    document.querySelectorAll('input[name="cor-caneca-coracao"]').forEach((cor) => {
      cor.checked = false;
    });
    atualizarConsultaCaneca(opcao);
  });
});

document.querySelectorAll('input[name="cor-caneca-coracao"]').forEach((cor) => {
  cor.addEventListener('change', () => {
    atualizarConsultaCaneca(document.querySelector('input[name="modelo-caneca"]:checked'));
  });
});

linkConsultarCaneca.addEventListener('click', (evento) => {
  if (linkConsultarCaneca.getAttribute('aria-disabled') === 'true') evento.preventDefault();
});
function categoriaPorId(id) {
  return CATEGORIAS.find((c) => c.id === id);
}

/* ---------- Filtros ---------- */
function criarFiltros() {
  const todas = [{ id: 'todos', nome: 'Todos' }, ...CATEGORIAS];
  todas.forEach((cat) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'chip';
    botao.dataset.cat = cat.id;
    botao.textContent = cat.nome;
    botao.addEventListener('click', () => escolherCategoria(cat.id));
    filtrosEl.appendChild(botao);
  });
}

function escolherCategoria(id) {
  categoriaAtiva = id;

  // Guarda a escolha no endereço (?cat=canecas), para poder compartilhar o link.
  // Em alguns navegadores isso é bloqueado ao abrir o arquivo direto do computador.
  try {
    const url = new URL(window.location.href);
    if (id === 'todos') url.searchParams.delete('cat');
    else url.searchParams.set('cat', id);
    window.history.replaceState(null, '', url);
  } catch (erro) {
    /* sem problema: o filtro funciona do mesmo jeito */
  }

  mostrar();
}

/* ---------- Cartões ---------- */
function criarCartao(produto) {
  const cat = categoriaPorId(produto.categoria) || { nome: '', bg: '#2a2045', fg: '#ffffff' };

  const cartao = document.createElement('article');
  cartao.className = 'item';
  cartao.style.setProperty('--bg', cat.bg);
  cartao.style.setProperty('--fg', cat.fg);

  // Área da foto: cor da categoria + foto, se existir
  const midia = document.createElement('div');
  midia.className = 'item-media';

  const palavra = document.createElement('span');
  palavra.className = 'item-word';
  palavra.setAttribute('aria-hidden', 'true');
  palavra.textContent = cat.nome;
  midia.appendChild(palavra);

  const foto = document.createElement('img');
  foto.src = '../img/produtos/' + produto.imagem;
  foto.alt = produto.nome;
  foto.loading = 'lazy';
  foto.dataset.demo = '../img/demo/' + produto.imagem.replace(/\.[^.]+$/, '') + '.svg';
  foto.setAttribute('data-opcional', '');
  midia.appendChild(foto);

  // Texto
  const corpo = document.createElement('div');
  corpo.className = 'item-body';

  const titulo = document.createElement('h3');
  titulo.textContent = produto.nome;

  const descricao = document.createElement('p');
  descricao.className = 'item-desc';
  descricao.textContent = produto.descricao;

  const preco = document.createElement('p');
  preco.className = 'item-price';
  // Valor de exemplo só aparece no modo demonstração (MODO_DEMO, em js/comum.js)
  const valorExemplo = !produto.preco && MODO_DEMO && produto.precoDemo;
  preco.textContent = produto.preco || valorExemplo || 'Consulte o valor';
  if (valorExemplo) {
    const nota = document.createElement('span');
    nota.className = 'demo-nota';
    nota.textContent = 'valor de exemplo';
    preco.appendChild(nota);
  }

  const pedir = document.createElement('a');
  pedir.className = 'btn btn--dark btn--small';
  pedir.href = 'https://wa.me/' + WHATSAPP;
  pedir.dataset.wa = 'Oi! Vim pelo catálogo do site e quero saber mais sobre: ' + produto.nome + '.';
  pedir.textContent = 'Pedir este';

  corpo.append(titulo, descricao);

  // Prazo de produção (só aparece quando o produto tem prazo definido)
  if (produto.prazo) {
    const prazo = document.createElement('p');
    prazo.className = 'item-prazo';
    prazo.textContent = 'Produção em ' + produto.prazo;
    corpo.appendChild(prazo);
  }

  if (produto.nome === 'Canecas personalizadas') {
    cartao.dataset.produto = 'canecas-personalizadas';
    const verModelos = document.createElement('button');
    verModelos.type = 'button';
    verModelos.className = 'btn btn--outline-dark btn--small ver-modelos';
    verModelos.setAttribute('aria-controls', 'galeria-canecas');
    verModelos.setAttribute('aria-expanded', 'false');
    verModelos.textContent = 'Ver modelos de caneca';
    corpo.append(preco, verModelos, pedir);
  } else {
    corpo.append(preco, pedir);
  }

  cartao.append(midia, corpo);
  return cartao;
}

function colocarGaleriaCanecas(cartao) {
  if (!cartao) return;

  cartao.after(galeriaCanecasEl);
  const botao = cartao.querySelector('.ver-modelos');
  botao.addEventListener('click', () => {
    const aberta = galeriaCanecasEl.hidden;
    galeriaCanecasEl.hidden = !aberta;
    if (!aberta) limparSelecaoCaneca();
    botao.setAttribute('aria-expanded', String(aberta));
    botao.textContent = aberta ? 'Ocultar modelos' : 'Ver modelos de caneca';

    if (aberta) galeriaCanecasEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ---------- Tela ---------- */
function mostrar() {
  const itens = PRODUTOS.filter((p) => categoriaAtiva === 'todos' || p.categoria === categoriaAtiva);

  limparSelecaoCaneca();
  galeriaCanecasEl.hidden = true;
  listaEl.textContent = '';
  itens.forEach((p) => listaEl.appendChild(criarCartao(p)));
  colocarGaleriaCanecas(listaEl.querySelector('[data-produto="canecas-personalizadas"]'));

  // Os cartões são criados agora, então liga WhatsApp e fotos neles
  ligarWhatsApp(listaEl);
  ligarImagensOpcionais(listaEl);

  filtrosEl.querySelectorAll('.chip').forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.cat === categoriaAtiva));
  });

  vazioEl.hidden = itens.length > 0;
  contagemEl.textContent = itens.length === 1 ? '1 item' : itens.length + ' itens';
}

criarFiltros();

// Abre já filtrado se o endereço tiver ?cat=...
const pedida = new URLSearchParams(window.location.search).get('cat');
if (pedida && categoriaPorId(pedida)) categoriaAtiva = pedida;

mostrar();

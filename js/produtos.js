/* ==========================================================
   Ponto GIM | DADOS do catálogo
   Para adicionar, trocar ou remover um item, edite só este arquivo.
   Não precisa mexer no HTML. A própria loja pode atualizar preços aqui.

   Cada produto tem:
     nome       título do cartão
     categoria  precisa ser igual a um "id" da lista CATEGORIAS
     descricao  frase curta
     imagem     nome do arquivo dentro de img/produtos/ (se não existir, usa a ilustração de img/demo/ no modo demonstração, ou só a cor)
     prazo      prazo de produção em dias úteis, ex.: '2 dias úteis'. Deixe '' para não mostrar
     precoDemo  valor INVENTADO, só aparece com MODO_DEMO = true (js/comum.js). Apague quando tiver o preço real
     preco      deixe '' para mostrar "Consulte o valor". Ou escreva, ex.: 'R$ 35,00' ou 'A partir de R$ 35,00'

   Lista de categorias e produtos aprovada pela loja (sem quadros personalizados).
   ========================================================== */

const CATEGORIAS = [
  { id: 'canecas',     nome: 'Canecas e copos',                bg: '#7b3ff2', fg: '#ffffff' },
  { id: 'vestuario',   nome: 'Vestuário',                      bg: '#ff8a1f', fg: '#120d1f' },
  { id: 'adesivos',    nome: 'Adesivos e etiquetas',           bg: '#ff3d8b', fg: '#120d1f' },
  { id: 'festas',      nome: 'Convites e topos de bolo',       bg: '#2e6bff', fg: '#ffffff' },
  { id: 'banners',     nome: 'Banners',                        bg: '#ffc23d', fg: '#120d1f' },
  { id: 'casa',        nome: 'Relógios e azulejos',            bg: '#2a2045', fg: '#ffffff' },
  { id: 'acessorios',  nome: 'Mouse pads e capas de celular',  bg: '#d1349a', fg: '#ffffff' },
  { id: 'corporativo', nome: 'Para empresas',                  bg: '#e4daf7', fg: '#120d1f' },
];

const PRODUTOS = [
  // ----- Canecas e copos -----
  {
    nome: 'Canecas personalizadas',
    categoria: 'canecas',
    descricao: 'Com foto, frase, nome ou logo. Para presentear, para vender, para o dia a dia.',
    imagem: 'canecas.jpg',
    prazo: '2 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 35,00',
  },
  {
    nome: 'Copos personalizados',
    categoria: 'canecas',
    descricao: 'Copos com nome, frase ou arte do jeito que você escolher.',
    imagem: 'copos.jpg',
    prazo: '3 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 45,00',
  },

  // ----- Vestuário -----
  {
    nome: 'Camisetas tradicionais',
    categoria: 'vestuario',
    descricao: 'Do P ao G3, com a sua foto, nome ou arte.',
    imagem: 'camisetas.jpg',
    prazo: '3 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 49,90',
  },
  {
    nome: 'Baby looks e regatas',
    categoria: 'vestuario',
    descricao: 'Modelos femininos e regatas personalizados.',
    imagem: 'baby-look-regata.jpg',
    prazo: '3 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 54,90',
  },
  {
    nome: 'Camisetas infantis e body infantil',
    categoria: 'vestuario',
    descricao: 'Peças infantis personalizadas, de camiseta a body.',
    imagem: 'infantil.jpg',
    prazo: '3 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 44,90',
  },
  {
    nome: 'Sublimação e DTF',
    categoria: 'vestuario',
    descricao: 'Personalização de vestuário por sublimação ou DTF, conforme a peça e a arte.',
    imagem: 'sublimacao-dtf.jpg',
    prazo: '3 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 59,90',
  },

  // ----- Adesivos e etiquetas -----
  {
    nome: 'Adesivos e etiquetas',
    categoria: 'adesivos',
    descricao: 'Com a sua arte ou com uma criada pela gente, sem custo.',
    imagem: 'adesivos.jpg',
    prazo: '4 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 12,00',
  },

  // ----- Convites e topos de bolo -----
  {
    nome: 'Convites digitais e interativos',
    categoria: 'festas',
    descricao: 'Convites para festas e eventos, para enviar direto pelo celular.',
    imagem: 'convites.jpg',
    prazo: '',
    preco: '',
    precoDemo: 'A partir de R$ 60,00',
  },
  {
    nome: 'Topos de bolo',
    categoria: 'festas',
    descricao: 'Topos personalizados com o tema e o nome da sua festa.',
    imagem: 'topos-de-bolo.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 25,00',
  },

  // ----- Banners -----
  {
    nome: 'Banners',
    categoria: 'banners',
    descricao: 'Para festas, eventos e lojas.',
    imagem: 'banners.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 89,90',
  },

  // ----- Relógios e azulejos -----
  {
    nome: 'Relógios personalizados',
    categoria: 'casa',
    descricao: 'Relógio com a sua foto ou arte, para casa, escritório ou presente.',
    imagem: 'relogios.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 69,90',
  },
  {
    nome: 'Azulejos personalizados',
    categoria: 'casa',
    descricao: 'Azulejo com a sua foto ou arte. Pergunte pelos tamanhos disponíveis.',
    imagem: 'azulejos.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 39,90',
  },

  // ----- Mouse pads e capas de celular -----
  {
    nome: 'Mouse pads',
    categoria: 'acessorios',
    descricao: 'Para a mesa de trabalho ou para presentear, com a arte que você quiser.',
    imagem: 'mouse-pads.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 35,00',
  },
  {
    nome: 'Capas de celular',
    categoria: 'acessorios',
    descricao: 'Com a sua foto ou arte. Informe o modelo do seu celular ao pedir.',
    imagem: 'capas-de-celular.jpg',
    prazo: '5 dias úteis',
    preco: '',
    precoDemo: 'A partir de R$ 49,90',
  },

  // ----- Para empresas -----
  {
    nome: 'Brindes corporativos',
    categoria: 'corporativo',
    descricao: 'Brindes com a sua marca para clientes e equipe. Não há quantidade mínima fixa.',
    imagem: 'brindes.jpg',
    prazo: '',
    preco: 'Orçamento personalizado',
  },
  {
    nome: 'Personalizados para empresas',
    categoria: 'corporativo',
    descricao: 'Canecas, camisetas, banners e outros itens com a identidade da sua empresa.',
    imagem: 'empresas.jpg',
    prazo: '',
    preco: 'Orçamento personalizado',
  },
];

/* ==========================================================
   Ponto GIM | comportamento da página de login (paginas/entrar.html)
   As funções de login ficam em auth.js.
   ========================================================== */

import {
  configurado,
  entrarComGoogle,
  entrarComEmail,
  criarConta,
  recuperarSenha,
  traduzirErro,
} from './auth.js';

const abas = document.querySelectorAll('.aba');
const form = document.getElementById('form-login');
const campoNome = document.getElementById('campo-nome');
const inputNome = document.getElementById('login-nome');
const inputEmail = document.getElementById('login-email');
const inputSenha = document.getElementById('login-senha');
const botaoEnviar = document.getElementById('btn-enviar');
const botaoGoogle = document.getElementById('btn-google');
const botaoEsqueci = document.getElementById('btn-esqueci');
const linhaEsqueci = document.getElementById('linha-esqueci');
const mensagem = document.getElementById('mensagem');

let modo = 'entrar';
let ocupado = false;

/* ---------- Mensagens ---------- */
function mostrarMensagem(tipo, texto) {
  if (!texto) {
    mensagem.hidden = true;
    return;
  }
  mensagem.textContent = texto;
  mensagem.className = 'mensagem mensagem--' + tipo;
  mensagem.hidden = false;
}

function ocupar(sim) {
  ocupado = sim;
  [botaoEnviar, botaoGoogle, botaoEsqueci].forEach((b) => { b.disabled = sim; });
}

/* ---------- Abas: Entrar / Criar conta ---------- */
function trocarModo(novo) {
  modo = novo;
  abas.forEach((aba) => {
    const ativa = aba.dataset.modo === novo;
    aba.setAttribute('aria-selected', String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
  });

  const criando = novo === 'criar';
  campoNome.hidden = !criando;
  linhaEsqueci.hidden = criando;
  botaoEnviar.textContent = criando ? 'Criar conta' : 'Entrar';
  inputSenha.autocomplete = criando ? 'new-password' : 'current-password';
  form.setAttribute('aria-labelledby', criando ? 'aba-criar' : 'aba-entrar');
  mostrarMensagem('erro', '');
}

abas.forEach((aba) => {
  aba.addEventListener('click', () => trocarModo(aba.dataset.modo));
  // Setas do teclado trocam de aba
  aba.addEventListener('keydown', (evento) => {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return;
    const outra = [...abas].find((a) => a !== aba);
    outra.focus();
    trocarModo(outra.dataset.modo);
  });
});

/* ---------- E-mail e senha ---------- */
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (ocupado) return;

  const email = inputEmail.value.trim();
  const senha = inputSenha.value;
  if (!email) return mostrarMensagem('erro', traduzirErro({ code: 'auth/missing-email' }));
  if (!senha) return mostrarMensagem('erro', traduzirErro({ code: 'auth/missing-password' }));

  mostrarMensagem('erro', '');
  ocupar(true);
  try {
    if (modo === 'criar') await criarConta(inputNome.value.trim(), email, senha);
    else await entrarComEmail(email, senha);
    // Deu certo: o auth.js percebe que a pessoa entrou e abre o site
    mostrarMensagem('ok', 'Tudo certo! Abrindo o site...');
  } catch (erro) {
    mostrarMensagem('erro', traduzirErro(erro));
    ocupar(false);
  }
});

/* ---------- Google ---------- */
botaoGoogle.addEventListener('click', async () => {
  if (ocupado) return;
  mostrarMensagem('erro', '');
  ocupar(true);
  try {
    await entrarComGoogle();
    mostrarMensagem('ok', 'Tudo certo! Abrindo o site...');
  } catch (erro) {
    mostrarMensagem('erro', traduzirErro(erro));
    ocupar(false);
  }
});

/* ---------- Esqueci minha senha ---------- */
botaoEsqueci.addEventListener('click', async () => {
  if (ocupado) return;
  const email = inputEmail.value.trim();
  if (!email) {
    mostrarMensagem('erro', 'Digite o seu e-mail no campo acima e clique em "Esqueci minha senha" de novo.');
    inputEmail.focus();
    return;
  }
  ocupar(true);
  try {
    await recuperarSenha(email);
    // A mesma resposta para qualquer e-mail: não revela quem tem conta
    mostrarMensagem('ok', 'Se existir uma conta com esse e-mail, enviamos o link para criar uma nova senha. Confira também a caixa de spam.');
  } catch (erro) {
    mostrarMensagem('erro', traduzirErro(erro));
  }
  ocupar(false);
});

/* ---------- Avisos ---------- */
if (!configurado) {
  document.getElementById('aviso-config').hidden = false;
  [botaoEnviar, botaoGoogle, botaoEsqueci].forEach((b) => { b.disabled = true; });
}

// O Google não deixa entrar por dentro do navegador do Instagram e do Facebook
if (/Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent)) {
  document.getElementById('aviso-instagram').hidden = false;
}

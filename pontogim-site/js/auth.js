/* ==========================================================
   Ponto GIM | login com Firebase Authentication

   Carregue em toda página que deve respeitar o login:
     <script type="module" src="js/auth.js"></script>

   O que este arquivo faz:
   - se o login não estiver configurado, não faz nada (o site abre normal);
   - se EXIGIR_LOGIN for true, leva quem não entrou para paginas/entrar.html;
   - ajusta o link "Entrar" / "Sair" do menu ([data-auth-link]);
   - oferece as funções de login usadas por js/entrar.js.

   AVISO: esta trava é só visual. Os arquivos do site continuam
   públicos para quem digitar o endereço direto. Ela serve para
   identificar clientes, não para proteger segredos.
   ========================================================== */

import { firebaseConfig, EXIGIR_LOGIN } from './firebase-config.js';

const VERSAO_FIREBASE = '10.14.1';
const CDN = 'https://www.gstatic.com/firebasejs/' + VERSAO_FIREBASE + '/';

export const configurado = ['apiKey', 'authDomain', 'projectId', 'appId']
  .every((chave) => Boolean(firebaseConfig[chave]));

// A raiz do site é a pasta acima de js/, não importa onde o site esteja hospedado
const RAIZ = new URL('../', import.meta.url);
export const URL_LOGIN = new URL('paginas/entrar.html', RAIZ).href;

const ehPaginaLogin = document.body.dataset.pagina === 'entrar';

// Libera a página (o <head> esconde o corpo até sabermos se o visitante entrou)
const mostrarPagina = () => document.documentElement.classList.remove('auth-pendente');

/* ---------- Firebase (carregado só quando necessário) ---------- */
let pronto = null;

function sdk() {
  if (!configurado) return Promise.resolve(null);
  if (!pronto) {
    pronto = Promise.all([
      import(CDN + 'firebase-app.js'),
      import(CDN + 'firebase-auth.js'),
    ]).then(([appMod, authMod]) => {
      const app = appMod.initializeApp(firebaseConfig);
      const auth = authMod.getAuth(app);
      auth.languageCode = 'pt-BR';
      return { ...authMod, auth };
    });
  }
  return pronto;
}

/* ---------- Funções usadas pela página de login ---------- */
export async function entrarComGoogle() {
  const s = await sdk();
  return s.signInWithPopup(s.auth, new s.GoogleAuthProvider());
}

export async function entrarComEmail(email, senha) {
  const s = await sdk();
  return s.signInWithEmailAndPassword(s.auth, email, senha);
}

export async function criarConta(nome, email, senha) {
  const s = await sdk();
  const credencial = await s.createUserWithEmailAndPassword(s.auth, email, senha);
  if (nome) await s.updateProfile(credencial.user, { displayName: nome });
  return credencial;
}

export async function recuperarSenha(email) {
  const s = await sdk();
  return s.sendPasswordResetEmail(s.auth, email);
}

export async function sair() {
  const s = await sdk();
  return s.signOut(s.auth);
}

const MENSAGENS_DE_ERRO = {
  'auth/invalid-email': 'E-mail inválido. Confira e tente de novo.',
  'auth/missing-email': 'Digite o seu e-mail.',
  'auth/missing-password': 'Digite a sua senha.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Esse e-mail já tem conta. Use a aba "Entrar".',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Verifique a internet e tente de novo.',
  'auth/popup-blocked': 'O navegador bloqueou a janela do Google. Libere os pop-ups ou use e-mail e senha.',
  'auth/unauthorized-domain': 'Este endereço do site ainda não foi autorizado no Firebase.',
  'auth/operation-not-allowed': 'Este tipo de login ainda não foi ativado no Firebase.',
  'auth/popup-closed-by-user': '',
  'auth/cancelled-popup-request': '',
};

// Devolve o texto para mostrar ao cliente ('' = não mostrar nada)
export function traduzirErro(erro) {
  const codigo = erro && erro.code;
  if (codigo in MENSAGENS_DE_ERRO) return MENSAGENS_DE_ERRO[codigo];
  return 'Não foi possível entrar agora. Tente de novo em instantes.';
}

/* ---------- Destino depois de entrar ---------- */
// Só aceita caminhos do próprio site (começando com uma barra), para ninguém
// montar um link que leve o cliente para outro endereço depois do login.
export function destinoDepoisDoLogin() {
  const pedido = new URLSearchParams(window.location.search).get('voltar') || '';
  const caminhoLogin = new URL(URL_LOGIN).pathname;
  const seguro =
    pedido.startsWith('/') &&
    !pedido.startsWith('//') &&
    !pedido.startsWith('/\\') &&
    !pedido.startsWith(caminhoLogin);
  return seguro ? pedido : RAIZ.pathname;
}

/* ---------- Link "Entrar" / "Sair" do menu ---------- */
function atualizarLinks(usuario) {
  document.querySelectorAll('[data-auth-link]').forEach((link) => {
    link.hidden = !configurado;
    if (!configurado) return;

    if (usuario) {
      link.textContent = 'Sair';
      link.href = '#';
      link.title = usuario.email || '';
      link.onclick = (evento) => {
        evento.preventDefault();
        sair();
      };
    } else {
      link.textContent = 'Entrar';
      link.href = URL_LOGIN;
      link.removeAttribute('title');
      link.onclick = null;
    }
  });
}

/* ---------- Início ---------- */
async function iniciar() {
  atualizarLinks(null);

  // Sem configuração, o site nunca fica trancado
  if (!configurado) {
    mostrarPagina();
    return;
  }

  // Quando o login não é obrigatório, a página aparece na hora
  if (!EXIGIR_LOGIN || ehPaginaLogin) mostrarPagina();

  let s;
  try {
    s = await sdk();
  } catch (erro) {
    // Se o Firebase não carregar (internet ruim, bloqueio), o site abre mesmo assim
    console.error('Não foi possível carregar o login:', erro);
    mostrarPagina();
    return;
  }

  s.onAuthStateChanged(s.auth, (usuario) => {
    if (ehPaginaLogin) {
      if (usuario) window.location.replace(destinoDepoisDoLogin());
      return;
    }

    if (EXIGIR_LOGIN && !usuario) {
      const voltar = window.location.pathname + window.location.search + window.location.hash;
      window.location.replace(URL_LOGIN + '?voltar=' + encodeURIComponent(voltar));
      return;
    }

    mostrarPagina();
    atualizarLinks(usuario);
  });
}

iniciar();

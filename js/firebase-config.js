/* ==========================================================
   Ponto GIM | configuração do login (Firebase Authentication)

   1. Crie o projeto no Firebase (passo a passo no LEIA-ME).
   2. Cole abaixo os valores que o Firebase mostra em
      Configurações do projeto > Seus apps > App da Web.
   3. Enquanto os campos estiverem vazios, o login fica DESLIGADO
      e o site abre normalmente para todo mundo.

   Esses valores não são senhas: o Firebase foi feito para que
   fiquem visíveis no site. Quem protege a conta é a lista de
   "domínios autorizados" no painel do Firebase.
   ========================================================== */

export const firebaseConfig = {
  apiKey: 'AIzaSyC5NMp3eTd04KFMG380EFdf00wnRPi_CEk',
  authDomain: 'ponto-gim.firebaseapp.com',
  projectId: 'ponto-gim',
  appId: '1:16433478462:web:334fc00093a3b3d4214a6f',
};

/* true  = o visitante precisa entrar antes de ver o site.
   false = o site abre para todos e aparece um botão "Entrar" no menu. */
export const EXIGIR_LOGIN = false;

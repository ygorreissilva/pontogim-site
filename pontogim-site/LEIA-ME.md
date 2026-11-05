# Site Ponto GIM

Site feito só com HTML, CSS e JavaScript, sem framework e sem instalar nada.
Para ver: abra o `index.html` (de preferência com a extensão Live Server do VS Code).

## Estrutura
```
pontogim-site/
├── index.html            página inicial (fica na raiz: é o que o Vercel procura)
├── 404.html              página "não encontrada" (o Vercel usa sozinho)
├── paginas/
│   ├── catalogo.html     catálogo com filtro por categoria
│   ├── entrar.html       página de login (Google e e-mail)
│   └── privacidade.html  Política de Privacidade (pública, abre sem login)
├── css/
│   ├── style.css         cores, fontes e layout de todo o site (variáveis em :root)
│   ├── catalogo.css      estilos só do catálogo
│   ├── entrar.css        estilos só do login
│   └── privacidade.css   estilos só da Política de Privacidade
├── js/
│   ├── comum.js          WhatsApp, menu, ano do rodapé (carregue primeiro em toda página)
│   ├── script.js         só da home: montador de caneca e orçamento
│   ├── produtos.js       DADOS do catálogo (é aqui que se edita produto, prazo e preço)
│   ├── catalogo.js       monta filtros e cartões do catálogo
│   ├── firebase-config.js  configuração do login e a chave EXIGIR_LOGIN
│   ├── auth.js           login e trava do site (módulo)
│   └── entrar.js         comportamento da página de login
├── img/                  logo, mascote e fotos
│   └── produtos/         fotos do catálogo
└── LEIA-ME.md
```
Páginas dentro de `paginas/` usam `../` para chegar em `css/`, `js/` e `img/`.

## O que já veio das respostas da loja
- Marca somente **Ponto GIM Gráfica e Personalizados** (Ponto GIM Tech fora do site; sem quadros personalizados).
- Slogan, história, três diferenciais, horário, WhatsApp, e-mail, Instagram, CNPJ no rodapé.
- Categorias aprovadas, prazos de produção, formas de pagamento, entrega, regras de arte, aprovação, sinal e troca.
- Preços: a própria loja atualiza em `js/produtos.js`. Campo `preco` vazio mostra "Consulte o valor".

## Ainda pendente (não inventar; o site está pronto para receber)
| Item | Onde entra |
| --- | --- |
| Razão social exata (cartão CNPJ) | rodapé do `index.html` (comentário PENDENTE) |
| CEP, bairro e ponto de referência | seção Contato do `index.html` (comentário PENDENTE) |
| Link do perfil da loja no Google Maps | botão "Ver no mapa" (hoje busca pelo endereço) |
| Logo original (PDF, SVG, AI ou PNG transparente) | `img/logo.png`, trocar o `<span class="logo-mark">` pelo `<img>` indicado no comentário do cabeçalho (no catálogo e no 404 também) |
| Panda original (PNG transparente ou vetor) | `img/mascote.png` (aparece em "Como pedir" e no 404 sozinho) |
| Cores e fontes oficiais | variáveis em `:root` do `css/style.css` |
| Fotos originais de cada produto | `img/produtos/` com os nomes de `js/produtos.js`; fotos grandes dos cartões da home em `img/` (caneca.jpg, vestuario.jpg, adesivos.jpg, festas.jpg, banners.jpg, outros.jpg, empresas.jpg) |
| Fotos da fachada, interior e produção | seção "Nossa história" |
| 3 a 5 depoimentos reais, com autorização | seção própria (comentário DEPOIMENTOS no `index.html`) |
| Tabela de preços fixos e variáveis | campo `preco` em `js/produtos.js` |
| Medidas dos azulejos; modelos e tamanhos de canecas e copos; grade e cores do vestuário | descrições em `js/produtos.js` |
| Formatos de arquivo aceitos (PNG, JPG, PDF, vetor) | passo 1 de "Como pedir" |
| Regiões, taxas e prazos da entrega por motoboy | card "Entrega" em "Prazos, pagamento e entrega" |
| Valor do sinal e condição para pagar o restante | passo 3 de "Como pedir" e card "Pagamento" |
| Datas sazonais para campanhas | faixa do topo da home |
| Autorização do uso de fotos com clientes ou marcas de terceiros | antes de publicar essas fotos |
| Domínio pontogim.com.br (verificar e registrar) e titularidade das contas | combinar com a loja |
| Decisão da loja sobre o login (obrigatório, opcional ou nenhum) | `EXIGIR_LOGIN` em `js/firebase-config.js` |
| Aprovação da Política de Privacidade (pontos abaixo) | `paginas/privacidade.html` |
| Projeto Firebase criado e configurado | `js/firebase-config.js` |

## Textos que eu escrevi e que a loja precisa aprovar
Estas frases não estavam nas respostas da loja; foram escritas para preencher o catálogo e a home:
- Descrições curtas dos cartões da home e dos 16 itens do catálogo.
- Prazo de 3 dias úteis nas peças de vestuário (regra "camisas e produtos em DTF") e de 5 dias nos topos de bolo, relógios, azulejos, mouse pads, capas de celular e banners (regra "banners e demais personalizados"). Convites digitais e itens corporativos ficam sem prazo.
- "Do P ao G3" nas camisetas tradicionais (a grade exata ainda precisa ser conferida).

## Como editar um produto
Abra `js/produtos.js` e copie um bloco `{ ... }` da lista `PRODUTOS`:
- `categoria` precisa ser igual a um `id` da lista `CATEGORIAS`
- `imagem` é o nome do arquivo dentro de `img/produtos/`
- `prazo` em dias úteis, ou `''` para não mostrar
- `preco`: `''` mostra "Consulte o valor"; ou escreva `'R$ 35,00'` ou `'A partir de R$ 35,00'`

## Login (Firebase Authentication)
Já vem pronto, mas **desligado**: enquanto `js/firebase-config.js` estiver com os campos vazios, o site abre normalmente para todos.

**Ligar o login**
1. Em console.firebase.google.com, crie um projeto (de preferência na conta Google da loja, para ela ser dona dos cadastros).
2. **Build > Authentication > Começar > Método de login**: ative **Google** (escolha um e-mail de suporte) e **E-mail/senha**.
3. **Authentication > Configurações > Domínios autorizados**: adicione o endereço do site (o `.vercel.app` e, depois, `pontogim.com.br`). O `localhost` já vem liberado; se o Live Server abrir em `127.0.0.1`, adicione também.
4. **Configurações do projeto > Seus apps > Web (`</>`)**: registre o app e copie `apiKey`, `authDomain`, `projectId` e `appId` para `js/firebase-config.js`.
5. Teste pelo Live Server ou pelo site publicado. Abrir o `index.html` com dois cliques não funciona, porque módulos JavaScript precisam de um servidor.

**Trava ou botão opcional?** Em `js/firebase-config.js`:
- `EXIGIR_LOGIN = true`: quem não entrou é levado para a página de login antes de ver o site.
- `EXIGIR_LOGIN = false` (modo atual): o site abre para todos e aparece "Entrar" no menu.
- Se um dia ligar a trava (`true`), recoloque no `<head>` do `index.html` e do `catalogo.html` o script que esconde a página até o login ser checado (a classe `auth-pendente`), para o conteúdo não piscar antes do redirecionamento.

**Onde ficam os cadastros:** Firebase > Authentication > Usuários (nome, e-mail e data). Dá para exportar.

**Pontos de atenção**
- A trava é visual. Os arquivos continuam acessíveis a quem digitar o endereço direto; ela não protege segredos.
- Quem chega pelo Instagram abre o site dentro do navegador do app, e o Google bloqueia o login ali. A página avisa e oferece e-mail e senha.
- Exigir login antes de ver o site afasta clientes e impede o Google de indexar as páginas. Considere `EXIGIR_LOGIN = false`.
- Coletar e-mail exige aviso de privacidade (LGPD). A página `paginas/privacidade.html` já existe, mas é um RASCUNHO: a loja precisa confirmar os pontos da lista abaixo antes de publicar.
- Se o Firebase não carregar, o site abre mesmo assim (a loja nunca fica fora do ar por causa do login).

## Política de Privacidade: pontos que a loja precisa confirmar
O texto foi escrito a partir do que o site faz hoje e **não substitui a revisão de um advogado**. Antes de publicar, confirmar:
- Razão social exata (comentário PENDENTE na seção 1).
- "Não vendemos os seus dados e não os usamos para nada além disso": é isso mesmo que a loja pratica? Se for mandar promoções ou novidades por WhatsApp ou e-mail, incluir isso nas finalidades e pedir consentimento.
- "Este site não usa cookies de publicidade nem ferramentas de estatística": vale hoje. Se for instalar Google Analytics, pixel do Instagram ou similares, atualizar o texto.
- Prazos de guarda de pedidos e conversas (hoje o texto diz "pelo tempo necessário"). A contabilidade da loja pode indicar o prazo fiscal.
- Quem atende os pedidos dos titulares (hoje: o e-mail da loja e o WhatsApp).
- Se o provedor de hospedagem ou o login mudarem, atualizar as seções 5 e 6.
- A página é pública de propósito (não carrega `js/auth.js`), para abrir mesmo com `EXIGIR_LOGIN = true`.

## Publicar: GitHub + Vercel
1. Na pasta do projeto: `git init`, `git add .`, `git commit -m "mensagem"`, `git branch -M main`.
2. No GitHub, crie o repositório, rode `git remote add origin ...` e `git push -u origin main`.
3. No Vercel: **Add New > Project**, importe o repositório. Framework Preset: **Other**; build e output em branco. **Deploy**.
4. A cada `git push`, o Vercel publica a atualização sozinho.

Atenção: o plano gratuito do Vercel (Hobby) é só para uso pessoal e não comercial. Antes de usar como site oficial da loja, definir a hospedagem (o mesmo repositório publica em Netlify, Cloudflare Pages ou GitHub Pages).

## Como o WhatsApp funciona
Todo botão com `data-wa="mensagem"` abre `wa.me/5521997437808` com essa mensagem pronta.
O número fica na primeira linha do `js/comum.js` (`const WHATSAPP`).

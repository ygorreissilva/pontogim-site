/* Caneca 3D interativa da Ponto GIM — usa Three.js local em js/vendor/. */
import * as THREE from './vendor/three.module.js';

const etapa = document.querySelector('.stage');
const visor = document.getElementById('mug-3d');
const controles = document.getElementById('mug-3d-controls');
const botaoCentralizar = document.getElementById('mug-3d-reset');
const campoTexto = document.getElementById('mug-text');
const formulario = document.getElementById('builder');

if (etapa && visor && formulario) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    visor.appendChild(renderer.domElement);

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 50);
    camera.position.set(1.35, 1.75, 4.15);
    camera.lookAt(0.12, 0.78, 0);

    cena.add(new THREE.HemisphereLight(0xffffff, 0x393047, 2.2));
    const luzPrincipal = new THREE.DirectionalLight(0xffffff, 3.2);
    luzPrincipal.position.set(-3, 4.5, 4);
    cena.add(luzPrincipal);
    const luzRecorte = new THREE.DirectionalLight(0xcbbcff, 1.5);
    luzRecorte.position.set(3, 2, -3);
    cena.add(luzRecorte);
    const luzFrontal = new THREE.DirectionalLight(0xffffff, 1.1);
    luzFrontal.position.set(1, 2.5, 4);
    cena.add(luzFrontal);

    const caneca = new THREE.Group();
    cena.add(caneca);

    const tecido = document.createElement('canvas');
    tecido.width = 1024;
    tecido.height = 512;
    const contexto = tecido.getContext('2d');
    const textura = new THREE.CanvasTexture(tecido);
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.wrapS = THREE.RepeatWrapping;
    textura.offset.x = 0.5;

    const corpoMaterial = new THREE.MeshPhysicalMaterial({
      color: '#f4f1f8',
      map: textura,
      roughness: 0.23,
      metalness: 0,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    });
    const corMaterial = new THREE.MeshPhysicalMaterial({
      color: '#08acd0',
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.16,
      side: THREE.DoubleSide,
    });
    const interiorMaterial = new THREE.MeshPhysicalMaterial({
      color: '#08acd0',
      roughness: 0.24,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });

    const paredeExterna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.74, 0.67, 1.36, 96, 1, true),
      corpoMaterial,
    );
    paredeExterna.position.y = 0.75;
    caneca.add(paredeExterna);

    const fundoExterno = new THREE.Mesh(
      new THREE.CylinderGeometry(0.67, 0.67, 0.1, 96),
      corpoMaterial,
    );
    fundoExterno.position.y = 0.1;
    caneca.add(fundoExterno);

    const paredeInterna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.63, 0.58, 1.14, 96, 1, true),
      interiorMaterial,
    );
    paredeInterna.position.y = 0.85;
    caneca.add(paredeInterna);

    const fundoInterno = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.035, 96),
      interiorMaterial,
    );
    fundoInterno.position.y = 0.27;
    caneca.add(fundoInterno);

    const borda = new THREE.Mesh(
      new THREE.TorusGeometry(0.685, 0.045, 18, 96),
      corMaterial,
    );
    borda.rotation.x = Math.PI / 2;
    borda.position.y = 1.43;
    caneca.add(borda);

    const caminhoAlca = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.66, 1.12, 0),
      new THREE.Vector3(0.96, 1.17, 0),
      new THREE.Vector3(1.22, 1.04, 0.02),
      new THREE.Vector3(1.31, 0.82, 0.04),
      new THREE.Vector3(1.26, 0.57, 0.04),
      new THREE.Vector3(1.08, 0.38, 0.02),
      new THREE.Vector3(0.68, 0.39, 0),
    ]);
    const alca = new THREE.Mesh(
      new THREE.TubeGeometry(caminhoAlca, 72, 0.095, 18, false),
      corMaterial,
    );
    caneca.add(alca);

    const sombra = new THREE.Mesh(
      new THREE.CircleGeometry(1, 64),
      new THREE.MeshBasicMaterial({ color: 0x080512, transparent: true, opacity: 0.24 }),
    );
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.set(0.08, 0.045, 0);
    sombra.scale.set(0.9, 0.52, 1);
    cena.add(sombra);

    const fontes = {
      forte: { family: 'Anton, Impact, sans-serif', weight: '400', style: 'normal', uppercase: true },
      manuscrita: { family: 'Yellowtail, cursive', weight: '400', style: 'normal', uppercase: false },
      classica: { family: 'Playfair Display, Georgia, serif', weight: '700', style: 'italic', uppercase: false },
    };

    function linhasDoTexto(valor, maximo = 12, limite = 3) {
      const palavras = valor.trim().split(/\s+/).filter(Boolean);
      const linhas = [];
      let atual = '';
      palavras.forEach((palavra) => {
        const tentativa = atual ? atual + ' ' + palavra : palavra;
        if (tentativa.length <= maximo || !atual) atual = tentativa;
        else { linhas.push(atual); atual = palavra; }
      });
      if (atual) linhas.push(atual);
      while (linhas.length > limite) {
        const ultima = linhas.pop();
        linhas[linhas.length - 1] += ' ' + ultima;
      }
      return linhas;
    }

    function atualizarEstampa() {
      const estilo = fontes[formulario.elements.fonte.value];
      const valor = campoTexto.value || 'Seu nome aqui';
      const linhas = linhasDoTexto(estilo.uppercase ? valor.toUpperCase() : valor);
      const maior = Math.max(1, ...linhas.map((linha) => linha.length));
      const tamanho = Math.min(98, 440 / maior);

      contexto.clearRect(0, 0, tecido.width, tecido.height);
      contexto.fillStyle = '#f4f1f8';
      contexto.fillRect(0, 0, tecido.width, tecido.height);
      contexto.fillStyle = '#1b1625';
      contexto.textAlign = 'center';
      contexto.textBaseline = 'middle';
      contexto.font = `${estilo.style} ${estilo.weight} ${tamanho}px ${estilo.family}`;

      const alturaLinha = tamanho * 1.08;
      const inicioY = tecido.height / 2 - ((linhas.length - 1) * alturaLinha) / 2;
      linhas.forEach((linha, indice) => {
        contexto.fillText(linha, tecido.width / 2, inicioY + indice * alturaLinha, 460);
      });
      textura.needsUpdate = true;
      renderizar();
    }

    function atualizarCor() {
      const cor = formulario.elements.cor.value;
      corMaterial.color.set(cor);
      interiorMaterial.color.set(cor);
      renderizar();
    }

    function renderizar() {
      renderer.render(cena, camera);
    }

    function redimensionar() {
      const largura = visor.clientWidth;
      const altura = visor.clientHeight;
      if (!largura || !altura) return;
      renderer.setSize(largura, altura, false);
      camera.aspect = largura / altura;
      camera.updateProjectionMatrix();
      renderizar();
    }

    function centralizar() {
      caneca.rotation.set(0, 0.08, 0);
      renderizar();
    }

    let arrastando = false;
    let ultimoX = 0;
    let ultimoY = 0;
    visor.addEventListener('pointerdown', (evento) => {
      if (evento.button !== undefined && evento.button !== 0) return;
      arrastando = true;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      visor.setPointerCapture(evento.pointerId);
      evento.preventDefault();
    });
    visor.addEventListener('pointermove', (evento) => {
      if (!arrastando) return;
      const dx = evento.clientX - ultimoX;
      const dy = evento.clientY - ultimoY;
      ultimoX = evento.clientX;
      ultimoY = evento.clientY;
      caneca.rotation.y += dx * 0.012;
      caneca.rotation.x = THREE.MathUtils.clamp(caneca.rotation.x + dy * 0.008, -0.42, 0.42);
      renderizar();
    });
    const pararArrasto = () => { arrastando = false; };
    visor.addEventListener('pointerup', pararArrasto);
    visor.addEventListener('pointercancel', pararArrasto);
    visor.addEventListener('lostpointercapture', pararArrasto);
    visor.addEventListener('keydown', (evento) => {
      const passo = 0.14;
      if (evento.key === 'ArrowLeft') caneca.rotation.y -= passo;
      else if (evento.key === 'ArrowRight') caneca.rotation.y += passo;
      else if (evento.key === 'ArrowUp') caneca.rotation.x = THREE.MathUtils.clamp(caneca.rotation.x - passo, -0.42, 0.42);
      else if (evento.key === 'ArrowDown') caneca.rotation.x = THREE.MathUtils.clamp(caneca.rotation.x + passo, -0.42, 0.42);
      else return;
      evento.preventDefault();
      renderizar();
    });

    botaoCentralizar.addEventListener('click', centralizar);
    campoTexto.addEventListener('input', atualizarEstampa);
    formulario.querySelectorAll('input[name="fonte"]').forEach((opcao) => {
      opcao.addEventListener('change', atualizarEstampa);
    });
    formulario.querySelectorAll('input[name="cor"]').forEach((opcao) => {
      opcao.addEventListener('change', atualizarCor);
    });

    etapa.classList.add('stage--3d');
    controles.hidden = false;
    centralizar();
    atualizarCor();
    atualizarEstampa();

    if ('ResizeObserver' in window) new ResizeObserver(redimensionar).observe(visor);
    else window.addEventListener('resize', redimensionar);
    document.fonts?.ready.then(atualizarEstampa);
  } catch (erro) {
    etapa.classList.remove('stage--3d');
    if (controles) controles.hidden = true;
    if (visor) visor.replaceChildren();
    renderer?.dispose();
    console.warn('A prévia 3D não pôde ser iniciada; a ilustração continua disponível.', erro);
  }
}

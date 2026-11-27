const paginas = [...document.querySelectorAll('.pagina')];
const links = [...document.querySelectorAll('.navegacao a')];
const curriculo = document.getElementById('curriculo');
const neon = curriculo.querySelector('.crimson-neon');
const retrato = curriculo.querySelector('.retrato');
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
const permiteGiro = window.matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');

retrato.addEventListener('pointermove', evento => {
  if (evento.pointerType !== 'mouse' || !permiteGiro.matches) return;
  const area = retrato.getBoundingClientRect();
  const x = (evento.clientX - area.left) / area.width - .5;
  const y = (evento.clientY - area.top) / area.height - .5;
  retrato.style.setProperty('--giro-x', `${-y * 12}deg`);
  retrato.style.setProperty('--giro-y', `${x * 16}deg`);
});
retrato.addEventListener('pointerleave', () => {
  retrato.style.removeProperty('--giro-x');
  retrato.style.removeProperty('--giro-y');
});

let curriculoAberto = false;

for (const bloco of curriculo.querySelectorAll('.curriculo-grid > :is(.contato-curriculo, .formacao-curriculo)')) {
  bloco.addEventListener('pointermove', evento => {
    if (evento.pointerType !== 'mouse' || !permiteGiro.matches) return;
    const area = bloco.getBoundingClientRect();
    const posicao = (evento.clientX - area.left) / area.width - .5;
    const altura = (evento.clientY - area.top) / area.height - .5;
    bloco.style.setProperty('--vertical', `${-altura * 4}deg`);
    bloco.style.setProperty('--ajuste', `${posicao * 5}deg`);
  });
  bloco.addEventListener('pointerleave', () => {
    bloco.style.removeProperty('--ajuste');
    bloco.style.removeProperty('--vertical');
  });
}

function abrirCurriculo() {
  if (curriculoAberto) return;
  curriculoAberto = true;
  const espera = movimentoReduzido.matches ? 0 : 450;
  Promise.all([neon.decode(), new Promise(resolve => setTimeout(resolve, espera))])
    .then(() => neon.classList.add('acesa'), () => {});

  const moldura = new Image();
  moldura.src = 'assets/curriculo/Borda.png';
  Promise.allSettled([moldura.decode(), retrato.querySelector('img').decode()]).then(() => {
    if (!curriculo.hidden && !movimentoReduzido.matches) {
      retrato.classList.add('entrada-retrato');
      retrato.addEventListener('animationend', () => retrato.classList.remove('entrada-retrato'), { once: true });
    }
    retrato.classList.add('foto-pronta');
  });
  if (movimentoReduzido.matches) return;

  if (!('IntersectionObserver' in window)) return;
  const secoes = curriculo.querySelectorAll('.curriculo-grid > section');
  const observador = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      if (entrada.intersectionRatio >= .12) revelar(entrada.target);
    }
  }, { threshold: .12 });

  function revelar(secao) {
    observador.unobserve(secao);
    secao.classList.remove('pendente');
  }

  secoes.forEach(secao => {
    secao.classList.add('pendente');
    observador.observe(secao);
  });
  curriculo.addEventListener('focusin', evento => {
    const secao = evento.target.closest('section.pendente');
    if (secao) revelar(secao);
  });
  movimentoReduzido.addEventListener('change', evento => {
    if (evento.matches) {
      retrato.classList.remove('entrada-retrato');
      secoes.forEach(revelar);
    }
  });
}
const nomes = { curriculo: 'Currículo', projetos: 'V-Tec Motors', scrum: 'Scrum Dungeon', lin0: 'LIN0' };
const passagem = document.querySelector('.passagem-yoru');
const faixa = document.querySelector('.faixa-yoru');
const recarregou = performance.getEntriesByType('navigation')[0]?.type === 'reload';
const chavePosicao = 'crimson:posicao:' + location.pathname;
let posicaoSalva;
try {
  if (recarregou) {
    const registro = JSON.parse(sessionStorage.getItem(chavePosicao));
    if (registro?.hash === location.hash) posicaoSalva = registro;
  }
} catch {
  // Se o armazenamento estiver indisponível, o navegador restaura a rolagem.
}
let restaurandoPosicao = Boolean(posicaoSalva);
if (restaurandoPosicao) history.scrollRestoration = 'manual';

let yoruExibida = false;
let ultimaRolagem = window.scrollY;
let quadroPassagem = 0;

function suavizar(valor) {
  const t = Math.max(0, Math.min(1, valor));
  return t * t * (3 - 2 * t);
}

function acompanharPassagem() {
  const anterior = ultimaRolagem;
  ultimaRolagem = window.scrollY;
  if (curriculo.hidden) return;

  const altura = window.innerHeight;
  const area = faixa.getBoundingClientRect();
  const topoProjetos = passagem.getBoundingClientRect().top;
  const progresso = (altura - area.top) / (altura + area.height);
  const emCena = !movimentoReduzido.matches && progresso > 0 && topoProjetos > 1;
  const subindo = ultimaRolagem < anterior;
  const yoruEstavaVisivel = faixa.classList.contains('mostra-yoru');
  const fimDaImagem = .73;
  if (yoruEstavaVisivel && (subindo || progresso >= fimDaImagem)) yoruExibida = true;

  let imagem = 0;
  if (emCena) {
    const breu = suavizar(progresso / .24) * suavizar((1 - progresso) / .21);
    if (!restaurandoPosicao && !yoruExibida && !subindo && (ultimaRolagem > anterior || yoruEstavaVisivel)) {
      const entrada = suavizar((progresso - .24) / .16);
      const saida = suavizar((progresso - .47) / (fimDaImagem - .47));
      imagem = entrada * (1 - saida);
    }
    faixa.style.setProperty('--breu', breu);
    faixa.style.setProperty('--yoru', imagem);
    faixa.style.setProperty('--escala', 1.06 + .10 * suavizar((progresso - .24) / .46));

    const pulso = suavizar((progresso - .80) / .065) * suavizar((.93 - progresso) / .05);
    const luzAmbiente = .32 * pulso + suavizar((progresso - .91) / .09);
    const luzCards = suavizar((progresso - .80) / .20);
    passagem.style.setProperty('--luz-ambiente', luzAmbiente);
    passagem.style.setProperty('--luz-cards', luzCards);
  } else if (faixa.classList.contains('em-cena')) {
    faixa.style.removeProperty('--breu');
    passagem.style.removeProperty('--luz-ambiente');
    passagem.style.removeProperty('--luz-cards');
  }
  faixa.classList.toggle('em-cena', emCena);
  faixa.classList.toggle('mostra-yoru', imagem > 0);
  passagem.classList.toggle('em-transicao', emCena);

  const nosProjetos = topoProjetos <= altura * .24;
  destacarNavegacao(nosProjetos ? '#area-projetos' : '#curriculo');
}

window.addEventListener('scroll', () => {
  if (quadroPassagem) return;
  quadroPassagem = requestAnimationFrame(() => {
    quadroPassagem = 0;
    acompanharPassagem();
  });
}, { passive: true });
window.addEventListener('resize', acompanharPassagem);
movimentoReduzido.addEventListener('change', acompanharPassagem);

function destacarNavegacao(hash) {
  links.forEach(link => {
    if (link.hash === hash) {
      if (!link.hasAttribute('aria-current')) link.setAttribute('aria-current', 'page');
    } else if (link.hasAttribute('aria-current')) link.removeAttribute('aria-current');
  });
}

function atualizarPagina(evento) {
  if (evento && location.hash === '#conteudo') return;
  const destinoProjetos = location.hash === "#area-projetos";
  const ativa = paginas.find(pagina => `#${pagina.id}` === location.hash) || paginas[0];
  paginas.forEach(pagina => { pagina.hidden = pagina !== ativa; });
  document.body.dataset.pagina = ativa.id;
  if (ativa === curriculo) abrirCurriculo();
  else retrato.classList.remove('entrada-retrato');
  destacarNavegacao(destinoProjetos ? "#area-projetos" : `#${ativa.id}`);
  document.title = `${nomes[ativa.id]} — Alef Gabriel`;
  if (destinoProjetos && (!restaurandoPosicao || evento)) {
    passagem.focus({ preventScroll: true });
    passagem.scrollIntoView({ block: 'start', behavior: 'instant' });
    ultimaRolagem = window.scrollY;
  } else if (evento) {
    (ativa.querySelector('h1') || ativa).focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  acompanharPassagem();
}
window.addEventListener('hashchange', atualizarPagina);
atualizarPagina();
// O navegador pode restaurar a rolagem depois da inicialização dos scripts.
window.addEventListener('pageshow', () => {
  if (restaurandoPosicao) {
    const inicioProjetos = window.scrollY + passagem.getBoundingClientRect().top;
    const destino = posicaoSalva.emProjetos && !curriculo.hidden
      ? inicioProjetos + posicaoSalva.deslocamento
      : posicaoSalva.deslocamento;
    window.scrollTo({ top: destino, behavior: 'instant' });
    ultimaRolagem = window.scrollY;
    restaurandoPosicao = false;
  }
  acompanharPassagem();
});
window.addEventListener('pagehide', () => {
  // Um segundo F5 pode ocorrer antes de a primeira restauração terminar.
  if (restaurandoPosicao) return;
  const topoProjetos = passagem.getBoundingClientRect().top;
  const emProjetos = !curriculo.hidden && (
    topoProjetos <= 1 || faixa.classList.contains('em-cena')
  );
  const deslocamento = emProjetos ? Math.max(0, -topoProjetos) : window.scrollY;
  try {
    sessionStorage.setItem(chavePosicao, JSON.stringify({
      hash: location.hash, emProjetos, deslocamento
    }));
  } catch {
    // A restauração nativa continua disponível.
  }
});

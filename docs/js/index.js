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

function abrirCurriculo() {
  if (curriculoAberto) return;
  curriculoAberto = true;
  const espera = movimentoReduzido.matches ? 0 : 450;
  Promise.all([neon.decode(), new Promise(resolve => setTimeout(resolve, espera))])
    .then(() => neon.classList.add('acesa'), () => {});

  const moldura = new Image();
  moldura.src = 'assets/images/Borda.png';
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

function atualizarPagina(evento) {
  if (evento && location.hash === '#conteudo') return;
  const ativa = paginas.find(pagina => `#${pagina.id}` === location.hash) || paginas[0];
  paginas.forEach(pagina => { pagina.hidden = pagina !== ativa; });
  document.body.dataset.pagina = ativa.id;
  if (ativa === curriculo) abrirCurriculo();
  else retrato.classList.remove('entrada-retrato');
  links.forEach(link => {
    if (link.hash === `#${ativa.id}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${nomes[ativa.id]} — Alef Gabriel`;
  if (evento) {
    ativa.querySelector('h1').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', atualizarPagina);
atualizarPagina();

if (location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  const teste = document.querySelector('.crimson-teste');
  const nivel = teste.querySelector('input');
  const percentual = teste.querySelector('output');
  const sombraNormal = 2 / 15;

  function ajustarClaridade() {
    const valor = nivel.valueAsNumber;
    const sombra = valor <= 55
      ? 1 - (1 - sombraNormal) * valor / 55
      : sombraNormal * Math.max(0, (75 - valor) / 20);
    const brilho = Math.max(0, (valor - 75) / 25);

    document.body.style.setProperty('--crimson-sombra', sombra);
    document.body.style.setProperty('--crimson-luz', brilho);
    percentual.value = `${valor}%`;
  }

  nivel.addEventListener('input', ajustarClaridade);
  ajustarClaridade();
  teste.hidden = false;
}

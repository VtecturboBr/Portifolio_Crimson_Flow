const paginas = [...document.querySelectorAll('.pagina')];
const links = [...document.querySelectorAll('.navegacao a')];
const nomes = { curriculo: 'Currículo', projetos: 'V-Tec Motors', scrum: 'Scrum Dungeon', lin0: 'LIN0' };

function atualizarPagina(evento) {
  if (evento && location.hash === '#conteudo') return;
  const ativa = paginas.find(pagina => `#${pagina.id}` === location.hash) || paginas[0];
  paginas.forEach(pagina => { pagina.hidden = pagina !== ativa; });
  document.body.dataset.pagina = ativa.id;
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

const neon = document.querySelector('.crimson-neon');
neon.decode().then(() => neon.classList.add('acesa'), () => {});

if (location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  const teste = document.querySelector('.crimson-teste');
  const nivel = teste.querySelector('input');
  const percentual = teste.querySelector('output');
  const arte = neon.parentElement;
  const sombraNormal = 2 / 15;

  function ajustarClaridade() {
    const valor = nivel.valueAsNumber;
    const sombra = valor <= 55
      ? 1 - (1 - sombraNormal) * valor / 55
      : sombraNormal * Math.max(0, (75 - valor) / 20);
    const brilho = Math.max(0, (valor - 75) / 25);

    arte.style.setProperty('--crimson-sombra', sombra);
    arte.style.setProperty('--crimson-luz', brilho);
    percentual.value = `${valor}%`;
  }

  nivel.addEventListener('input', ajustarClaridade);
  ajustarClaridade();
  teste.hidden = false;
}

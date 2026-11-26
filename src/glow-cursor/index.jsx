import { createRoot } from 'react-dom/client';
import GlowCursor from './GlowCursor';

export function montarCursor() {
  const permitido = matchMedia('(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)');

  const cursor = document.createElement('div');
  cursor.className = 'crimson-cursor';
  cursor.hidden = true;
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<div class="rastro-glow"></div><span class="ponteiro-crimson"><span class="seta-crimson"></span><span class="legenda-cursor"></span></span>';
  document.body.append(cursor);
  const [rastro, ponteiro] = cursor.children;
  const [seta, legenda] = ponteiro.children;
  let raiz;
  let x, y;
  let pulso;

  function ocultar() {
    cursor.hidden = true;
    document.documentElement.classList.remove('crimson-pointer');
    pulso?.cancel();
  }

  function montarRastro() {
    if (raiz) return;
    raiz = createRoot(rastro);
    raiz.render(
      <GlowCursor color="#ff0037" intensity={0.3} trailWidth={3} linger={0.3} followSpeed={1}
        glow={3} clickBurst theme="dark" />
    );
  }

  function atualizar(alvo) {
    if (!alvo || alvo.isContentEditable || alvo.closest('textarea, select, iframe, input:not([type=range]):not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio])')) {
      ocultar();
      return;
    }
    const link = alvo.closest('a[href]');
    const projeto = link && ['#projetos', '#scrum', '#lin0'].includes(link.getAttribute('href'));
    const externo = link?.target === '_blank' && link.closest('#projetos, #scrum, #lin0');
    const texto = externo ? 'OPEN' : projeto || alvo.closest('.projeto, .lin0-capa') ? 'VIEW' : '';
    if (legenda.textContent !== texto) legenda.textContent = texto;
    cursor.classList.toggle('interativo', Boolean(texto || link || alvo.closest('button, summary, input, [role="button"]')));
    if (cursor.hidden) {
      cursor.hidden = false;
      document.documentElement.classList.add('crimson-pointer');
    }
    ponteiro.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    montarRastro();
  }

  window.addEventListener('pointermove', evento => {
    if (!permitido.matches || evento.pointerType !== 'mouse') return ocultar();
    x = evento.clientX;
    y = evento.clientY;
    atualizar(evento.target);
  }, { passive: true });
  window.addEventListener('pointerdown', evento => {
    if (evento.pointerType !== 'mouse') return ocultar();
    if (cursor.hidden || evento.button !== 0) return;
    pulso?.cancel();
    pulso = seta.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(.73)', offset: .22 },
      { transform: 'scale(1)' }
    ], { duration: 270, easing: 'cubic-bezier(.23, 1, .32, 1)' });
  });
  window.addEventListener('scroll', () => {
    if (!cursor.hidden) atualizar(document.elementFromPoint(x, y));
  }, { passive: true, capture: true });
  document.documentElement.addEventListener('pointerleave', ocultar);
  window.addEventListener('pointercancel', ocultar);
  window.addEventListener('blur', ocultar);
  window.addEventListener('hashchange', ocultar);
  document.addEventListener('visibilitychange', () => { if (document.hidden) ocultar(); });
  permitido.addEventListener('change', () => {
    ocultar();
    if (!permitido.matches) {
      raiz?.unmount();
      raiz = undefined;
    }
  });
}

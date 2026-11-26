import { createRoot } from 'react-dom/client';
import TechText from './TechText';
import { montarCursor } from '../glow-cursor';

const curriculo = document.getElementById('curriculo');
const container = document.getElementById('tech-text-curriculo');

async function montarNome() {
  if (curriculo.hidden) return;
  window.removeEventListener('hashchange', montarNome);
  try {
    await document.fonts.load('600 64px "Akira Expanded Demo"', 'Alef Gabriel');
  } catch {
    // O componente também pode desenhar com a fonte alternativa.
  }

  createRoot(container).render(
    <TechText
      text="Alef Gabriel "
      fontFamily='"Akira Expanded Demo", Arial, sans-serif'
      fontWeight={600}
      fontSize={450}
      reveal="letter"
      dashLength={4}
      dashGap={2}
      specks={15}
      intro="type"
      introDuration={2}
      clickKick
      guides={false}
      accentColor="#ffffff"
      lineStyle="solid"
      color="#ff0037"
      sweep={false}
    />
  );
}

window.addEventListener('hashchange', montarNome);
montarNome();
montarCursor();

import { createRoot } from 'react-dom/client';
import TechText from './TechText';

const curriculo = document.getElementById('curriculo');
const container = document.getElementById('tech-text-curriculo');

function montarNome() {
  if (curriculo.hidden) return;
  window.removeEventListener('hashchange', montarNome);

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

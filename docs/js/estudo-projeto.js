/** @param {HTMLDialogElement} dialog @param {PortfolioProject[]} projects */
function createProjectCase(dialog, projects) {
  const find = selector => dialog.querySelector(selector);
  const panel = find('.case-panel');
  const scroll = find('.case-scroll');
  const gallery = find('.case-gallery');
  const stage = find('.case-stage');
  const markers = find('.case-markers');
  const expand = find('.case-expand');
  const closeButton = find('.case-close');
  const inertInZoom = ['.case-bar', '.case-intro', '.case-story', '.case-browse'].map(find);
  let projectIndex = 0;
  let mediaIndex = 0;
  let media = [];
  let trigger;
  let entering;
  let closing = false;
  let touchStart;
  const wrap = (index, length) => (index + length) % length;

  function element(tag, text) {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  }

  function link(label, url) {
    const node = element('a', label);
    node.href = url;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  }

  function showMedia(index, crossfade = true) {
    mediaIndex = wrap(index, media.length);
    const item = media[mediaIndex];
    const previous = stage.querySelector('.case-outgoing') || stage.querySelector('img');
    const keepPrevious = crossfade && previous?.naturalWidth && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    stage.replaceChildren();
    touchStart = null;
    stage.dataset.kind = item.kind;
    const isImage = item.kind === 'image' || item.kind === 'gif';
    stage.tabIndex = isImage ? 0 : -1;
    if (isImage) { stage.setAttribute('role','button'); stage.setAttribute('aria-label','Alternar ampliação: ' + item.alt); }
    else { stage.removeAttribute('role'); stage.removeAttribute('aria-label'); }
    expand.hidden = !gallery.classList.contains('is-expanded');
    if (isImage) {
      const image = new Image();
      image.alt = item.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.src = item.src;
      stage.append(image);
      if (keepPrevious) {
        previous.className = 'case-outgoing';
        previous.alt = '';
        previous.setAttribute('aria-hidden', 'true');
        stage.append(previous);
        image.decode().catch(() => {}).then(() => {
          if (image.parentElement !== stage) return;
          const fade = previous.animate([{opacity:1}, {opacity:0}], {duration:180, easing:'ease-out'});
          fade.finished.then(() => {
            if (image.parentElement === stage) previous.remove();
          });
        });
      }
    } else if (item.kind === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', item.alt);
      video.src = item.src;
      stage.append(video);
    } else {
      // Mount third-party players only on request. The external link also works if embedding is restricted.
      const preview = document.createElement('div');
      preview.className = 'case-player';
      const thumbnail = new Image();
      thumbnail.alt = '';
      thumbnail.src = 'assets/projetos/galeria/video-' + encodeURIComponent(item.src) + '.jpg';
      thumbnail.onerror = () => {
        thumbnail.onerror = null;
        thumbnail.src = 'https://i.ytimg.com/vi/' + encodeURIComponent(item.src) + '/hqdefault.jpg';
      };
      preview.append(thumbnail);
      const watch = link('Assistir no YouTube ↗', 'https://www.youtube.com/watch?v=' + encodeURIComponent(item.src));
      // Local files have no HTTP referrer for YouTube's embedded-player identification.
      if (location.protocol === 'https:') {
        const play = element('button', '▶  Reproduzir apresentação');
        play.type = 'button';
        play.onclick = () => {
          const player = document.createElement('iframe');
          player.title = item.alt;
          const url = new URL('https://www.youtube.com/embed/' + encodeURIComponent(item.src));
          url.searchParams.set('origin', location.origin);
          url.searchParams.set('autoplay', '1');
          player.referrerPolicy = 'origin';
          player.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
          player.src = url.href;
          watch.className = 'case-watch';
          stage.replaceChildren(player, watch);
          player.focus();
        };
        preview.append(play);
      }
      preview.append(watch);
      stage.append(preview);
    }
    find('.case-caption').textContent = `${mediaIndex + 1} / ${media.length}　${item.caption}`;
    [...markers.children].forEach((marker, i) => marker.setAttribute('aria-pressed', String(i === mediaIndex)));
  }

  function zoom(on) {
    gallery.classList.toggle('is-expanded', on);
    inertInZoom.forEach(node => { node.inert = on; });
    scroll.classList.toggle('zoom-active', on);
    expand.setAttribute('aria-pressed', String(on));
    expand.setAttribute('aria-label', on ? 'Sair da ampliação' : 'Ampliar imagem');
    expand.textContent = on ? '×' : '⛶';
    expand.hidden = !on;
    (on ? expand : stage).focus({preventScroll:true});
  }

  function section(title, content, source) {
    const section = document.createElement('section');
    section.append(element('h3', title));
    if (Array.isArray(content)) {
      const list = document.createElement('ul');
      list.append(...content.map(item => element('li', item)));
      section.append(list);
    } else {
      section.append(element('p', content));
    }
    if (source) section.append(link(source.label + ' ↗', source.url));
    return section;
  }

  function render(index) {
    projectIndex = wrap(index, projects.length);
    const p = projects[projectIndex];
    panel.style.setProperty('--case-accent', p.theme.accent);
    panel.style.setProperty('--case-light', p.theme.light);
    panel.style.setProperty('--case-surface', p.theme.surface);
    find('.case-category').textContent = p.type.toLocaleLowerCase('pt-BR');
    const title = find('#dialog-title img');
    title.src = p.title;
    title.alt = p.name;
    find('.case-summary').textContent = p.description;
    const actions = [link('GitHub ↗', p.url)];
    if (p.demo) actions.push(link(p.demo.label + ' ↗', p.demo.url));
    find('.case-actions').replaceChildren(...actions);

    media = p.media.length ? p.media : [{kind:'image', src:p.cover, alt:'Arte de capa de ' + p.name, caption:'Arte de capa'}];
    markers.replaceChildren(...media.map((item, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Mostrar ' + item.caption);
      button.dataset.mediaIndex = String(i);
      return button;
    }));
    markers.parentElement.querySelectorAll('[data-slide], .case-markers').forEach(node => { node.hidden = media.length === 1; });
    showMedia(0, false);
    const stack = section('Stack tecnológica', p.tags);
    stack.className = 'case-stack';
    find('.case-story').replaceChildren(
      section('Visão geral', p.overview), section('Problema e solução', p.problem),
      section('Funcionalidades', p.features), section('Minha contribuição', p.contributions, p.evidence),
      stack, section('Equipe e contexto', p.context)
    );
    for (const button of dialog.querySelectorAll('[data-project-step]')) {
      button.querySelector('strong').textContent = projects[wrap(projectIndex + Number(button.dataset.projectStep), projects.length)].name;
    }
    scroll.scrollTop = 0;
  }

  async function close() {
    if (closing || !dialog.open) return;
    closing = true;
    if (gallery.classList.contains('is-expanded')) zoom(false);
    await entering;
    dialog.classList.add('is-closing');
    try {
      await animateProjectCase(dialog, trigger, false);
    } finally {
      dialog.close();
    }
  }

  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    if (gallery.classList.contains('is-expanded')) zoom(false);
    else close();
  });
  dialog.addEventListener('close', () => {
    stage.replaceChildren();
    dialog.classList.remove('is-closing');
    document.documentElement.classList.remove('case-open');
    trigger?.focus({preventScroll:true});
    closing = false;
  });
  dialog.addEventListener('click', event => {
    if (closing) return;
    const button = event.target.closest('button');
    if (event.target === dialog || button === closeButton) return void close();
    if (button === expand) return zoom(!gallery.classList.contains('is-expanded'));
    if (button?.hasAttribute('data-media-index')) return showMedia(Number(button.dataset.mediaIndex));
    if (button?.hasAttribute('data-slide')) return showMedia(mediaIndex + Number(button.dataset.slide));
    if (button?.hasAttribute('data-project-step')) {
      render(projectIndex + Number(button.dataset.projectStep));
      find('#dialog-title').focus({preventScroll:true});
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        scroll.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'none'}], {duration:180,easing:'ease-out'});
      }
    }
  });
  dialog.addEventListener('keydown', event => {
    if (closing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Tab') {
      const container = gallery.classList.contains('is-expanded') ? gallery : panel;
      const stops = [...container.querySelectorAll('button, [tabindex="0"], a[href], video[controls], iframe')].filter(node => node.getClientRects().length);
      const first = stops[0], last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    } else if (['ArrowLeft','ArrowRight'].includes(event.key) && !event.target.closest('video, iframe')) {
      event.preventDefault();
      showMedia(mediaIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  let suppressTap = false;
  stage.addEventListener('click', () => {
    if (!suppressTap && stage.tabIndex === 0) zoom(!gallery.classList.contains('is-expanded'));
    suppressTap = false;
  });
  stage.addEventListener('keydown', event => {
    if (event.target === stage && ['Enter',' '].includes(event.key)) {
      event.preventDefault();
      zoom(!gallery.classList.contains('is-expanded'));
    }
  });
  stage.addEventListener('pointerdown', event => {
    suppressTap = false;
    if (event.pointerType === 'touch' && event.isPrimary && !event.target.closest('button,a,video,iframe')) {
      touchStart = {x:event.clientX, y:event.clientY};
      stage.setPointerCapture(event.pointerId);
    }
  });
  stage.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) { suppressTap = true; showMedia(mediaIndex + (dx < 0 ? 1 : -1)); }
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });

  return {open(id, button) {
    const index = projects.findIndex(p => p.id === id);
    if (dialog.open || closing || index < 0) return;
    trigger = button;
    render(index);
    document.documentElement.classList.add('case-open');
    dialog.showModal();
    closeButton.focus({preventScroll:true});
    entering = animateProjectCase(dialog, trigger, true);
  }};
}

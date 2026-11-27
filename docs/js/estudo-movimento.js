// Both endpoints are measured once, before composing the card and cover transforms.
async function animateProjectCase(dialog, trigger, opening) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const panel = dialog.querySelector('.case-panel');
  const stage = dialog.querySelector('.case-stage');
  const source = trigger.closest('.project-face').getBoundingClientRect();
  const destination = panel.getBoundingClientRect();
  const cover = trigger.getBoundingClientRect();
  const frame = stage.getBoundingClientRect();
  const artVisible = frame.bottom > destination.top + 55 && frame.top < destination.bottom;
  const transform = (from, to) =>
    `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  const timing = { duration: opening ? 340 : 250, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'both',
    direction: opening ? 'normal' : 'reverse' };
  const animations = [panel.animate([
    {transform: transform(source, destination), opacity: 0.15},
    {transform: 'none', opacity: 1}
  ], timing)];

  // Keep the cover independent of the panel scale and its inner scroll position.
  const ghost = trigger.querySelector('img').cloneNode();
  ghost.className = 'case-flight';
  ghost.alt = '';
  ghost.setAttribute('aria-hidden', 'true');
  const end = artVisible ? frame : destination;
  Object.assign(ghost.style, {left: end.x + 'px', top: end.y + 'px', width: end.width + 'px', height: end.height + 'px'});
  dialog.append(ghost);
  animations.push(ghost.animate([
    {transform: transform(cover, end), opacity: 1},
    {opacity: artVisible ? 1 : 0, offset: 0.72},
    {transform: 'none', opacity: 0}
  ], timing));

  try {
    await Promise.all(animations.map(animation => animation.finished));
  } finally {
    ghost.remove();
    animations.forEach(animation => animation.cancel());
  }
}

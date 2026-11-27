(() => {
const projects = portfolioProjects;
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tagMarkup=p=>p.tags.map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join('');
const titleMarkup = project => `<img class="titulo-projeto" src="${project.title}" alt="${escapeHTML(project.name)}">`;
const coverMarkup=p=>`<div class="cover ${p.id}"><div class="art" aria-hidden="true"><img src="${p.cover}" alt="" width="832" height="468" decoding="sync" draggable="false"></div></div>`;
const grid=document.querySelector('#grid');grid.innerHTML=projects.map(p=>`<article class="project" data-id="${p.id}"><div class="project-face"><button class="cover-button" type="button" aria-label="Explorar ${escapeHTML(p.name)}" data-open="${p.id}">${coverMarkup(p)}</button><div class="body"><div class="meta">${p.type}</div><h2>${titleMarkup(p)}</h2><p class="description">${escapeHTML(p.description)}</p><div class="tags">${tagMarkup(p)}</div></div><div class="specular" aria-hidden="true"></div><div class="tribal-frame" aria-hidden="true"></div></div></article>`).join('');
const dialog = document.querySelector('#projectDialog');
const cases = createProjectCase(dialog, projects);
grid.addEventListener('click', event => {
  const card = event.target.closest('.project');
  if (!card || (window.getSelection()?.toString() && !event.target.closest('button'))) return;
  const trigger = card.querySelector('[data-open]');
  if (trigger) cases.open(trigger.dataset.open, trigger);
});
function filterProjects(value){let count=0;grid.querySelectorAll('.project').forEach((el,i)=>{const show=value==='all'||projects[i].category===value;el.hidden=!show;if(show)count++});document.querySelector('#count').textContent=`${count} ${count===1?'projeto':'projetos'}`;document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)))}document.querySelector('.filters').addEventListener('click',e=>{const b=e.target.closest('.filter');if(b)filterProjects(b.dataset.filter)});filterProjects('all');

// 3D hover: stable outer hit area, frame-rate independent interpolation, explicit transforms.
const tiltMedia=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const tiltCards=[...grid.querySelectorAll('.project')].map(card=>{
  const face=card.querySelector('.project-face'), image=card.querySelector('.art img'), glare=card.querySelector('.specular');
  const s={card,face,image,glare,active:false,x:0,y:0,p:0,tx:0,ty:0,tp:0,frame:0,last:0,w:0,h:0};
  function paint(){const {x,y,p,w,h}=s; face.style.transform=`rotateX(${(-y*7).toFixed(3)}deg) rotateY(${(x*7).toFixed(3)}deg) translate3d(0,${(-p*4).toFixed(2)}px,${(p*8).toFixed(2)}px) scale(${(1+p*.012).toFixed(4)})`; image.style.transform=`translate3d(${(-x*8).toFixed(2)}px,${(-y*5).toFixed(2)}px,0) scale(${(1.035+p*.045).toFixed(4)})`;glare.style.opacity=(p*.85).toFixed(3);glare.style.setProperty('--gx',`${x*w*.31}px`);glare.style.setProperty('--gy',`${y*h*.31}px`);}
  function tick(now){const dt=s.last?Math.min(now-s.last,50):16.7;s.last=now;const k=1-Math.exp(-dt/75);s.x+=(s.tx-s.x)*k;s.y+=(s.ty-s.y)*k;s.p+=(s.tp-s.p)*k;const rest=Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y)+Math.abs(s.tp-s.p)<.003;if(rest){s.x=s.tx;s.y=s.ty;s.p=s.tp;}paint();if(rest){s.frame=0;s.last=0;if(!s.active){face.style.removeProperty('transform');image.style.removeProperty('transform');glare.style.removeProperty('opacity');}}else s.frame=requestAnimationFrame(tick);}
  function wake(){if(!s.frame)s.frame=requestAnimationFrame(tick);}
  function move(e){if(!tiltMedia.matches||e.pointerType==='touch'||card.hidden||dialog.open)return;const r=card.getBoundingClientRect();s.w=r.width;s.h=r.height;s.tx=Math.max(-1,Math.min(1,2*(e.clientX-r.left)/r.width-1));s.ty=Math.max(-1,Math.min(1,2*(e.clientY-r.top)/r.height-1));s.active=true;s.tp=1;wake();}
  function leave(){s.active=false;s.tx=s.ty=s.tp=0;wake();}
  function reset(){if(s.frame)cancelAnimationFrame(s.frame);Object.assign(s,{active:false,x:0,y:0,p:0,tx:0,ty:0,tp:0,frame:0,last:0});face.style.removeProperty('transform');image.style.removeProperty('transform');glare.style.removeProperty('opacity');}
  card.addEventListener('pointerenter',move);card.addEventListener('pointermove',move);card.addEventListener('pointerleave',leave);card.addEventListener('pointercancel',leave);
  return {reset,leave};
});
tiltMedia.addEventListener('change',()=>tiltCards.forEach(s=>s.reset()));
window.addEventListener('blur',()=>tiltCards.forEach(s=>s.reset()));
window.addEventListener('scroll',()=>tiltCards.forEach(s=>s.leave()),{passive:true});
document.querySelector('.filters').addEventListener('click',()=>tiltCards.forEach(s=>s.reset()));
grid.addEventListener('click',e=>{if(e.target.closest('[data-open]'))tiltCards.forEach(s=>s.reset());});
})();

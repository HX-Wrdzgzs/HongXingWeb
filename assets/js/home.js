(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const desktop=matchMedia('(min-width:761px)');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
qsa('[data-mark3d]').forEach(stage=>{
  const src='assets/img/hongxing-logo.svg';
  const paint=()=>{
    const isDesk=desktop.matches,layers=isDesk?28:14;
    stage.replaceChildren();
    for(let i=0;i<layers;i++){
      const layer=d.createElement('div');layer.className='hx-logo-layer';layer.style.zIndex=i;
      const img=d.createElement('img');img.src=src;img.alt=i===layers-1?'Hong Xing':'';img.draggable=false;img.decoding='async';
      if(i<layers-1){const t=i/(layers-1);img.style.filter=`brightness(${.27+.66*t}) saturate(${.7+.3*t})`;}
      layer.style.transform=`translate3d(${i*.34}px,${i*.27}px,${i*1.72}px)`;
      layer.appendChild(img);stage.appendChild(layer);
    }
    stage.style.transform=isDesk?'rotateX(-4deg) rotateY(-9deg)':'rotateX(-2deg) rotateY(-5deg)';
  };
  paint();
  desktop.addEventListener?.('change',paint);
  if(!reduced){
    const host=stage.closest('.hx-hero-mark');
    host?.addEventListener('pointermove',e=>{
      if(!desktop.matches)return;
      const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      stage.style.transform=`rotateX(${-4-y*13}deg) rotateY(${-9+x*18}deg) rotateZ(${x*1.5}deg) scale(1.015)`;
    });
    host?.addEventListener('pointerleave',()=>{if(desktop.matches)stage.style.transform='rotateX(-4deg) rotateY(-9deg)'});
  }
});
const pTrack=qs('[data-project-track]'),projects=qsa('[data-project]'),pPrev=qs('[data-project-prev]'),pNext=qs('[data-project-next]'),pCount=qs('[data-project-count]'),pProgress=qs('[data-project-progress]');
let pIndex=0;
function projectStep(){if(!projects[0]||!pTrack)return 0;return projects[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(pTrack).gap)||0)}
function paintProject(animate=true){
  if(!projects.length)return;
  pIndex=clamp(pIndex,0,projects.length-1);
  projects.forEach((x,i)=>x.classList.toggle('active',i===pIndex));
  if(desktop.matches&&pTrack){pTrack.style.transition=animate?'.72s cubic-bezier(.2,.78,.2,1)':'none';pTrack.style.transform=`translate3d(${-pIndex*projectStep()}px,0,0)`}
  else if(pTrack){pTrack.style.transform='none'}
  if(pCount)pCount.textContent=String(pIndex+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');
  if(pProgress)pProgress.style.width=((pIndex+1)/projects.length*100)+'%';
  if(pPrev)pPrev.disabled=pIndex===0;if(pNext)pNext.disabled=pIndex===projects.length-1;
}
pPrev?.addEventListener('click',()=>{pIndex--;paintProject()});
pNext?.addEventListener('click',()=>{pIndex++;paintProject()});
addEventListener('resize',()=>paintProject(false));paintProject(false);
const quickSteps=qsa('[data-quick-step]'),quickCore=qs('[data-quick-core]'),quickNumber=qs('[data-quick-number]'),rings=qsa('.hx-ring');
function setQuick(i){
  i=clamp(i,0,quickSteps.length-1);
  quickSteps.forEach((x,n)=>x.classList.toggle('active',n===i));
  const step=quickSteps[i];
  if(quickCore)quickCore.textContent=step?.dataset.label||'START';
  if(quickNumber)quickNumber.textContent=step?.dataset.number||String(i+1).padStart(2,'0');
  rings.forEach((r,n)=>{const sign=n%2?1:-1;r.style.rotate=`${sign*(i+1)*(18+n*12)}deg`});
}
if(quickSteps.length){
  setQuick(0);
  quickSteps.forEach((step,i)=>step.addEventListener('mouseenter',()=>desktop.matches&&setQuick(i)));
  const qio=new IntersectionObserver(entries=>{
    if(!desktop.matches)return;
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible)setQuick(quickSteps.indexOf(visible.target));
  },{threshold:[.28,.45,.62],rootMargin:'-18% 0px -28%'});
  quickSteps.forEach(x=>qio.observe(x));
}
function buildCity(host,type){
  if(!host)return;host.replaceChildren();
  const specs=type==='nanjing'?[[3,24,88,0],[16,30,148,1],[32,22,112,0],[48,37,176,0],[69,28,132,1],[86,22,94,0]]:[[4,26,78,0],[18,22,112,0],[34,34,86,0],[53,21,132,0],[70,31,94,0],[86,23,72,0]];
  specs.forEach(([x,w,h,red],i)=>{const b=d.createElement('i');b.className='hx-building'+(red?' red':'');b.style.setProperty('--x',x+'%');b.style.setProperty('--w',w+'px');b.style.setProperty('--h',h+'px');b.style.setProperty('--i',i);host.appendChild(b)});
}
qsa('[data-city]').forEach(x=>buildCity(x,x.dataset.city));
const cityScene=qs('[data-city-scene]'),transfer=qs('[data-transfer-progress]');
function paintMigration(){
  if(!cityScene||!transfer)return;
  const r=cityScene.getBoundingClientRect(),p=clamp((innerHeight*.78-r.top)/(innerHeight*.78+r.height*.55),0,1);
  if(innerWidth<=760){transfer.style.width='100%';transfer.style.height=(p*100)+'%'}else{transfer.style.height='100%';transfer.style.width=(p*100)+'%'}
  const nj=qs('.hx-city.nanjing .hx-city-model'),sz=qs('.hx-city.suzhou .hx-city-model');
  if(nj)nj.style.transform=`translate3d(${(1-p)*22}px,0,0) scale(${.96+p*.04})`;
  if(sz)sz.style.transform=`translate3d(${-(1-p)*15}px,0,0) scale(${1-p*.025})`;
  qsa('.hx-city.nanjing .hx-building').forEach((b,i)=>b.style.transform=`translateY(${Math.max(0,(1-p)*30+i*2)}px) skewY(-3deg)`);
}
addEventListener('scroll',paintMigration,{passive:true});addEventListener('resize',paintMigration);paintMigration();
const railButtons=qsa('.hx-rail button'),sections=qsa('[data-home-section]');
railButtons.forEach(b=>b.addEventListener('click',()=>qs(b.dataset.target)?.scrollIntoView({behavior:reduced?'auto':'smooth'})));
if(sections.length){
  const rio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)railButtons.forEach(b=>b.classList.toggle('active',b.dataset.target==='#'+e.target.id))}),{threshold:.34,rootMargin:'-10% 0px -35%'});
  sections.forEach(s=>rio.observe(s));
}
if(window.gsap&&window.ScrollTrigger&&!reduced){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.hx-hero-copy > *',{opacity:0,y:26,duration:.72,stagger:.07,ease:'power3.out',delay:.12});
  gsap.from('.hx-mark3d',{opacity:0,scale:.76,rotationZ:-7,duration:1.05,ease:'power3.out'});
  gsap.to('.hx-mark3d',{yPercent:-8,scale:.93,rotationZ:2,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hx-mark-orbit.orbit-a',{rotation:92,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hx-mark-orbit.orbit-b',{rotation:-84,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});
  qsa('.hx-principle').forEach((el,i)=>gsap.from(el,{opacity:0,y:36,duration:.65,delay:i*.05,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 84%'}}));
  qsa('.hx-update').forEach((el,i)=>gsap.from(el,{opacity:0,y:24,duration:.55,delay:i*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}}));
  if(desktop.matches){
    gsap.to('.hx-amia-visual img',{yPercent:-3,scale:1.025,ease:'none',scrollTrigger:{trigger:'.hx-amia',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.from('.hx-city.suzhou .hx-city-model',{opacity:.2,x:-36,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.hx-migration',start:'top 72%'}});
    gsap.from('.hx-city.nanjing .hx-city-model',{opacity:.15,x:42,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.hx-migration',start:'top 72%'}});
  }
}
})();
(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,desktop=matchMedia('(min-width:761px)');

qsa('[data-mark3d]').forEach(stage=>{
  const rebuild=()=>{
    const count=desktop.matches?28:14;stage.replaceChildren();
    for(let i=0;i<count;i++){
      const layer=d.createElement('div');layer.className='hx-logo-layer';layer.style.zIndex=i;
      const img=d.createElement('img');img.src='assets/img/hongxing-logo.svg';img.alt=i===count-1?'Hong Xing':'';img.draggable=false;img.decoding='async';
      if(i<count-1){const t=i/(count-1);img.style.filter=`brightness(${.28+.66*t}) saturate(${.72+.28*t})`;}
      layer.style.transform=`translate3d(${i*.34}px,${i*.27}px,${i*1.72}px)`;layer.appendChild(img);stage.appendChild(layer);
    }
    stage.style.transform=desktop.matches?'rotateX(-4deg) rotateY(-9deg)':'rotateX(-2deg) rotateY(-5deg)';
  };
  rebuild();desktop.addEventListener?.('change',rebuild);
  if(!reduced){
    const host=stage.closest('.hx-hero-mark');
    host?.addEventListener('pointermove',e=>{if(!desktop.matches)return;const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${-4-y*13}deg) rotateY(${-9+x*18}deg) rotateZ(${x*1.4}deg) scale(1.015)`;});
    host?.addEventListener('pointerleave',()=>{if(desktop.matches)stage.style.transform='rotateX(-4deg) rotateY(-9deg)';});
  }
});

const pStage=qs('[data-project-stage]'),pTrack=qs('[data-project-track]'),projects=qsa('[data-project]'),prev=qs('[data-project-prev]'),next=qs('[data-project-next]'),count=qs('[data-project-count]'),progress=qs('[data-project-progress]');
let pIndex=0,drag=null;
const step=()=>projects[0]&&pTrack?projects[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(pTrack).gap)||0):0;
function paintProject(animate=true){
  if(!projects.length)return;pIndex=clamp(pIndex,0,projects.length-1);projects.forEach((x,i)=>x.classList.toggle('active',i===pIndex));
  if(desktop.matches&&pTrack){pTrack.style.transition=animate?'.72s cubic-bezier(.2,.78,.2,1)':'none';pTrack.style.transform=`translate3d(${-pIndex*step()}px,0,0)`;}else if(pTrack)pTrack.style.transform='none';
  if(count)count.textContent=String(pIndex+1).padStart(2,'0')+' / '+String(projects.length).padStart(2,'0');if(progress)progress.style.width=((pIndex+1)/projects.length*100)+'%';if(prev)prev.disabled=pIndex===0;if(next)next.disabled=pIndex===projects.length-1;
}
prev?.addEventListener('click',()=>{pIndex--;paintProject()});next?.addEventListener('click',()=>{pIndex++;paintProject()});
if(pStage){
  pStage.addEventListener('pointerdown',e=>{if(!desktop.matches||e.pointerType==='mouse'&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null,start:-pIndex*step()};});
  pStage.addEventListener('pointermove',e=>{if(!desktop.matches||!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.axis&&Math.hypot(dx,dy)>9){drag.axis=Math.abs(dx)>Math.abs(dy)*1.25?'x':'y';if(drag.axis==='x')pStage.setPointerCapture?.(e.pointerId);else{drag=null;return;}}if(drag?.axis!=='x')return;e.preventDefault();pTrack.style.transition='none';pTrack.style.transform=`translate3d(${drag.start+dx}px,0,0)`;},{passive:false});
  const end=e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.x,axis=drag.axis;drag=null;if(axis==='x'&&Math.abs(dx)>Math.min(110,step()*.16))pIndex+=dx<0?1:-1;paintProject();};
  pStage.addEventListener('pointerup',end);pStage.addEventListener('pointercancel',end);
}
addEventListener('resize',()=>paintProject(false));paintProject(false);

const quickSteps=qsa('[data-quick-step]'),quickCore=qs('[data-quick-core]'),quickNumber=qs('[data-quick-number]'),rings=qsa('.hx-ring');
function setQuick(i){i=clamp(i,0,quickSteps.length-1);quickSteps.forEach((x,n)=>x.classList.toggle('active',n===i));const s=quickSteps[i];if(quickCore)quickCore.textContent=s?.dataset.label||'START';if(quickNumber)quickNumber.textContent=s?.dataset.number||String(i+1).padStart(2,'0');rings.forEach((r,n)=>r.style.rotate=`${(n%2?1:-1)*(i+1)*(18+n*12)}deg`);}
if(quickSteps.length){setQuick(0);quickSteps.forEach((s,i)=>s.addEventListener('mouseenter',()=>desktop.matches&&setQuick(i)));const io=new IntersectionObserver(entries=>{if(!desktop.matches)return;const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)setQuick(quickSteps.indexOf(v.target));},{threshold:[.25,.42,.6],rootMargin:'-16% 0px -26%'});quickSteps.forEach(s=>io.observe(s));}

function buildCity(host,type){if(!host)return;host.replaceChildren();const specs=type==='nanjing'?[[3,24,88,0],[16,30,148,1],[32,22,112,0],[48,37,176,0],[69,28,132,1],[86,22,94,0]]:[[4,26,78,0],[18,22,112,0],[34,34,86,0],[53,21,132,0],[70,31,94,0],[86,23,72,0]];specs.forEach(([x,w,h,red],i)=>{const b=d.createElement('i');b.className='hx-building'+(red?' red':'');b.style.setProperty('--x',x+'%');b.style.setProperty('--w',w+'px');b.style.setProperty('--h',h+'px');b.style.setProperty('--i',i);host.appendChild(b)});}
qsa('[data-city]').forEach(x=>buildCity(x,x.dataset.city));
const cityScene=qs('[data-city-scene]'),transfer=qs('[data-transfer-progress]');
function paintMigration(){if(!cityScene||!transfer)return;const r=cityScene.getBoundingClientRect(),p=clamp((innerHeight*.82-r.top)/(innerHeight*.82+r.height*.55),0,1);if(innerWidth<=760){transfer.style.width='100%';transfer.style.height=(p*100)+'%';}else{transfer.style.height='100%';transfer.style.width=(p*100)+'%';}const nj=qs('.hx-city.nanjing .hx-city-model'),sz=qs('.hx-city.suzhou .hx-city-model');if(nj)nj.style.transform=`translate3d(${(1-p)*22}px,0,0) scale(${.96+p*.04})`;if(sz)sz.style.transform=`translate3d(${-(1-p)*15}px,0,0) scale(${1-p*.025})`;qsa('.hx-city.nanjing .hx-building').forEach((b,i)=>b.style.translate=`0 ${Math.max(0,(1-p)*26+i*1.5)}px`);}
addEventListener('scroll',paintMigration,{passive:true});addEventListener('resize',paintMigration);paintMigration();

qsa('[data-target]').forEach(b=>{if(!b.closest('.hx-rail')&&!b.classList.contains('hx-scroll-cue'))return;b.addEventListener('click',()=>qs(b.dataset.target)?.scrollIntoView({behavior:reduced?'auto':'smooth'}));});
const railButtons=qsa('.hx-rail button'),sections=qsa('[data-home-section]');if(sections.length){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)railButtons.forEach(b=>b.classList.toggle('active',b.dataset.target==='#'+e.target.id));}),{threshold:.34,rootMargin:'-10% 0px -36%'});sections.forEach(s=>io.observe(s));}

if(window.gsap&&window.ScrollTrigger&&!reduced){
  gsap.registerPlugin(ScrollTrigger);gsap.from('.hx-hero-copy > *',{opacity:0,y:28,duration:.76,stagger:.075,ease:'power3.out',delay:.1});gsap.from('.hx-mark3d',{opacity:0,scale:.76,rotationZ:-7,duration:1.05,ease:'power3.out'});gsap.to('.hx-mark3d',{yPercent:-8,scale:.93,rotationZ:1.8,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.hx-mark-orbit.orbit-a',{rotation:95,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.hx-mark-orbit.orbit-b',{rotation:-86,ease:'none',scrollTrigger:{trigger:'.hx-hero',start:'top top',end:'bottom top',scrub:true}});if(desktop.matches){qsa('.hx-direction').forEach(el=>gsap.from(el.querySelector('.hx-direction-copy'),{opacity:0,y:36,duration:.72,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 75%'}}));gsap.to('.hx-amia-visual img',{scale:1.025,yPercent:-1.5,ease:'none',scrollTrigger:{trigger:'.hx-amia',start:'top bottom',end:'bottom top',scrub:true}});qsa('.hx-history-list article').forEach(el=>gsap.from(el,{opacity:0,y:28,duration:.55,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));}}
})();
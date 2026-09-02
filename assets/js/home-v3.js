(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
qsa('[data-logo3d]').forEach(stage=>{
  const layers=24;stage.replaceChildren();
  for(let i=0;i<layers;i++){
    const layer=d.createElement('div');layer.className='layer';layer.style.zIndex=i;
    const img=d.createElement('img');img.src='assets/img/hongxing-logo.svg';img.alt='';img.draggable=false;img.decoding='async';
    const t=i/(layers-1);img.style.filter=i===layers-1?'none':`brightness(${.32+.54*t}) saturate(${.65+.35*t})`;
    layer.appendChild(img);layer.style.transform=`translate3d(${i*.42}px,${i*.31}px,${i*2.15}px)`;stage.appendChild(layer);
  }
  stage.style.transform='rotateX(-5deg) rotateY(-10deg) rotateZ(-1deg)';
  if(!reduced&&matchMedia('(pointer:fine)').matches){
    const host=stage.closest('[data-hero-visual]')||stage;
    host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${-5-y*17}deg) rotateY(${-10+x*23}deg) rotateZ(${x*2}deg) scale(1.02)`;});
    host.addEventListener('pointerleave',()=>stage.style.transform='rotateX(-5deg) rotateY(-10deg) rotateZ(-1deg)');
  }
});
const reasonTabs=qsa('[data-reason]'),reasonPanels=qsa('[data-reason-panel]');
function setReason(i){reasonTabs.forEach((b,n)=>b.classList.toggle('active',n===i));reasonPanels.forEach((p,n)=>p.classList.toggle('active',n===i));}
reasonTabs.forEach((b,i)=>b.addEventListener('click',()=>setReason(i)));if(reasonTabs.length)setReason(0);
function initSlider({viewportSel,trackSel,itemSel,prevSel,nextSel,countSel,progressSel}){
  const viewport=qs(viewportSel),track=qs(trackSel);if(!viewport||!track)return;
  const items=qsa(itemSel,track),prev=qs(prevSel),next=qs(nextSel),count=qs(countSel),bar=qs(progressSel);if(!items.length)return;
  let idx=0,startX=0,startOffset=0,dragging=false;
  const step=()=>{const r=items[0].getBoundingClientRect(),gap=parseFloat(getComputedStyle(track).gap)||0;return r.width+gap;};
  const max=()=>Math.max(0,items.length-1);
  function render(animate=true){idx=clamp(idx,0,max());track.style.transition=animate?'':'none';track.style.transform=`translate3d(${-idx*step()}px,0,0)`;if(count)count.textContent=String(idx+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');if(bar)bar.style.width=((idx+1)/items.length*100)+'%';if(prev)prev.disabled=idx===0;if(next)next.disabled=idx===max();items.forEach((el,n)=>el.classList.toggle('is-active',n===idx));requestAnimationFrame(()=>track.style.transition='');}
  prev?.addEventListener('click',()=>{idx--;render();});next?.addEventListener('click',()=>{idx++;render();});
  viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;startX=e.clientX;startOffset=-idx*step();viewport.classList.add('dragging');viewport.setPointerCapture?.(e.pointerId);});
  viewport.addEventListener('pointermove',e=>{if(!dragging)return;track.style.transition='none';track.style.transform=`translate3d(${startOffset+(e.clientX-startX)}px,0,0)`;});
  function end(e){if(!dragging)return;const dx=e.clientX-startX;if(Math.abs(dx)>Math.min(120,step()*.16))idx+=dx<0?1:-1;dragging=false;viewport.classList.remove('dragging');render();}
  viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
  viewport.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)&&Math.abs(e.deltaX)>20){e.preventDefault();idx+=e.deltaX>0?1:-1;render();}},{passive:false});
  addEventListener('resize',()=>render(false));render(false);
}
initSlider({viewportSel:'[data-project-viewport]',trackSel:'[data-project-track]',itemSel:'[data-project-card]',prevSel:'[data-project-prev]',nextSel:'[data-project-next]',countSel:'[data-project-count]',progressSel:'[data-project-progress]'});
initSlider({viewportSel:'[data-news-viewport]',trackSel:'[data-news-track]',itemSel:'.nf-news-card',prevSel:'[data-news-prev]',nextSel:'[data-news-next]',countSel:'[data-news-count]',progressSel:'[data-news-progress]'});
initSlider({viewportSel:'.nf-history-viewport',trackSel:'[data-history-track]',itemSel:'article',prevSel:'[data-history-prev]',nextSel:'[data-history-next]',countSel:'[data-history-count]',progressSel:'[data-history-progress]'});
const tech=qs('.nf-tech'),techSteps=qsa('[data-tech-step]'),techCore=qs('[data-tech-core]'),techCurrent=qs('[data-tech-current]'),techIndexLine=qs('.nf-tech-index i');
function paintTech(){if(!tech||!techSteps.length)return;const r=tech.getBoundingClientRect(),total=Math.max(1,tech.offsetHeight-innerHeight),p=clamp(-r.top/total,0,1),idx=clamp(Math.floor(p*3),0,2);techSteps.forEach((s,n)=>s.classList.toggle('active',n===idx));if(techCore)techCore.textContent=techSteps[idx].dataset.label||'';if(techCurrent)techCurrent.textContent='0'+(idx+1);if(techIndexLine)techIndexLine.style.setProperty('--tech-p',((idx+1)/3*100)+'%');qsa('.nf-power-ring').forEach((ring,n)=>{ring.style.rotate=((p*150*(n%2?1:-1))+n*20)+'deg';});if(techCore)techCore.style.transform=`scale(${1+Math.sin(p*Math.PI*3)*.045})`;}
addEventListener('scroll',paintTech,{passive:true});paintTech();
const route=qs('[data-route]'),routeLine=qs('[data-route-line]');
function paintRoute(){if(!route||!routeLine)return;const r=route.getBoundingClientRect(),p=clamp((innerHeight*.82-r.top)/(innerHeight*.82+r.height*.35),0,1);if(innerWidth<=760){routeLine.style.width='3px';routeLine.style.height=(p*100)+'%';}else{routeLine.style.height='3px';routeLine.style.width=(p*100)+'%';}}
addEventListener('scroll',paintRoute,{passive:true});addEventListener('resize',paintRoute);paintRoute();
if(window.gsap&&window.ScrollTrigger&&!reduced){gsap.registerPlugin(ScrollTrigger);const logo=qs('.nf-logo3d');if(logo){gsap.from(logo,{opacity:0,scale:.74,rotationZ:-9,duration:1.15,ease:'power3.out'});gsap.to(logo,{yPercent:-14,scale:.86,rotationZ:3,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});}gsap.from('.nf-hero-copy > *',{opacity:0,y:28,duration:.75,stagger:.08,ease:'power3.out',delay:.12});gsap.to('.nf-orbit.orbit-a',{rotation:100,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.nf-orbit.orbit-b',{rotation:-90,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});}
})();
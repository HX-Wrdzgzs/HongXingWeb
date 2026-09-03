(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)],clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,desktop=matchMedia('(min-width:761px)').matches;
if(!qs('link[data-home-v5]')){const l=d.createElement('link');l.rel='stylesheet';l.href='assets/css/home-v5.css?v=20260903-5';l.dataset.homeV5='';d.head.appendChild(l)}
function wrap(sectionSel,className){const s=qs(sectionSel);if(!s||qs('.'+className,s))return s;const p=d.createElement('div');p.className=className;[...s.children].forEach(x=>p.appendChild(x));s.appendChild(p);return s}
if(desktop&&!reduced){wrap('.nf-reasons','nf-reasons-pin');wrap('.nf-products','nf-products-pin');wrap('.nf-history','nf-history-pin')}
const reasons=qs('.nf-reasons'),reasonTabs=qsa('[data-reason]'),reasonPanels=qsa('[data-reason-panel]');
const products=qs('.nf-products'),pTrack=qs('[data-project-track]'),pViewport=qs('[data-project-viewport]'),pCards=qsa('[data-project-card]'),pCount=qs('[data-project-count]'),pBar=qs('[data-project-progress]');
const history=qs('.nf-history'),hTrack=qs('[data-history-track]'),hViewport=qs('.nf-history-viewport'),hItems=qsa('[data-history-track] article'),hCount=qs('[data-history-count]'),hBar=qs('[data-history-progress]');
function sectionProgress(s){if(!s)return 0;const r=s.getBoundingClientRect(),total=Math.max(1,s.offsetHeight-innerHeight);return clamp(-r.top/total,0,1)}
function setReason(i){reasonTabs.forEach((b,n)=>b.classList.toggle('active',n===i));reasonPanels.forEach((p,n)=>p.classList.toggle('active',n===i))}
if(desktop&&!reduced){reasonTabs.forEach((b,i)=>{b.onclick=()=>{const range=Math.max(1,reasons.offsetHeight-innerHeight),dest=reasons.offsetTop+(i/Math.max(1,reasonTabs.length-1))*range;scrollTo({top:dest,behavior:'smooth'})}})}
function fitTrack(track,viewport,p){if(!track||!viewport)return 0;const max=Math.max(0,track.scrollWidth-viewport.clientWidth);track.style.transform=`translate3d(${-max*p}px,0,0)`;return max}
let raf=0;function paint(){raf=0;if(desktop&&!reduced){
  if(reasons&&reasonPanels.length){const p=sectionProgress(reasons),i=clamp(Math.floor(p*reasonPanels.length),0,reasonPanels.length-1);setReason(i)}
  if(products&&pTrack&&pViewport&&pCards.length){const p=sectionProgress(products);fitTrack(pTrack,pViewport,p);const i=clamp(Math.round(p*(pCards.length-1)),0,pCards.length-1);pCards.forEach((x,n)=>x.classList.toggle('is-active',n===i));if(pCount)pCount.textContent=String(i+1).padStart(2,'0')+' / '+String(pCards.length).padStart(2,'0');if(pBar)pBar.style.width=Math.max(2,p*100)+'%'}
  if(history&&hTrack&&hViewport&&hItems.length){const p=sectionProgress(history);fitTrack(hTrack,hViewport,p);const i=clamp(Math.round(p*(hItems.length-1)),0,hItems.length-1);hItems.forEach((x,n)=>x.classList.toggle('current',n===i));if(hCount)hCount.textContent=String(i+1).padStart(2,'0')+' / '+String(hItems.length).padStart(2,'0');if(hBar)hBar.style.width=Math.max(2,p*100)+'%'}
} }
function queue(){if(!raf)raf=requestAnimationFrame(paint)}addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);queue();
if(desktop&&!reduced&&window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);
  gsap.to('.nf-hero-copy',{yPercent:-8,opacity:.42,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'55% center',end:'bottom top',scrub:true}});
  gsap.to('.nf-hero-visual',{yPercent:-5,scale:.93,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.fromTo('.nf-reason-head',{y:42,opacity:.1},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.nf-reasons',start:'top bottom',end:'top top',scrub:true}});
  gsap.fromTo('.nf-products-head',{y:48,opacity:.05},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.nf-products',start:'top bottom',end:'top 35%',scrub:true}});
  gsap.to('.nf-amia-visual img',{yPercent:-3,scale:1.025,ease:'none',scrollTrigger:{trigger:'.nf-amia',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.nf-move-head',{y:55,opacity:.1},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.nf-move',start:'top 90%',end:'top 36%',scrub:true}});
  gsap.fromTo('.nf-history-head',{y:48,opacity:.05},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.nf-history',start:'top bottom',end:'top 40%',scrub:true}});
}
})();

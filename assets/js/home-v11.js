(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches,desktop=matchMedia('(min-width:761px)');
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const mark=qs('[data-v11-mark]');
if(mark){
  const paint=()=>{
    const count=desktop.matches?30:16;mark.replaceChildren();
    for(let i=0;i<count;i++){
      const layer=d.createElement('div');layer.className='v11-mark-layer';
      const img=d.createElement('img');img.src='assets/img/hongxing-logo.svg';img.alt=i===count-1?'Hong Xing':'';img.draggable=false;
      const t=i/(count-1);if(i<count-1)img.style.filter=`brightness(${.28+.72*t}) saturate(${.82+.18*t}) drop-shadow(0 18px 14px rgba(0,0,0,.04))`;
      layer.style.transform=`translate3d(${i*.36}px,${i*.25}px,${i*1.6}px)`;layer.appendChild(img);mark.appendChild(layer);
    }
    mark.style.transform=desktop.matches?'rotateX(-4deg) rotateY(-10deg) rotateZ(-1deg)':'rotateX(-2deg) rotateY(-6deg)';
  };
  paint();desktop.addEventListener?.('change',paint);
  if(!reduced){const host=mark.closest('.v11-hero-logo');host?.addEventListener('pointermove',e=>{if(!desktop.matches)return;const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;mark.style.transform=`rotateX(${-4-y*10}deg) rotateY(${-10+x*16}deg) rotateZ(${x*1.2}deg) scale(1.012)`});host?.addEventListener('pointerleave',()=>{mark.style.transform=desktop.matches?'rotateX(-4deg) rotateY(-10deg) rotateZ(-1deg)':'rotateX(-2deg) rotateY(-6deg)'})}
}
const reveals=qsa('.v11-reveal');if(reduced)reveals.forEach(x=>x.classList.add('in'));else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -8%'});reveals.forEach(x=>io.observe(x))}
qsa('.v11-quick-card').forEach(card=>{card.addEventListener('mouseenter',()=>{qsa('.v11-quick-card').forEach(x=>x.classList.remove('active'));card.classList.add('active')});card.addEventListener('focusin',()=>{qsa('.v11-quick-card').forEach(x=>x.classList.remove('active'));card.classList.add('active')})});
const scrollCue=qs('[data-scroll-target]');scrollCue?.addEventListener('click',()=>qs(scrollCue.dataset.scrollTarget)?.scrollIntoView({behavior:reduced?'auto':'smooth'}));
if(!reduced){let raf=0;const hero=qs('.v11-hero'),wave=qs('.v11-wave');function paintScroll(){raf=0;if(!hero)return;const r=hero.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height),0,1);if(mark)mark.style.setProperty('--scroll-p',p);if(wave)wave.style.transform=`translate3d(0,${p*18}px,0) scale(${1+p*.02})`;}addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paintScroll)},{passive:true});paintScroll();}
})();

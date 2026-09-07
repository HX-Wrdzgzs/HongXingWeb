(()=>{
'use strict';
if(document.body.dataset.page!=='home')return;
const hero=document.querySelector('.hero');
const grid=hero?.querySelector('.hero-grid');
const copy=hero?.querySelector('.hero-copy');
const visual=hero?.querySelector('.hero-visual');
if(!hero||!grid||!copy||!visual)return;

const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const visible=()=>!document.hidden;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const hash=(x,y=0)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453123;return n-Math.floor(n);};
hero.classList.add('hx-shader-hero');

copy.innerHTML=`
  <div class="hx-hero-kicker">Hong Xing · Product & Service System</div>
  <h1>系统、服务与<em>基础设施</em></h1>
  <p class="formal-lead">Hong Xing 当前产品与服务体系涵盖 HongXing / HongXingOS、固件、HongXing Online、AuthLit 以及相关基础设施。本站用于发布版本状态、技术公告、兼容性说明、生命周期安排及基础设施调整。</p>
  <div class="hero-en">SYSTEM · FIRMWARE · ONLINE SERVICE · AUTHENTICATION</div>
  <div class="actions"><a class="primary" href="projects.html">查看产品体系 <span>→</span></a><a class="text-link" href="updates.html">查看公告归档 <span>→</span></a></div>
  <div class="hx-region-field" aria-label="服务节点状态">
    <svg class="hx-region-svg" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
      <rect class="hx-region-bg" x="0" y="0" width="1000" height="280"/>
      <defs>
        <filter id="hxGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <path id="hxRouteSN" d="M105 214 C305 214 390 84 585 70"/>
        <path id="hxRouteXN" d="M790 214 C760 160 700 94 585 70"/>
      </defs>
      <path class="hx-route hx-route-red" d="M105 214 C305 214 390 84 585 70"/>
      <path class="hx-route hx-route-gray" d="M790 214 C760 160 700 94 585 70"/>
      <g class="hx-route-particles red">
        ${Array.from({length:9},(_,i)=>`<circle r="${i%3===0?5:3.6}" class="hx-dot hx-dot-red"><animateMotion dur="${5.2+(i%3)*.45}s" begin="-${(i*.61).toFixed(2)}s" repeatCount="indefinite"><mpath href="#hxRouteSN"/></animateMotion></circle>`).join('')}
      </g>
      <g class="hx-route-particles gray">
        ${Array.from({length:6},(_,i)=>`<circle r="${i%3===0?4.2:3.1}" class="hx-dot hx-dot-gray"><animateMotion dur="${6.8+(i%2)*.6}s" begin="-${(i*.92).toFixed(2)}s" repeatCount="indefinite"><mpath href="#hxRouteXN"/></animateMotion></circle>`).join('')}
      </g>
      <g class="hx-node hx-node-s"><circle cx="105" cy="214" r="8"/><circle class="ring" cx="105" cy="214" r="17"/></g>
      <g class="hx-node hx-node-n" filter="url(#hxGlow)"><circle cx="585" cy="70" r="9"/><circle class="ring" cx="585" cy="70" r="20"/></g>
      <g class="hx-node hx-node-x"><circle cx="790" cy="214" r="8"/><circle class="ring" cx="790" cy="214" r="17"/></g>
    </svg>
    <div class="hx-region-label nanjing"><span><strong>南京</strong><small>NANJING · PRIMARY</small></span></div>
    <div class="hx-region-label xining"><span><strong>青海西宁</strong><small>XINING · ACTIVE</small></span></div>
    <div class="hx-region-label suzhou"><span><strong>苏州</strong><small>SUZHOU · MIGRATING</small></span></div>
  </div>`;

visual.innerHTML=`<div class="hx-particle-stage"><canvas class="hx-particle-canvas" aria-hidden="true"></canvas><div class="hx-particle-vignette"></div></div>`;
copy.classList.add('in');visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});
if(visual.parentElement!==grid)grid.appendChild(visual);

const canvas=visual.querySelector('.hx-particle-canvas');
const ctx=canvas?.getContext('2d',{alpha:true,desynchronized:true});
if(!canvas||!ctx)return;

const mask=document.createElement('canvas');
const mctx=mask.getContext('2d',{willReadFrequently:true});
const logo=new Image();
let w=0,h=0,dpr=1,raf=0,onScreen=true,last=0,logoReady=false,maskData=null,box={x:0,y:0,w:0,h:0};
const palette=['#ff8f55','#ff6430','#ff451c','#FE2601','#d91f07','#b31905','#242422'];

const buildMask=()=>{
  if(!logoReady||!w||!h)return;
  const mobile=w<760;
  mask.width=Math.max(1,Math.round(w));
  mask.height=Math.max(1,Math.round(h));
  mctx.clearRect(0,0,mask.width,mask.height);
  const iw=logo.naturalWidth||1,ih=logo.naturalHeight||1;
  const maxW=w*(mobile?.78:.40),maxH=h*(mobile?.31:.60);
  const scale=Math.min(maxW/iw,maxH/ih);
  const dw=iw*scale,dh=ih*scale;
  const cx=w*(mobile?.68:.78),cy=h*(mobile?.43:.48);
  const dx=cx-dw*.5,dy=cy-dh*.5;
  box={x:dx,y:dy,w:dw,h:dh};
  mctx.drawImage(logo,dx,dy,dw,dh);
  maskData=mctx.getImageData(0,0,mask.width,mask.height).data;
};

const maskAt=(x,y)=>{
  if(!maskData||x<0||y<0||x>=mask.width||y>=mask.height)return 0;
  return maskData[(Math.floor(y)*mask.width+Math.floor(x))*4+3]/255;
};

const resize=()=>{
  const r=visual.getBoundingClientRect();
  if(!r.width||!r.height)return;
  const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.15);
  const nw=Math.max(1,Math.round(r.width*ndpr)),nh=Math.max(1,Math.round(r.height*ndpr));
  if(nw===canvas.width&&nh===canvas.height)return;
  w=r.width;h=r.height;dpr=ndpr;
  canvas.width=nw;canvas.height=nh;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  buildMask();
};

const square=(x,y,s,color,a)=>{
  if(a<=.002)return;
  ctx.globalAlpha=a;ctx.fillStyle=color;
  ctx.fillRect(Math.round(x-s*.5),Math.round(y-s*.5),s,s);
};

const draw=(now=0)=>{
  raf=0;if(!onScreen||!visible())return;
  last=now;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const t=reduced?4.8:now/1000;
  const spacing=w<760?8:9;
  const speed=w<760?34:42;
  const shift=reduced?0:(t*speed)%spacing;
  const cycle=reduced?5.0:(t%10.8);
  let reveal=1,fade=1;
  if(cycle<.7)reveal=0;
  else if(cycle<4.6)reveal=smooth((cycle-.7)/3.9);
  if(cycle>9.0)fade=1-smooth((cycle-9.0)/1.5);
  const front=box.x+box.w*(1-reveal);
  const rows=Math.ceil(h/spacing)+2;
  const cols=Math.ceil(w/spacing)+3;

  for(let gy=-1;gy<rows;gy++){
    const rowJitter=(hash(gy,4)-.5)*2.2;
    const y=gy*spacing+rowJitter;
    for(let gx=-1;gx<cols;gx++){
      const seed=hash(gx,gy);
      if(seed<.38)continue;
      const x=gx*spacing-shift;
      if(x<-12||x>w+12)continue;
      const inside=maskAt(x,y);
      const revealed=x>=front?1:0;
      const logoWeight=inside*revealed*fade;
      const frontBand=1-clamp(Math.abs(x-front)/42,0,1);
      let alpha=.045+seed*.12;
      let size=1.6+hash(gx+17,gy+9)*2.2;
      let color=palette[Math.floor(hash(gx+31,gy+23)*palette.length)];
      if(logoWeight>.04){
        alpha=.58+hash(gx+3,gy+5)*.36;
        size=2.6+hash(gx+7,gy+11)*2.4;
        if(seed>.90)color='#252523';
        else if(seed<.16)color='#ff9d67';
      }else if(frontBand>.02&&x>box.x-60&&x<box.x+box.w+60){
        alpha=Math.max(alpha,.18*frontBand);
        color=seed>.82?'#b71b07':'#ff4c20';
      }
      const leftFade=clamp((x/w-.03)/.25,0,1);
      alpha*=leftFade;
      square(x+7,y,size*.55,color,alpha*.12);
      square(x+3.5,y,size*.74,color,alpha*.22);
      square(x,y,size,color,alpha);
    }
  }
  ctx.globalAlpha=1;
  if(!reduced)raf=requestAnimationFrame(draw);
};

const start=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(draw);};
logo.onload=()=>{logoReady=true;buildMask();start();};
logo.src='assets/img/hongxing-mark-exact.svg?v=20260907-1';
if('ResizeObserver'in window)new ResizeObserver(()=>{resize();start();}).observe(visual);
else window.addEventListener('resize',()=>{resize();start();},{passive:true});
if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)start();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(hero);
document.addEventListener('visibilitychange',()=>{if(visible())start();else if(raf){cancelAnimationFrame(raf);raf=0;}});
resize();start();
})();
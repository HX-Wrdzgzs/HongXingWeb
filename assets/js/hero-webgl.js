(()=>{
'use strict';
if(document.body.dataset.page!=='home')return;
const hero=document.querySelector('.hero');
const grid=hero?.querySelector('.hero-grid');
const copy=hero?.querySelector('.hero-copy');
const visual=hero?.querySelector('.hero-visual');
if(!hero||!grid||!copy||!visual)return;

document.querySelectorAll('link[href*="assets/css/hero-webgl.css"]').forEach(link=>link.remove());
const heroCss=document.createElement('link');
heroCss.rel='stylesheet';
heroCss.href='assets/css/hero-webgl.css?v=20260907-3';
document.head.appendChild(heroCss);

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
    <canvas class="hx-region-canvas" aria-hidden="true"></canvas>
    <div class="hx-region-label nanjing"><span><strong>南京</strong><small>NANJING · PRIMARY</small></span></div>
    <div class="hx-region-label xining"><span><strong>青海西宁</strong><small>XINING · ACTIVE</small></span></div>
    <div class="hx-region-label suzhou"><span><strong>苏州</strong><small>SUZHOU · MIGRATING</small></span></div>
  </div>`;

visual.innerHTML=`<div class="hx-particle-stage"><canvas class="hx-particle-canvas" aria-hidden="true"></canvas><div class="hx-particle-vignette"></div></div>`;
copy.classList.add('in');
visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});
if(visual.parentElement!==grid)grid.appendChild(visual);

// ---------------------------------------------------------------------------
// HERO: continuous ambient flow + stable logo particles revealed right -> left.
// ---------------------------------------------------------------------------
const canvas=visual.querySelector('.hx-particle-canvas');
const ctx=canvas?.getContext('2d',{alpha:true,desynchronized:true});
if(canvas&&ctx){
  const mask=document.createElement('canvas');
  const mctx=mask.getContext('2d',{willReadFrequently:true});
  const logo=new Image();
  const palette=['#ff8f55','#ff6430','#ff451c','#FE2601','#d91f07','#b31905','#242422'];
  let w=0,h=0,dpr=1,raf=0,onScreen=true,logoReady=false,logoPoints=[],ambient=[];

  const buildLogo=()=>{
    if(!logoReady||!w||!h)return;
    const mobile=w<760;
    mask.width=Math.max(1,Math.round(w));
    mask.height=Math.max(1,Math.round(h));
    mctx.clearRect(0,0,mask.width,mask.height);
    const iw=logo.naturalWidth||1,ih=logo.naturalHeight||1;
    const maxW=w*(mobile?.78:.40);
    const maxH=h*(mobile?.31:.60);
    const scale=Math.min(maxW/iw,maxH/ih);
    const dw=iw*scale,dh=ih*scale;
    const cx=w*(mobile?.68:.78),cy=h*(mobile?.43:.48);
    const dx=cx-dw*.5,dy=cy-dh*.5;
    mctx.drawImage(logo,dx,dy,dw,dh);
    const data=mctx.getImageData(0,0,mask.width,mask.height).data;
    const step=mobile?5.5:6.2;
    const raw=[];
    for(let y=Math.max(0,dy);y<Math.min(h,dy+dh);y+=step){
      for(let x=Math.max(0,dx);x<Math.min(w,dx+dw);x+=step){
        const a=data[(Math.floor(y)*mask.width+Math.floor(x))*4+3];
        if(a>48)raw.push({x,y,lx:(x-dx)/Math.max(1,dw)});
      }
    }
    const maxPoints=mobile?900:1250;
    const stride=Math.max(1,Math.ceil(raw.length/maxPoints));
    logoPoints=raw.filter((_,i)=>i%stride===0).slice(0,maxPoints).map((p,i)=>({
      ...p,
      seed:hash(i*3.17,2),
      size:2.0+hash(i*5.73,7)*2.6,
      tone:Math.floor(hash(i*8.1,11)*palette.length)
    }));
  };

  const buildAmbient=()=>{
    if(!w||!h)return;
    const mobile=w<760;
    const count=mobile?230:360;
    ambient=Array.from({length:count},(_,i)=>({
      x:hash(i*2.9,3)*w,
      y:hash(i*6.7,9)*h,
      speed:32+hash(i*4.2,15)*48,
      size:1.0+hash(i*7.5,4)*2.2,
      alpha:.045+hash(i*9.1,6)*.14,
      color:palette[Math.floor(hash(i*11.2,13)*6)]
    }));
  };

  const resize=()=>{
    const r=visual.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.18);
    const nw=Math.max(1,Math.round(r.width*ndpr)),nh=Math.max(1,Math.round(r.height*ndpr));
    if(nw===canvas.width&&nh===canvas.height)return;
    w=r.width;h=r.height;dpr=ndpr;
    canvas.width=nw;canvas.height=nh;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    buildAmbient();buildLogo();
  };

  const sq=(x,y,s,c,a)=>{
    if(a<=.002)return;
    ctx.globalAlpha=a;ctx.fillStyle=c;
    ctx.fillRect(x-s*.5,y-s*.5,s,s);
  };

  let last=0;
  const draw=(now=0)=>{
    raf=0;if(!onScreen||!visible())return;
    const dt=Math.min(.032,Math.max(.001,(now-last||16)/1000));last=now;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const t=reduced?4.8:now/1000;

    ambient.forEach((p,i)=>{
      p.x-=p.speed*dt;
      if(p.x<-12){p.x=w+12+hash(i+Math.floor(t),17)*w*.10;p.y=hash(i*13.7+Math.floor(t),5)*h;}
      const leftFade=clamp((p.x/w-.02)/.26,0,1);
      sq(p.x+7,p.y,p.size*.55,p.color,p.alpha*.10*leftFade);
      sq(p.x+3.5,p.y,p.size*.76,p.color,p.alpha*.20*leftFade);
      sq(p.x,p.y,p.size,p.color,p.alpha*leftFade);
    });

    const cycle=reduced?5.2:(t%11.2);
    let reveal=1,fade=1;
    if(cycle<.55)reveal=0;
    else if(cycle<4.5)reveal=smooth((cycle-.55)/3.95);
    if(cycle>9.4)fade=1-smooth((cycle-9.4)/1.5);
    const front=1.08-reveal*1.18;
    const microDrift=reduced?0:Math.sin(t*.72)*.65;

    logoPoints.forEach((p,i)=>{
      const localReveal=smooth((p.lx-front)/.12);
      if(localReveal<=.002)return;
      const a=(.56+p.seed*.36)*localReveal*fade;
      const c=palette[p.tone];
      const x=p.x+microDrift;
      const y=p.y+Math.sin(t*.48+i*.11)*.22;
      sq(x+5,y,p.size*.62,c,a*.10);
      sq(x+2.5,y,p.size*.80,c,a*.18);
      sq(x,y,p.size,c,a);
      if(i%8===0)sq(x-1.2,y-1.2,p.size*.42,'#ffad79',a*.28);
    });

    ctx.globalAlpha=1;
    if(!reduced)raf=requestAnimationFrame(draw);
  };
  const start=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(draw);};
  logo.onload=()=>{logoReady=true;buildLogo();start();};
  logo.src='assets/img/hongxing-mark-exact.svg?v=20260907-3';
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();start();}).observe(visual);
  else window.addEventListener('resize',()=>{resize();start();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)start();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(visible())start();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();start();
}

// ---------------------------------------------------------------------------
// THREE REGIONS: particle clouds and broad particle bands, no route lines.
// ---------------------------------------------------------------------------
const region=copy.querySelector('.hx-region-field');
const rc=region?.querySelector('.hx-region-canvas');
const rctx=rc?.getContext('2d',{alpha:false,desynchronized:true});
if(region&&rc&&rctx){
  let rw=0,rh=0,rdpr=1,rraf=0,last=0,onScreen=true;
  const N={s:[.12,.73],n:[.58,.25],x:[.78,.72]};
  const point=([x,y])=>({x:x*rw,y:y*rh});
  const bez=(a,c,b,t)=>{const u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};};
  const bandPoint=(from,to,bend,t,lane)=>{
    const a=point(from),b=point(to),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
    const p=bez(a,c,b,t);
    const p2=bez(a,c,b,Math.min(1,t+.01));
    const dx=p2.x-p.x,dy=p2.y-p.y,len=Math.max(1,Math.hypot(dx,dy));
    return{x:p.x-dy/len*lane,y:p.y+dx/len*lane};
  };
  const sq=(x,y,s,c,a)=>{rctx.globalAlpha=a;rctx.fillStyle=c;rctx.fillRect(x-s*.5,y-s*.5,s,s);rctx.globalAlpha=1;};

  const resizeRegion=()=>{
    const r=region.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.12);
    const nw=Math.round(r.width*ndpr),nh=Math.round(r.height*ndpr);
    if(nw===rc.width&&nh===rc.height)return;
    rw=r.width;rh=r.height;rdpr=ndpr;rc.width=nw;rc.height=nh;rctx.setTransform(rdpr,0,0,rdpr,0,0);
  };

  const nodeCloud=(center,count,radius,colorA,colorB,seedBase)=>{
    const c=point(center);
    for(let i=0;i<count;i++){
      const a=hash(seedBase+i*2.7,4)*Math.PI*2;
      const rr=Math.sqrt(hash(seedBase+i*4.1,8))*radius;
      const x=c.x+Math.cos(a)*rr;
      const y=c.y+Math.sin(a)*rr*.64;
      const s=1.2+hash(seedBase+i*5.3,3)*2.3;
      const col=hash(seedBase+i*7.9,12)>.28?colorA:colorB;
      const alpha=.08+hash(seedBase+i*8.8,6)*.22;
      sq(x,y,s,col,alpha);
    }
  };

  const drawRegion=(now=0)=>{
    rraf=0;if(!onScreen||!visible())return;
    const dt=Math.min(.032,Math.max(.001,(now-last||16)/1000));last=now;
    rctx.setTransform(rdpr,0,0,rdpr,0,0);rctx.globalAlpha=1;rctx.fillStyle='#fff';rctx.fillRect(0,0,rw,rh);
    const t=reduced?2.8:now/1000;

    // soft static node clouds
    nodeCloud(N.n,58,28,'#FE2601','#ff7a38',10);
    nodeCloud(N.s,28,19,'#9a9a94','#d9d9d4',120);
    nodeCloud(N.x,31,20,'#333330','#a7a7a1',240);

    // Suzhou -> Nanjing: broad red particle band
    for(let lane=-3;lane<=3;lane++){
      for(let i=0;i<8;i++){
        const q=(t*(.070+Math.abs(lane)*.002)+i/8+lane*.071)%1;
        const p=bandPoint(N.s,N.n,-.15,q,lane*4.2);
        const bright=(i+lane+12)%4===0;
        sq(p.x+4.5,p.y,1.6,bright?'#ff6b31':'#FE2601',.055);
        sq(p.x,p.y,bright?3.5:2.5,bright?'#ff6b31':'#FE2601',bright?.68:.46);
      }
    }

    // Xining -> Nanjing: cooler neutral particle band
    for(let lane=-2;lane<=2;lane++){
      for(let i=0;i<7;i++){
        const q=(t*(.050+Math.abs(lane)*.002)+i/7+lane*.09)%1;
        const p=bandPoint(N.x,N.n,.045,q,lane*4.2);
        const dark=(i+lane+9)%3===0;
        sq(p.x+3.5,p.y,1.5,dark?'#343432':'#8e8e88',.045);
        sq(p.x,p.y,dark?3.0:2.35,dark?'#343432':'#8e8e88',dark?.42:.30);
      }
    }

    rctx.globalAlpha=1;
    if(!reduced)rraf=requestAnimationFrame(drawRegion);
  };
  const startRegion=()=>{if(!rraf&&onScreen&&visible())rraf=requestAnimationFrame(drawRegion);};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resizeRegion();startRegion();}).observe(region);
  else window.addEventListener('resize',()=>{resizeRegion();startRegion();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)startRegion();else if(rraf){cancelAnimationFrame(rraf);rraf=0;}},{threshold:0}).observe(region);
  document.addEventListener('visibilitychange',()=>{if(visible())startRegion();else if(rraf){cancelAnimationFrame(rraf);rraf=0;}});
  resizeRegion();startRegion();
}
})();
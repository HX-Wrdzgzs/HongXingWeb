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
heroCss.href='assets/css/hero-webgl.css?v=20260907-4';
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

const palette=['#ff9a60','#ff6b34','#ff4b20','#FE2601','#dc2108','#b51a06','#252523'];

// ---------------------------------------------------------------------------
// HERO: one-way ambient flow + one-time logo reveal. No visible loopback.
// ---------------------------------------------------------------------------
const canvas=visual.querySelector('.hx-particle-canvas');
const ctx=canvas?.getContext('2d',{alpha:true,desynchronized:true});
if(canvas&&ctx){
  const mask=document.createElement('canvas');
  const mctx=mask.getContext('2d',{willReadFrequently:true});
  const logo=new Image();
  let w=0,h=0,dpr=1,raf=0,onScreen=true,logoReady=false,logoPoints=[],ambient=[],maskData=null,logoBox={x:0,y:0,w:0,h:0};
  const started=performance.now();

  const buildLogo=()=>{
    if(!logoReady||!w||!h)return;
    const mobile=w<760;
    mask.width=Math.max(1,Math.round(w));
    mask.height=Math.max(1,Math.round(h));
    mctx.clearRect(0,0,mask.width,mask.height);
    const iw=logo.naturalWidth||1,ih=logo.naturalHeight||1;
    const maxW=w*(mobile ? .80 : .41);
    const maxH=h*(mobile ? .32 : .61);
    const scale=Math.min(maxW/iw,maxH/ih);
    const dw=iw*scale,dh=ih*scale;
    const cx=w*(mobile ? .69 : .79),cy=h*(mobile ? .43 : .48);
    const dx=cx-dw*.5,dy=cy-dh*.5;
    logoBox={x:dx,y:dy,w:dw,h:dh};
    mctx.drawImage(logo,dx,dy,dw,dh);
    maskData=mctx.getImageData(0,0,mask.width,mask.height).data;
    const step=mobile ? 5.2 : 5.8;
    const raw=[];
    for(let y=Math.max(0,dy);y<Math.min(h,dy+dh);y+=step){
      for(let x=Math.max(0,dx);x<Math.min(w,dx+dw);x+=step){
        const a=maskData[(Math.floor(y)*mask.width+Math.floor(x))*4+3];
        if(a>52)raw.push({x,y,lx:(x-dx)/Math.max(1,dw)});
      }
    }
    const maxPoints=mobile ? 980 : 1380;
    const stride=Math.max(1,Math.ceil(raw.length/maxPoints));
    logoPoints=raw.filter((_,i)=>i%stride===0).slice(0,maxPoints).map((p,i)=>({
      ...p,
      seed:hash(i*3.17,2),
      size:2.0+hash(i*5.73,7)*2.5,
      tone:Math.floor(hash(i*8.1,11)*palette.length)
    }));
  };

  const buildAmbient=()=>{
    if(!w||!h)return;
    const mobile=w<760;
    const count=mobile ? 300 : 470;
    ambient=Array.from({length:count},(_,i)=>({
      x:hash(i*2.9,3)*w,
      y:hash(i*6.7,9)*h,
      speed:34+hash(i*4.2,15)*52,
      size:1.0+hash(i*7.5,4)*2.3,
      alpha:.05+hash(i*9.1,6)*.16,
      tone:Math.floor(hash(i*11.2,13)*6),
      wrap:0,
      seed:hash(i*13.3,17)
    }));
  };

  const maskAt=(x,y)=>{
    if(!maskData||x<0||y<0||x>=mask.width||y>=mask.height)return 0;
    return maskData[(Math.floor(y)*mask.width+Math.floor(x))*4+3]/255;
  };

  const resize=()=>{
    const r=visual.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760 ? 1 : 1.18);
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
    const t=reduced ? 4.6 : now/1000;
    const elapsed=reduced ? 4.6 : (now-started)/1000;
    const reveal=smooth((elapsed-.35)/3.7);
    const front=logoBox.x+logoBox.w*(1-reveal);

    ambient.forEach((p,i)=>{
      p.x-=p.speed*dt;
      if(p.x<-16){
        p.wrap+=1;
        p.x=w+16+hash(i*5.1,p.wrap)*w*.10;
        p.y=hash(i*9.7,p.wrap+3)*h;
      }
      const inside=maskAt(p.x,p.y);
      const revealed=p.x>=front ? 1 : 0;
      const logoBoost=inside*revealed;
      let color=palette[p.tone];
      let size=p.size;
      let alpha=p.alpha;
      if(logoBoost>.05){
        alpha=.34+p.seed*.48;
        size*=1.30+p.seed*.26;
        if(p.seed<.14)color='#ffab78';
        else if(p.seed>.90)color='#242422';
      }
      const leftFade=clamp((p.x/w-.015)/.24,0,1);
      alpha*=leftFade;
      sq(p.x+9,p.y,size*.50,color,alpha*.08);
      sq(p.x+4.5,p.y,size*.72,color,alpha*.18);
      sq(p.x,p.y,size,color,alpha);
    });

    logoPoints.forEach((p,i)=>{
      const localReveal=smooth((p.lx-(1.06-reveal*1.16))/.115);
      if(localReveal<=.002)return;
      const a=(.50+p.seed*.34)*localReveal;
      const c=palette[p.tone];
      const x=p.x;
      const y=p.y;
      sq(x+4.5,y,p.size*.58,c,a*.08);
      sq(x+2.2,y,p.size*.78,c,a*.16);
      sq(x,y,p.size,c,a);
      if(i%9===0)sq(x-1.1,y-1.1,p.size*.40,'#ffb88c',a*.26);
    });

    ctx.globalAlpha=1;
    if(!reduced)raf=requestAnimationFrame(draw);
  };

  const start=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(draw);};
  logo.onload=()=>{logoReady=true;buildLogo();start();};
  logo.src='assets/img/hongxing-mark-exact.svg?v=20260907-4';
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();start();}).observe(visual);
  else window.addEventListener('resize',()=>{resize();start();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)start();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(visible())start();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();start();
}

// ---------------------------------------------------------------------------
// THREE REGIONS: structured packet lanes. No clouds, no pulse, no route line.
// ---------------------------------------------------------------------------
const region=copy.querySelector('.hx-region-field');
const rc=region?.querySelector('.hx-region-canvas');
const rctx=rc?.getContext('2d',{alpha:false,desynchronized:true});
if(region&&rc&&rctx){
  let rw=0,rh=0,rdpr=1,rraf=0,onScreen=true;
  const N={s:[.12,.72],n:[.58,.24],x:[.78,.72]};
  const point=([x,y])=>({x:x*rw,y:y*rh});
  const bez=(a,c,b,t)=>{const u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};};
  const lanePoint=(from,to,bend,t,offset)=>{
    const a=point(from),b=point(to),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
    const p=bez(a,c,b,t),p2=bez(a,c,b,Math.min(1,t+.006));
    const dx=p2.x-p.x,dy=p2.y-p.y,len=Math.max(1,Math.hypot(dx,dy));
    return{x:p.x-dy/len*offset,y:p.y+dx/len*offset};
  };
  const sq=(x,y,s,c,a)=>{rctx.globalAlpha=a;rctx.fillStyle=c;rctx.fillRect(x-s*.5,y-s*.5,s,s);rctx.globalAlpha=1;};

  const resizeRegion=()=>{
    const r=region.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760 ? 1 : 1.12);
    const nw=Math.round(r.width*ndpr),nh=Math.round(r.height*ndpr);
    if(nw===rc.width&&nh===rc.height)return;
    rw=r.width;rh=r.height;rdpr=ndpr;rc.width=nw;rc.height=nh;rctx.setTransform(rdpr,0,0,rdpr,0,0);
  };

  const drawNode=(center,kind)=>{
    const p=point(center);
    const main=kind==='n'?'#FE2601':kind==='x'?'#2d2d2b':'#8b8b86';
    const ring=kind==='n'?'rgba(254,38,1,.18)':'rgba(70,70,67,.10)';
    rctx.strokeStyle=ring;rctx.lineWidth=1;
    rctx.strokeRect(p.x-13,p.y-13,26,26);
    rctx.strokeRect(p.x-7,p.y-7,14,14);
    sq(p.x,p.y,6,main,.95);
    for(let i=0;i<8;i++){
      const ox=((i%4)-1.5)*6,oy=(i<4?-1:1)*17;
      sq(p.x+ox,p.y+oy,1.7,main,kind==='n'?.18:.10);
    }
  };

  const drawRegion=(now=0)=>{
    rraf=0;if(!onScreen||!visible())return;
    rctx.setTransform(rdpr,0,0,rdpr,0,0);
    rctx.globalAlpha=1;rctx.fillStyle='#fff';rctx.fillRect(0,0,rw,rh);
    const t=reduced ? 2.5 : now/1000;

    // very faint technical grid for structure, not decoration
    rctx.strokeStyle='rgba(35,35,33,.035)';rctx.lineWidth=1;
    for(let x=18;x<rw;x+=28){rctx.beginPath();rctx.moveTo(x,0);rctx.lineTo(x,rh);rctx.stroke();}
    for(let y=18;y<rh;y+=28){rctx.beginPath();rctx.moveTo(0,y);rctx.lineTo(rw,y);rctx.stroke();}

    // Suzhou -> Nanjing: five parallel packet lanes
    for(let lane=-2;lane<=2;lane++){
      const offset=lane*5.0;
      for(let i=0;i<11;i++){
        const q=(t*(.078+Math.abs(lane)*.003)+i/11+lane*.083)%1;
        const p=lanePoint(N.s,N.n,-.15,q,offset);
        const bright=(i+lane+13)%5===0;
        const c=bright?'#ff6a31':'#FE2601';
        sq(p.x+4,p.y,1.5,c,.07);
        sq(p.x,p.y,bright?3.3:2.5,c,bright?.72:.48);
      }
    }

    // Xining -> Nanjing: three neutral packet lanes
    for(let lane=-1;lane<=1;lane++){
      const offset=lane*5.5;
      for(let i=0;i<9;i++){
        const q=(t*(.060+Math.abs(lane)*.002)+i/9+lane*.11)%1;
        const p=lanePoint(N.x,N.n,.045,q,offset);
        const dark=(i+lane+8)%4===0;
        const c=dark?'#383836':'#8b8b85';
        sq(p.x+3.5,p.y,1.4,c,.055);
        sq(p.x,p.y,dark?2.9:2.25,c,dark?.44:.30);
      }
    }

    drawNode(N.s,'s');drawNode(N.n,'n');drawNode(N.x,'x');
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
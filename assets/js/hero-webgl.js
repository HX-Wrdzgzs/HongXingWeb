(()=>{
'use strict';
if(document.body.dataset.page!=='home')return;
const hero=document.querySelector('.hero');
const grid=hero?.querySelector('.hero-grid');
const copy=hero?.querySelector('.hero-copy');
const visual=hero?.querySelector('.hero-visual');
if(!hero||!grid||!copy||!visual)return;

const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
const pageVisible=()=>!document.hidden;
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

visual.innerHTML=`<div class="hx-particle-stage"><canvas class="hx-particle-canvas" aria-hidden="true"></canvas><div class="hx-particle-vignette"></div><div class="hx-particle-legend">RIGHT → LEFT PARTICLE FLOW<br>SLIDING LOGO REVEAL</div></div>`;
copy.classList.add('in');
visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});
if(visual.parentElement!==grid)grid.appendChild(visual);

const palette=['#ff8a45','#ff5a20','#ff3510','#FE2601','#d71e05','#9f1404','#242422'];
const hash=n=>{const x=Math.sin(n*91.713+17.23)*43758.5453;return x-Math.floor(x);};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const easeOutCubic=t=>1-Math.pow(1-clamp(t,0,1),3);
const easeInOut=t=>{t=clamp(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};

// ---------------------------------------------------------------------------
// HERO: the entire particle logo slides from right to left as one structure.
// A reveal front travels through the moving logo from right to left.
// ---------------------------------------------------------------------------
const heroCanvas=visual.querySelector('.hx-particle-canvas');
const hctx=heroCanvas?.getContext('2d',{alpha:true,desynchronized:true});
if(heroCanvas&&hctx){
  const mask=document.createElement('canvas');
  const mctx=mask.getContext('2d',{willReadFrequently:true});
  const logoImg=new Image();
  let w=0,h=0,dpr=1,logoPoints=[],ambient=[],raf=0,last=0,onScreen=true,logoReady=false;

  const rebuild=()=>{
    if(!w||!h)return;
    const mobile=w<760;
    ambient=Array.from({length:mobile?135:210},(_,i)=>({
      x:hash(i*3.17)*w,
      y:hash(i*8.33)*h,
      vx:22+hash(i*6.11)*58,
      size:1+hash(i*5.73)*2.6,
      alpha:.055+hash(i*7.4)*.18,
      color:palette[Math.floor(hash(i*4.8)*6)]
    }));
    if(!logoReady)return;

    mask.width=Math.max(1,Math.round(w));
    mask.height=Math.max(1,Math.round(h));
    mctx.clearRect(0,0,mask.width,mask.height);
    const iw=logoImg.naturalWidth||1;
    const ih=logoImg.naturalHeight||1;
    const maxW=w*(mobile?.68:.34);
    const maxH=h*(mobile?.31:.58);
    const scale=Math.min(maxW/iw,maxH/ih);
    const dw=iw*scale;
    const dh=ih*scale;
    const targetCx=w*(mobile?.68:.78);
    const targetCy=h*(mobile?.47:.48);
    const dx=targetCx-dw*.5;
    const dy=targetCy-dh*.5;
    mctx.drawImage(logoImg,dx,dy,dw,dh);
    const data=mctx.getImageData(0,0,mask.width,mask.height).data;
    const step=mobile?5:6;
    const raw=[];
    for(let y=Math.max(0,Math.floor(dy));y<Math.min(h,Math.ceil(dy+dh));y+=step){
      for(let x=Math.max(0,Math.floor(dx));x<Math.min(w,Math.ceil(dx+dw));x+=step){
        const idx=(Math.floor(y)*mask.width+Math.floor(x))*4+3;
        if(data[idx]>52){
          raw.push({
            x:x,
            y:y,
            lx:(x-dx)/Math.max(1,dw),
            seed:hash(raw.length*3.91)
          });
        }
      }
    }
    const maxPoints=mobile?820:1100;
    const stride=Math.max(1,Math.ceil(raw.length/maxPoints));
    logoPoints=raw.filter((_,i)=>i%stride===0).slice(0,maxPoints);
  };

  const resize=()=>{
    const r=visual.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.18);
    const nw=Math.max(1,Math.round(r.width*ndpr));
    const nh=Math.max(1,Math.round(r.height*ndpr));
    if(nw===heroCanvas.width&&nh===heroCanvas.height)return;
    w=r.width;h=r.height;dpr=ndpr;
    heroCanvas.width=nw;heroCanvas.height=nh;
    hctx.setTransform(dpr,0,0,dpr,0,0);
    rebuild();
  };

  const square=(x,y,s,c,a)=>{
    hctx.globalAlpha=a;
    hctx.fillStyle=c;
    hctx.fillRect(Math.round(x-s*.5),Math.round(y-s*.5),s,s);
    hctx.globalAlpha=1;
  };

  const drawHero=(now=0)=>{
    raf=0;
    if(!onScreen||!pageVisible())return;
    const dt=Math.min(.034,Math.max(.001,(now-last||16)/1000));
    last=now;
    hctx.setTransform(dpr,0,0,dpr,0,0);
    hctx.clearRect(0,0,w,h);
    const t=reduced?5.1:now/1000;

    // Continuous right-to-left ambient field.
    ambient.forEach((p,i)=>{
      p.x-=p.vx*dt;
      if(p.x<-12){p.x=w+12+hash(i+t*.1)*w*.16;p.y=hash(i*11.31+Math.floor(t))*h;}
      const leftFade=clamp((p.x/w-.03)/.28,0,1);
      square(p.x+7,p.y,p.size*.72,p.color,p.alpha*.17*leftFade);
      square(p.x,p.y,p.size,p.color,p.alpha*leftFade);
    });

    // Cycle: enter from right -> settle -> hold -> exit to left.
    const cycleLen=11.2;
    const phase=reduced?4.8:(t%cycleLen);
    let groupOffset=0;
    let groupAlpha=1;
    if(phase<3.0){
      const k=easeOutCubic(phase/3.0);
      groupOffset=(1-k)*w*.78;
    }else if(phase<7.7){
      groupOffset=0;
    }else{
      const k=easeInOut((phase-7.7)/(cycleLen-7.7));
      groupOffset=-k*w*.88;
      groupAlpha=1-clamp((phase-9.7)/1.5,0,1);
    }

    // Reveal front is in logo-local X: right edge to left edge.
    const revealProgress=phase<.45?0:easeInOut((phase-.45)/3.9);
    const revealFront=1.12-revealProgress*1.34;

    logoPoints.forEach((p,i)=>{
      const reveal=clamp((p.lx-revealFront)/.13,0,1);
      if(reveal<=0)return;
      const shimmer=.86+.14*Math.sin(t*2.6+i*.37);
      const alpha=(.30+p.seed*.62)*reveal*groupAlpha*shimmer;
      const x=p.x+groupOffset;
      const y=p.y;
      if(x<-30||x>w+30)return;
      const color=palette[Math.floor(hash(i*2.71)*palette.length)];
      const size=2.1+hash(i*5.33)*2.8;
      // short directional trail to make leftward movement visible
      square(x+8,y,size*.66,color,alpha*.10);
      square(x+4,y,size*.82,color,alpha*.18);
      square(x,y,size,color,alpha);
      if(i%6===0)square(x-1.8,y-1.6,size*.45,'#ff9a56',alpha*.34);
    });

    if(!reduced)raf=requestAnimationFrame(drawHero);
  };

  const startHero=()=>{if(!raf&&onScreen&&pageVisible())raf=requestAnimationFrame(drawHero);};
  logoImg.onload=()=>{logoReady=true;rebuild();startHero();};
  logoImg.src='assets/img/hongxing-mark-exact.svg';
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();startHero();}).observe(visual);
  else window.addEventListener('resize',()=>{resize();startHero();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    onScreen=entries.some(e=>e.isIntersecting);
    if(onScreen)startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}
  },{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();startHero();
}else{
  visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';
}

// ---------------------------------------------------------------------------
// THREE REGIONS: explicitly light canvas, soft paths, multi-lane particle flow.
// ---------------------------------------------------------------------------
const region=copy.querySelector('.hx-region-field');
const regionCanvas=region?.querySelector('.hx-region-canvas');
const rctx=regionCanvas?.getContext('2d',{alpha:false,desynchronized:true});
if(region&&regionCanvas&&rctx){
  let w=0,h=0,dpr=1,raf=0,last=0,onScreen=true;
  const node=(x,y)=>({x:x*w,y:y*h});
  const bez=(a,c,b,t)=>{const u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};};
  const curve=(from,to,bend,t,offset=0)=>{
    const a=node(from[0],from[1]);
    const b=node(to[0],to[1]);
    const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset};
    return bez(a,c,b,t);
  };
  const path=(from,to,bend,color,width,offset=0)=>{
    const a=node(from[0],from[1]);
    const b=node(to[0],to[1]);
    const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset};
    rctx.beginPath();rctx.moveTo(a.x,a.y);rctx.quadraticCurveTo(c.x,c.y,b.x,b.y);
    rctx.strokeStyle=color;rctx.lineWidth=width;rctx.stroke();
  };
  const square=(p,s,c,a)=>{rctx.globalAlpha=a;rctx.fillStyle=c;rctx.fillRect(Math.round(p.x-s*.5),Math.round(p.y-s*.5),s,s);rctx.globalAlpha=1;};

  const resizeRegion=()=>{
    const r=region.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.12);
    const nw=Math.round(r.width*ndpr),nh=Math.round(r.height*ndpr);
    if(nw===regionCanvas.width&&nh===regionCanvas.height)return;
    w=r.width;h=r.height;dpr=ndpr;
    regionCanvas.width=nw;regionCanvas.height=nh;
    rctx.setTransform(dpr,0,0,dpr,0,0);
  };

  const drawRegion=(now=0)=>{
    raf=0;
    if(!onScreen||!pageVisible())return;
    if(!reduced&&now-last<30){raf=requestAnimationFrame(drawRegion);return;}
    last=now;
    rctx.setTransform(dpr,0,0,dpr,0,0);
    rctx.globalAlpha=1;
    rctx.fillStyle='#ffffff';
    rctx.fillRect(0,0,w,h);
    const t=reduced?3:now/1000;

    // subtle background particles, never darken the field
    for(let i=0;i<64;i++){
      const x=hash(i*2.13)*w;
      const y=hash(i*7.43)*h;
      const s=1.2+hash(i*5.81)*1.6;
      const a=.018+hash(i*4.17)*.052;
      square({x,y},s,i%6===0?'#FE2601':'#9a9a95',a);
    }

    path([.10,.76],[.58,.22],-.18,'rgba(254,38,1,.19)',1.15,-6);
    path([.10,.76],[.58,.22],-.18,'rgba(255,94,35,.09)',2.8,5);
    path([.76,.76],[.58,.22],.05,'rgba(50,50,48,.14)',1.0,0);
    path([.76,.76],[.58,.22],.05,'rgba(130,130,124,.07)',2.6,-6);

    for(let lane=0;lane<3;lane++){
      for(let i=0;i<11;i++){
        const speed=lane===0?.145:lane===1?.125:.108;
        const q=(t*speed+i/11+lane*.11)%1;
        const p=curve([.10,.76],[.58,.22],-.18,q,(lane-1)*7);
        const c=i%4===0?'#ff6a22':i%3===0?'#c91d06':'#FE2601';
        const a=.22+.56*Math.sin(Math.PI*q);
        square({x:p.x+6,y:p.y},2.0,c,a*.14);
        square(p,i%5===0?4.2:3.1,c,a);
      }
    }

    for(let lane=0;lane<2;lane++){
      for(let i=0;i<9;i++){
        const speed=lane===0?.082:.067;
        const q=(t*speed+i/9+lane*.16)%1;
        const p=curve([.76,.76],[.58,.22],.05,q,lane===0?4:-5);
        const c=i%3===0?'#333331':'#858580';
        const a=.15+.38*Math.sin(Math.PI*q);
        square({x:p.x+5,y:p.y},1.8,c,a*.12);
        square(p,2.7,c,a);
      }
    }

    const pulse=.5+.5*Math.sin(t*2.2);
    const nodes=[
      {p:[.58,.22],c:'#FE2601',r:10+pulse*3,a:.18},
      {p:[.76,.76],c:'#2d2d2b',r:8,a:.10},
      {p:[.10,.76],c:'#777772',r:8,a:.10}
    ];
    nodes.forEach(n=>{
      const p=node(n.p[0],n.p[1]);
      rctx.globalAlpha=n.a;
      rctx.strokeStyle=n.c;
      rctx.lineWidth=1;
      rctx.strokeRect(p.x-n.r,p.y-n.r,n.r*2,n.r*2);
      rctx.globalAlpha=1;
    });

    if(!reduced)raf=requestAnimationFrame(drawRegion);
  };

  const startRegion=()=>{if(!raf&&onScreen&&pageVisible())raf=requestAnimationFrame(drawRegion);};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resizeRegion();startRegion();}).observe(region);
  else window.addEventListener('resize',()=>{resizeRegion();startRegion();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    onScreen=entries.some(e=>e.isIntersecting);
    if(onScreen)startRegion();else if(raf){cancelAnimationFrame(raf);raf=0;}
  },{threshold:0}).observe(region);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startRegion();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resizeRegion();startRegion();
}
})();
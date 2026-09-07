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
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const hash=n=>{const x=Math.sin(n*91.713+17.23)*43758.5453;return x-Math.floor(x);};
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
copy.classList.add('in');visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});
if(visual.parentElement!==grid)grid.appendChild(visual);

const heroCanvas=visual.querySelector('.hx-particle-canvas');
const hctx=heroCanvas?.getContext('2d',{alpha:true,desynchronized:true});
if(heroCanvas&&hctx){
  const mask=document.createElement('canvas');
  const mctx=mask.getContext('2d',{willReadFrequently:true});
  const logoImg=new Image();
  const colors=['#ff7a38','#ff5221','#ff3512','#FE2601','#d91e05','#b31604','#262624'];
  let w=0,h=0,dpr=1,maskData=null,logoBox={x:0,y:0,w:0,h:0},particles=[],raf=0,last=0,onScreen=true,logoReady=false;

  const buildMask=()=>{
    if(!logoReady||!w||!h)return;
    const mobile=w<760;
    mask.width=Math.max(1,Math.round(w));mask.height=Math.max(1,Math.round(h));
    mctx.clearRect(0,0,mask.width,mask.height);
    const iw=logoImg.naturalWidth||1,ih=logoImg.naturalHeight||1;
    const maxW=w*(mobile?.72:.38),maxH=h*(mobile?.34:.62);
    const scale=Math.min(maxW/iw,maxH/ih);
    const dw=iw*scale,dh=ih*scale;
    const cx=w*(mobile?.69:.79),cy=h*(mobile?.48:.49);
    const dx=cx-dw*.5,dy=cy-dh*.5;
    logoBox={x:dx,y:dy,w:dw,h:dh};
    mctx.drawImage(logoImg,dx,dy,dw,dh);
    maskData=mctx.getImageData(0,0,mask.width,mask.height).data;
  };

  const buildParticles=()=>{
    if(!w||!h)return;
    const mobile=w<760;
    const count=mobile?620:980;
    particles=Array.from({length:count},(_,i)=>({
      x:hash(i*3.17)*w,
      y:hash(i*7.93)*h,
      speed:42+hash(i*5.77)*52,
      size:1.25+hash(i*11.31)*2.55,
      tone:Math.floor(hash(i*13.27)*colors.length),
      alpha:.07+hash(i*17.17)*.20,
      seed:hash(i*19.9)
    }));
  };

  const resizeHero=()=>{
    const r=visual.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.15);
    const nw=Math.max(1,Math.round(r.width*ndpr)),nh=Math.max(1,Math.round(r.height*ndpr));
    if(nw===heroCanvas.width&&nh===heroCanvas.height)return;
    w=r.width;h=r.height;dpr=ndpr;
    heroCanvas.width=nw;heroCanvas.height=nh;
    hctx.setTransform(dpr,0,0,dpr,0,0);
    buildParticles();buildMask();
  };

  const maskAt=(x,y)=>{
    if(!maskData||x<0||y<0||x>=mask.width||y>=mask.height)return 0;
    return maskData[(Math.floor(y)*mask.width+Math.floor(x))*4+3]/255;
  };
  const sq=(x,y,s,c,a)=>{if(a<=.002)return;hctx.globalAlpha=a;hctx.fillStyle=c;hctx.fillRect(Math.round(x-s*.5),Math.round(y-s*.5),s,s);};

  const drawHero=(now=0)=>{
    raf=0;if(!onScreen||!pageVisible())return;
    const dt=Math.min(.032,Math.max(.001,(now-last||16)/1000));last=now;
    hctx.setTransform(dpr,0,0,dpr,0,0);hctx.clearRect(0,0,w,h);
    const t=reduced?5.2:now/1000;
    const cycle=reduced?5.2:(t%10.4);
    let reveal=1,logoFade=1;
    if(cycle<.6)reveal=0;
    else if(cycle<4.2)reveal=smooth((cycle-.6)/3.6);
    else reveal=1;
    if(cycle>8.4)logoFade=1-smooth((cycle-8.4)/1.7);
    const front=logoBox.x+logoBox.w*(1-reveal);

    particles.forEach((p,i)=>{
      p.x-=p.speed*dt;
      if(p.x<-18){p.x=w+18+hash(i+Math.floor(t))*w*.12;p.y=hash(i*7.1+Math.floor(t)*.37)*h;}
      const inside=maskAt(p.x,p.y);
      const passed=p.x>=front?1:0;
      const logoWeight=inside*passed*logoFade;
      const edgeWeight=clamp((p.x-(front-28))/28,0,1)*clamp(((front+18)-p.x)/18,0,1);
      const ambientA=p.alpha*(.34+.66*clamp((p.x/w-.02)/.32,0,1));
      let color=colors[p.tone],size=p.size,alpha=ambientA;
      if(logoWeight>.04){
        size*=1.55+p.seed*.42;
        alpha=.48+.46*p.seed;
        if(p.seed<.16)color='#ff9a5e';
        else if(p.seed>.88)color='#20201f';
      }else if(edgeWeight>.05){
        alpha=Math.max(alpha,.22*edgeWeight);
        color=p.seed<.72?'#ff4f1d':'#b91905';
      }
      const trail=logoWeight>.04?.28:.11;
      sq(p.x+10,p.y,size*.56,color,alpha*trail*.42);
      sq(p.x+5,p.y,size*.76,color,alpha*trail);
      sq(p.x,p.y,size,color,alpha);
      if(logoWeight>.04&&i%7===0)sq(p.x-1.5,p.y-1.5,size*.42,'#ffb078',alpha*.34);
    });
    hctx.globalAlpha=1;
    if(!reduced)raf=requestAnimationFrame(drawHero);
  };
  const startHero=()=>{if(!raf&&onScreen&&pageVisible())raf=requestAnimationFrame(drawHero);};
  logoImg.onload=()=>{logoReady=true;buildMask();startHero();};
  logoImg.src='assets/img/hongxing-mark-exact.svg';
  if('ResizeObserver'in window)new ResizeObserver(()=>{resizeHero();startHero();}).observe(visual);else window.addEventListener('resize',()=>{resizeHero();startHero();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resizeHero();startHero();
}

const region=copy.querySelector('.hx-region-field');
const rc=region?.querySelector('.hx-region-canvas');
const rctx=rc?.getContext('2d',{alpha:false,desynchronized:true});
if(region&&rc&&rctx){
  let w=0,h=0,dpr=1,raf=0,last=0,onScreen=true,staticLayer=null;
  const nodes={s:[.11,.74],n:[.59,.23],x:[.77,.74]};
  const point=([x,y])=>({x:x*w,y:y*h});
  const curve=(from,to,bend,t,offset=0)=>{const a=point(from),b=point(to),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset},u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};};
  const drawCurve=(ctx,from,to,bend,color,width,offset=0)=>{const a=point(from),b=point(to),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset};ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
  const sq=(ctx,x,y,s,c,a)=>{ctx.globalAlpha=a;ctx.fillStyle=c;ctx.fillRect(Math.round(x-s*.5),Math.round(y-s*.5),s,s);ctx.globalAlpha=1;};

  const rebuildStatic=()=>{
    staticLayer=document.createElement('canvas');staticLayer.width=rc.width;staticLayer.height=rc.height;
    const c=staticLayer.getContext('2d',{alpha:false});c.setTransform(dpr,0,0,dpr,0,0);
    c.fillStyle='#fff';c.fillRect(0,0,w,h);
    const grad=c.createRadialGradient(w*.59,h*.23,4,w*.59,h*.23,h*.42);grad.addColorStop(0,'rgba(254,38,1,.050)');grad.addColorStop(1,'rgba(254,38,1,0)');c.fillStyle=grad;c.fillRect(0,0,w,h);
    drawCurve(c,nodes.s,nodes.n,-.16,'rgba(254,38,1,.18)',1.1,-5);
    drawCurve(c,nodes.s,nodes.n,-.16,'rgba(254,38,1,.055)',4.2,6);
    drawCurve(c,nodes.x,nodes.n,.05,'rgba(42,42,40,.14)',1.0,0);
    drawCurve(c,nodes.x,nodes.n,.05,'rgba(80,80,76,.045)',3.6,-6);
    for(let i=0;i<28;i++){
      const x=hash(i*2.3)*w,y=hash(i*7.7)*h;
      sq(c,x,y,1.5,i%6===0?'#FE2601':'#aaa9a4',i%6===0?.055:.032);
    }
  };
  const resizeRegion=()=>{
    const r=region.getBoundingClientRect();if(!r.width||!r.height)return;
    const ndpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.1),nw=Math.round(r.width*ndpr),nh=Math.round(r.height*ndpr);
    if(nw===rc.width&&nh===rc.height)return;
    w=r.width;h=r.height;dpr=ndpr;rc.width=nw;rc.height=nh;rctx.setTransform(dpr,0,0,dpr,0,0);rebuildStatic();
  };
  const drawRegion=(now=0)=>{
    raf=0;if(!onScreen||!pageVisible())return;
    if(!reduced&&now-last<32){raf=requestAnimationFrame(drawRegion);return;}last=now;
    rctx.setTransform(dpr,0,0,dpr,0,0);rctx.globalAlpha=1;rctx.fillStyle='#fff';rctx.fillRect(0,0,w,h);
    if(staticLayer)rctx.drawImage(staticLayer,0,0,staticLayer.width,staticLayer.height,0,0,w,h);
    const t=reduced?3.4:now/1000;
    for(let lane=0;lane<2;lane++)for(let i=0;i<12;i++){
      const q=(t*(lane===0?.115:.094)+i/12+lane*.18)%1,p=curve(nodes.s,nodes.n,-.16,q,lane===0?-5:7);
      const c=i%4===0?'#ff6126':i%3===0?'#c91d06':'#FE2601';
      sq(rctx,p.x+5,p.y,2.0,c,.10);sq(rctx,p.x,p.y,i%5===0?4.0:3.0,c,.70);
    }
    for(let lane=0;lane<2;lane++)for(let i=0;i<8;i++){
      const q=(t*(lane===0?.072:.058)+i/8+lane*.21)%1,p=curve(nodes.x,nodes.n,.05,q,lane===0?0:-6),c=i%3===0?'#363634':'#85857f';
      sq(rctx,p.x+4,p.y,1.8,c,.08);sq(rctx,p.x,p.y,2.7,c,.46);
    }
    hctx?.globalAlpha;
    rctx.globalAlpha=1;
    if(!reduced)raf=requestAnimationFrame(drawRegion);
  };
  const startRegion=()=>{if(!raf&&onScreen&&pageVisible())raf=requestAnimationFrame(drawRegion);};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resizeRegion();startRegion();}).observe(region);else window.addEventListener('resize',()=>{resizeRegion();startRegion();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)startRegion();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(region);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startRegion();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resizeRegion();startRegion();
}
})();
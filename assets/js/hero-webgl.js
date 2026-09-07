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
heroCss.href='assets/css/hero-webgl.css?v=20260907-5';
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
    <svg class="hx-region-svg" viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true">
      <rect class="hx-region-bg" x="0" y="0" width="1000" height="280"/>
      <g class="hx-region-grid">
        <path d="M0 56H1000M0 112H1000M0 168H1000M0 224H1000"/>
        <path d="M125 0V280M250 0V280M375 0V280M500 0V280M625 0V280M750 0V280M875 0V280"/>
      </g>
      <g class="hx-red-lanes">
        <path class="hx-lane hx-lane-red lane-a" d="M110 215 C300 218 405 82 590 70"/>
        <path class="hx-lane hx-lane-red lane-b" d="M110 223 C302 226 408 90 590 78"/>
        <path class="hx-lane hx-lane-red lane-c" d="M110 207 C298 210 402 74 590 62"/>
      </g>
      <g class="hx-gray-lanes">
        <path class="hx-lane hx-lane-gray lane-a" d="M800 215 C760 158 700 91 590 70"/>
        <path class="hx-lane hx-lane-gray lane-b" d="M807 221 C766 164 705 98 595 77"/>
      </g>
      <g class="hx-node-matrix hx-node-s" transform="translate(110 215)">
        <rect x="-13" y="-13" width="5" height="5"/><rect x="-4" y="-13" width="5" height="5"/><rect x="5" y="-13" width="5" height="5"/>
        <rect x="-13" y="-4" width="5" height="5"/><rect class="core" x="-4" y="-4" width="5" height="5"/><rect x="5" y="-4" width="5" height="5"/>
        <rect x="-13" y="5" width="5" height="5"/><rect x="-4" y="5" width="5" height="5"/><rect x="5" y="5" width="5" height="5"/>
      </g>
      <g class="hx-node-matrix hx-node-n" transform="translate(590 70)">
        <rect x="-16" y="-16" width="6" height="6"/><rect x="-5" y="-16" width="6" height="6"/><rect x="6" y="-16" width="6" height="6"/>
        <rect x="-16" y="-5" width="6" height="6"/><rect class="core" x="-5" y="-5" width="6" height="6"/><rect x="6" y="-5" width="6" height="6"/>
        <rect x="-16" y="6" width="6" height="6"/><rect x="-5" y="6" width="6" height="6"/><rect x="6" y="6" width="6" height="6"/>
      </g>
      <g class="hx-node-matrix hx-node-x" transform="translate(800 215)">
        <rect x="-13" y="-13" width="5" height="5"/><rect x="-4" y="-13" width="5" height="5"/><rect x="5" y="-13" width="5" height="5"/>
        <rect x="-13" y="-4" width="5" height="5"/><rect class="core" x="-4" y="-4" width="5" height="5"/><rect x="5" y="-4" width="5" height="5"/>
        <rect x="-13" y="5" width="5" height="5"/><rect x="-4" y="5" width="5" height="5"/><rect x="5" y="5" width="5" height="5"/>
      </g>
    </svg>
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

const canvas=visual.querySelector('.hx-particle-canvas');
const ctx=canvas?.getContext('2d',{alpha:true});
if(!canvas||!ctx)return;

const logoMask=document.createElement('canvas');
const maskCtx=logoMask.getContext('2d',{willReadFrequently:true});
const logoImg=new Image();
const palette=['#ff9a5d','#ff7138','#ff4e23','#FE2601','#df2109','#bd1905','#272725'];
let w=0,h=0,dpr=1,raf=0,onScreen=true,logoReady=false,maskData=null,logoBox={x:0,y:0,w:0,h:0};
const started=performance.now();

const buildLogoMask=()=>{
  if(!logoReady||!w||!h)return;
  const mobile=w<760;
  logoMask.width=Math.max(1,Math.round(w));
  logoMask.height=Math.max(1,Math.round(h));
  maskCtx.clearRect(0,0,logoMask.width,logoMask.height);
  const iw=logoImg.naturalWidth||1;
  const ih=logoImg.naturalHeight||1;
  const maxW=w*(mobile ? .78 : .39);
  const maxH=h*(mobile ? .31 : .58);
  const scale=Math.min(maxW/iw,maxH/ih);
  const dw=iw*scale;
  const dh=ih*scale;
  const cx=w*(mobile ? .69 : .79);
  const cy=h*(mobile ? .43 : .48);
  const dx=cx-dw*.5;
  const dy=cy-dh*.5;
  logoBox={x:dx,y:dy,w:dw,h:dh};
  maskCtx.drawImage(logoImg,dx,dy,dw,dh);
  maskData=maskCtx.getImageData(0,0,logoMask.width,logoMask.height).data;
};

const maskAt=(x,y)=>{
  if(!maskData||x<0||y<0||x>=logoMask.width||y>=logoMask.height)return 0;
  return maskData[(Math.floor(y)*logoMask.width+Math.floor(x))*4+3]/255;
};

const resize=()=>{
  const r=visual.getBoundingClientRect();
  if(!r.width||!r.height)return;
  const mobile=r.width<760;
  const ndpr=Math.min(window.devicePixelRatio||1,mobile ? 1 : 1.15);
  const nw=Math.max(1,Math.round(r.width*ndpr));
  const nh=Math.max(1,Math.round(r.height*ndpr));
  if(nw===canvas.width&&nh===canvas.height)return;
  w=r.width;h=r.height;dpr=ndpr;
  canvas.width=nw;canvas.height=nh;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  buildLogoMask();
};

const drawParticle=(x,y,size,color,alpha)=>{
  if(alpha<=.002)return;
  ctx.globalAlpha=alpha;
  ctx.fillStyle=color;
  ctx.fillRect(x-size*.5,y-size*.5,size,size);
};

const drawFiber=(row,rows,t,reveal)=>{
  const mobile=w<760;
  const spacing=mobile ? 10.5 : 11.5;
  const speed=mobile ? 27 : 34;
  const travel=t*speed/spacing;
  const base=Math.floor(travel);
  const frac=travel-base;
  const cols=Math.ceil(w/spacing)+5;
  const baseY=((row+.5)/rows)*h;
  const rowPhase=row*.53;
  const rowDepth=.58+.42*Math.sin((row/Math.max(1,rows-1))*Math.PI);
  const front=logoBox.x+logoBox.w*(1-reveal);

  ctx.beginPath();
  let lineStarted=false;
  for(let k=-2;k<cols;k++){
    const worldIndex=k+base;
    const x=(k-frac)*spacing;
    const wrinkle=Math.sin(worldIndex*.31+rowPhase+t*.22)*2.1+Math.sin(worldIndex*.12-rowPhase*.7+t*.11)*1.35;
    const y=baseY+wrinkle*rowDepth;
    if(x<-20||x>w+20)continue;
    if(!lineStarted){ctx.moveTo(x,y);lineStarted=true;}else ctx.lineTo(x,y);
  }
  ctx.globalAlpha=.028*rowDepth;
  ctx.strokeStyle=row%5===0?'#FE2601':'#b9b9b4';
  ctx.lineWidth=.65;
  ctx.stroke();

  for(let k=-2;k<cols;k++){
    const worldIndex=k+base;
    const x=(k-frac)*spacing;
    if(x<-20||x>w+20)continue;
    const wrinkle=Math.sin(worldIndex*.31+rowPhase+t*.22)*2.1+Math.sin(worldIndex*.12-rowPhase*.7+t*.11)*1.35;
    const y=baseY+wrinkle*rowDepth;
    const seed=hash(worldIndex,row);
    if(seed<.38)continue;

    const inside=maskAt(x,y);
    const revealed=x>=front ? 1 : 0;
    const logoWeight=inside*revealed;
    const edge=1-clamp(Math.abs(x-front)/48,0,1);
    const tone=Math.floor(hash(worldIndex+31,row+19)*palette.length);
    let color=palette[tone];
    let size=1.55+hash(worldIndex+17,row+7)*1.9;
    let alpha=(.055+seed*.12)*rowDepth;

    if(logoWeight>.03){
      size=2.7+hash(worldIndex+5,row+11)*2.25;
      alpha=(.58+hash(worldIndex+13,row+23)*.34)*logoWeight;
      if(seed<.12)color='#ffb083';
      else if(seed>.91)color='#252523';
    }else if(edge>.02&&x>logoBox.x-70&&x<logoBox.x+logoBox.w+70){
      alpha=Math.max(alpha,.16*edge);
      color=seed>.82?'#bc1b06':'#ff4c21';
    }

    const leftFade=clamp((x/w-.015)/.23,0,1);
    alpha*=leftFade;
    drawParticle(x+8,y,size*.52,color,alpha*.08);
    drawParticle(x+4,y,size*.72,color,alpha*.18);
    drawParticle(x,y,size,color,alpha);
  }
};

const draw=(now=0)=>{
  raf=0;
  if(!onScreen||!visible())return;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,w,h);
  const t=reduced ? 4.4 : now/1000;
  const elapsed=reduced ? 4.4 : (now-started)/1000;
  const reveal=smooth((elapsed-.25)/3.3);
  const rows=w<760 ? 42 : 56;
  for(let row=0;row<rows;row++)drawFiber(row,rows,t,reveal);
  ctx.globalAlpha=1;
  if(!reduced)raf=requestAnimationFrame(draw);
};

const start=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(draw);};
logoImg.onload=()=>{logoReady=true;buildLogoMask();start();};
logoImg.src='assets/img/hongxing-mark-exact.svg?v=20260907-5';
if('ResizeObserver'in window)new ResizeObserver(()=>{resize();start();}).observe(visual);
else window.addEventListener('resize',()=>{resize();start();},{passive:true});
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
  onScreen=entries.some(e=>e.isIntersecting);
  if(onScreen)start();
  else if(raf){cancelAnimationFrame(raf);raf=0;}
},{threshold:0}).observe(hero);
document.addEventListener('visibilitychange',()=>{
  if(visible())start();
  else if(raf){cancelAnimationFrame(raf);raf=0;}
});
resize();start();
})();
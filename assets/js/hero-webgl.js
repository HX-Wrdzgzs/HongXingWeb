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
visual.innerHTML=`<div class="hx-particle-stage"><canvas class="hx-particle-canvas" aria-hidden="true"></canvas><div class="hx-particle-vignette"></div><div class="hx-particle-legend">PARTICLE FLOW · RIGHT → LEFT<br>LOGO ASSEMBLY · SERVICE FIELD</div></div>`;
copy.classList.add('in');visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});
if(visual.parentElement!==grid)grid.appendChild(visual);

const palette=['#ff6a22','#ff3e12','#FE2601','#d81f05','#a91505','#242422'];
const hash=n=>{const x=Math.sin(n*91.713+17.23)*43758.5453;return x-Math.floor(x)};

const canvas=visual.querySelector('.hx-particle-canvas');
const ctx=canvas?.getContext('2d',{alpha:true,desynchronized:true});
if(canvas&&ctx){
  const mask=document.createElement('canvas');
  const mctx=mask.getContext('2d',{willReadFrequently:true});
  const logo=new Image();
  let w=0,h=0,dpr=1,targets=[],particles=[],ambient=[],raf=0,onScreen=true,last=0,lastCycle=-1,logoReady=false;

  const resetParticle=(p,i)=>{
    p.x=w*(1.04+hash(i*7.1)*.38);
    p.y=h*(.08+hash(i*11.9)*.84);
    p.px=p.x;p.py=p.y;
    p.vx=-(42+hash(i*5.7)*58);
    p.size=1.8+hash(i*13.1)*2.8;
    p.color=palette[Math.min(palette.length-1,Math.floor(hash(i*3.7)*palette.length))];
  };

  const rebuildLogo=()=>{
    if(!logoReady||!w||!h)return;
    mask.width=Math.max(1,Math.round(w));mask.height=Math.max(1,Math.round(h));
    mctx.clearRect(0,0,w,h);
    const mobile=w<760;
    const iw=logo.naturalWidth||1,ih=logo.naturalHeight||1;
    const maxW=w*(mobile ? .80 : .42),maxH=h*(mobile ? .38 : .62);
    const scale=Math.min(maxW/iw,maxH/ih);
    const dw=iw*scale,dh=ih*scale;
    const cx=w*(mobile ? .60 : .76),cy=h*(mobile ? .47 : .48);
    const dx=cx-dw*.5,dy=cy-dh*.5;
    mctx.drawImage(logo,dx,dy,dw,dh);
    const data=mctx.getImageData(0,0,mask.width,mask.height).data;
    const step=mobile?6:7;
    const candidates=[];
    for(let y=Math.max(0,Math.floor(dy));y<Math.min(h,Math.ceil(dy+dh));y+=step){
      for(let x=Math.max(0,Math.floor(dx));x<Math.min(w,Math.ceil(dx+dw));x+=step){
        const a=data[(Math.floor(y)*mask.width+Math.floor(x))*4+3];
        if(a>48)candidates.push({x,y,lx:(x-dx)/Math.max(1,dw)});
      }
    }
    const maxPoints=mobile?560:760;
    const stride=Math.max(1,Math.ceil(candidates.length/maxPoints));
    targets=candidates.filter((_,i)=>i%stride===0).slice(0,maxPoints);
    particles=targets.map((t,i)=>{const p={tx:t.x,ty:t.y,lx:t.lx,phase:hash(i*2.9)*.35};resetParticle(p,i);return p;});

    const ambientCount=mobile?105:155;
    ambient=Array.from({length:ambientCount},(_,i)=>({
      x:hash(i*3.1)*w,y:hash(i*7.9)*h,
      vx:-(18+hash(i*5.2)*52),size:1+hash(i*9.3)*2.4,
      alpha:.07+hash(i*4.2)*.20,color:palette[Math.floor(hash(i*8.4)*5)]
    }));
    lastCycle=-1;
  };

  const resize=()=>{
    const r=visual.getBoundingClientRect();if(!r.width||!r.height)return;
    const nextDpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.2);
    const nw=Math.round(r.width*nextDpr),nh=Math.round(r.height*nextDpr);
    if(nw===canvas.width&&nh===canvas.height)return;
    w=r.width;h=r.height;dpr=nextDpr;canvas.width=nw;canvas.height=nh;ctx.setTransform(dpr,0,0,dpr,0,0);rebuildLogo();
  };

  const drawSquare=(x,y,s,color,a)=>{ctx.globalAlpha=a;ctx.fillStyle=color;ctx.fillRect(Math.round(x-s*.5),Math.round(y-s*.5),s,s);ctx.globalAlpha=1;};
  const drawHero=(now=0)=>{
    raf=0;if(!onScreen||!visible())return;
    const dt=Math.min(.034,Math.max(.001,(now-last||16)/1000));last=now;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const time=now/1000,cycleLen=10.8,cycle=Math.floor(time/cycleLen),phase=time%cycleLen;
    if(cycle!==lastCycle){particles.forEach(resetParticle);lastCycle=cycle;}

    ambient.forEach((p,i)=>{
      p.x+=p.vx*dt;
      if(p.x<-8){p.x=w+8+hash(i+cycle)*w*.12;p.y=hash(i*13.7+cycle)*h;}
      const fade=(p.x/w < .42 ? .52 : 1);
      drawSquare(p.x+7,p.y,p.size*.72,p.color,p.alpha*.20*fade);
      drawSquare(p.x,p.y,p.size,p.color,p.alpha*fade);
    });

    particles.forEach((p,i)=>{
      const start=.35+(1-p.lx)*3.55+p.phase;
      const assembling=phase>=start&&phase<8.15;
      const dispersing=phase>=8.15;
      p.px=p.x;p.py=p.y;
      if(assembling){
        const settle=Math.min(1,(phase-start)/1.25);
        const ease=1-Math.exp(-dt*(3.8+settle*6.0));
        p.x+=(p.tx-p.x)*ease;p.y+=(p.ty-p.y)*ease;
      }else if(dispersing){
        p.x+=(-90-hash(i*4.3)*80)*dt;
        p.y+=Math.sin(time*1.6+i)*9*dt;
      }else{
        p.x+=p.vx*dt;
      }
      const life=dispersing?Math.max(0,1-(phase-8.15)/2.25):Math.min(1,Math.max(0,(phase-start)/.50));
      if(life<=0)return;
      const leftFade=(p.x/w < .45 ? .46 : 1);
      const alpha=(.30+hash(i*6.2)*.58)*life*leftFade;
      const color=palette[Math.floor(hash(i*2.37)*palette.length)];
      const s=p.size*(.90+hash(i*8.1)*.42);
      drawSquare(p.px+5,p.py,s*.76,color,alpha*.15);
      drawSquare(p.x,p.y,s,color,alpha);
      if(i%5===0)drawSquare(p.x+2.6,p.y-2.4,s*.46,'#ff8a4a',alpha*.30);
    });

    if(!reduced)raf=requestAnimationFrame(drawHero);
  };
  const startHero=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(drawHero);};
  logo.onload=()=>{logoReady=true;rebuildLogo();startHero();};
  logo.src='assets/img/hongxing-mark-exact.svg';
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();startHero();}).observe(visual);else window.addEventListener('resize',()=>{resize();startHero();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(hero);
  document.addEventListener('visibilitychange',()=>{if(visible())startHero();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();startHero();
}else{
  visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';
}

const region=copy.querySelector('.hx-region-field');
const rc=region?.querySelector('.hx-region-canvas');
const rctx=rc?.getContext('2d',{alpha:true,desynchronized:true});
if(region&&rc&&rctx){
  let w=0,h=0,dpr=1,raf=0,last=0,onScreen=true;
  const node=(x,y)=>({x:x*w,y:y*h});
  const bez=(a,c,b,t)=>{const u=1-t;return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};};
  const curve=(from,to,bend,t,offset=0)=>{const a=node(from[0],from[1]),b=node(to[0],to[1]),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset};return bez(a,c,b,t);};
  const path=(from,to,bend,color,width,offset=0)=>{const a=node(from[0],from[1]),b=node(to[0],to[1]),c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+h*bend+offset};rctx.beginPath();rctx.moveTo(a.x,a.y);rctx.quadraticCurveTo(c.x,c.y,b.x,b.y);rctx.strokeStyle=color;rctx.lineWidth=width;rctx.stroke();};
  const square=(p,s,c,a)=>{rctx.globalAlpha=a;rctx.fillStyle=c;rctx.fillRect(Math.round(p.x-s*.5),Math.round(p.y-s*.5),s,s);rctx.globalAlpha=1;};
  const resize=()=>{const r=region.getBoundingClientRect();if(!r.width||!r.height)return;const nd=Math.min(window.devicePixelRatio||1,r.width<760?1:1.15),nw=Math.round(r.width*nd),nh=Math.round(r.height*nd);if(nw===rc.width&&nh===rc.height)return;w=r.width;h=r.height;dpr=nd;rc.width=nw;rc.height=nh;rctx.setTransform(dpr,0,0,dpr,0,0);};
  const draw=(now=0)=>{
    raf=0;if(!onScreen||!visible())return;if(!reduced&&now-last<30){raf=requestAnimationFrame(draw);return;}last=now;
    rctx.setTransform(dpr,0,0,dpr,0,0);rctx.clearRect(0,0,w,h);const t=reduced?3:now/1000;
    for(let i=0;i<46;i++){const x=hash(i*2.1)*w,y=hash(i*7.3)*h,s=1.2+hash(i*5.1)*1.8,a=.018+hash(i*4.9)*.045;square({x,y},s,i%5===0?'#FE2601':'#6f6f6a',a);}
    path([.10,.76],[.58,.22],-.18,'rgba(254,38,1,.16)',1.1,-5);
    path([.10,.76],[.58,.22],-.18,'rgba(255,92,34,.08)',3.6,6);
    path([.76,.76],[.58,.22],.05,'rgba(37,37,34,.12)',1.0,0);
    path([.76,.76],[.58,.22],.05,'rgba(120,120,114,.06)',3.0,-6);

    for(let lane=0;lane<2;lane++)for(let i=0;i<13;i++){
      const q=(t*(lane?0.12:0.145)+i/13+lane*.12)%1,p=curve([.10,.76],[.58,.22],-.18,q,lane?7:-5);
      const c=i%4===0?'#ff6a22':i%3===0?'#c91d06':'#FE2601',a=.26+.58*Math.sin(Math.PI*q);
      square({x:p.x+7,y:p.y},2.4,c,a*.16);square(p,i%5===0?4.6:3.4,c,a);
    }
    for(let lane=0;lane<2;lane++)for(let i=0;i<8;i++){
      const q=(t*(lane ? .07 : .085)+i/8+lane*.18)%1,p=curve([.76,.76],[.58,.22],.05,q,lane?-5:4),c=i%3===0?'#2b2b29':'#777772',a=.16+.40*Math.sin(Math.PI*q);
      square({x:p.x+5,y:p.y},2.0,c,a*.15);square(p,2.8,c,a);
    }
    const pulse=.5+.5*Math.sin(t*2.2);
    [{p:[.58,.22],c:'#FE2601',r:10+pulse*3},{p:[.76,.76],c:'#2d2d2b',r:8},{p:[.10,.76],c:'#777',r:8}].forEach((n,i)=>{
      const p=node(n.p[0],n.p[1]);rctx.globalAlpha=(i===0 ? .18 : .10);rctx.strokeStyle=n.c;rctx.lineWidth=1;rctx.strokeRect(p.x-n.r,p.y-n.r,n.r*2,n.r*2);rctx.globalAlpha=1;
    });
    if(!reduced)raf=requestAnimationFrame(draw);
  };
  const start=()=>{if(!raf&&onScreen&&visible())raf=requestAnimationFrame(draw);};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();start();}).observe(region);else window.addEventListener('resize',()=>{resize();start();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{onScreen=es.some(e=>e.isIntersecting);if(onScreen)start();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(region);
  document.addEventListener('visibilitychange',()=>{if(visible())start();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();start();
}
})();
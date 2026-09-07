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

visual.innerHTML=`
  <div class="hx-particle-stage">
    <canvas class="hx-particle-canvas" aria-hidden="true"></canvas>
    <div class="hx-particle-vignette"></div>
    <div class="hx-particle-legend">WEBGL2 · DENSE PARTICLE FIELD<br>RIGHT → LEFT · LOGO REVEAL</div>
  </div>`;

copy.classList.add('in');
visual.classList.add('in');
Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});

const lead=copy.querySelector('.formal-lead');
const syncLayout=()=>{
  const mobile=window.matchMedia('(max-width:760px)').matches;
  if(mobile){
    if(visual.parentElement!==copy)lead.insertAdjacentElement('afterend',visual);
  }else if(visual.parentElement!==grid){
    copy.insertAdjacentElement('afterend',visual);
  }
};
syncLayout();
window.addEventListener('resize',syncLayout,{passive:true});

// ---------------------------------------------------------------------------
// Three-region information particle field: separate from the logo field.
// ---------------------------------------------------------------------------
const region=copy.querySelector('.hx-region-field');
const regionCanvas=region?.querySelector('.hx-region-canvas');
const regionCtx=regionCanvas?.getContext('2d',{alpha:true,desynchronized:true});
if(region&&regionCanvas&&regionCtx){
  const staticCanvas=document.createElement('canvas');
  const staticCtx=staticCanvas.getContext('2d',{alpha:true});
  let rw=0,rh=0,rdpr=1,regionRaf=0,lastRegion=0,regionOnscreen=true;

  const node=(x,y)=>({x:x*rw,y:y*rh});
  const curve=(from,to,bend,t)=>{
    const a=node(from[0],from[1]),b=node(to[0],to[1]);
    const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
    const u=1-t;
    return{x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};
  };
  const drawPath=(ctx,from,to,bend,stroke,width)=>{
    const a=node(from[0],from[1]),b=node(to[0],to[1]);
    const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);
    ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();
  };
  const hash=(x,y)=>{
    let n=(Math.imul(x+19,374761393)^Math.imul(y+31,668265263))>>>0;
    n=(n^(n>>>13))>>>0;n=Math.imul(n,1274126177)>>>0;
    return((n^(n>>>16))>>>0)/4294967295;
  };

  const rebuildStatic=()=>{
    staticCanvas.width=regionCanvas.width;staticCanvas.height=regionCanvas.height;
    staticCtx.setTransform(rdpr,0,0,rdpr,0,0);
    staticCtx.fillStyle='#fff';staticCtx.fillRect(0,0,rw,rh);
    for(let y=9,gy=0;y<rh-7;y+=10,gy++){
      for(let x=8,gx=0;x<rw-7;x+=10,gx++){
        const h=hash(gx,gy);
        if(h>.72){
          const warm=h>.9;
          staticCtx.fillStyle=warm?'rgba(254,38,1,.115)':'rgba(74,74,70,.045)';
          const s=warm?3:2;
          staticCtx.fillRect(Math.round(x),Math.round(y),s,s);
        }
      }
    }
    drawPath(staticCtx,[.10,.76],[.58,.22],-.18,'rgba(254,38,1,.26)',1.3);
    drawPath(staticCtx,[.76,.76],[.58,.22],.05,'rgba(36,36,34,.16)',1.05);
  };

  const resizeRegion=()=>{
    const r=region.getBoundingClientRect();if(!r.width||!r.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.15);
    const nw=Math.round(r.width*dpr),nh=Math.round(r.height*dpr);
    if(nw===regionCanvas.width&&nh===regionCanvas.height)return;
    rw=r.width;rh=r.height;rdpr=dpr;
    regionCanvas.width=nw;regionCanvas.height=nh;
    regionCtx.setTransform(rdpr,0,0,rdpr,0,0);
    rebuildStatic();
  };

  const square=(p,size,color,alpha)=>{
    regionCtx.globalAlpha=alpha;regionCtx.fillStyle=color;
    regionCtx.fillRect(Math.round(p.x-size*.5),Math.round(p.y-size*.5),size,size);
    regionCtx.globalAlpha=1;
  };

  const drawRegion=(now=0)=>{
    regionRaf=0;
    if(!regionOnscreen||!pageVisible())return;
    if(!reduced&&now-lastRegion<28){regionRaf=requestAnimationFrame(drawRegion);return;}
    lastRegion=now;
    regionCtx.setTransform(rdpr,0,0,rdpr,0,0);
    regionCtx.fillStyle='#fff';regionCtx.fillRect(0,0,rw,rh);
    regionCtx.drawImage(staticCanvas,0,0,staticCanvas.width,staticCanvas.height,0,0,rw,rh);
    const t=reduced?3:now/1000;

    for(let i=0;i<18;i++){
      const q=(t*.135+i/18)%1;
      const p=curve([.10,.76],[.58,.22],-.18,q);
      const palette=i%4===0?'#ff5a1f':i%3===0?'#c91f08':'#FE2601';
      square(p,i%5===0?5.5:4.2,palette,.34+.62*Math.sin(Math.PI*q));
    }
    for(let i=0;i<11;i++){
      const q=(t*.085+i/11)%1;
      const p=curve([.76,.76],[.58,.22],.05,q);
      square(p,i%4===0?4:3.2,i%4===0?'#171716':'#777772',.20+.48*Math.sin(Math.PI*q));
    }

    const pulse=.5+.5*Math.sin(t*2.2);
    const nodes=[{p:[.58,.22],c:'#FE2601',a:.23,s:8+pulse*3},{p:[.76,.76],c:'#222',a:.13,s:7},{p:[.10,.76],c:'#777',a:.13,s:7}];
    nodes.forEach(n=>{
      const p=node(n.p[0],n.p[1]);
      regionCtx.strokeStyle=n.c;regionCtx.globalAlpha=n.a;regionCtx.lineWidth=1.2;
      regionCtx.strokeRect(Math.round(p.x-n.s),Math.round(p.y-n.s),Math.round(n.s*2),Math.round(n.s*2));
      regionCtx.globalAlpha=1;
    });
    if(!reduced)regionRaf=requestAnimationFrame(drawRegion);
  };
  const startRegion=()=>{if(!regionRaf&&regionOnscreen&&pageVisible())regionRaf=requestAnimationFrame(drawRegion)};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resizeRegion();startRegion()}).observe(region);
  else window.addEventListener('resize',()=>{resizeRegion();startRegion()},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    regionOnscreen=entries.some(e=>e.isIntersecting);
    if(regionOnscreen)startRegion();else if(regionRaf){cancelAnimationFrame(regionRaf);regionRaf=0;}
  },{threshold:0}).observe(region);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startRegion();else if(regionRaf){cancelAnimationFrame(regionRaf);regionRaf=0;}});
  resizeRegion();startRegion();
}

// ---------------------------------------------------------------------------
// Dense Hong Xing logo particle field.
// ---------------------------------------------------------------------------
const canvas=visual.querySelector('.hx-particle-canvas');
const probe=document.createElement('canvas');
if(!canvas||!probe.getContext('webgl2')){
  visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';
  return;
}

try{
  const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'high-performance'});
  if(!gl)throw new Error('WebGL2 context unavailable');
  const vs=`#version 300 es
  in vec2 a_pos;
  void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;
  const fs=`#version 300 es
  precision mediump float;
  out vec4 outColor;
  uniform vec2 u_res;
  uniform float u_time;
  uniform sampler2D u_logo;
  uniform float u_reduce;
  float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  void main(){
    vec2 uv=gl_FragCoord.xy/u_res;uv.y=1.0-uv.y;
    float aspect=u_res.x/u_res.y;
    float columns=mix(66.0,82.0,step(760.0,u_res.x));
    vec2 grid=vec2(columns,max(46.0,columns/aspect));
    float flowCells=u_reduce>.5?0.0:u_time*7.0;
    vec2 moving=uv*grid+vec2(flowCells,0.0);
    vec2 gid=floor(moving);
    vec2 local=fract(moving)-0.5;
    vec2 cellUv=(gid+0.5-vec2(flowCells,0.0))/grid;
    float rnd=hash21(gid);
    float rnd2=hash21(gid+vec2(17.0,41.0));
    float logo=texture(u_logo,clamp(cellUv,0.0,1.0)).r;
    float logoShape=smoothstep(.055,.30,logo);
    float cycle=u_reduce>.5?6.0:mod(u_time,10.0);
    float progress=smoothstep(.45,4.85,cycle);
    float front=mix(1.18,-.18,progress);
    float revealed=smoothstep(front-.045,front+.12,cellUv.x);
    float life=1.0-smoothstep(8.15,9.55,cycle);
    float logoDensity=logoShape*revealed*life;
    float frontBand=1.0-smoothstep(.025,.16,abs(cellUv.x-front));
    frontBand*=smoothstep(.20,.62,cycle)*(1.0-smoothstep(4.7,5.3,cycle));
    float frontParticles=frontBand*step(.42,rnd2)*.90;
    float stream=step(.885,rnd)*(.16+.16*(.5+.5*sin(gid.y*.35-u_time*3.0)));
    float wake=(1.0-smoothstep(.0,.34,cellUv.x-front))*step(.94,rnd2)*.13;
    float density=max(logoDensity,max(frontParticles,max(stream,wake)));
    float size=mix(.27,.39,rnd2);
    float d=max(abs(local.x),abs(local.y));
    float core=1.0-smoothstep(size,size+.025,d);
    float glow=(1.0-smoothstep(size+.03,size+.16,d))*density*.18;
    float edge=smoothstep(.006,.045,uv.x)*smoothstep(.994,.95,uv.x)*smoothstep(.010,.055,uv.y)*smoothstep(.990,.945,uv.y);
    float alpha=(core*density+glow)*edge;
    vec3 col=vec3(.996,.149,.004);
    if(rnd<.22)col=vec3(1.0,.33,.09);
    else if(rnd>.72&&rnd<.91)col=vec3(.78,.075,.018);
    else if(rnd>=.91)col=vec3(.075,.072,.068);
    col=mix(col,vec3(1.0,.39,.12),frontBand*.34);
    outColor=vec4(col,min(alpha*1.28,.98));
  }`;

  const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader compile failed');return s;};
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));
  gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'program link failed');
  gl.useProgram(program);

  const buffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(program,'a_pos');
  gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const U={res:gl.getUniformLocation(program,'u_res'),time:gl.getUniformLocation(program,'u_time'),logo:gl.getUniformLocation(program,'u_logo'),reduce:gl.getUniformLocation(program,'u_reduce')};

  const logoMask=document.createElement('canvas');logoMask.width=8;logoMask.height=8;
  const logoCtx=logoMask.getContext('2d');logoCtx.fillStyle='#000';logoCtx.fillRect(0,0,8,8);
  const uploadLogo=old=>{
    const tex=old||gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,logoMask);return tex;
  };
  let logoTex=uploadLogo(null);gl.uniform1i(U.logo,0);
  const logoImg=new Image();let logoReady=false;
  const paintLogo=()=>{
    if(!logoReady)return;
    const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const aspect=r.width/r.height;let mw,mh;
    if(aspect>=1){mw=900;mh=Math.max(340,Math.round(mw/aspect));}else{mh=900;mw=Math.max(340,Math.round(mh*aspect));}
    if(logoMask.width!==mw)logoMask.width=mw;if(logoMask.height!==mh)logoMask.height=mh;
    const g=logoMask.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,mw,mh);
    const iw=logoImg.naturalWidth||1,ih=logoImg.naturalHeight||1;
    const mobile=aspect<1.45;
    const maxW=mw*(mobile?.78:.72),maxH=mh*(mobile?.76:.80);
    const scale=Math.min(maxW/iw,maxH/ih),dw=iw*scale,dh=ih*scale;
    g.filter='grayscale(1) brightness(6) contrast(4)';g.drawImage(logoImg,(mw-dw)/2,(mh-dh)/2,dw,dh);g.filter='none';
    logoTex=uploadLogo(logoTex);
  };
  logoImg.onload=()=>{logoReady=true;paintLogo();};
  logoImg.src='assets/img/hongxing-mark-exact.svg';

  let w=0,h=0,raf=0,onscreen=true,dead=false;
  const resize=()=>{
    const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,r.width<760?1:1.24);
    const nw=Math.max(1,Math.round(r.width*dpr)),nh=Math.max(1,Math.round(r.height*dpr));
    if(nw===w&&nh===h)return;
    w=canvas.width=nw;h=canvas.height=nh;gl.viewport(0,0,w,h);paintLogo();
  };
  const start=performance.now();
  const frame=now=>{
    raf=0;if(dead||!onscreen||!pageVisible())return;
    try{
      gl.clearColor(1,1,1,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
      gl.uniform2f(U.res,w,h);gl.uniform1f(U.time,reduced?6:(now-start)/1000);gl.uniform1f(U.reduce,reduced?1:0);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }catch(e){dead=true;visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';return;}
    if(!reduced)raf=requestAnimationFrame(frame);
  };
  const startFrames=()=>{if(!dead&&!raf&&onscreen&&pageVisible())raf=requestAnimationFrame(frame);};
  if('ResizeObserver'in window)new ResizeObserver(()=>{resize();startFrames();}).observe(canvas);
  else window.addEventListener('resize',()=>{resize();startFrames();},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
    onscreen=entries.some(e=>e.isIntersecting);if(onscreen)startFrames();else if(raf){cancelAnimationFrame(raf);raf=0;}
  },{threshold:0}).observe(visual);
  document.addEventListener('visibilitychange',()=>{if(pageVisible())startFrames();else if(raf){cancelAnimationFrame(raf);raf=0;}});
  resize();startFrames();
}catch(e){
  console.warn('[HongXing] particle hero fallback',e);
  visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';
}
})();
(()=>{
  'use strict';
  if(document.body.dataset.page!=='home') return;
  const hero=document.querySelector('.hero');
  const copy=hero?.querySelector('.hero-copy');
  const visual=hero?.querySelector('.hero-visual');
  if(!hero||!copy||!visual) return;

  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
  hero.classList.add('hx-shader-hero','hx-service-mobile-order');

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
      <div class="hx-particle-legend">WEBGL2 · LATTICE FIELD<br>RIGHT → LEFT · LOGO REVEAL</div>
    </div>`;

  copy.classList.add('in');visual.classList.add('in');
  Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
  Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});

  const pageVisible=()=>!document.hidden;

  // -------------------------------------------------------------------------
  // Three-region particle network. This is intentionally separate from the
  // Hong Xing logo field: no logo mask is ever sampled in this canvas.
  // -------------------------------------------------------------------------
  const region=copy.querySelector('.hx-region-field');
  const regionCanvas=region?.querySelector('.hx-region-canvas');
  const regionCtx=regionCanvas?.getContext('2d',{alpha:true,desynchronized:true});
  if(region&&regionCanvas&&regionCtx){
    const staticCanvas=document.createElement('canvas');
    const staticCtx=staticCanvas.getContext('2d',{alpha:true});
    let rw=0,rh=0,rdpr=1,regionRaf=0,lastRegion=0,regionOnscreen=true;

    const node=(x,y)=>({x:x*rw,y:y*rh});
    const bezier=(a,c,b,t)=>{
      const u=1-t;
      return {x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y};
    };
    const pathPoint=(from,to,bend,t)=>{
      const a=node(from[0],from[1]),b=node(to[0],to[1]);
      const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
      return bezier(a,c,b,t);
    };
    const drawPath=(ctx,from,to,bend,stroke,width=1)=>{
      const a=node(from[0],from[1]),b=node(to[0],to[1]);
      const c={x:(a.x+b.x)*.5,y:(a.y+b.y)*.5+rh*bend};
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(c.x,c.y,b.x,b.y);
      ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();
    };
    const hash=(x,y)=>{
      let n=(Math.imul(x+17,374761393)^Math.imul(y+29,668265263))>>>0;
      n=(n^(n>>>13))>>>0;n=Math.imul(n,1274126177)>>>0;return((n^(n>>>16))>>>0)/4294967295;
    };

    const rebuildStatic=()=>{
      staticCanvas.width=regionCanvas.width;staticCanvas.height=regionCanvas.height;
      staticCtx.setTransform(rdpr,0,0,rdpr,0,0);
      staticCtx.clearRect(0,0,rw,rh);
      const step=12;
      for(let y=10,gy=0;y<rh-8;y+=step,gy++){
        for(let x=8,gx=0;x<rw-8;x+=step,gx++){
          const h=hash(gx,gy);
          if(h>.82){
            const a=.025+(h-.82)*.22;
            staticCtx.fillStyle=`rgba(254,38,1,${a.toFixed(3)})`;
            staticCtx.fillRect(Math.round(x),Math.round(y),3,3);
          }
        }
      }
      drawPath(staticCtx,[.12,.74],[.62,.23],-.18,'rgba(254,38,1,.16)',1.1);
      drawPath(staticCtx,[.75,.74],[.62,.23],.04,'rgba(35,35,33,.12)',1);
    };

    const resizeRegion=()=>{
      const r=region.getBoundingClientRect();if(!r.width||!r.height)return;
      const mobile=r.width<760;
      const nextDpr=Math.min(window.devicePixelRatio||1,mobile?1:1.2);
      const nw=Math.round(r.width*nextDpr),nh=Math.round(r.height*nextDpr);
      if(nw===regionCanvas.width&&nh===regionCanvas.height)return;
      rdpr=nextDpr;rw=r.width;rh=r.height;
      regionCanvas.width=nw;regionCanvas.height=nh;
      regionCtx.setTransform(rdpr,0,0,rdpr,0,0);
      rebuildStatic();
    };

    const drawMover=(p,size,fill,alpha=1)=>{
      regionCtx.globalAlpha=alpha;regionCtx.fillStyle=fill;
      regionCtx.fillRect(Math.round(p.x-size*.5),Math.round(p.y-size*.5),size,size);
      regionCtx.globalAlpha=1;
    };

    const drawRegion=(now=0)=>{
      regionRaf=0;
      if(!regionOnscreen||!pageVisible())return;
      if(!reduced&&now-lastRegion<30){regionRaf=requestAnimationFrame(drawRegion);return;}
      lastRegion=now;
      regionCtx.setTransform(rdpr,0,0,rdpr,0,0);
      regionCtx.clearRect(0,0,rw,rh);
      regionCtx.drawImage(staticCanvas,0,0,staticCanvas.width,staticCanvas.height,0,0,rw,rh);
      const t=reduced?2.6:now/1000;

      // Suzhou -> Nanjing: primary migration stream.
      for(let i=0;i<9;i++){
        const q=(t*.115+i/9)%1;
        const p=pathPoint([.12,.74],[.62,.23],-.18,q);
        drawMover(p,i%3===0?5:4,'#FE2601',.34+.58*Math.sin(Math.PI*q));
      }
      // Xining <-> Nanjing: existing active service relationship.
      for(let i=0;i<6;i++){
        const q=(t*.075+i/6)%1;
        const p=pathPoint([.75,.74],[.62,.23],.04,q);
        drawMover(p,3.5,'#333330',.18+.42*Math.sin(Math.PI*q));
      }

      // Small node pulses, kept inexpensive and visually subordinate.
      const pulse=.5+.5*Math.sin(t*2.0);
      [[.62,.23,'rgba(254,38,1,'],[.75,.74,'rgba(25,25,24,'],[.12,.74,'rgba(110,110,106,']].forEach(([x,y,c],i)=>{
        const p=node(x,y);const s=6+(i===0?pulse*3:0);
        regionCtx.strokeStyle=c+(i===0?.16:.10)+')';regionCtx.lineWidth=1;
        regionCtx.strokeRect(Math.round(p.x-s),Math.round(p.y-s),Math.round(s*2),Math.round(s*2));
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

  // -------------------------------------------------------------------------
  // Homepage logo field. Only the logo lives here; city labels and routes are
  // intentionally absent so the two concepts cannot collapse into one block.
  // -------------------------------------------------------------------------
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
        float columns=mix(44.0,58.0,step(760.0,u_res.x));
        vec2 grid=vec2(columns,max(32.0,columns/aspect));
        float flowCells=u_reduce>.5?0.0:u_time*5.2;
        vec2 moving=uv*grid+vec2(flowCells,0.0);
        vec2 gid=floor(moving);
        vec2 local=fract(moving)-0.5;
        vec2 cellUv=(gid+0.5-vec2(flowCells,0.0))/grid;
        float rnd=hash21(gid);
        float logo=texture(u_logo,clamp(cellUv,0.0,1.0)).r;
        float logoShape=smoothstep(.09,.36,logo);
        float cycle=u_reduce>.5?6.2:mod(u_time,10.5);
        float progress=smoothstep(.65,5.35,cycle);
        float front=mix(1.16,-.16,progress);
        float revealed=smoothstep(front-.055,front+.115,cellUv.x);
        float life=1.0-smoothstep(8.35,9.95,cycle);
        float logoDensity=logoShape*revealed*life;
        float frontBand=(1.0-smoothstep(.035,.17,abs(cellUv.x-front)));
        frontBand*=smoothstep(.45,.85,cycle)*(1.0-smoothstep(5.25,5.8,cycle));
        float frontParticles=frontBand*step(.70,hash21(gid+vec2(19.0,7.0)))*.62;
        float ambient=step(.947,rnd)*.15;
        float size=mix(.245,.335,rnd);
        float square=1.0-smoothstep(size,size+.026,max(abs(local.x),abs(local.y)));
        float edge=smoothstep(.008,.055,uv.x)*smoothstep(.992,.94,uv.x)*smoothstep(.012,.07,uv.y)*smoothstep(.988,.92,uv.y);
        float density=max(ambient,max(frontParticles,logoDensity));
        float alpha=square*density*edge;
        float dark=step(.974,rnd)*logoDensity;
        vec3 col=mix(vec3(.996,.149,.004),vec3(.045,.045,.043),dark*.82);
        outColor=vec4(col,min(alpha*1.52,.98));
      }`;
    const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||'shader compile failed');return s};
    const program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)||'program link failed');gl.useProgram(program);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'a_pos');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    const U={res:gl.getUniformLocation(program,'u_res'),time:gl.getUniformLocation(program,'u_time'),logo:gl.getUniformLocation(program,'u_logo'),reduce:gl.getUniformLocation(program,'u_reduce')};

    const logoMask=document.createElement('canvas');logoMask.width=8;logoMask.height=8;const logoCtx=logoMask.getContext('2d');logoCtx.fillStyle='#000';logoCtx.fillRect(0,0,8,8);
    const uploadLogo=old=>{const tex=old||gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,logoMask);return tex};
    let logoTex=uploadLogo(null);gl.uniform1i(U.logo,0);const logoImg=new Image();let logoReady=false;
    const paintLogo=()=>{
      if(!logoReady)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const aspect=r.width/r.height;let mw,mh;
      if(aspect>=1){mw=768;mh=Math.max(300,Math.round(mw/aspect))}else{mh=768;mw=Math.max(300,Math.round(mh*aspect))}
      if(logoMask.width!==mw)logoMask.width=mw;if(logoMask.height!==mh)logoMask.height=mh;
      const g=logoMask.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,mw,mh);
      const iw=logoImg.naturalWidth||logoImg.width||1,ih=logoImg.naturalHeight||logoImg.height||1;const portrait=aspect<1;
      const maxW=mw*(portrait?.76:.70),maxH=mh*(portrait?.72:.78);const scale=Math.min(maxW/iw,maxH/ih);const dw=iw*scale,dh=ih*scale;const dx=(mw-dw)*.5,dy=(mh-dh)*.5;
      g.filter='grayscale(1) brightness(5) contrast(3)';g.drawImage(logoImg,dx,dy,dw,dh);g.filter='none';logoTex=uploadLogo(logoTex);
    };
    logoImg.onload=()=>{logoReady=true;paintLogo()};logoImg.src='assets/img/hongxing-mark-exact.svg';

    let w=0,h=0,dead=false,raf=0,onscreen=true;
    const resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const mobile=r.width<760;const dpr=Math.min(window.devicePixelRatio||1,mobile?1:1.28);const nw=Math.max(1,Math.round(r.width*dpr)),nh=Math.max(1,Math.round(r.height*dpr));if(nw===w&&nh===h)return;w=canvas.width=nw;h=canvas.height=nh;gl.viewport(0,0,w,h);paintLogo()};
    const start=performance.now();
    const frame=now=>{raf=0;if(dead||!onscreen||!pageVisible())return;try{gl.clearColor(1,1,1,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform2f(U.res,w,h);gl.uniform1f(U.time,reduced?6.2:(now-start)/1000);gl.uniform1f(U.reduce,reduced?1:0);gl.drawArrays(gl.TRIANGLES,0,3)}catch(e){dead=true;visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>';return}if(!reduced)raf=requestAnimationFrame(frame)};
    const startFrames=()=>{if(!dead&&!raf&&onscreen&&pageVisible())raf=requestAnimationFrame(frame)};
    if('ResizeObserver'in window)new ResizeObserver(()=>{resize();startFrames()}).observe(canvas);else window.addEventListener('resize',()=>{resize();startFrames()},{passive:true});
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{onscreen=entries.some(e=>e.isIntersecting);if(onscreen)startFrames();else if(raf){cancelAnimationFrame(raf);raf=0;}},{threshold:0}).observe(visual);
    document.addEventListener('visibilitychange',()=>{if(pageVisible())startFrames();else if(raf){cancelAnimationFrame(raf);raf=0;}});
    resize();startFrames();
  }catch(e){console.warn('[HongXing] logo WebGL unavailable',e);visual.innerHTML='<div class="hx-logo-fallback"><img src="assets/img/hongxing-mark-exact.svg" alt="Hong Xing"></div>'}
})();
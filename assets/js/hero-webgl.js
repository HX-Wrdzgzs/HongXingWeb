(()=>{
  'use strict';
  if(document.body.dataset.page!=='home') return;
  const hero=document.querySelector('.hero');
  const grid=hero?.querySelector('.hero-grid');
  const copy=hero?.querySelector('.hero-copy');
  const visual=hero?.querySelector('.hero-visual');
  if(!hero||!grid||!copy||!visual) return;

  const original={copy:copy.innerHTML,visual:visual.innerHTML,heroClass:hero.className};
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
  const probe=document.createElement('canvas');
  if(!probe.getContext('webgl2')) return;

  const restore=(err)=>{
    if(err) console.warn('[HongXing] particle hero restored to static mode',err);
    if(visual.parentElement!==grid) grid.appendChild(visual);
    hero.className=original.heroClass;
    copy.innerHTML=original.copy;
    visual.innerHTML=original.visual;
    copy.classList.add('in');
    visual.classList.add('in');
    Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none',display:''});
    Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none',display:''});
  };

  try{
    hero.classList.add('hx-shader-hero','hx-service-mobile-order');
    copy.innerHTML=`
      <div class="hx-hero-kicker">Hong Xing · Product & Service System</div>
      <h1>系统、服务与<em>基础设施</em></h1>
      <p class="formal-lead">Hong Xing 当前产品与服务体系涵盖 HongXing / HongXingOS、固件、HongXing Online、AuthLit 以及相关基础设施。本站用于发布版本状态、技术公告、兼容性说明、生命周期安排及基础设施调整。</p>
      <div class="hero-en">SYSTEM · FIRMWARE · ONLINE SERVICE · AUTHENTICATION</div>
      <div class="actions"><a class="primary" href="projects.html">查看产品体系 <span>→</span></a><a class="text-link" href="updates.html">查看公告归档 <span>→</span></a></div>
      <div class="hx-hero-note"><span><b>南京</b>主服务节点</span><span><b>青海西宁</b>既有机房持续运行</span><span><b>苏州</b>服务与资源迁移中</span></div>`;

    visual.innerHTML=`
      <div class="hx-particle-stage">
        <canvas class="hx-particle-canvas" aria-hidden="true"></canvas>
        <div class="hx-particle-vignette"></div>
        <div class="hx-network-label nanjing"><span><strong>南京</strong><small>NANJING · PRIMARY</small></span></div>
        <div class="hx-network-label xining"><span><strong>青海西宁</strong><small>XINING · ACTIVE</small></span></div>
        <div class="hx-network-label suzhou"><span><strong>苏州</strong><small>SUZHOU · MIGRATING</small></span></div>
        <div class="hx-particle-legend">WEBGL2 · LATTICE FIELD<br>RIGHT → LEFT · LOGO REVEAL</div>
      </div>`;
    copy.classList.add('in');
    visual.classList.add('in');
    Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
    Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});

    const mobileLayout=window.matchMedia('(max-width:760px)');
    const placeVisual=()=>{
      const note=copy.querySelector('.hx-hero-note');
      if(mobileLayout.matches&&note){
        if(visual.parentElement!==copy||visual.nextElementSibling!==note) copy.insertBefore(visual,note);
      }else if(visual.parentElement!==grid||visual!==grid.lastElementChild){
        grid.appendChild(visual);
      }
    };
    placeVisual();

    const canvas=visual.querySelector('.hx-particle-canvas');
    const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'high-performance'});
    if(!gl) throw new Error('WebGL2 context unavailable');

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

      float hash21(vec2 p){
        p=fract(p*vec2(123.34,456.21));
        p+=dot(p,p+45.32);
        return fract(p.x*p.y);
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        uv.y=1.0-uv.y;
        float aspect=u_res.x/u_res.y;

        // The lattice itself moves from right to left.
        float columns=mix(46.0,58.0,step(760.0,u_res.x));
        vec2 grid=vec2(columns,max(34.0,columns/aspect));
        float flowCells=u_reduce>.5?0.0:u_time*5.2;
        vec2 moving=uv*grid+vec2(flowCells,0.0);
        vec2 gid=floor(moving);
        vec2 local=fract(moving)-0.5;
        vec2 cellUv=(gid+0.5-vec2(flowCells,0.0))/grid;
        float rnd=hash21(gid);

        float logo=texture(u_logo,clamp(cellUv,0.0,1.0)).r;
        float logoShape=smoothstep(.09,.36,logo);

        // Reveal the logo with a right-to-left front, then hold and fade.
        float cycle=u_reduce>.5?6.2:mod(u_time,10.5);
        float revealProgress=smoothstep(.65,5.35,cycle);
        float front=mix(1.16,-.16,revealProgress);
        float revealed=smoothstep(front-.055,front+.115,cellUv.x);
        float logoLife=1.0-smoothstep(8.35,9.95,cycle);
        float logoDensity=logoShape*revealed*logoLife;

        float frontBand=(1.0-smoothstep(.035,.17,abs(cellUv.x-front)));
        frontBand*=smoothstep(.45,.85,cycle)*(1.0-smoothstep(5.25,5.8,cycle));
        float frontParticles=frontBand*step(.70,hash21(gid+vec2(19.0,7.0)))*.62;

        float ambient=step(.945,rnd)*.16;
        float size=mix(.245,.335,rnd);
        float square=1.0-smoothstep(size,size+.026,max(abs(local.x),abs(local.y)));
        float edge=smoothstep(.008,.055,uv.x)*smoothstep(.992,.94,uv.x)*smoothstep(.012,.07,uv.y)*smoothstep(.988,.92,uv.y);

        float density=max(ambient,max(frontParticles,logoDensity));
        float alpha=square*density*edge;

        float blackParticle=step(.972,rnd)*logoDensity;
        vec3 red=vec3(.996,.149,.004);
        vec3 black=vec3(.045,.045,.043);
        vec3 col=mix(red,black,blackParticle*.82);
        outColor=vec4(col,min(alpha*1.52,.98));
      }`;

    const compile=(type,src)=>{
      const shader=gl.createShader(type);
      gl.shaderSource(shader,src);
      gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader)||'shader compile failed');
      return shader;
    };

    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)||'program link failed');
    gl.useProgram(program);

    const buffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(program,'a_pos');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);

    const U={
      res:gl.getUniformLocation(program,'u_res'),
      time:gl.getUniformLocation(program,'u_time'),
      logo:gl.getUniformLocation(program,'u_logo'),
      reduce:gl.getUniformLocation(program,'u_reduce')
    };

    const logoMask=document.createElement('canvas');
    logoMask.width=8;logoMask.height=8;
    const logoCtx=logoMask.getContext('2d');
    logoCtx.fillStyle='#000';logoCtx.fillRect(0,0,8,8);

    const uploadLogo=(oldTex)=>{
      const tex=oldTex||gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,logoMask);
      return tex;
    };

    let logoTex=uploadLogo(null);
    gl.uniform1i(U.logo,0);
    const logoImg=new Image();
    let logoReady=false;

    const paintLogoMask=()=>{
      if(!logoReady)return;
      const r=canvas.getBoundingClientRect();
      if(!r.width||!r.height)return;
      const aspect=r.width/r.height;
      let mw,mh;
      if(aspect>=1){mw=768;mh=Math.max(320,Math.round(mw/aspect));}
      else{mh=768;mw=Math.max(320,Math.round(mh*aspect));}
      if(logoMask.width!==mw)logoMask.width=mw;
      if(logoMask.height!==mh)logoMask.height=mh;
      const g=logoMask.getContext('2d');
      g.fillStyle='#000';g.fillRect(0,0,mw,mh);
      const iw=logoImg.naturalWidth||logoImg.width||1;
      const ih=logoImg.naturalHeight||logoImg.height||1;
      const portrait=aspect<1;
      const maxW=mw*(portrait?.78:.70);
      const maxH=mh*(portrait?.60:.78);
      const scale=Math.min(maxW/iw,maxH/ih);
      const dw=iw*scale,dh=ih*scale;
      const dx=(mw-dw)*.5,dy=(mh-dh)*.5;
      g.filter='grayscale(1) brightness(5) contrast(3)';
      g.drawImage(logoImg,dx,dy,dw,dh);
      g.filter='none';
      logoTex=uploadLogo(logoTex);
    };

    logoImg.onload=()=>{logoReady=true;paintLogoMask()};
    logoImg.src='assets/img/hongxing-mark-exact.svg';

    let w=0,h=0,dead=false,raf=0,visible=!document.hidden,onscreen=true;
    const resize=()=>{
      const r=canvas.getBoundingClientRect();
      if(!r.width||!r.height)return;
      const mobile=r.width<760;
      const dpr=Math.min(window.devicePixelRatio||1,mobile?1.0:1.30);
      const nw=Math.max(1,Math.round(r.width*dpr));
      const nh=Math.max(1,Math.round(r.height*dpr));
      if(nw===w&&nh===h)return;
      w=canvas.width=nw;h=canvas.height=nh;
      gl.viewport(0,0,w,h);
      paintLogoMask();
    };

    const start=performance.now();
    const frame=now=>{
      raf=0;
      if(dead||!visible||!onscreen)return;
      try{
        gl.clearColor(1,1,1,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform2f(U.res,w,h);
        gl.uniform1f(U.time,reduced?6.2:(now-start)/1000);
        gl.uniform1f(U.reduce,reduced?1:0);
        gl.drawArrays(gl.TRIANGLES,0,3);
      }catch(e){dead=true;restore(e);return}
      if(!reduced)raf=requestAnimationFrame(frame);
    };

    const startFrames=()=>{
      if(dead||raf||!visible||!onscreen)return;
      raf=requestAnimationFrame(frame);
    };

    const syncLayout=()=>{
      placeVisual();
      requestAnimationFrame(()=>{
        resize();
        paintLogoMask();
        startFrames();
      });
    };
    if(mobileLayout.addEventListener) mobileLayout.addEventListener('change',syncLayout);
    else mobileLayout.addListener?.(syncLayout);

    if('ResizeObserver' in window)new ResizeObserver(()=>{resize();startFrames()}).observe(canvas);
    else window.addEventListener('resize',()=>{resize();startFrames()},{passive:true});

    if('IntersectionObserver' in window){
      new IntersectionObserver(entries=>{
        onscreen=entries.some(entry=>entry.isIntersecting);
        if(onscreen)startFrames();
        else if(raf){cancelAnimationFrame(raf);raf=0;}
      },{threshold:0}).observe(hero);
    }

    document.addEventListener('visibilitychange',()=>{
      visible=!document.hidden;
      if(visible)startFrames();
      else if(raf){cancelAnimationFrame(raf);raf=0;}
    });

    resize();
    startFrames();
  }catch(e){restore(e)}
})();
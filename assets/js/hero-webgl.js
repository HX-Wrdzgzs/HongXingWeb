(()=>{
  'use strict';
  if(document.body.dataset.page!=='home') return;
  const hero=document.querySelector('.hero');
  const copy=hero?.querySelector('.hero-copy');
  const visual=hero?.querySelector('.hero-visual');
  if(!hero||!copy||!visual) return;

  // Keep a complete static fallback. Nothing is replaced until WebGL2 is confirmed.
  const original={copy:copy.innerHTML,visual:visual.innerHTML,heroClass:hero.className};
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
  const probe=document.createElement('canvas');
  const probeGl=probe.getContext('webgl2');
  if(!probeGl) return;

  const restore=(err)=>{
    if(err) console.warn('[HongXing] particle hero restored to static mode',err);
    hero.className=original.heroClass;
    copy.innerHTML=original.copy;
    visual.innerHTML=original.visual;
    copy.classList.add('in'); visual.classList.add('in');
    Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none',display:''});
    Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none',display:''});
  };

  try{
    hero.classList.add('hx-shader-hero','hx-service-mobile-order');
    copy.innerHTML=`
      <div class="hx-hero-kicker">Hong Xing · Product & Service System</div>
      <h1>持续维护系统、服务与<em>基础设施</em></h1>
      <p class="formal-lead">Hong Xing 负责 HongXing / HongXingOS、Firmware、Online、AuthLit 及相关基础设施的开发、维护与生命周期管理。本站集中发布产品状态、技术公告、兼容性信息与基础设施调整。</p>
      <div class="hero-en">SYSTEM · FIRMWARE · ONLINE SERVICE · AUTHENTICATION</div>
      <div class="actions"><a class="primary" href="projects.html">查看产品体系 <span>→</span></a><a class="text-link" href="updates.html">查看公告归档 <span>→</span></a></div>
      <div class="hx-hero-note"><span><b>南京</b>主服务节点</span><span><b>青海西宁</b>既有机房持续运行</span><span><b>苏州</b>相关服务迁移中</span></div>`;
    visual.innerHTML=`
      <div class="hx-particle-stage">
        <canvas class="hx-particle-canvas" aria-hidden="true"></canvas>
        <div class="hx-particle-vignette"></div>
        <div class="hx-network-label nanjing"><span><strong>南京</strong><small>NANJING · PRIMARY</small></span></div>
        <div class="hx-network-label xining"><span><strong>青海西宁</strong><small>XINING · ACTIVE</small></span></div>
        <div class="hx-network-label suzhou"><span><strong>苏州</strong><small>SUZHOU · MIGRATING</small></span></div>
        <div class="hx-particle-legend">WEBGL2 / LATTICE FIELD<br>DISSOLVE · REFORM</div>
      </div>`;
    copy.classList.add('in'); visual.classList.add('in');
    Object.assign(copy.style,{opacity:'1',visibility:'visible',transform:'none'});
    Object.assign(visual.style,{opacity:'1',visibility:'visible',transform:'none'});

    const canvas=visual.querySelector('.hx-particle-canvas');
    const gl=canvas.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:true,powerPreference:'high-performance'});
    if(!gl) throw new Error('WebGL2 context unavailable');

    const vs=`#version 300 es
      in vec2 a_pos;
      void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;
    const fs=`#version 300 es
      precision highp float;
      out vec4 outColor;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform sampler2D u_logo;
      uniform sampler2D u_net;
      uniform float u_reduce;
      float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
      float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);float a=hash21(i),b=hash21(i+vec2(1,0)),c=hash21(i+vec2(0,1)),d=hash21(i+vec2(1));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
      void main(){
        vec2 uv=gl_FragCoord.xy/u_res; uv.y=1.0-uv.y;
        float asp=u_res.x/u_res.y;
        vec2 grid=vec2(90.0,max(50.0,90.0/asp));
        vec2 gid=floor(uv*grid);
        vec2 cell=(gid+0.5)/grid;
        float md=distance(cell,u_mouse);
        float pointer=(1.0-u_reduce)*exp(-md*12.0);
        cell+=normalize(cell-u_mouse+vec2(.0001))*pointer*.010*sin(u_time*1.25+md*30.0);
        float morph=smoothstep(.08,.92,.5+.5*sin(u_time*.18));
        float logo=texture(u_logo,cell).r;
        float net=texture(u_net,cell).r;
        float mask=max(mix(logo,net,morph),net*.34);
        float n=noise2(gid*.145+vec2(u_time*.045,-u_time*.028));
        float wave=.5+.5*sin(gid.x*.16+gid.y*.105-u_time*.82);
        float structure=smoothstep(.12,.52,mask*.98+n*.22+wave*.10);
        float sparks=step(.942,hash21(gid+floor(u_time*.28)))*(1.0-mask)*.56;
        vec2 local=fract(uv*grid)-.5;
        float rnd=hash21(gid);
        float size=mix(.17,.31,rnd);
        float square=1.0-smoothstep(size,size+.028,max(abs(local.x),abs(local.y)));
        float edge=smoothstep(.005,.055,uv.x)*smoothstep(.995,.93,uv.x)*smoothstep(.01,.07,uv.y)*smoothstep(.99,.91,uv.y);
        float alpha=square*max(structure*max(mask,.46),sparks)*edge;
        float blackMix=step(.953,rnd)*(.25+.42*net);
        vec3 col=mix(vec3(.996,.149,.004),vec3(.055,.055,.052),blackMix);
        alpha*=1.0+(1.0-u_reduce)*.10*sin(u_time*1.45+rnd*6.283);
        outColor=vec4(col,min(alpha*1.34,.98));
      }`;

    const compile=(type,src)=>{
      const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader compile failed');
      return s;
    };
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vs));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fs));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)||'program link failed');
    gl.useProgram(program);

    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(program,'a_pos'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    const U={res:gl.getUniformLocation(program,'u_res'),time:gl.getUniformLocation(program,'u_time'),mouse:gl.getUniformLocation(program,'u_mouse'),logo:gl.getUniformLocation(program,'u_logo'),net:gl.getUniformLocation(program,'u_net'),reduce:gl.getUniformLocation(program,'u_reduce')};

    const makeMask=()=>{const c=document.createElement('canvas');c.width=1024;c.height=640;return c};
    const logoMask=makeMask(),netMask=makeMask();
    const upload=(unit,c,oldTex)=>{
      const tex=oldTex||gl.createTexture(); gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c); return tex;
    };
    const hash=v=>{const x=Math.sin(v*12.9898)*43758.5453;return x-Math.floor(x)};
    const ng=netMask.getContext('2d');
    ng.fillStyle='#000';ng.fillRect(0,0,1024,640);ng.strokeStyle='#fff';ng.fillStyle='#fff';ng.lineCap='round';ng.lineJoin='round';
    const P={s:[180,472],n:[650,274],x:[836,428]};
    ng.globalAlpha=.96;ng.lineWidth=15;ng.beginPath();ng.moveTo(...P.s);ng.bezierCurveTo(320,430,460,314,...P.n);ng.stroke();
    ng.globalAlpha=.70;ng.lineWidth=8;ng.beginPath();ng.moveTo(...P.n);ng.bezierCurveTo(724,260,790,326,...P.x);ng.stroke();
    ng.globalAlpha=.34;ng.lineWidth=5;[[125,158,520,118],[300,530,730,505],[518,104,925,176],[478,390,950,302]].forEach(([x1,y1,x2,y2])=>{ng.beginPath();ng.moveTo(x1,y1);ng.bezierCurveTo((x1+x2)/2,y1-70,(x1+x2)/2,y2+70,x2,y2);ng.stroke()});
    ng.globalAlpha=1;[P.s,P.n,P.x,[430,178],[764,138],[905,270],[350,360]].forEach((p,i)=>{ng.beginPath();ng.arc(p[0],p[1],i<3?20:9,0,Math.PI*2);ng.fill()});
    ng.globalAlpha=.37;for(let y=56;y<590;y+=24)for(let x=70;x<970;x+=24){if(Math.hypot(x-620,y-310)<315&&hash(x*13+y*7)>.33)ng.fillRect(x-4,y-4,8,8)}ng.globalAlpha=1;

    let netTex=upload(1,netMask),logoTex=upload(0,netMask);
    gl.uniform1i(U.logo,0); gl.uniform1i(U.net,1);
    const logoImg=new Image();
    logoImg.onload=()=>{
      try{
        const g=logoMask.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,1024,640);g.filter='grayscale(1) brightness(5)';g.drawImage(logoImg,128,92,470,470);g.filter='none';logoTex=upload(0,logoMask,logoTex);
      }catch(e){}
    };
    logoImg.src='assets/img/hongxing-mark-exact.svg';

    let mouse=[.62,.44],w=0,h=0,dead=false;
    visual.addEventListener('pointermove',e=>{const r=visual.getBoundingClientRect();mouse=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]},{passive:true});
    visual.addEventListener('pointerleave',()=>{mouse=[.62,.44]});
    const resize=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),nw=Math.max(1,Math.round(r.width*dpr)),nh=Math.max(1,Math.round(r.height*dpr));if(nw!==w||nh!==h){w=canvas.width=nw;h=canvas.height=nh;gl.viewport(0,0,w,h)}};
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize,{passive:true});
    resize();
    const start=performance.now();
    const frame=now=>{
      if(dead)return;
      try{
        resize();gl.clearColor(1,1,1,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);gl.uniform2f(U.res,w,h);gl.uniform1f(U.time,reduced?5.4:(now-start)/1000);gl.uniform2f(U.mouse,mouse[0],mouse[1]);gl.uniform1f(U.reduce,reduced?1:0);gl.drawArrays(gl.TRIANGLES,0,3);
      }catch(e){dead=true;restore(e);return}
      if(!reduced)requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }catch(e){restore(e)}
})();
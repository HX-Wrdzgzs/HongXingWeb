(()=>{
  'use strict';
  if(document.body.dataset.page!=='home') return;
  const hero=document.querySelector('.hero');
  const copy=hero?.querySelector('.hero-copy');
  const visual=hero?.querySelector('.hero-visual');
  if(!hero||!copy||!visual) return;

  const original={copy:copy.innerHTML,visual:visual.innerHTML,heroClass:hero.className};
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
  const probe=document.createElement('canvas');
  if(!probe.getContext('webgl2')) return;

  const restore=(err)=>{
    if(err) console.warn('[HongXing] particle hero restored to static mode',err);
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
        <div class="hx-particle-legend">WEBGL2 · LATTICE FIELD<br>DISSOLVE · REFORM</div>
      </div>`;
    copy.classList.add('in');
    visual.classList.add('in');
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

      float hash21(vec2 p){
        p=fract(p*vec2(123.34,456.21));
        p+=dot(p,p+45.32);
        return fract(p.x*p.y);
      }
      float ease(float x){return x*x*(3.0-2.0*x);}

      void main(){
        vec2 uv=gl_FragCoord.xy/u_res;
        uv.y=1.0-uv.y;
        float aspect=u_res.x/u_res.y;

        // Larger regular cells: closer to the Connect-style square lattice.
        float gx=mix(54.0,68.0,step(760.0,u_res.x));
        vec2 grid=vec2(gx,max(36.0,gx/aspect));
        vec2 gid=floor(uv*grid);
        vec2 center=(gid+0.5)/grid;
        vec2 local=fract(uv*grid)-0.5;
        float rnd=hash21(gid);

        // Sample the masks through a very small continuous field offset. The
        // squares stay on the lattice; only the structure drifts/reforms.
        vec2 drift=vec2(
          sin(u_time*.22+center.y*8.0),
          cos(u_time*.19+center.x*7.0)
        )*.005*(1.0-u_reduce);
        float md=distance(center,u_mouse);
        drift+=normalize(center-u_mouse+vec2(.0001))*exp(-md*15.0)*.008*(1.0-u_reduce);
        vec2 sampleUv=clamp(center+drift,0.0,1.0);

        float logo=texture(u_logo,sampleUv).r;
        float net=texture(u_net,sampleUv).r;

        // A slow eased morph with long readable periods at both ends.
        float cyc=.5+.5*sin(u_time*.34-1.5707963);
        float morph=ease(ease(cyc));
        float shape=mix(logo,net,morph);

        // Coherent dissolve band. This moves across the structure rather than
        // making every particle flicker independently.
        float band=.5+.5*sin((center.x*1.25+center.y*.72)*8.5-u_time*.95);
        float gate=smoothstep(.20,.58,shape*.95+band*.23);
        float core=smoothstep(.10,.32,shape)*gate;

        // Network particles remain lightly visible during the logo state so
        // transitions never collapse into a blank field.
        core=max(core,net*.18*(.35+.65*morph));

        // Sparse background squares, intentionally much weaker than the shape.
        float ambient=step(.975,rnd)*(.08+.10*(.5+.5*sin(u_time*.55+rnd*6.283)));

        float size=mix(.255,.345,rnd);
        float square=1.0-smoothstep(size,size+.026,max(abs(local.x),abs(local.y)));
        float edge=smoothstep(.006,.05,uv.x)*smoothstep(.994,.94,uv.x)*smoothstep(.012,.07,uv.y)*smoothstep(.988,.92,uv.y);

        float alpha=square*max(core,ambient)*edge;
        float flow=.5+.5*sin(gid.x*.23+gid.y*.10-u_time*2.15);
        alpha*=mix(.90,1.15,flow*(.35+.65*net));

        float blackParticle=step(.965,rnd)*max(net,.28);
        vec3 red=vec3(.996,.149,.004);
        vec3 black=vec3(.045,.045,.043);
        vec3 col=mix(red,black,blackParticle*.72);

        outColor=vec4(col,min(alpha*1.55,.98));
      }`;

    const compile=(type,src)=>{
      const s=gl.createShader(type);
      gl.shaderSource(s,src);
      gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)||'shader compile failed');
      return s;
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
      mouse:gl.getUniformLocation(program,'u_mouse'),
      logo:gl.getUniformLocation(program,'u_logo'),
      net:gl.getUniformLocation(program,'u_net'),
      reduce:gl.getUniformLocation(program,'u_reduce')
    };

    const makeMask=()=>{const c=document.createElement('canvas');c.width=1024;c.height=640;return c};
    const logoMask=makeMask(),netMask=makeMask();
    const upload=(unit,c,oldTex)=>{
      const tex=oldTex||gl.createTexture();
      gl.activeTexture(gl.TEXTURE0+unit);
      gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);
      return tex;
    };

    const ng=netMask.getContext('2d');
    ng.fillStyle='#000';ng.fillRect(0,0,1024,640);
    ng.strokeStyle='#fff';ng.fillStyle='#fff';ng.lineCap='round';ng.lineJoin='round';
    const P={s:[174,472],n:[650,274],x:[836,430]};
    ng.globalAlpha=1;ng.lineWidth=18;ng.beginPath();ng.moveTo(...P.s);ng.bezierCurveTo(320,438,460,320,...P.n);ng.stroke();
    ng.globalAlpha=.82;ng.lineWidth=11;ng.beginPath();ng.moveTo(...P.n);ng.bezierCurveTo(725,262,790,326,...P.x);ng.stroke();
    ng.globalAlpha=.32;ng.lineWidth=6;
    [[126,158,520,118],[300,530,735,505],[518,104,925,176],[478,390,950,302]].forEach(([x1,y1,x2,y2])=>{ng.beginPath();ng.moveTo(x1,y1);ng.bezierCurveTo((x1+x2)/2,y1-70,(x1+x2)/2,y2+70,x2,y2);ng.stroke()});
    ng.globalAlpha=1;
    [P.s,P.n,P.x,[430,178],[764,138],[905,270],[350,360]].forEach((p,i)=>{ng.beginPath();ng.arc(p[0],p[1],i<3?23:10,0,Math.PI*2);ng.fill()});
    ng.globalAlpha=.28;
    for(let y=58;y<590;y+=28) for(let x=72;x<970;x+=28){
      if(Math.hypot(x-620,y-310)<320 && hash21js(x*13+y*7)>.56) ng.fillRect(x-5,y-5,10,10);
    }
    ng.globalAlpha=1;

    function hash21js(v){const x=Math.sin(v*12.9898)*43758.5453;return x-Math.floor(x)}

    let netTex=upload(1,netMask),logoTex=upload(0,netMask);
    gl.uniform1i(U.logo,0);
    gl.uniform1i(U.net,1);

    const logoImg=new Image();
    logoImg.onload=()=>{
      try{
        const g=logoMask.getContext('2d');
        g.fillStyle='#000';g.fillRect(0,0,1024,640);
        g.filter='grayscale(1) brightness(5) contrast(3)';
        g.drawImage(logoImg,118,82,500,500);
        g.filter='none';
        logoTex=upload(0,logoMask,logoTex);
      }catch(_){/* network mask remains a valid fallback */}
    };
    logoImg.src='assets/img/hongxing-mark-exact.svg';

    let mouse=[.62,.44],w=0,h=0,dead=false;
    visual.addEventListener('pointermove',e=>{
      const r=visual.getBoundingClientRect();
      mouse=[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height];
    },{passive:true});
    visual.addEventListener('pointerleave',()=>{mouse=[.62,.44]});

    const resize=()=>{
      const r=canvas.getBoundingClientRect();
      const mobile=r.width<760;
      const dpr=Math.min(window.devicePixelRatio||1,mobile?1.35:1.75);
      const nw=Math.max(1,Math.round(r.width*dpr));
      const nh=Math.max(1,Math.round(r.height*dpr));
      if(nw!==w||nh!==h){w=canvas.width=nw;h=canvas.height=nh;gl.viewport(0,0,w,h)}
    };
    if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize',resize,{passive:true});
    resize();

    const start=performance.now();
    const frame=now=>{
      if(dead)return;
      try{
        resize();
        gl.clearColor(1,1,1,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform2f(U.res,w,h);
        gl.uniform1f(U.time,reduced?5.4:(now-start)/1000);
        gl.uniform2f(U.mouse,mouse[0],mouse[1]);
        gl.uniform1f(U.reduce,reduced?1:0);
        gl.drawArrays(gl.TRIANGLES,0,3);
      }catch(e){dead=true;restore(e);return}
      if(!reduced)requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }catch(e){restore(e)}
})();
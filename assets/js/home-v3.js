(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
if(!qs('link[data-home-v4]')){const link=d.createElement('link');link.rel='stylesheet';link.href='assets/css/home-v4.css?v=20260903-4';link.dataset.homeV4='';d.head.appendChild(link);}

function setCopy(){
  const heroH=qs('.nf-hero-copy h1');if(heroH)heroH.innerHTML='<span>构建。</span><span>连接。</span><span class="accent">持续向前。</span>';
  const heroP=qs('.nf-hero-copy>p');if(heroP)heroP.textContent='Hong Xing 持续维护 HongXingOS、O3、AuthLit 与 HX Online2，并围绕真实运行中的系统、服务和基础设施继续迭代。';
  const meta=qsa('.nf-hero-bottom>div');
  if(meta[0])meta[0].innerHTML='<strong>O3</strong><span>面向受支持版本陆续推送</span>';
  if(meta[1])meta[1].innerHTML='<strong>NANJING</strong><span>服务与数据逐步完成迁移</span>';
  if(meta[2])meta[2].innerHTML='<strong>NEXT</strong><span>HongXingOS 7 与兼容计划继续推进</span>';
  const rh=qs('.nf-reason-head h2');if(rh)rh.textContent='把变化，真正落到使用里。';
  const rl=qs('.nf-reason-head>p');if(rl)rl.textContent='稳定、兼容、演进。每一次更新都围绕这三件事展开。';
  const tabNames=['稳定运行','向下兼容','持续演进'];qsa('[data-reason]').forEach((b,i)=>{const x=b.querySelector('b');if(x)x.textContent=tabNames[i]||x.textContent});
  const rp=qsa('[data-reason-panel]');
  if(rp[0]){rp[0].querySelector('h3').textContent='先稳定，再继续。';rp[0].querySelector('p').textContent='启动、连接、认证和后台服务先保证可用。出现兼容问题时，以修复、验证和重新发布为优先。';}
  if(rp[1]){rp[1].querySelector('h3').textContent='新版本向前，旧环境尽量不断。';rp[1].querySelector('p').textContent='O3 继续执行向下兼容计划，对仍在使用的接口、配置与运行方式，尽可能保留可继续使用或迁移的路径。';}
  if(rp[2]){rp[2].querySelector('h3').textContent='每一轮更新，都为下一阶段铺路。';rp[2].querySelector('p').textContent='从 O3 的服务精简、Online2 的连接调度，到 HongXingOS 7 的后续计划，改动会继续根据实际运行反馈推进。';}
  const ph=qs('.nf-products-head h2');if(ph)ph.textContent='正在维护的项目与服务';
  const pl=qs('.nf-products-intro>p');if(pl)pl.textContent='四条主线各自承担不同职责，也在实际运行中彼此衔接。';
  const cards=qsa('[data-project-card] .nf-project-copy p');
  if(cards[0])cards[0].textContent='负责系统与设备软件层的持续维护，覆盖应用适配、设备调用、版本生命周期和向下兼容；HongXingOS 7 继续作为下一阶段的演进方向。';
  if(cards[1])cards[1].textContent='当前固件主线。2026 年 8 月起面向受支持版本陆续推送，重点调整启动、后台调度、网络连接、安全响应、服务精简与最小预加载。';
  if(cards[2])cards[2].textContent='负责认证、权限、状态检测与异常响应。AuthLit 5 已达到阶段性发布标准，并继续根据运行反馈完善管理与安全能力。';
  if(cards[3])cards[3].textContent='负责在线服务的初始化、连接建立、恢复与部分请求路径调度。O3 已集成 Quick Start、Quick Connect 与 Quick Route。';
  const th=qs('.nf-tech-copy h2');if(th)th.innerHTML='从启动，<br>到连接，<br>再到路径调度。';
  const tp=qs('.nf-tech-copy>p');if(tp)tp.textContent='O3 将 Online2 的三段关键流程分别优化：缩短启动等待、减少重复连接，并降低不必要的请求绕行。';
  const lh=qs('.nf-latest-head h2');if(lh)lh.textContent='近期动态';
  const mp=qs('.nf-move-head>p');if(mp)mp.textContent='2026 年下半年，Hong Xing 逐步停止苏州地区的后续发展，现有业务、开发与服务资源向南京集中。8 月 31 日起，Amia 相关服务已接入南京网络机房，整体迁移仍在进行。';
  const places=qsa('.nf-route .nf-place');
  if(places[0]){const s=places[0].querySelector('span');if(s)s.textContent='业务与资源逐步迁出';}
  if(places[1]){const s=places[1].querySelector('span');if(s)s.textContent='开发、服务与基础设施逐步集中';}
  const note=qs('.nf-move-note p');if(note)note.textContent='相关服务与数据将分阶段完成迁移；具体部署地点和调整安排以后续公告为准。';
  const ap=qs('.nf-amia-copy>p');if(ap)ap.textContent='Amia_晓山瑞希相关服务已接入 Hong Xing（南京）网络机房。资源分发、下载服务与备用节点能力将随整体迁移继续调整。';
}
setCopy();

qsa('[data-logo3d]').forEach(stage=>{
  const layers=30;stage.replaceChildren();
  for(let i=0;i<layers;i++){
    const layer=d.createElement('div');layer.className='layer';layer.style.zIndex=i;
    const img=d.createElement('img');img.src='assets/img/hongxing-logo.svg';img.alt='';img.draggable=false;img.decoding='async';
    const t=i/(layers-1);img.style.filter=i===layers-1?'none':`brightness(${.27+.61*t}) saturate(${.62+.38*t})`;
    layer.appendChild(img);layer.style.transform=`translate3d(${i*.36}px,${i*.27}px,${i*1.85}px)`;stage.appendChild(layer);
  }
  stage.style.transform='rotateX(-5deg) rotateY(-10deg) rotateZ(-1deg)';
  if(!reduced&&matchMedia('(pointer:fine)').matches){
    const host=stage.closest('[data-hero-visual]')||stage;
    host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${-5-y*15}deg) rotateY(${-10+x*21}deg) rotateZ(${x*1.6}deg) scale(1.018)`;});
    host.addEventListener('pointerleave',()=>stage.style.transform='rotateX(-5deg) rotateY(-10deg) rotateZ(-1deg)');
  }
});

const reasonTabs=qsa('[data-reason]'),reasonPanels=qsa('[data-reason-panel]');
function setReason(i){reasonTabs.forEach((b,n)=>b.classList.toggle('active',n===i));reasonPanels.forEach((p,n)=>p.classList.toggle('active',n===i));}
reasonTabs.forEach((b,i)=>b.addEventListener('click',()=>setReason(i)));if(reasonTabs.length)setReason(0);

function initSlider({viewportSel,trackSel,itemSel,prevSel,nextSel,countSel,progressSel}){
  const viewport=qs(viewportSel),track=qs(trackSel);if(!viewport||!track)return;
  const items=qsa(itemSel,track),prev=qs(prevSel),next=qs(nextSel),count=qs(countSel),bar=qs(progressSel);if(!items.length)return;
  let idx=0,gesture=null,raf=0;
  const isNative=()=>matchMedia('(max-width:760px)').matches;
  const step=()=>{const r=items[0].getBoundingClientRect(),gap=parseFloat(getComputedStyle(track).gap)||0;return r.width+gap;};
  const max=()=>Math.max(0,items.length-1);
  const paint=()=>{idx=clamp(idx,0,max());if(count)count.textContent=String(idx+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');if(bar)bar.style.width=((idx+1)/items.length*100)+'%';if(prev)prev.disabled=idx===0;if(next)next.disabled=idx===max();items.forEach((el,n)=>el.classList.toggle('is-active',n===idx));};
  function render(animate=true){idx=clamp(idx,0,max());if(isNative()){track.style.transform='none';viewport.scrollTo({left:idx*step(),behavior:animate&&!reduced?'smooth':'auto'});}else{track.style.transition=animate?'':'none';track.style.transform=`translate3d(${-idx*step()}px,0,0)`;requestAnimationFrame(()=>track.style.transition='');}paint();}
  prev?.addEventListener('click',()=>{idx--;render();});next?.addEventListener('click',()=>{idx++;render();});
  viewport.addEventListener('scroll',()=>{if(!isNative())return;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{idx=clamp(Math.round(viewport.scrollLeft/Math.max(1,step())),0,max());paint();});},{passive:true});
  viewport.addEventListener('pointerdown',e=>{if(isNative())return;if(e.pointerType==='mouse'&&e.button!==0)return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,axis:null,offset:-idx*step()};});
  viewport.addEventListener('pointermove',e=>{if(isNative()||!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(!gesture.axis&&Math.hypot(dx,dy)>9){gesture.axis=Math.abs(dx)>Math.abs(dy)*1.22?'x':'y';if(gesture.axis==='x'){viewport.classList.add('dragging');viewport.setPointerCapture?.(e.pointerId);}else{gesture=null;return;}}if(gesture?.axis!=='x')return;e.preventDefault();track.style.transition='none';track.style.transform=`translate3d(${gesture.offset+dx}px,0,0)`;},{passive:false});
  function end(e){if(isNative()||!gesture||gesture.id!==e.pointerId)return;const dx=e.clientX-gesture.x,axis=gesture.axis;viewport.classList.remove('dragging');gesture=null;if(axis==='x'&&Math.abs(dx)>Math.min(105,step()*.14))idx+=dx<0?1:-1;render();}
  viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
  viewport.addEventListener('wheel',e=>{if(isNative())return;if(Math.abs(e.deltaX)>Math.abs(e.deltaY)*1.3&&Math.abs(e.deltaX)>28){e.preventDefault();idx+=e.deltaX>0?1:-1;render();}},{passive:false});
  addEventListener('resize',()=>{idx=clamp(idx,0,max());render(false);});render(false);
}
initSlider({viewportSel:'[data-project-viewport]',trackSel:'[data-project-track]',itemSel:'[data-project-card]',prevSel:'[data-project-prev]',nextSel:'[data-project-next]',countSel:'[data-project-count]',progressSel:'[data-project-progress]'});
initSlider({viewportSel:'[data-news-viewport]',trackSel:'[data-news-track]',itemSel:'.nf-news-card',prevSel:'[data-news-prev]',nextSel:'[data-news-next]',countSel:'[data-news-count]',progressSel:'[data-news-progress]'});
initSlider({viewportSel:'.nf-history-viewport',trackSel:'[data-history-track]',itemSel:'article',prevSel:'[data-history-prev]',nextSel:'[data-history-next]',countSel:'[data-history-count]',progressSel:'[data-history-progress]'});

function buildCity(host,type){
  if(!host||host.querySelector('.nf-city-model'))return;
  const model=d.createElement('div');model.className=`nf-city-model ${type}`;model.setAttribute('aria-hidden','true');
  const base=d.createElement('div');base.className='nf-city-base';model.appendChild(base);
  const specs=type==='nanjing'?[
    [22,72,8,26,'slab'],[30,118,42,4,'tower'],[18,84,86,42,'slab'],[32,146,116,0,'spire'],[24,92,164,24,'tower'],[18,60,204,56,'slab'],[26,110,228,8,'tower'],[16,78,274,42,'slab']
  ]:[
    [24,64,8,44,'slab'],[20,88,44,18,'tower'],[28,72,82,54,'slab'],[18,102,122,8,'tower'],[30,74,158,46,'slab'],[20,88,202,20,'tower'],[22,66,238,50,'slab']
  ];
  specs.forEach(([w,h,x,y,kind],i)=>{const b=d.createElement('i');b.className=`nf-building ${kind}`;b.style.setProperty('--bw',w+'px');b.style.setProperty('--bh',h+'px');b.style.setProperty('--bx',x+'px');b.style.setProperty('--by',y+'px');b.style.setProperty('--delay',(i*.07)+'s');model.appendChild(b);});
  const beam=d.createElement('div');beam.className='nf-city-beam';model.appendChild(beam);host.prepend(model);
}
const cityPlaces=qsa('.nf-route .nf-place');buildCity(cityPlaces[0],'suzhou');buildCity(cityPlaces[1],'nanjing');

const tech=qs('.nf-tech'),techSteps=qsa('[data-tech-step]'),techCore=qs('[data-tech-core]'),techCurrent=qs('[data-tech-current]'),techIndexLine=qs('.nf-tech-index i');
function paintTech(){if(!tech||!techSteps.length)return;const r=tech.getBoundingClientRect(),total=Math.max(1,tech.offsetHeight-innerHeight),p=clamp(-r.top/total,0,1),idx=clamp(Math.floor(p*3),0,2);techSteps.forEach((s,n)=>s.classList.toggle('active',n===idx));if(techCore)techCore.textContent=techSteps[idx].dataset.label||'';if(techCurrent)techCurrent.textContent='0'+(idx+1);if(techIndexLine)techIndexLine.style.setProperty('--tech-p',((idx+1)/3*100)+'%');qsa('.nf-power-ring').forEach((ring,n)=>{ring.style.rotate=((p*160*(n%2?1:-1))+n*22)+'deg';});if(techCore)techCore.style.transform=`scale(${1+Math.sin(p*Math.PI*3)*.045})`;}
addEventListener('scroll',paintTech,{passive:true});paintTech();

const route=qs('[data-route]'),routeLine=qs('[data-route-line]');
function paintRoute(){if(!route||!routeLine)return;const r=route.getBoundingClientRect(),p=clamp((innerHeight*.82-r.top)/(innerHeight*.82+r.height*.36),0,1);if(innerWidth<=760){routeLine.style.width='3px';routeLine.style.height=(p*100)+'%';}else{routeLine.style.height='3px';routeLine.style.width=(p*100)+'%';}qsa('.nf-city-model').forEach((m,i)=>{m.style.setProperty('--route-shift',`${(1-p)*(i?18:-18)}px`);m.style.setProperty('--route-opacity',String(.55+p*.45));});}
addEventListener('scroll',paintRoute,{passive:true});addEventListener('resize',paintRoute);paintRoute();

if(!reduced){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('hx-in');e.target.classList.remove('hx-enter');io.unobserve(e.target);}}),{threshold:.08,rootMargin:'0px 0px -10%'});qsa('[data-rail-section]').forEach((s,i)=>{if(i===0){s.classList.add('hx-in');return;}s.classList.add('hx-enter');io.observe(s);});}

if(window.gsap&&window.ScrollTrigger&&!reduced){
  gsap.registerPlugin(ScrollTrigger);
  const logo=qs('.nf-logo3d');if(logo){gsap.from(logo,{opacity:0,scale:.72,rotationZ:-8,duration:1.2,ease:'power3.out'});gsap.to(logo,{yPercent:-12,scale:.88,rotationZ:2.5,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});}
  gsap.from('.nf-hero-copy > *',{opacity:0,y:30,duration:.78,stagger:.075,ease:'power3.out',delay:.12});
  gsap.to('.nf-orbit.orbit-a',{rotation:110,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.nf-orbit.orbit-b',{rotation:-98,ease:'none',scrollTrigger:{trigger:'.nf-hero',start:'top top',end:'bottom top',scrub:true}});
  if(innerWidth>760){
    gsap.fromTo('.nf-city-model.suzhou',{x:-24,opacity:.55},{x:0,opacity:.72,ease:'none',scrollTrigger:{trigger:'.nf-move',start:'top 75%',end:'center 50%',scrub:true}});
    gsap.fromTo('.nf-city-model.nanjing',{x:28,opacity:.35},{x:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.nf-move',start:'top 75%',end:'center 50%',scrub:true}});
    gsap.to('.nf-amia-visual img',{yPercent:-2,ease:'none',scrollTrigger:{trigger:'.nf-amia',start:'top bottom',end:'bottom top',scrub:true}});
  }
}
})();

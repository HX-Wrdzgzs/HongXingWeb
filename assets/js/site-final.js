(()=>{
  'use strict';
  const d=document;
  const q=(s,c=d)=>c?.querySelector?.(s)||null;
  const qa=(s,c=d)=>c?.querySelectorAll?[...c.querySelectorAll(s)]:[];
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;

  const rescue=d.createElement('style');
  rescue.textContent=`
    .reveal{opacity:1!important;transform:none!important;visibility:visible!important}
    .hero,.hero-grid,.hero-copy,.hero-visual{visibility:visible!important}
    .hero-copy,.hero-visual{opacity:1!important;transform:none!important}
    @media(max-width:760px){
      body[data-page="home"] .hero{min-height:0!important}
      body[data-page="home"] .hero-grid{display:flex!important;flex-direction:column!important;min-height:0!important;padding:0!important;gap:0!important}
      body[data-page="home"] .hero-copy{order:1!important;min-height:0!important}
      body[data-page="home"] .hero-visual{order:2!important;min-height:390px!important;height:390px!important}
    }
  `;
  d.head.appendChild(rescue);
  qa('.reveal').forEach(el=>el.classList.add('in'));

  const addCss=(href)=>{
    if(q(`link[href^="${href.split('?')[0]}"]`)) return;
    const l=d.createElement('link');l.rel='stylesheet';l.href=href;d.head.appendChild(l);
  };
  addCss('assets/css/approved-visual.css?v=20260906-8');
  addCss('assets/css/polish-v3.css?v=20260906-8');
  addCss('assets/css/hero-webgl.css?v=20260906-8');
  addCss('assets/css/infra-service.css?v=20260906-8');

  try{
    const header=q('.site-header'),navBtn=q('.menu-btn'),mobile=q('.mobile-nav');
    const paint=()=>header?.classList.toggle('scrolled',window.scrollY>8);
    paint();window.addEventListener('scroll',paint,{passive:true});
    navBtn?.addEventListener('click',()=>{
      if(!mobile)return;
      const open=mobile.classList.toggle('open');
      navBtn.setAttribute('aria-expanded',String(open));
    });
  }catch(e){console.warn('[HongXing] nav enhancement skipped',e)}

  if(d.body.dataset.page==='home')q('.entry-strip')?.remove();

  try{
    qa('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(src.endsWith('suzhou-landmark.svg'))img.src='assets/img/suzhou-landmark.webp?v=20260906-8';
      if(src.endsWith('nanjing-landmark.svg'))img.src='assets/img/nanjing-landmark.webp?v=20260906-8';
      if(src.endsWith('hongxingos7-dev-preview.svg'))img.src='assets/img/hongxingos7-dev-preview.svg?v=20260906-8';
    });

    const replace=(el,from,to)=>{if(el&&el.textContent.includes(from))el.textContent=el.textContent.replace(from,to)};
    qa('p').forEach(p=>{
      replace(p,'2026 年下半年，Hong Xing 逐步结束苏州地区后续发展，将开发、技术、业务与服务资源向南京集中。','苏州节点相关服务与资源正按计划迁移至南京主服务节点；青海西宁既有机房保持运行。');
      replace(p,'2026 年，Hong Xing 的基础设施规划经历了苏州扩容、资源收缩以及向南京集中三个阶段。当前公开状态为：苏州地区后续发展逐步结束，开发、技术、服务与数据资源向南京迁移；最终部署地点与完成时间以后续正式公告为准。','2026 年基础设施调整包括苏州节点服务迁移、南京主服务节点承接以及青海西宁既有机房持续运行。本站按公告时间顺序保留相关调整记录。');
      replace(p,'苏州地区后续发展逐步结束，开发、技术、服务与数据资源向南京迁移；具体最终部署地点仍以正式公告为准。','苏州节点相关服务与资源正按计划迁移至南京主服务节点；青海西宁既有机房保持运行。');
    });

    qa('.migration-layout').forEach(box=>{
      const cards=qa('.city-card',box);
      const s0=cards[0],s1=cards[1];
      if(s0){const a=q('.city-label strong',s0),b=q('.city-label span',s0);if(a)a.textContent='SUZHOU';if(b)b.textContent='苏州节点 · 服务与资源迁出';}
      if(s1){const a=q('.city-label strong',s1),b=q('.city-label span',s1);if(a)a.textContent='NANJING';if(b)b.textContent='南京主服务节点 · 承接相关服务与资源';}
      const route=q('.route',box);
      if(route){const a=q('strong',route),b=q('small',route);if(a)a.textContent='服务迁移';if(b)b.textContent='苏州 → 南京';}

      const parent=box.parentElement;
      if(parent&&!q('.hx-continuous-service',parent)){
        const svc=d.createElement('section');
        svc.className='hx-continuous-service in';
        svc.innerHTML=`<div class="hx-continuous-head"><div><small>CONTINUOUS SERVICE</small><h3>青海西宁既有机房</h3></div><p>该机房保持运行，继续承担现有服务职责，不属于苏州节点至南京主服务节点的迁移范围。</p></div><article class="hx-xining-card"><div class="hx-xining-copy"><span class="eyebrow">QINGHAI · XINING</span><h4>持续运行</h4><p>现有基础设施继续运行，并与南京主服务节点共同承担当前服务。</p></div><div class="hx-xining-model"><img src="assets/img/xining-datacenter.svg?v=20260906-8" alt="青海西宁既有机房基础设施模型"></div></article>`;
        parent.insertBefore(svc,q('.infra-note',parent));
      }
    });

    qa('.infra-note').forEach(n=>n.textContent='苏州节点相关服务与资源正按计划迁移至南京主服务节点。青海西宁既有机房保持运行，不属于本次迁移范围。图示建筑仅用于城市识别，不代表实际机房建筑或部署地点。');

    if(location.pathname.endsWith('/infrastructure.html')||location.pathname.endsWith('infrastructure.html')){
      const grid=q('.status-grid');
      const cards=qa('.status',grid);
      if(cards[0]){const h=q('h3',cards[0]),p=q('p',cards[0]);if(h)h.textContent='苏州节点';if(p)p.textContent='相关服务与资源按迁移安排逐步迁出。';}
      if(cards[1]){const h=q('h3',cards[1]),p=q('p',cards[1]);if(h)h.textContent='服务迁移';if(p)p.textContent='苏州节点相关服务与资源正迁移至南京主服务节点。';}
      if(cards[2]){const h=q('h3',cards[2]),p=q('p',cards[2]);if(h)h.textContent='南京主服务节点';if(p)p.textContent='承接本次迁移中的相关服务与资源，并继续承担现有主服务职责。';}
      if(grid&&!q('.hx-xining-status',grid)){
        const card=d.createElement('article');
        card.className='status in hx-xining-status';
        card.innerHTML='<h3>青海西宁</h3><p>既有机房保持运行，继续承担现有服务职责，不属于本次迁移范围。</p>';
        grid.appendChild(card);
      }
    }
  }catch(e){console.warn('[HongXing] infrastructure enhancement skipped',e)}

  if(!reduced&&'IntersectionObserver' in window){
    try{
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}
      }),{threshold:.06,rootMargin:'0px 0px -4%'});
      qa('.reveal').forEach(el=>io.observe(el));
    }catch(e){}
  }

  if(d.body.dataset.page==='home'){
    const hero=q('.hero'),copy=q('.hero-copy',hero),visual=q('.hero-visual',hero);
    copy?.classList.add('in');visual?.classList.add('in');
    if(copy){copy.style.opacity='1';copy.style.visibility='visible';copy.style.transform='none'}
    if(visual){visual.style.opacity='1';visual.style.visibility='visible';visual.style.transform='none'}
    Promise.resolve().then(()=>import('./hero-webgl.js?v=20260906-8')).catch(err=>{
      console.warn('[HongXing] WebGL hero unavailable; static hero retained.',err);
      hero?.classList.remove('hx-shader-hero');
      if(copy){copy.style.display='block';copy.style.opacity='1';copy.style.visibility='visible'}
      if(visual){visual.style.display='grid';visual.style.opacity='1';visual.style.visibility='visible'}
    });
  }

  try{
    qa('.quick-card').forEach(c=>{
      const activate=()=>{qa('.quick-card').forEach(x=>x.classList.remove('active'));c.classList.add('active')};
      c.addEventListener('mouseenter',activate);c.addEventListener('click',activate);
    });
  }catch(e){}

  if(d.body.dataset.page==='updates'){
    try{
      const rows=qa('.update-row'),search=q('[data-search]'),filters=qa('[data-filter]'),pages=q('[data-pagination]'),summary=q('[data-summary]');
      const dialog=q('#update-dialog'),dlgTitle=q('[data-dialog-title]'),dlgDate=q('[data-dialog-date]'),dlgText=q('[data-dialog-text]');
      let filter='all',term='',page=1;const per=4;
      const searchable=r=>[r.textContent,r.dataset.title,r.dataset.detail,r.dataset.date,r.dataset.category].filter(Boolean).join(' ').toLowerCase();
      const render=()=>{
        const matched=rows.filter(r=>(filter==='all'||r.dataset.category===filter)&&(!term||searchable(r).includes(term)));
        const pageCount=Math.max(1,Math.ceil(matched.length/per));page=Math.min(page,pageCount);
        rows.forEach(r=>r.classList.add('hidden'));
        matched.slice((page-1)*per,page*per).forEach(r=>r.classList.remove('hidden'));
        if(summary)summary.textContent=`${matched.length} 条记录 · 第 ${page}/${pageCount} 页`;
        pages?.replaceChildren();
        for(let i=1;i<=pageCount;i++){
          const b=d.createElement('button');b.className='page-btn'+(i===page?' active':'');b.textContent=String(i);
          b.onclick=()=>{page=i;render()};pages?.appendChild(b);
        }
      };
      search?.addEventListener('input',()=>{term=search.value.trim().toLowerCase();page=1;render()});
      filters.forEach(b=>b.onclick=()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter||'all';page=1;render()});
      rows.forEach(r=>q('.detail-btn',r)?.addEventListener('click',()=>{
        if(dlgDate)dlgDate.textContent=r.dataset.date||'';if(dlgTitle)dlgTitle.textContent=r.dataset.title||'';if(dlgText)dlgText.textContent=r.dataset.detail||q('p',r)?.textContent||'';dialog?.showModal?.();
      }));
      q('.dialog-close')?.addEventListener('click',()=>dialog?.close?.());render();
    }catch(e){console.warn('[HongXing] updates enhancement skipped',e)}
  }

  try{
    addCss('assets/css/morphicons-ui.css?v=20260906-8');
    import('./morphicons-ui.js?v=20260906-8').catch(()=>{});
  }catch(e){}
})();
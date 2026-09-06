(()=>{
  'use strict';
  const d=document;
  const q=(s,c=d)=>c?.querySelector?.(s)||null;
  const qa=(s,c=d)=>c?.querySelectorAll?[...c.querySelectorAll(s)]:[];
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;

  // Fail-open first: content must remain visible even if any optional enhancement fails.
  const rescue=d.createElement('style');
  rescue.textContent=`
    .reveal{opacity:1!important;transform:none!important;visibility:visible!important}
    .hero,.hero-grid,.hero-copy,.hero-visual{visibility:visible!important}
    .hero-copy,.hero-visual{opacity:1!important;transform:none!important}
    @media(max-width:760px){
      body[data-page="home"] .hero{min-height:0!important}
      body[data-page="home"] .hero-grid{display:flex!important;flex-direction:column!important;min-height:0!important;padding:0!important;gap:0!important}
      body[data-page="home"] .hero-copy{order:1!important;min-height:0!important}
      body[data-page="home"] .hero-visual{order:2!important;min-height:340px!important;height:340px!important}
    }
  `;
  d.head.appendChild(rescue);
  qa('.reveal').forEach(el=>el.classList.add('in'));

  const addCss=(href)=>{
    if(q(`link[href^="${href.split('?')[0]}"]`)) return;
    const l=d.createElement('link'); l.rel='stylesheet'; l.href=href; d.head.appendChild(l);
  };
  addCss('assets/css/approved-visual.css?v=20260906-7');
  addCss('assets/css/polish-v3.css?v=20260906-7');
  addCss('assets/css/hero-webgl.css?v=20260906-7');
  addCss('assets/css/infra-service.css?v=20260906-7');

  // Basic navigation must never depend on optional modules.
  try{
    const header=q('.site-header'), navBtn=q('.menu-btn'), mobile=q('.mobile-nav');
    const paint=()=>header?.classList.toggle('scrolled',window.scrollY>8);
    paint(); window.addEventListener('scroll',paint,{passive:true});
    navBtn?.addEventListener('click',()=>{
      if(!mobile) return;
      const open=mobile.classList.toggle('open');
      navBtn.setAttribute('aria-expanded',String(open));
    });
  }catch(e){console.warn('[HongXing] nav enhancement skipped',e)}

  // Remove personal repository strip from the Hong Xing homepage.
  if(d.body.dataset.page==='home') q('.entry-strip')?.remove();

  // Static asset swaps and infrastructure wording.
  try{
    qa('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(src.endsWith('suzhou-landmark.svg')) img.src='assets/img/suzhou-landmark.webp?v=20260906-7';
      if(src.endsWith('nanjing-landmark.svg')) img.src='assets/img/nanjing-landmark.webp?v=20260906-7';
      if(src.endsWith('hongxingos7-dev-preview.svg')) img.src='assets/img/hongxingos7-dev-preview.svg?v=20260906-7';
    });

    qa('.migration-layout').forEach(box=>{
      const cards=qa('.city-card',box);
      const s0=cards[0], s1=cards[1];
      if(s0){ const a=q('.city-label strong',s0), b=q('.city-label span',s0); if(a)a.textContent='SUZHOU'; if(b)b.textContent='苏州节点 · 相关服务迁移中'; }
      if(s1){ const a=q('.city-label strong',s1), b=q('.city-label span',s1); if(a)a.textContent='NANJING'; if(b)b.textContent='南京主服务节点 · 承接迁移服务与资源'; }
      const route=q('.route',box); if(route){ const a=q('strong',route),b=q('small',route); if(a)a.textContent='服务迁移'; if(b)b.textContent='苏州 → 南京'; }

      const parent=box.parentElement;
      if(parent&&!q('.hx-continuous-service',parent)){
        const svc=d.createElement('section');
        svc.className='hx-continuous-service in';
        svc.innerHTML=`<div class="hx-continuous-head"><div><small>CONTINUOUS SERVICE</small><h3>青海西宁既有机房</h3></div><p>青海西宁既有机房持续运行，不属于本次苏州至南京的迁移链路。</p></div><article class="hx-xining-card"><div class="hx-xining-copy"><span class="eyebrow">QINGHAI · XINING</span><h4>持续服务</h4><p>现有基础设施保持运行，继续承担既有服务职责，并与南京主服务节点共同支撑当前服务体系。</p></div><div class="hx-xining-model"><img src="assets/img/xining-datacenter.svg?v=20260906-7" alt="青海西宁既有机房基础设施模型"></div></article>`;
        parent.insertBefore(svc,q('.infra-note',parent));
      }
    });
    qa('.infra-note').forEach(n=>n.textContent='苏州相关服务正在迁入南京主服务节点；青海西宁既有机房持续运行，不属于本次迁移。图中苏州与南京建筑仅用于区分城市，不对应实际机房建筑或地址。');
  }catch(e){console.warn('[HongXing] infrastructure enhancement skipped',e)}

  // Keep standard reveal animation only for content below the fold; fail-open already made everything visible.
  if(!reduced&&'IntersectionObserver' in window){
    try{
      const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}
      }),{threshold:.06,rootMargin:'0px 0px -4%'});
      qa('.reveal').forEach(el=>io.observe(el));
    }catch(e){}
  }

  // Home hero: optional WebGL enhancement. Static hero remains visible on any failure.
  if(d.body.dataset.page==='home'){
    const hero=q('.hero'), copy=q('.hero-copy',hero), visual=q('.hero-visual',hero);
    copy?.classList.add('in'); visual?.classList.add('in');
    if(copy){copy.style.opacity='1';copy.style.visibility='visible';copy.style.transform='none'}
    if(visual){visual.style.opacity='1';visual.style.visibility='visible';visual.style.transform='none'}
    Promise.resolve()
      .then(()=>import('./hero-webgl.js?v=20260906-7'))
      .catch(err=>{
        console.warn('[HongXing] WebGL hero unavailable; static hero retained.',err);
        hero?.classList.remove('hx-shader-hero');
        if(copy){copy.style.display='block';copy.style.opacity='1';copy.style.visibility='visible'}
        if(visual){visual.style.display='grid';visual.style.opacity='1';visual.style.visibility='visible'}
      });
  }

  // Quick Services interaction.
  try{
    qa('.quick-card').forEach(c=>{
      const activate=()=>{qa('.quick-card').forEach(x=>x.classList.remove('active'));c.classList.add('active')};
      c.addEventListener('mouseenter',activate); c.addEventListener('click',activate);
    });
  }catch(e){}

  // Updates page filtering, pagination and details.
  if(d.body.dataset.page==='updates'){
    try{
      const rows=qa('.update-row'), search=q('[data-search]'), filters=qa('[data-filter]'), pages=q('[data-pagination]'), summary=q('[data-summary]');
      const dialog=q('#update-dialog'), dlgTitle=q('[data-dialog-title]'), dlgDate=q('[data-dialog-date]'), dlgText=q('[data-dialog-text]');
      let filter='all', term='', page=1; const per=4;
      const searchable=r=>[r.textContent,r.dataset.title,r.dataset.detail,r.dataset.date,r.dataset.category].filter(Boolean).join(' ').toLowerCase();
      const render=()=>{
        const matched=rows.filter(r=>(filter==='all'||r.dataset.category===filter)&&(!term||searchable(r).includes(term)));
        const pageCount=Math.max(1,Math.ceil(matched.length/per)); page=Math.min(page,pageCount);
        rows.forEach(r=>r.classList.add('hidden'));
        matched.slice((page-1)*per,page*per).forEach(r=>r.classList.remove('hidden'));
        if(summary) summary.textContent=`${matched.length} 条记录 · 第 ${page}/${pageCount} 页`;
        pages?.replaceChildren();
        for(let i=1;i<=pageCount;i++){
          const b=d.createElement('button'); b.className='page-btn'+(i===page?' active':''); b.textContent=String(i);
          b.onclick=()=>{page=i;render()}; pages?.appendChild(b);
        }
      };
      search?.addEventListener('input',()=>{term=search.value.trim().toLowerCase();page=1;render()});
      filters.forEach(b=>b.onclick=()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter||'all';page=1;render()});
      rows.forEach(r=>q('.detail-btn',r)?.addEventListener('click',()=>{
        if(dlgDate)dlgDate.textContent=r.dataset.date||''; if(dlgTitle)dlgTitle.textContent=r.dataset.title||''; if(dlgText)dlgText.textContent=r.dataset.detail||q('p',r)?.textContent||''; dialog?.showModal?.();
      }));
      q('.dialog-close')?.addEventListener('click',()=>dialog?.close?.()); render();
    }catch(e){console.warn('[HongXing] updates enhancement skipped',e)}
  }

  // Optional icon morphing, never allowed to affect page visibility.
  try{
    addCss('assets/css/morphicons-ui.css?v=20260906-7');
    import('./morphicons-ui.js?v=20260906-7').catch(()=>{});
  }catch(e){}
})();
import { createMorph } from 'https://esm.sh/morphicons@1.5.0/dom';

const MENU='M4 6h16M4 12h16M4 18h16';
const CLOSE='M6 6l12 12M18 6L6 18';
const SEARCH='M11 19a8 8 0 1 1 5.657-2.343L21 21';
const ARROW_RIGHT='M5 12h14M13 6l6 6-6 6';
const ARROW_UPRIGHT='M7 17L17 7M7 7h10v10';

function svgPath(initial,size=24){
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('fill','none');
  svg.setAttribute('stroke','currentColor');
  svg.setAttribute('stroke-width','2');
  svg.setAttribute('stroke-linecap','round');
  svg.setAttribute('stroke-linejoin','round');
  svg.setAttribute('aria-hidden','true');
  svg.classList.add('morph-ui-icon');
  svg.style.width=`${size}px`;
  svg.style.height=`${size}px`;
  const path=document.createElementNS(ns,'path');
  path.setAttribute('d',initial);
  svg.appendChild(path);
  return {svg,path};
}

function morphHandle(path,initial){
  return createMorph(path,initial,{reducedMotion:'user'});
}

function initMenu(){
  const btn=document.querySelector('.menu-btn');
  if(!btn)return;
  const {svg,path}=svgPath(MENU,30);
  const morph=morphHandle(path,MENU);
  btn.appendChild(svg);
  btn.classList.add('morph-ready');
  const sync=()=>{
    const open=btn.getAttribute('aria-expanded')==='true';
    morph.morphTo(open?CLOSE:MENU,'snappy');
    btn.setAttribute('aria-label',open?'关闭菜单':'打开菜单');
  };
  btn.addEventListener('click',()=>queueMicrotask(sync));
}

function initSearch(){
  const input=document.querySelector('[data-search]');
  if(!input||input.closest('.search-shell'))return;
  const shell=document.createElement('div');
  shell.className='search-shell';
  input.parentNode.insertBefore(shell,input);
  shell.appendChild(input);
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='search-morph-btn';
  btn.setAttribute('aria-label','聚焦搜索');
  const {svg,path}=svgPath(SEARCH,18);
  const morph=morphHandle(path,SEARCH);
  btn.appendChild(svg);
  shell.appendChild(btn);
  const sync=()=>{
    const active=input.value.trim().length>0;
    morph.morphTo(active?CLOSE:SEARCH,'snappy');
    btn.setAttribute('aria-label',active?'清除搜索':'聚焦搜索');
  };
  input.addEventListener('input',sync);
  btn.addEventListener('click',()=>{
    if(input.value){input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();}
    else input.focus();
  });
  sync();
}

function attachArrow(el,selector){
  if(!el||el.dataset.morphArrow==='1')return;
  el.dataset.morphArrow='1';
  const target=selector?el.querySelector(selector):el;
  if(!target)return;
  const {svg,path}=svgPath(ARROW_RIGHT,18);
  const morph=morphHandle(path,ARROW_RIGHT);
  if(target!==el)target.style.display='none';
  else target.textContent='';
  el.appendChild(svg);
  el.classList.add('morph-link-ready');
  const toUp=()=>morph.morphTo(ARROW_UPRIGHT,'snappy');
  const toRight=()=>morph.morphTo(ARROW_RIGHT,'snappy');
  el.addEventListener('pointerenter',toUp);
  el.addEventListener('pointerleave',toRight);
  el.addEventListener('focusin',toUp);
  el.addEventListener('focusout',toRight);
}

function initArrows(){
  document.querySelectorAll('.text-link').forEach(el=>attachArrow(el,'span'));
  document.querySelectorAll('.primary').forEach(el=>attachArrow(el,'span'));
  document.querySelectorAll('.entry').forEach(el=>attachArrow(el,'b'));
  document.querySelectorAll('.project-card .arrow,.news-card .arrow').forEach(el=>attachArrow(el));
  document.querySelectorAll('.detail-btn').forEach(el=>attachArrow(el));
}

try{
  initMenu();
  initSearch();
  initArrows();
  document.documentElement.classList.add('morphicons-active');
}catch(err){
  console.warn('[HongXing] Morphicons fallback active:',err);
}

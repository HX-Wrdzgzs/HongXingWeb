(()=>{
'use strict';
const d=document,qs=(s,c=d)=>c.querySelector(s),qsa=(s,c=d)=>[...c.querySelectorAll(s)],reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!reduced){
  const stage=qs('.infra6-stage'),sz=qs('.infra6-city.suzhou svg'),nj=qs('.infra6-city.nanjing svg');let raf=0;
  const paint=()=>{raf=0;if(!stage)return;const r=stage.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));if(sz)sz.style.transform=`translate3d(${-p*12}px,${p*5}px,0) scale(${1-p*.015})`;if(nj)nj.style.transform=`translate3d(${(1-p)*12}px,${(1-p)*5}px,0) scale(${.985+p*.015})`;};
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});addEventListener('resize',paint);paint();
}
const reveal=qsa('.infra6-reveal');if(reduced)reveal.forEach(x=>x.style.opacity='1');else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.animate([{opacity:0,transform:'translateY(28px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.78,.2,1)',fill:'forwards'});io.unobserve(e.target)}}),{threshold:.12});reveal.forEach(x=>{x.style.opacity='0';io.observe(x)})}
})();

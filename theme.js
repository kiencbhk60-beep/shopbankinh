// Lucian UX/UI Prompt #219 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#219
(()=>{
 const root=document.documentElement,button=document.createElement('button');button.type='button';button.className='u219-tg';
 const SUN='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 1.5v1.4M8 13.1v1.4M1.5 8h1.4M13.1 8h1.4M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1"/></g></svg>';
 const MOON='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.5 9.8A5.6 5.6 0 0 1 6.2 2.5a5.6 5.6 0 1 0 7.3 7.3z" fill="currentColor"/></svg>';
 let on=false,busy=false;try{on=localStorage.getItem('trekbross-theme')==='dark';}catch{}
 document.querySelector('.nav-actions').prepend(button);
 function sync(){root.dataset.theme=on?'dark':'light';button.innerHTML=on?MOON:SUN;button.setAttribute('aria-label',on?'Chuyển sang nền sáng':'Chuyển sang nền tối');button.setAttribute('aria-pressed',String(on));try{localStorage.setItem('trekbross-theme',root.dataset.theme);}catch{}}
 button.addEventListener('click',async()=>{if(busy)return;const b=button.getBoundingClientRect(),x=b.left+b.width/2,y=b.top+b.height/2,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||root.classList.contains('motion-paused');
 on=!on;if(!document.startViewTransition||reduced){sync();return;}busy=true;
 try{const transition=document.startViewTransition(sync);await transition.ready;await root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:700,easing:'cubic-bezier(.65,0,.35,1)',pseudoElement:'::view-transition-new(root)'}).finished;await transition.finished;}catch{sync();}finally{busy=false;}
 });sync();
})();

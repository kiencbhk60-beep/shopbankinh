(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  try { paused ||= localStorage.getItem('trekbross-motion') === 'off'; } catch {}
  const root = document.documentElement;
  const toggle = document.createElement('button');
  toggle.className = 'motion-toggle';
  const sync = () => {root.classList.toggle('motion-paused', paused);toggle.textContent = paused ? 'Chuyển động: Tắt' : 'Chuyển động: Bật';toggle.setAttribute('aria-pressed', String(!paused));};
  toggle.onclick = () => {paused = !paused;sync();if(paused) document.getAnimations().forEach(a => a.finish());try {localStorage.setItem('trekbross-motion', paused?'off':'on');} catch {}};
  document.body.append(toggle);sync();
  reduced.addEventListener('change', e => {paused = e.matches;sync();if(paused) document.getAnimations().forEach(a => a.finish());});
  const ease = 'cubic-bezier(.16,1,.3,1)';
  // Extend visual motion by 30% while keeping response and stagger delays immediate.
  const motionPace = 1.3;
  const animate = (el, frames, options={}) => !paused && el.animate(frames,{easing:ease,...options,duration:(options.duration ?? 850)*motionPace});
  const title = document.querySelector('h1');
  animate(document.querySelector('.hero-copy'),[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{delay:300,fill:'backwards'});
  animate(document.querySelector('.hero-photo'),[{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'none'}],{duration:1200,delay:180,fill:'backwards'});
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;animate(target,[{opacity:0,transform:'translateY(38px)'},{opacity:1,transform:'none'}],{delay:Number(target.dataset.stagger||0),fill:'backwards'});reveal.unobserve(target);});
  },{threshold:.08});
  document.querySelectorAll('.section-head,.product,.filters,.filter-note,.statement>.eyebrow,.statement h2,.statement-bottom,.faq details,.footer-top').forEach((el,i)=>{if(el.matches('.product'))el.dataset.stagger=(i%3)*65;reveal.observe(el);});
  const progress = document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const hero=document.querySelector('.hero-photo'),mark=document.querySelector('.giant-mark'),header=document.querySelector('header');
  let scheduled=false;
  function frame(){scheduled=false;const h=hero.getBoundingClientRect(),m=mark.getBoundingClientRect();const max=root.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;header.classList.toggle('scrolled',scrollY>20);if(!paused){if(h.bottom>0&&h.top<innerHeight)hero.style.setProperty('--hero-offset',`${Math.max(-16,Math.min(16,(innerHeight/2-h.top-h.height/2)*.035))}px`);if(m.bottom>0&&m.top<innerHeight)mark.style.setProperty('--mark-offset',`${Math.max(-25,Math.min(25,(innerHeight/2-m.top)*.06))}px`);}}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(frame);}},{passive:true});addEventListener('resize',frame);frame();
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.product:not([hidden])').forEach((el,i)=>{el.getAnimations().forEach(a=>a.cancel());animate(el,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:550,delay:Math.min(i,5)*45,fill:'backwards'});});}));
  // Keep native modal semantics, Escape, focus restoration and existing checkout flow.
  document.querySelectorAll('dialog').forEach(dialog=>{
    const close = dialog.close.bind(dialog);let closing=false;
    dialog.close = value => {if(!dialog.open||closing)return;if(paused){close(value);return;}closing=true;dialog.classList.add('closing');setTimeout(()=>{dialog.classList.remove('closing');close(value);closing=false;},300);};
    dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close();});
  });
  document.querySelectorAll('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)animate(detail.querySelector('p'),[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{duration:350});}));
  document.querySelectorAll('[data-add],#dialog-add').forEach(button=>button.addEventListener('click',()=>animate(document.querySelector('#count'),[{transform:'scale(1)'},{transform:'scale(1.3)',offset:.4},{transform:'scale(1)'}],{duration:380})));
  document.querySelector('#product-dialog').setAttribute('aria-labelledby','dialog-name');
  document.querySelector('#bag-dialog').setAttribute('aria-label','Túi kính của bạn');
})();


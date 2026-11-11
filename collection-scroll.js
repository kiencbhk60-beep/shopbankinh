/* Native horizontal discovery: touch inertia, scroll snap, keyboard and filter-aware controls. */
(() => {
  const track=document.querySelector('#collection-track');
  if(!track)return;
  const controls=document.querySelector('.collection-navigation');
  const counter=document.querySelector('#collection-position');
  const previous=document.querySelector('#collection-prev');
  const next=document.querySelector('#collection-next');
  const progress=document.querySelector('.collection-progress');
  const fill=progress.querySelector('span');
  const mobile=matchMedia('(max-width:767px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const all=Array.from(track.querySelectorAll('.product'));
  let cards=[],index=0,pending=false;
  const left=(card)=>card.offsetLeft-(cards[0]?.offsetLeft||0);
  function sync(){
    pending=false;
    if(!mobile.matches)return;
    cards=all.filter(card=>!card.hidden);
    index=cards.reduce((best,card,i)=>Math.abs(left(card)-track.scrollLeft)<Math.abs(left(cards[best])-track.scrollLeft)?i:best,0);
    all.forEach(card=>card.classList.toggle('is-current',card===cards[index]));
    const position=cards.length?index+1:0;
    counter.textContent=String(position).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
    previous.disabled=index===0||!cards.length;
    next.disabled=index>=cards.length-1;
    progress.setAttribute('aria-valuemax',String(Math.max(1,cards.length)));
    progress.setAttribute('aria-valuenow',String(position));
    progress.setAttribute('aria-valuetext',cards[index]?cards[index].querySelector('h3').textContent+' — '+position+'/'+cards.length:'Không có mẫu kính');
    fill.style.width=(cards.length?position/cards.length*100:0)+'%';
  }
  function schedule(){if(!pending){pending=true;requestAnimationFrame(sync)}}
  function move(delta){
    if(!mobile.matches||!cards.length)return;
    const target=Math.max(0,Math.min(cards.length-1,index+delta));
    track.scrollTo({left:left(cards[target]),behavior:reduced.matches||document.documentElement.classList.contains('motion-paused')?'instant':'smooth'});
  }
  function configure(){
    controls.hidden=!mobile.matches;
    if(mobile.matches){track.setAttribute('tabindex','0');track.setAttribute('role','region');track.setAttribute('aria-label','Bộ sưu tập kính, vuốt ngang hoặc dùng phím mũi tên để chuyển mẫu');sync()}
    else{track.removeAttribute('tabindex');track.removeAttribute('role');track.removeAttribute('aria-label');all.forEach(card=>card.classList.remove('is-current'))}
  }
  previous.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',schedule,{passive:true});
  track.addEventListener('keydown',event=>{if(event.target!==track||!mobile.matches)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1)}});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{if(!mobile.matches)return;track.scrollTo({left:0,behavior:'instant'});sync();schedule()}));
  mobile.addEventListener('change',configure);
  addEventListener('resize',schedule,{passive:true});
  configure();
})();

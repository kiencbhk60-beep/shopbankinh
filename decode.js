// Lucian UX/UI Prompt #245 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#245
(() => {
  const h=document.querySelector('.statement h2');
  if(!h)return;
  const lines=['ĐI THEO LỐI BẠN.','CHẠY THEO NHỊP RIÊNG.'];
  const GLYPH='!<>-_/[]{}=+~^?#%&@$01',dur=1100;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let cells=[],raf=0,running=false,visible=false;
  const reduced=()=>media.matches||document.documentElement.classList.contains('motion-paused');
  h.classList.add('u245');h.setAttribute('aria-label',lines.join(' '));h.replaceChildren();
  lines.forEach((line,li)=>{if(li)h.append(document.createElement('br'));line.split(' ').forEach((word,wi)=>{if(wi)h.append(document.createTextNode(' '));const w=document.createElement('span');w.className='u245-w';w.setAttribute('aria-hidden','true');Array.from(word).forEach(ch=>{const c=document.createElement('span'),b=document.createElement('b'),g=document.createElement('i');c.className='u245-c';b.textContent=ch;c.append(b,g);w.append(c);cells.push({el:c,g});});h.append(w);});});
  function settle(){cancelAnimationFrame(raf);running=false;cells.forEach(c=>c.el.className='u245-c');}
  function run(){
    if(reduced()){settle();return;}cancelAnimationFrame(raf);
    const n=cells.length,t0=performance.now();
    cells.forEach((c,i)=>{c.a=Math.random()*dur*.3;c.r=dur*(.32+.68*i/Math.max(1,n-1))+Math.random()*90;c.n=0;c.done=false;c.el.className='u245-c z';});running=true;
    function frame(now){if(!h.isConnected)return;if(reduced()||!visible){settle();return;}const t=now-t0;let left=0;
      cells.forEach(c=>{if(c.done){if(t>=c.r+40)c.el.classList.remove('f');else left++;return;}if(t>=c.r){c.done=true;c.el.className='u245-c f';left++;return;}left++;if(t>=c.a){c.el.className='u245-c s';if(now-c.n>55){c.n=now;c.g.textContent=GLYPH.charAt(Math.random()*GLYPH.length|0);}}});
      if(left)raf=requestAnimationFrame(frame);else running=false;
    }raf=requestAnimationFrame(frame);
  }
  h.addEventListener('pointerenter',()=>{if(!running&&visible)run();});
  new IntersectionObserver(entries=>{const was=visible;visible=entries[0].isIntersecting;if(visible&&!was)run();else if(!visible)settle();},{threshold:.25}).observe(h);
  const sync=()=>{if(reduced())settle();};media.addEventListener('change',sync);new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
})();

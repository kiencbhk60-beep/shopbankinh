// Lucian UX/UI Prompt #356 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#356
(() => {
  const dialog = document.querySelector('#product-dialog');
  const art = dialog?.querySelector('#dialog-image');
  if (!art) return;
  const root = document.createElement('section');
  root.className = 'ux u356';
  root.setAttribute('aria-label', 'Xem chi tiết ảnh kính');
  root.innerHTML = `<h3 class="u356-title">Xem chi tiết</h3>
    <div class="u356-st" role="button" tabindex="0" aria-label="Soi chi tiết ảnh kính" aria-pressed="false" aria-describedby="u356-help u356-keys">
      <div class="u356-lp" aria-hidden="true"></div><div class="u356-zm" aria-hidden="true">2.5×</div>
    </div>
    <p class="u356-guide" id="u356-help"><span class="u356-desktop">Di chuột để soi gần · Nhấn để đổi độ phóng đại</span><span class="u356-touch">Bật Soi chi tiết, rồi chạm vào vùng bạn muốn xem</span></p>
    <div class="u356-controls"><button type="button" class="u356-toggle" aria-pressed="false">Soi chi tiết</button><button type="button" class="u356-zoom" aria-label="Độ phóng đại 2.5×, nhấn để đổi">2.5×</button></div>
    <p class="u356-sr" id="u356-keys">Enter bật hoặc tắt soi. Phím mũi tên di chuyển vùng soi. Escape thoát soi. Nút độ phóng đại chuyển giữa 2.5 và 4 lần.</p>
    <span class="u356-sr u356-status" role="status" aria-live="polite"></span>`;
  art.before(root);
  const st = root.querySelector('.u356-st'), lp = root.querySelector('.u356-lp'), zm = root.querySelector('.u356-zm');
  st.prepend(art);
  const big = document.createElement('img');big.alt='';big.draggable=false;lp.append(big);
  const toggle=root.querySelector('.u356-toggle'), zoom=root.querySelector('.u356-zoom'), status=root.querySelector('.u356-status');
  const Z=[2.5,4];let zi=0, pos=null, mode='off', suppressHover=false, raf=0;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function geometry(){
    const w=st.clientWidth,h=st.clientHeight;
    if(!w||!h||!art.naturalWidth||!art.naturalHeight||!art.complete)return null;
    const scale=Math.min(w/art.naturalWidth,h/art.naturalHeight);
    const iw=art.naturalWidth*scale,ih=art.naturalHeight*scale;
    return {w,h,iw,ih,ox:(w-iw)/2,oy:(h-ih)/2};
  }
  function place(){
    raf=0;const g=geometry();
    if(!pos||mode==='off'||!g){lp.classList.remove('is-on');zm.classList.remove('is-on');return;}
    const z=Z[zi],x=g.ox+pos.u*g.iw,y=g.oy+pos.v*g.ih;
    // Clamp the lens, not the sampled pixel: edges remain inspectable without clipping.
    const cx=clamp(x,74,g.w-74),cy=clamp(y,74,g.h-98);
    lp.style.left=cx+'px';lp.style.top=cy+'px';
    big.style.width=g.iw+'px';big.style.height=g.ih+'px';
    big.style.transform=`translate(${64-pos.u*g.iw*z}px,${64-pos.v*g.ih*z}px) scale(${z})`;
    zm.style.left=cx+'px';zm.style.top=(cy+72)+'px';zm.textContent=z+'×';
    lp.classList.add('is-on');zm.classList.add('is-on');
  }
  function schedule(){if(!raf)raf=requestAnimationFrame(place);}
  function setMode(next,announce=false){mode=next;const on=next!=='off';if(on&&!pos)pos={u:.5,v:.5};if(!on)pos=null;st.classList.toggle('is-active',on);st.setAttribute('aria-pressed',String(on));toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'Tắt soi':'Soi chi tiết';if(announce)status.textContent=on?`Đang soi ở mức ${Z[zi]} lần. Dùng phím mũi tên để di chuyển.`:'Đã tắt soi chi tiết.';place();}
  function setZoom(){zi=(zi+1)%Z.length;zoom.textContent=Z[zi]+'×';zoom.setAttribute('aria-label',`Độ phóng đại ${Z[zi]}×, nhấn để đổi`);status.textContent=`Độ phóng đại ${Z[zi]} lần`;place();}
  function loc(event){const g=geometry();if(!g)return;const r=st.getBoundingClientRect();const x=(event.clientX-r.left)*g.w/r.width,y=(event.clientY-r.top)*g.h/r.height;pos={u:clamp((x-g.ox)/g.iw,0,1),v:clamp((y-g.oy)/g.ih,0,1)};}
  st.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&!suppressHover){if(mode==='off')setMode('hover');loc(event);schedule();}else if(mode==='manual'){loc(event);schedule();}});
  st.addEventListener('pointerleave',()=>{suppressHover=false;if(mode==='hover')setMode('off');});
  st.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'&&mode==='manual'){loc(event);st.setPointerCapture(event.pointerId);schedule();}});
  st.addEventListener('click',event=>{if(event.detail===0)return;if(event.pointerType==='touch'||event.pointerType==='pen'){if(mode==='manual'){loc(event);place();}return;}if(suppressHover&&mode==='off'){suppressHover=false;setMode('manual');loc(event);place();return;}loc(event);if(mode==='off')setMode('manual');else setZoom();});
  toggle.addEventListener('click',()=>{suppressHover=true;setMode(mode==='off'?'manual':'off',true);});
  zoom.addEventListener('click',setZoom);
  st.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){event.preventDefault();suppressHover=true;setMode(mode==='off'?'manual':'off',true);return;}
    const deltas={ArrowLeft:[-.035,0],ArrowRight:[.035,0],ArrowUp:[0,-.035],ArrowDown:[0,.035]};
    if(deltas[event.key]){event.preventDefault();if(mode==='off')setMode('manual');mode='manual';const [du,dv]=deltas[event.key];pos={u:clamp(pos.u+du,0,1),v:clamp(pos.v+dv,0,1)};place();}
  });
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'&&mode!=='off'){event.preventDefault();event.stopImmediatePropagation();suppressHover=true;setMode('off',true);}},true);
  dialog.addEventListener('cancel',event=>{if(mode!=='off'){event.preventDefault();event.stopImmediatePropagation();suppressHover=true;setMode('off',true);}},true);
  function reset(){if(raf){cancelAnimationFrame(raf);raf=0;}zi=0;suppressHover=false;setMode('off');zoom.textContent='2.5×';zoom.setAttribute('aria-label','Độ phóng đại 2.5×, nhấn để đổi');status.textContent='';big.src=art.currentSrc||art.src;st.setAttribute('aria-label',`Soi chi tiết: ${art.alt||'ảnh kính'}`);}
  new MutationObserver(reset).observe(art,{attributes:true,attributeFilter:['src','srcset','alt']});
  art.addEventListener('load',()=>{big.src=art.currentSrc||art.src;schedule();});
  art.addEventListener('error',()=>setMode('off'));
  new ResizeObserver(schedule).observe(st);
  new MutationObserver(()=>{if(!dialog.open)reset();}).observe(dialog,{attributes:true,attributeFilter:['open']});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motionSync=()=>root.classList.toggle('is-motion-paused',reduced.matches||document.documentElement.classList.contains('motion-paused'));
  reduced.addEventListener('change',motionSync);
  new MutationObserver(motionSync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  reset();motionSync();
})();


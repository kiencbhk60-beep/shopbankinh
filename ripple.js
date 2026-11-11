// Lucian UX/UI Prompt #205 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#205

(function () {
  var heading=document.querySelector('.hero-title h1');
  var root=document.createElement('div');root.className='ux u205';heading.before(root);root.append(heading);heading.classList.add('u205-wd');heading.setAttribute('aria-label','MADE FOR RUGGED PATHS.');heading.replaceChildren();
  var wd = root.querySelector('.u205-wd');
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WORD = 'MADE FOR RUGGED PATHS.', SIG = 34;
  var amp = 25, px = null, pulse = null, raf = 0;
  var L = Array.from(WORD).map(function (ch, index) {
    if(ch==='|'){wd.appendChild(document.createElement('br'));return null;}
    var s = document.createElement('span');if(ch===' ')s.classList.add('u205-space');
    s.classList.add('u205-l');s.style.setProperty('--letter-color',((index>=9&&index<=14)||(index>=16&&index<=20))?'var(--accent)':'var(--ink)'); s.textContent = ch; s.setAttribute('aria-hidden', 'true');
    wd.appendChild(s);
    return { el: s, x: 0, y: 0, v: 0 };
  });
  L=L.filter(Boolean);
  function measure() {
    var available = root.clientWidth;
    var width = L.reduce(function (total, l) { return total + l.el.getBoundingClientRect().width; }, 0);
    var current = parseFloat(getComputedStyle(wd).fontSize);
    if (available > 0 && width > 0 && current > 0) {
      var fitted = Math.max(12, Math.min(144, current * available * 0.98 / width));
      if (Math.abs(fitted - current) > 0.1) wd.style.fontSize = fitted.toFixed(2) + 'px';
    }
    L.forEach(function (l) { l.x = l.el.offsetLeft + l.el.offsetWidth / 2; });
  }
  function g(d, s) { return Math.exp(-(d * d) / (2 * s * s)); }
  function tick(now) {
    raf = 0;
    if (!root.isConnected || rm) return;
    var moving = false, pc = null;
    if (pulse) {
      var k = (now - pulse) / 1100;
      if (k >= 1) pulse = null; else pc = -60 + (wd.offsetWidth + 120) * k;
    }
    L.forEach(function (l) {
      var tgt = 0;
      if (px != null) tgt -= amp * g(l.x - px, SIG);
      if (pc != null) tgt -= amp * 1.35 * g(l.x - pc, SIG * 1.2);
      l.v += (tgt - l.y) * 0.16;
      l.v *= 0.8;
      l.y += l.v;
      if (Math.abs(l.v) > 0.02 || Math.abs(tgt - l.y) > 0.05) moving = true;
      var t = Math.min(1, Math.max(0, -l.y / 50));
      l.el.style.setProperty('--y', l.y.toFixed(2) + 'px');
      l.el.style.setProperty('--sy', (1 + Math.max(-0.08, Math.min(0.14, -l.v * 0.02))).toFixed(3));
      l.el.style.setProperty('--t', t.toFixed(3));
    });
    if (moving || pulse || px != null) raf = requestAnimationFrame(tick);
  }
  function kick() { if (!raf && !rm) raf = requestAnimationFrame(tick); }
  function local(e) { var r = wd.getBoundingClientRect(); return (e.clientX - r.left) * (wd.offsetWidth / (r.width || 1)); }
  wd.addEventListener('pointermove', function (e) { if (!L[0].x) measure(); px = local(e); kick(); });
  wd.addEventListener('pointerleave', function () { px = null; kick(); });
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  function sync(){rm=media.matches||document.documentElement.classList.contains('motion-paused');if(rm){cancelAnimationFrame(raf);raf=0;px=null;pulse=null;L.forEach(l=>{l.y=0;l.v=0;l.el.style.setProperty('--y','0px');l.el.style.setProperty('--sy','1');l.el.style.setProperty('--t','0');});}}
  media.addEventListener('change',sync);new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['class']});new ResizeObserver(measure).observe(wd);document.fonts.ready.then(measure);sync();measure();
})();



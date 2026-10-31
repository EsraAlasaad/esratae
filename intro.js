if(!new URLSearchParams(location.search).has('overview')){
/* Welcome screen: silver stars gather into the logo bird, then the Bali gate, and back.
   "Begin your story" turns silver, the stars scatter and the home page is revealed.
   Shown once per browser session. Star positions come from assets/intro/shapes.js. */
(() => {
  const SEEN = 'tayer-intro-seen';

  const shapes = window.INTRO_SHAPES;
  if (!shapes) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const root = document.createElement('div');
  root.className = 'intro';
  root.innerHTML = '<canvas aria-hidden="true"></canvas><div class="intro-ui"><button class="intro-btn" type="button">Begin your story</button></div>';
  document.body.appendChild(root);
  document.documentElement.classList.add('intro-on');
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), btn = root.querySelector('.intro-btn');

  let W = 0, H = 0, dpr = 1, unit = 1;
  const mobile = () => innerWidth < 720;

  // soft silver star sprite
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  {
    const g = sprite.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.18, 'rgba(232,238,246,0.95)');
    r.addColorStop(0.45, 'rgba(176,190,212,0.32)');
    r.addColorStop(1, 'rgba(150,165,190,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  }

  const step = mobile() ? 2 : 1;
  const pick = list => list.filter((_, i) => i % step === 0);
  const SHAPES = { logo: { aspect: shapes.logo.aspect, pts: pick(shapes.logo.pts) }, gate: { aspect: shapes.gate.aspect, pts: pick(shapes.gate.pts) } };
  const COUNT = Math.max(SHAPES.logo.pts.length, SHAPES.gate.pts.length);

  const parts = [];
  const sky = [];
  let current = null, leaving = false;

  function box(shape) {
    const btnTop = btn.getBoundingClientRect().top || H * 0.85;
    const top = H * (mobile() ? 0.1 : 0.08), bottom = btnTop - H * 0.07;
    const maxW = Math.min(W * (mobile() ? 0.9 : 0.8), 1000), maxH = Math.max(120, bottom - top);
    let w = maxW, h = w / shape.aspect;
    if (h > maxH) { h = maxH; w = h * shape.aspect; }
    return { x: (W - w) / 2, y: top + (maxH - h) / 2, w, h };
  }

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    unit = Math.max(0.6, Math.min(W, H * 1.4) / 1100);
    sky.length = 0;
    for (let i = 0; i < (mobile() ? 120 : 260); i++) sky.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + 0.2, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 });
    if (current) settle(current);
  }

  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // send every star to its place in a shape along a gently curved path
  function morph(name, now) {
    current = name;
    const s = SHAPES[name], b = box(s);
    parts.forEach((p, i) => {
      const [px, py, br] = s.pts[i % s.pts.length];
      p.sx = p.x; p.sy = p.y; p.sb = p.b;
      p.tx = b.x + px * b.w; p.ty = b.y + py * b.h; p.tb = br;
      const mx = (p.sx + p.tx) / 2, my = (p.sy + p.ty) / 2, dx = p.tx - p.sx, dy = p.ty - p.sy;
      const bend = (Math.random() - 0.5) * 0.6;
      p.cx = mx - dy * bend; p.cy = my + dx * bend;
      p.t0 = now + (reduce ? 0 : Math.random() * 700);
      p.dur = reduce ? 1 : 1700 + Math.random() * 900;
    });
  }
  function settle(name) {
    const s = SHAPES[name], b = box(s);
    parts.forEach((p, i) => {
      const [px, py, br] = s.pts[i % s.pts.length];
      p.x = p.sx = p.tx = p.cx = b.x + px * b.w;
      p.y = p.sy = p.ty = p.cy = b.y + py * b.h;
      p.b = p.sb = p.tb = br; p.t0 = 0; p.dur = 1;
    });
  }

  resize();
  addEventListener('resize', resize);
  for (let i = 0; i < COUNT; i++) {
    const x = Math.random() * W, y = Math.random() * H;
    parts.push({ x, y, sx: x, sy: y, tx: x, ty: y, cx: x, cy: y, b: 0.25, sb: 0.25, tb: 0.25, t0: 0, dur: 1, ph: Math.random() * 6.28, tw: 1 + Math.random() * 2.2, sz: 0.75 + Math.random() * 0.6, vx: 0, vy: 0 });
  }

  // logo → gate → logo … (holds long enough to read each drawing)
  const plan = [['logo', 600], ['gate', 5200], ['logo', 5800]];
  let planAt = performance.now(), planIdx = 0;
  if (reduce) settle('logo');

  let shooting = null, nextShoot = performance.now() + 2500;

  function frame(now) {
    if (!reduce && !leaving) {
      const [name, wait] = plan[planIdx];
      if (now - planAt >= wait) {
        morph(name, now);
        planAt = now;
        planIdx = planIdx === plan.length - 1 ? 1 : planIdx + 1;
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (const s of sky) {
      ctx.globalAlpha = 0.25 + 0.3 * Math.sin(s.ph + now * 0.001 * s.sp);
      ctx.fillStyle = '#cfd8e6';
      ctx.fillRect(s.x, s.y, s.r, s.r);
    }

    if (!reduce && now > nextShoot && !shooting) shooting = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.35, t: 0 };
    if (shooting) {
      shooting.t += 1 / 60;
      const len = 140 * unit, k = shooting.t / 0.9, x = shooting.x + k * 420 * unit, y = shooting.y + k * 160 * unit;
      const g = ctx.createLinearGradient(x - len, y - len * 0.38, x, y);
      g.addColorStop(0, 'rgba(220,228,240,0)'); g.addColorStop(1, 'rgba(240,244,250,0.85)');
      ctx.globalAlpha = 1 - k; ctx.strokeStyle = g; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x - len, y - len * 0.38); ctx.lineTo(x, y); ctx.stroke();
      if (k >= 1) { shooting = null; nextShoot = now + 4000 + Math.random() * 5000; }
    }

    for (const p of parts) {
      if (leaving) {
        p.x += p.vx; p.y += p.vy; p.vx *= 1.03; p.vy *= 1.03;
      } else if (p.dur > 1) {
        const t = Math.min(1, Math.max(0, (now - p.t0) / p.dur)), e = ease(t), u = 1 - e;
        p.x = u * u * p.sx + 2 * u * e * p.cx + e * e * p.tx;
        p.y = u * u * p.sy + 2 * u * e * p.cy + e * e * p.ty;
        p.b = p.sb + (p.tb - p.sb) * e;
      }
      const tw = reduce ? 1 : 0.72 + 0.28 * Math.sin(p.ph + now * 0.001 * p.tw);
      const r = (1.3 + p.b * 2.2) * p.sz * unit * 1.9;
      ctx.globalAlpha = Math.min(1, p.b * tw);
      ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    if (root.isConnected) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  btn.addEventListener('click', () => {
    if (leaving) return;
    leaving = true;
    btn.classList.add('pressed');
    try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignore */ }
    // the click lets the browser start the site's ambience music
    const sound = document.getElementById('soundControl');
    if (sound && !sound.classList.contains('playing')) sound.click();
    const cx = W / 2, cy = H * 0.45;
    for (const p of parts) {
      const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy) || 1;
      p.vx = (dx / d) * (1.5 + Math.random() * 3); p.vy = (dy / d) * (1.5 + Math.random() * 3);
    }
    setTimeout(() => root.classList.add('leaving'), reduce ? 0 : 250);
    setTimeout(() => { root.remove(); document.documentElement.classList.remove('intro-on'); }, reduce ? 300 : 1800);
  });
})();

}
(function () {
  'use strict';

  // Note: theme toggle lives in js/game-widget.js (single source of truth).

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ===== Magnetic action buttons (same pattern as portfolio) ===== */

  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.game-actions .btn.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ===== KK Cube Run — one-button endless runner ===== */

  var canvas = document.getElementById('game');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var scoreEl = document.getElementById('score');
  var hiEl = document.getElementById('hi');
  var hintEl = document.getElementById('hint');
  var overEl = document.getElementById('gameOver');
  var finalScoreEl = document.getElementById('finalScore');
  var finalHiEl = document.getElementById('finalHi');
  var retryBtn = document.getElementById('retryBtn');
  var muteBtn = document.getElementById('muteBtn');

  var HI_KEY = 'kk-cube-hi';
  var MUTE_KEY = 'kk-cube-muted';

  var hi = 0;
  var muted = false;
  try {
    hi = parseInt(localStorage.getItem(HI_KEY), 10) || 0;
    muted = localStorage.getItem(MUTE_KEY) === '1';
  } catch (e) { /* storage unavailable */ }

  function pad(n) {
    var s = String(Math.max(0, Math.floor(n)));
    while (s.length < 5) s = '0' + s;
    return s;
  }

  function renderMute() {
    if (!muteBtn) return;
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.setAttribute('aria-pressed', String(muted));
    muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  }

  function setMuted(next) {
    muted = !!next;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch (e) { /* ignore */ }
    renderMute();
  }

  renderMute();
  if (hiEl) hiEl.textContent = pad(hi);

  /* ----- Tiny WebAudio blips (no assets, unmuted by default) ----- */

  var actx = null;

  function ensureAudio() {
    if (muted) return null;
    try {
      if (!actx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        actx = new AC();
      }
      if (actx.state === 'suspended') actx.resume();
      return actx;
    } catch (e) {
      return null;
    }
  }

  function tone(f0, f1, dur, type, vol) {
    if (muted) return;
    var ac = ensureAudio();
    if (!ac) return;
    try {
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      var t = ac.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(30, f0), t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (e) { /* audio unavailable */ }
  }

  function blipJump() { tone(520, 880, 0.09, 'triangle', 0.12); }
  function blipStar() { tone(1180, 1560, 0.07, 'sine', 0.1); }
  function blipCrash() { tone(180, 70, 0.2, 'sawtooth', 0.12); }

  /* ----- Sizing (CSS pixels, DPR-aware) ----- */

  var W = 900;
  var H = 300;
  var groundY = 252;

  function resize() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(280, rect.width || 900);
    var cssH = rect.height || 300;
    W = cssW;
    H = cssH;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    groundY = H - 48;
    player.x = Math.min(90, W * 0.14);
    if (!player.jumping) player.y = groundY - player.h;
  }

  /* ----- State ----- */

  var GRAV = 2600;
  var JUMP_V = -860;
  var START_SPEED = reduceMotion ? 240 : 320;
  var MAX_SPEED = reduceMotion ? 320 : 720;
  var ACCEL = reduceMotion ? 0 : 8;
  var RESTART_DELAY = 0.75;

  var OB_COLORS = ['#ff5e7e', '#22d3ee', '#a3e635', '#e879f9', '#ffb347'];
  var OB_TYPES = [
    { w: 26, h: 44 },
    { w: 26, h: 70 },
    { w: 54, h: 34 }
  ];

  var G = {
    mode: 'idle',
    speed: START_SPEED,
    dist: 0,
    starBonus: 0,
    score: 0,
    obstacles: [],
    stars: [],
    motes: [],
    sinceSpawn: 0,
    nextGap: 420,
    deadAt: -10,
    now: 0,
    paused: false,
    colorIdx: 0,
    flashes: []
  };

  var player = {
    x: 70,
    y: 200,
    w: 42,
    h: 42,
    vy: 0,
    jumping: false
  };

  function reset() {
    G.speed = START_SPEED;
    G.dist = 0;
    G.starBonus = 0;
    G.score = 0;
    G.obstacles.length = 0;
    G.stars.length = 0;
    G.flashes.length = 0;
    G.sinceSpawn = 0;
    G.nextGap = 420;
    player.vy = 0;
    player.jumping = false;
    player.y = groundY - player.h;
  }

  function start() {
    reset();
    G.mode = 'running';
    if (overEl) overEl.hidden = true;
    if (hintEl) {
      hintEl.classList.remove('blink');
      hintEl.style.opacity = '0.55';
    }
  }

  function crash() {
    G.mode = 'over';
    G.deadAt = G.now;
    blipCrash();
    var s = Math.floor(G.score);
    if (s > hi) {
      hi = s;
      try {
        localStorage.setItem(HI_KEY, String(hi));
      } catch (e) { /* ignore */ }
    }
    if (hiEl) hiEl.textContent = pad(hi);
    if (finalScoreEl) finalScoreEl.textContent = String(s);
    if (finalHiEl) finalHiEl.textContent = String(hi);
    if (overEl) overEl.hidden = false;
    if (retryBtn) retryBtn.focus({ preventScroll: true });
  }

  function doJump() {
    if (player.jumping) return;
    player.jumping = true;
    player.vy = JUMP_V;
    blipJump();
  }

  function cutJump() {
    if (player.jumping && player.vy < -260) {
      player.vy *= 0.45;
    }
  }

  function press() {
    ensureAudio();
    if (G.mode === 'idle') {
      start();
      doJump();
    } else if (G.mode === 'running') {
      doJump();
    } else if (G.mode === 'over') {
      if (G.now - G.deadAt >= RESTART_DELAY) {
        start();
        doJump();
      }
    }
  }

  /* ----- Spawning ----- */

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function spawnObstacle() {
    var t = OB_TYPES[Math.floor(Math.random() * OB_TYPES.length)];
    var color = OB_COLORS[G.colorIdx % OB_COLORS.length];
    G.colorIdx += 1;
    G.obstacles.push({
      x: W + 20,
      y: groundY - t.h,
      w: t.w,
      h: t.h,
      color: color
    });
  }

  function maybeSpawnStar() {
    if (Math.random() < 0.45) {
      G.stars.push({
        x: W + rand(60, 300),
        y: groundY - rand(95, 165),
        r: 11,
        taken: false,
        spin: rand(0, 6)
      });
    }
  }

  /* ----- Ambient motes (aquarium nod, always drifting) ----- */

  function seedMotes() {
    G.motes.length = 0;
    for (var i = 0; i < 26; i += 1) {
      G.motes.push({
        x: Math.random() * W,
        y: Math.random() * (groundY - 20),
        r: rand(1, 2.6),
        hue: OB_COLORS[i % OB_COLORS.length],
        drift: rand(8, 26)
      });
    }
  }

  /* ----- Update ----- */

  function overlaps(a, b, shrink) {
    return (
      a.x + shrink < b.x + b.w &&
      a.x + a.w - shrink > b.x &&
      a.y + shrink < b.y + b.h &&
      a.y + a.h - shrink > b.y
    );
  }

  function playerBox() {
    return { x: player.x, y: player.y, w: player.w, h: player.h };
  }

  function update(dt) {
    var i;

    for (i = 0; i < G.motes.length; i += 1) {
      var m = G.motes[i];
      m.x -= m.drift * dt * (G.mode === 'running' ? 2.2 : 1);
      if (m.x < -6) {
        m.x = W + 6;
        m.y = Math.random() * (groundY - 20);
      }
    }

    for (i = G.flashes.length - 1; i >= 0; i -= 1) {
      G.flashes[i].life -= dt;
      G.flashes[i].y -= 60 * dt;
      if (G.flashes[i].life <= 0) G.flashes.splice(i, 1);
    }

    if (G.mode !== 'running') return;

    if (G.speed < MAX_SPEED) G.speed += ACCEL * dt;
    G.dist += G.speed * dt;
    G.sinceSpawn += G.speed * dt;

    if (G.sinceSpawn >= G.nextGap) {
      G.sinceSpawn = 0;
      G.nextGap = rand(300, 560) + G.speed * 0.35;
      spawnObstacle();
      maybeSpawnStar();
    }

    for (i = G.obstacles.length - 1; i >= 0; i -= 1) {
      G.obstacles[i].x -= G.speed * dt;
      if (G.obstacles[i].x + G.obstacles[i].w < -20) G.obstacles.splice(i, 1);
    }

    for (i = G.stars.length - 1; i >= 0; i -= 1) {
      var st = G.stars[i];
      st.x -= G.speed * dt;
      st.spin += dt * 6;
      if (st.x < -30) G.stars.splice(i, 1);
    }

    player.vy += GRAV * dt;
    player.y += player.vy * dt;
    if (player.y >= groundY - player.h) {
      player.y = groundY - player.h;
      player.vy = 0;
      player.jumping = false;
    }

    G.score = G.dist / 10 + G.starBonus;
    var shown = pad(G.score);
    if (scoreEl && scoreEl.textContent !== shown) scoreEl.textContent = shown;

    var pb = playerBox();
    for (i = 0; i < G.obstacles.length; i += 1) {
      if (overlaps(pb, G.obstacles[i], 7)) {
        crash();
        return;
      }
    }

    for (i = G.stars.length - 1; i >= 0; i -= 1) {
      var s2 = G.stars[i];
      var sb = { x: s2.x - s2.r, y: s2.y - s2.r, w: s2.r * 2, h: s2.r * 2 };
      if (overlaps(pb, sb, 2)) {
        G.stars.splice(i, 1);
        G.starBonus += 50;
        G.flashes.push({ x: s2.x, y: s2.y, life: 0.6, text: '+50' });
        blipStar();
      }
    }
  }

  /* ----- Draw ----- */

  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function cssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v && v.trim()) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    var i;
    for (i = 0; i < G.motes.length; i += 1) {
      var m = G.motes[i];
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = m.hue;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = cssVar('--line-strong', 'rgba(255,255,255,0.25)');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 0.5);
    ctx.lineTo(W, groundY + 0.5);
    ctx.stroke();

    ctx.fillStyle = cssVar('--faint', '#7c88ad');
    ctx.font = '12px ui-monospace, Consolas, monospace';
    ctx.globalAlpha = 0.5;
    var glyphs = ['<', '>', '{', '}', ';', '/>'];
    for (i = 0; i < 8; i += 1) {
      var gx = ((i * 173 - G.dist * 0.25) % (W + 60) + (W + 60)) % (W + 60) - 30;
      ctx.fillText(glyphs[i % glyphs.length], gx, groundY + 24 + (i % 2) * 12);
    }
    ctx.globalAlpha = 1;

    var s;
    for (i = 0; i < G.stars.length; i += 1) {
      s = G.stars[i];
      var tw = 1 + Math.sin(s.spin) * 0.15;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.scale(tw, tw);
      ctx.fillStyle = '#ffd93b';
      ctx.beginPath();
      for (var p = 0; p < 5; p += 1) {
        var ang = -Math.PI / 2 + (p * Math.PI * 2) / 5;
        var px = Math.cos(ang) * s.r;
        var py = Math.sin(ang) * s.r;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        var ang2 = ang + Math.PI / 5;
        ctx.lineTo(Math.cos(ang2) * s.r * 0.45, Math.sin(ang2) * s.r * 0.45);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    for (i = 0; i < G.obstacles.length; i += 1) {
      var o = G.obstacles[i];
      ctx.fillStyle = o.color;
      rr(o.x, o.y, o.w, o.h, 7);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      rr(o.x, o.y + o.h - 10, o.w, 10, 7);
      ctx.fill();
      ctx.fillStyle = '#fff';
      var ex = o.x + o.w / 2;
      var ey = o.y + 13;
      ctx.beginPath();
      ctx.arc(ex - 5, ey, 4, 0, Math.PI * 2);
      ctx.arc(ex + 5, ey, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#101736';
      ctx.beginPath();
      ctx.arc(ex - 5, ey + 1, 2, 0, Math.PI * 2);
      ctx.arc(ex + 5, ey + 1, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    var squash = 1;
    if (player.jumping) {
      squash = player.vy < 0 ? 1.08 : 0.94;
    } else if (G.mode === 'idle' && !reduceMotion) {
      squash = 1 + Math.sin(G.now * 6) * 0.02;
    }

    var pw = player.w;
    var ph = player.h * squash;
    var px = player.x;
    var py = player.y + (player.h - ph);

    if (G.mode === 'over') {
      ctx.save();
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate(-0.12);
      ctx.translate(-pw / 2, -ph / 2);
      px = 0;
      py = 0;
    }

    var grad = ctx.createLinearGradient(px, py, px + pw, py + ph);
    grad.addColorStop(0, '#22d3ee');
    grad.addColorStop(0.55, '#8b5cf6');
    grad.addColorStop(1, '#e879f9');
    ctx.fillStyle = grad;
    rr(px, py, pw, ph, 11);
    ctx.fill();

    ctx.fillStyle = 'rgba(8,18,40,0.9)';
    ctx.font = '700 15px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KK', px + pw / 2, py + ph / 2 + 1);

    ctx.fillStyle = '#fff';
    var eyeY = py + 9;
    if (G.mode === 'over') {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 10, eyeY - 3);
      ctx.lineTo(px + 16, eyeY + 3);
      ctx.moveTo(px + 16, eyeY - 3);
      ctx.lineTo(px + 10, eyeY + 3);
      ctx.moveTo(px + pw - 16, eyeY - 3);
      ctx.lineTo(px + pw - 10, eyeY + 3);
      ctx.moveTo(px + pw - 10, eyeY - 3);
      ctx.lineTo(px + pw - 16, eyeY + 3);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(px + 13, eyeY, 3, 0, Math.PI * 2);
      ctx.arc(px + pw - 13, eyeY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (G.mode === 'over') ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    for (i = 0; i < G.flashes.length; i += 1) {
      var f = G.flashes[i];
      ctx.globalAlpha = Math.min(1, f.life / 0.6);
      ctx.fillStyle = '#ffd93b';
      ctx.font = '700 14px ui-monospace, Consolas, monospace';
      ctx.fillText(f.text, f.x - 12, f.y);
    }
    ctx.globalAlpha = 1;
  }

  /* ----- Main loop ----- */

  var last = 0;

  function frame(ts) {
    if (!last) last = ts;
    var dt = (ts - last) / 1000;
    last = ts;
    if (dt > 0.033) dt = 0.033;
    if (dt < 0) dt = 0;
    if (!G.paused) {
      G.now += dt;
      update(dt);
      draw();
    }
    window.requestAnimationFrame(frame);
  }

  /* ----- Input: one button only ----- */

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      if (e.repeat) return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      press();
    } else if (e.code === 'KeyM') {
      setMuted(!muted);
    } else if (e.code === 'Enter' && G.mode === 'over') {
      press();
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      cutJump();
    }
  });

  canvas.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    press();
  });

  canvas.addEventListener('pointerup', function () {
    cutJump();
  });

  if (retryBtn) {
    retryBtn.addEventListener('click', function () {
      press();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      ensureAudio();
      setMuted(!muted);
    });
  }

  document.addEventListener('visibilitychange', function () {
    G.paused = document.hidden;
    last = 0;
  });

  window.addEventListener('blur', function () {
    if (G.mode === 'running') G.paused = true;
  });

  window.addEventListener('focus', function () {
    G.paused = false;
    last = 0;
  });

  window.addEventListener('resize', resize);

  /* ----- Boot ----- */

  resize();
  seedMotes();
  reset();
  if (scoreEl) scoreEl.textContent = pad(0);
  if (hintEl && !reduceMotion) hintEl.classList.add('blink');
  if (hintEl && reduceMotion) {
    hintEl.textContent = 'Press Space or tap to hop (calm mode: steady speed)';
  }
  window.requestAnimationFrame(frame);

  window.__cubeGame = {
    state: G,
    player: player,
    press: press,
    cutJump: cutJump,
    setMuted: setMuted,
    getScore: function () {
      return Math.floor(G.score);
    },
    getMode: function () {
      return G.mode;
    }
  };
})();

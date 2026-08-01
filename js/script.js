(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktopGallery = window.matchMedia('(min-width: 861px)');
  var htmlEl = document.documentElement;
  htmlEl.classList.add('js');

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /* ===== Lenis smooth scroll ===== */

  var lenis = null;

  if (typeof window.Lenis === 'function' && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    function lenisRaf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(lenisRaf);
    }
    window.requestAnimationFrame(lenisRaf);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      if (body && body.classList.contains('menu-open')) closeMenu();
      if (lenis) {
        lenis.scrollTo(target, { offset: -16, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ===== Typing effect ===== */

  var typedEl = document.getElementById('typed');
  var roles = ['Software Engineer', 'Full-Stack Developer', 'XR / AR / VR Developer', 'Game Developer'];
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    var current = roles[roleIndex];
    charIndex = deleting ? charIndex - 1 : charIndex + 1;
    typedEl.textContent = current.slice(0, charIndex);

    var delay = deleting ? 38 : 85;
    if (!deleting && charIndex === current.length) {
      delay = 1900;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 450;
    }
    setTimeout(typeLoop, delay);
  }

  if (reduceMotion) {
    typedEl.textContent = roles[0];
  } else {
    setTimeout(typeLoop, 600);
  }

  /* ===== Scroll-driven state ===== */

  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('main section[id]');
  var progressBar = document.querySelector('.scroll-progress');
  var heroInner = document.querySelector('.hero-inner');
  var scrollCue = document.querySelector('.scroll-cue');
  var timeline = document.querySelector('.timeline');
  var tlProgress = document.querySelector('.timeline-progress');
  var pinSection = document.querySelector('.pin-section');
  var track = document.querySelector('.projects-track');
  var trackDistance = 0;
  var countNow = document.querySelector('.count-now');

  var bg = document.querySelector('.bg');
  var orbLayer = document.querySelector('.orb-layer');
  var paneLayer = document.querySelector('.pane-layer');
  var glyphLayer = document.querySelector('.code-glyphs');
  var bgX = 0;
  var bgY = 0;
  var bgCurX = 0;
  var bgCurY = 0;
  var mouseTX = 0;
  var mouseTY = 0;
  var scrollTY = 0;
  var bgRaf = null;
  var layerTargets = [
    { el: orbLayer, factor: 1.5 },
    { el: paneLayer, factor: 0.6 },
    { el: glyphLayer, factor: 2.2 }
  ];
  var layerPos = {};
  layerTargets.forEach(function (layer) {
    layerPos[layer.el] = { x: 0, y: 0, tx: 0, ty: 0 };
  });

  function onScroll() {
    var y = window.scrollY || 0;
    var vh = window.innerHeight;
    var maxY = Math.max(1, (document.documentElement.scrollHeight || document.body.scrollHeight) - vh);
    var progress = clamp(y / maxY, 0, 1);

    nav.classList.toggle('scrolled', y > 40);
    if (progressBar) progressBar.style.transform = 'scaleX(' + progress + ')';

    var pos = y + vh * 0.35;
    var currentId = 'hero';
    sections.forEach(function (section) {
      if (pos >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });

    if (heroInner && !reduceMotion) {
      if (y < vh * 1.15) {
        heroInner.style.transform = 'translateY(' + (y * 0.28) + 'px)';
        heroInner.style.opacity = String(1 - y / (vh * 1.05));
      } else {
        heroInner.style.transform = '';
        heroInner.style.opacity = '';
      }
    }

    if (scrollCue) {
      scrollCue.style.opacity = String(1 - clamp(y / 260, 0, 1));
    }

    if (timeline && tlProgress && !reduceMotion) {
      var tRect = timeline.getBoundingClientRect();
      var tlP = clamp((vh * 0.8 - tRect.top) / tRect.height, 0, 1);
      tlProgress.style.height = (tlP * 100) + '%';
    }

    updateGallery();
    updateCerts();

    if (bg && !reduceMotion) {
      scrollTY = -y * 0.045;
      if (!bgRaf) bgRaf = window.requestAnimationFrame(bgLoop);
    }
  }

  function bgLoop() {
    var targetX = mouseTX;
    var targetY = mouseTY + scrollTY;
    bgCurX += (targetX - bgCurX) * 0.1;
    bgCurY += (targetY - bgCurY) * 0.1;
    bg.style.transform = 'translate(' + bgCurX.toFixed(2) + 'px, ' + bgCurY.toFixed(2) + 'px)';

    layerTargets.forEach(function (layer) {
      var pos = layerPos[layer.el];
      var tx = mouseTX * layer.factor;
      var ty = mouseTY * layer.factor;
      pos.x += (tx - pos.x) * 0.1;
      pos.y += (ty - pos.y) * 0.1;
      layer.el.style.transform = 'translate(' + pos.x.toFixed(2) + 'px, ' + pos.y.toFixed(2) + 'px)';
    });

    bgRaf = null;
    if (Math.abs(targetX - bgCurX) > 0.05 || Math.abs(targetY - bgCurY) > 0.05) {
      bgRaf = window.requestAnimationFrame(bgLoop);
    }
  }

  if (finePointer && !reduceMotion) {
    window.addEventListener('mousemove', function (e) {
      mouseTX = (e.clientX / window.innerWidth - 0.5) * 54;
      mouseTY = (e.clientY / window.innerHeight - 0.5) * 36;
      if (!bgRaf) bgRaf = window.requestAnimationFrame(bgLoop);
    }, { passive: true });
  }

  /* ===== Horizontal projects gallery ===== */

  function computeGallery() {
    if (!pinSection || !track) return;
    if (!desktopGallery.matches || reduceMotion) {
      pinSection.style.height = '';
      track.style.transform = '';
      return;
    }
    var vw = window.innerWidth;
    trackDistance = Math.max(0, track.scrollWidth - vw);
    pinSection.style.height = (trackDistance + window.innerHeight) + 'px';
  }

  function updateGallery() {
    if (!pinSection || !track) return;
    if (!desktopGallery.matches || reduceMotion) {
      return;
    }
    var rect = pinSection.getBoundingClientRect();
    var p = clamp(-rect.top / trackDistance, 0, 1);
    track.style.transform = 'translate3d(' + (-p * trackDistance) + 'px, 0, 0)';
    if (countNow) {
      var idx = clamp(Math.ceil(p * 5), 1, 5);
      countNow.textContent = String(idx).padStart(2, '0');
    }
  }

  computeGallery();

  /* ===== Cert scatter & drift ===== */

  var certSection = document.getElementById('certifications');
  var certCards = [];

  if (certSection && !reduceMotion) {
    certCards = Array.prototype.slice.call(certSection.querySelectorAll('.cert-card'));
    certCards.forEach(function (card) {
      card.style.setProperty('--cert-rot', (Math.random() * 8 - 4).toFixed(2) + 'deg');
      card.style.setProperty('--cert-drift', (Math.random() * 24 - 12).toFixed(1) + 'px');
      card.style.setProperty('--float-dur', (4 + Math.random() * 3).toFixed(2) + 's');
    });
  }

  function updateCerts() {
    if (!certSection || !certCards.length) return;
    var rect = certSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = clamp((vh * 0.55 - rect.top) / rect.height, -0.5, 1.5);
    var factor = clamp(Math.abs(p - 0.5) * 3.2, 0, 1);
    certCards.forEach(function (card) {
      var rot = parseFloat(card.style.getPropertyValue('--cert-rot')) || 0;
      var drift = parseFloat(card.style.getPropertyValue('--cert-drift')) || 0;
      card.style.transform = 'translateY(' + (drift * factor).toFixed(2) + 'px) rotate(' + (rot * factor).toFixed(2) + 'deg)';
    });
  }

  /* ===== Event wiring ===== */

  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      computeGallery();
      onScroll();
    }, 150);
  });

  window.addEventListener('load', computeGallery);

  onScroll();

  /* ===== Mobile menu ===== */

  var body = document.body;
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileLinks = document.querySelectorAll('.mobile-links a');

  function closeMenu() {
    body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  }

  navToggle.addEventListener('click', function () {
    var open = body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    if (lenis) {
      if (open) lenis.stop();
      else lenis.start();
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ===== Reveal on scroll ===== */

  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-blur');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ===== Split word-mask headings ===== */

  function initSplit() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      return;
    }

    var splitObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          var head = entry.target.closest('.sec-head');
          if (head) head.classList.add('is-visible');
          splitObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.split').forEach(function (heading) {
      var state = { idx: 0 };
      splitNode(heading, state);
      splitObserver.observe(heading);
      if (heading.getBoundingClientRect().top < window.innerHeight) {
        heading.classList.add('is-visible');
        var head = heading.closest('.sec-head');
        if (head) head.classList.add('is-visible');
      }
    });
  }

  function wrapWord(text, idx, grad) {
    var word = document.createElement('span');
    word.className = 'word';
    word.style.setProperty('--word-delay', (idx * 0.05).toFixed(3) + 's');
    var inner = document.createElement('span');
    inner.className = 'word-inner' + (grad ? ' grad-text' : '');
    inner.textContent = text;
    word.appendChild(inner);
    return word;
  }

  function splitNode(node, state) {
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    var gradParents = [];

    textNodes.forEach(function (tn) {
      var gradParent = tn.parentNode;
      var isGrad = gradParent && gradParent.classList && gradParent.classList.contains('gradient-text');
      if (isGrad && gradParents.indexOf(gradParent) === -1) gradParents.push(gradParent);
      var parts = tn.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
        } else {
          frag.appendChild(wrapWord(part, state.idx++, isGrad));
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });

    gradParents.forEach(function (span) {
      if (span.parentNode) {
        while (span.firstChild) {
          span.parentNode.insertBefore(span.firstChild, span);
        }
        span.parentNode.removeChild(span);
      }
    });
  }

  initSplit();

  /* ===== Skill bars ===== */

  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        fill.style.width = fill.getAttribute('data-level') + '%';
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.bar-fill').forEach(function (bar) {
    if (reduceMotion) {
      bar.style.width = bar.getAttribute('data-level') + '%';
    } else {
      barObserver.observe(bar);
    }
  });

  /* ===== Stat counters ===== */

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var p = clamp((ts - start) / 1400, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }

      if (reduceMotion) {
        el.textContent = target + suffix;
      } else {
        window.requestAnimationFrame(step);
      }
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ===== Magnetic buttons ===== */

  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      var strength = el.classList.contains('btn') ? 0.25 : 0.18;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ===== Custom cursor ===== */

  if (finePointer && !reduceMotion) {
    var ring = document.querySelector('.cursor-ring');
    var pointer = document.querySelector('.cursor-pointer');
    var dot = document.querySelector('.cursor-dot');

    if (ring && pointer) {
      htmlEl.classList.add('custom-cursor');
      var mouseX = -100;
      var mouseY = -100;
      var ringX = -100;
      var ringY = -100;
      var dotX = -100;
      var dotY = -100;
      var ringRaf = null;
      var pointerOffX = 8.4;
      var pointerOffY = 1.85;

      pointer.style.transform = 'translate(' + (-100 - pointerOffX) + 'px, ' + (-100 - pointerOffY) + 'px)';
      if (dot) dot.style.transform = 'translate(-103px, -103px)';

      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        pointer.style.transform = 'translate(' + (mouseX - pointerOffX) + 'px, ' + (mouseY - pointerOffY) + 'px)';
        if (!ringRaf) ringRaf = window.requestAnimationFrame(ringLoop);
      }, { passive: true });

      function ringLoop() {
        ringX += (mouseX - ringX) * 0.08;
        ringY += (mouseY - ringY) * 0.08;
        ring.style.transform = 'translate(' + (ringX - 18) + 'px, ' + (ringY - 18) + 'px)';
        if (dot) {
          dotX += (mouseX - dotX) * 0.22;
          dotY += (mouseY - dotY) * 0.22;
          dot.style.transform = 'translate(' + (dotX - 3) + 'px, ' + (dotY - 3) + 'px)';
        }
        ringRaf = null;
        var dotDx = dot ? Math.abs(mouseX - dotX) : 0;
        var dotDy = dot ? Math.abs(mouseY - dotY) : 0;
        if (Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5 || dotDx > 0.5 || dotDy > 0.5) {
          ringRaf = window.requestAnimationFrame(ringLoop);
        }
      }

      document.querySelectorAll('a, button, .btn, input, textarea, .p-card').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('is-active'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('is-active'); });
      });

      var boltPath = 'M12 1 L6 13 H11 L10 23 L17 10 H12.5 Z';
      var boltFlights = [
        { rot: 180, tx: 0, ty: -46 },
        { rot: 135, tx: -33, ty: -33 },
        { rot: 90, tx: -46, ty: 0 }
      ];
      var sparkAngles = [0, 50, 105, 155, 205, 260, 310];
      var themeCount = { dark: 6, light: 5, sunset: 8 };

      function angleOffset(index) {
        return (index % 2 === 0 ? 7 : -7) * (index + 1);
      }

      document.addEventListener('mousedown', function (e) {
        var theme = htmlEl.getAttribute('data-theme') || 'dark';
        var count = themeCount[theme] || 6;
        var spark = document.createElement('span');
        spark.className = 'click-spark';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';

        var flash = document.createElement('span');
        flash.className = 'flash';
        spark.appendChild(flash);

        var i = 0;
        while (i < boltFlights.length) {
          var b = document.createElement('span');
          b.className = 'bolt';
          b.style.setProperty('--bolt-tx', boltFlights[i].tx + 'px');
          b.style.setProperty('--bolt-ty', boltFlights[i].ty + 'px');
          b.style.setProperty('--bolt-rot', boltFlights[i].rot + 'deg');
          b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + boltPath + '"></path></svg>';
          spark.appendChild(b);
          i += 1;
        }

        i = 0;
        while (i < count) {
          var p = document.createElement('span');
          p.className = 'particle';
          var base = sparkAngles[i % sparkAngles.length] + angleOffset(i);
          var rad = base * Math.PI / 180;
          var dist = 34 + (i % 3) * 12;
          p.style.setProperty('--spark-tx', Math.cos(rad) * dist + 'px');
          p.style.setProperty('--spark-ty', Math.sin(rad) * dist + 'px');
          p.style.setProperty('--spark-delay', ((i % 3) * 0.03) + 's');
          spark.appendChild(p);
          i += 1;
        }

        var pending = spark.querySelectorAll('.flash, .bolt, .particle').length;
        spark.addEventListener('animationend', function () {
          pending -= 1;
          if (pending <= 0) spark.remove();
        });
        document.body.appendChild(spark);
      });
    }
  }

  /* ===== Theme toggle ===== */

  var themeToggle = document.getElementById('themeToggle');
  var themeOrder = ['dark', 'light', 'sunset'];
  var themeAria = {
    dark: 'Switch to light theme',
    light: 'Switch to sunset theme',
    sunset: 'Switch to dark theme'
  };

  function currentTheme() {
    return htmlEl.getAttribute('data-theme') || 'dark';
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) { /* storage unavailable */ }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var cur = themeOrder.indexOf(currentTheme());
      var next = themeOrder[(cur + 1) % themeOrder.length];
      htmlEl.setAttribute('data-theme', next);
      themeToggle.setAttribute('aria-label', themeAria[next]);
      themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
      saveTheme(next);
    });

    var initial = currentTheme();
    themeToggle.setAttribute('aria-label', themeAria[initial] || themeAria.dark);
    themeToggle.setAttribute('aria-pressed', String(initial === 'dark'));
  }

  /* ===== Card tilt ===== */

  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.about-card, .skill-card, .p-card').forEach(function (el) {
      var state = { rx: 0, ry: 0, tx: 0, ty: 0, raf: null };

      function tiltLoop() {
        state.rx += (state.ty - state.rx) * 0.15;
        state.ry += (state.tx - state.ry) * 0.15;
        el.style.transform = 'perspective(900px) rotateX(' + state.rx.toFixed(2) + 'deg) rotateY(' + state.ry.toFixed(2) + 'deg)';
        state.raf = null;
        if (Math.abs(state.ty - state.rx) > 0.05 || Math.abs(state.tx - state.ry) > 0.05) {
          state.raf = window.requestAnimationFrame(tiltLoop);
        } else if (el.style.transition) {
          el.style.transition = '';
        }
      }

      function kick() {
        if (!state.raf) state.raf = window.requestAnimationFrame(tiltLoop);
      }

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        state.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 9;
        state.ty = ((e.clientY - rect.top) / rect.height - 0.5) * -9;
        el.style.transition = 'none';
        kick();
      });

      el.addEventListener('mouseleave', function () {
        state.tx = 0;
        state.ty = 0;
        el.style.transition = 'transform 0.4s var(--ease)';
        kick();
      });
    });
  }

  /* ===== Contact form ===== */

  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    success.classList.add('show');
    form.reset();
    setTimeout(function () {
      success.classList.remove('show');
    }, 4200);
  });
})();

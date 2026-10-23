// ===== LOADER =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const progress = document.querySelector('.loader-progress');
  if (!loader || !progress) {
    initSite();
    return;
  }

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 28 + 8;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      progress.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        initSite();
      }, 350);
    } else {
      progress.style.width = width + '%';
    }
  }, 90);
});


// ===== IMG FALLBACK =====
document.addEventListener('error', (e) => {
  const t = e.target;
  if (t && t.tagName === 'IMG') {
    t.dataset.failed = '1';
    t.style.opacity = '0';
  }
}, true);

function initSite() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.body.classList.add('touch');
  }

  initCursor();
  initScrollProgress();
  initBrief();
  initCopyEmail();
  initLightbox();
  initTheme();
  initLang();
  initMagnetic();
  initHeaderScroll();
  initThree();
  initAnimations();
  initFilters();
  initTestimonials();
  initForm();
  initMobileMenu();
  initCounters();
  initTilt();
  initCursorTrail();
  initChat();
  initReviewsGallery();
  initToTop();
  initProcessTimeline();
}

// ===== CUSTOM CURSOR =====

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [];
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id, el, a });
  });
  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop || window.scrollY) / max : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
    const y = window.scrollY + 120;
    let current = null;
    sections.forEach(s => {
      if (s.el.offsetTop <= y) current = s;
    });
    sections.forEach(s => s.a.classList.toggle('is-active', s === current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower || document.body.classList.contains('touch')) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = document.querySelectorAll('a, button, .magnetic, .work-card, .skill, .filter-btn');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });
}

// ===== THEME =====
function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('theme') || 'light';
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(saved);

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// ===== LANGUAGE =====
function initLang() {
  const toggle = document.querySelector('.lang-toggle');
  if (!toggle) return;

  let current = localStorage.getItem('lang') || 'ru';
  applyLang(current);

  toggle.addEventListener('click', () => {
    current = current === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', current);
    applyLang(current);
  });

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-ru]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text === null) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder') || el.getAttribute('data-ru')) el.placeholder = text;
        return;
      }
      if (el.children.length && el.querySelector('svg, img, button, input')) {
        if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
        return;
      }
      el.textContent = text;
    });
    document.querySelectorAll('.lang-ru, .lang-en').forEach(span => {
      span.classList.toggle('active', span.classList.contains('lang-' + lang));
    });
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.placeholder = lang === 'en'
        ? (chatInput.dataset.placeholderEn || 'Write a message…')
        : (chatInput.dataset.placeholderRu || 'Напишите сообщение…');
    }
  }
}

// ===== MAGNETIC =====
function initMagnetic() {
  if (document.body.classList.contains('touch')) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== THREE.JS HERO — magnetic paradise objects =====
function initThree() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.15, 5.2);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding || undefined;
  if (renderer.toneMapping !== undefined) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }

  function resize() {
    const parent = canvas.parentElement || document.body;
    const w = parent.clientWidth || window.innerWidth;
    const h = parent.clientHeight || window.innerHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  resize();

  const isDark = () => document.body.classList.contains('dark');

  // Lights — studio setup
  const amb = new THREE.AmbientLight(0x8899bb, 0.35);
  scene.add(amb);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x57D8FF, 0.55);
  fill.position.set(-5, 1, 2);
  scene.add(fill);
  const rim = new THREE.PointLight(0xA878FF, 1.2, 20);
  rim.position.set(0, -1.5, -3);
  scene.add(rim);
  const coral = new THREE.PointLight(0xFF855E, 0.45, 14);
  coral.position.set(3, 2, 1);
  scene.add(coral);

  const group = new THREE.Group();
  scene.add(group);

  // Core metal icosahedron
  const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x1a1d2e,
    metalness: 0.92,
    roughness: 0.22,
    envMapIntensity: 1.2
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Glass shell
  const shellGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0xa8c8ff,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.72,
    transparent: true,
    opacity: 0.85,
    thickness: 0.6,
    ior: 1.45
  });
  // Fallback if MeshPhysicalMaterial missing fields on old three
  if (shellMat.transmission === undefined) {
    shellMat.transparent = true;
    shellMat.opacity = 0.25;
  }
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);

  // Light ring
  const ringGeo = new THREE.TorusGeometry(1.55, 0.035, 16, 128);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x57D8FF,
    emissive: 0x57D8FF,
    emissiveIntensity: 0.85,
    metalness: 0.6,
    roughness: 0.25
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.15;
  group.add(ring);

  // Secondary ring
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.85, 0.018, 12, 100),
    new THREE.MeshBasicMaterial({ color: 0xA878FF, transparent: true, opacity: 0.45 })
  );
  ring2.rotation.x = Math.PI / 2.6;
  ring2.rotation.y = 0.35;
  group.add(ring2);

  // Floating shards
  const shards = [];
  const shardGeo = new THREE.OctahedronGeometry(0.18, 0);
  for (let i = 0; i < 7; i++) {
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 ? 0x635BFF : 0xFF855E,
      metalness: 0.7,
      roughness: 0.3,
      emissive: i % 2 ? 0x635BFF : 0xFF855E,
      emissiveIntensity: 0.15
    });
    const m = new THREE.Mesh(shardGeo, mat);
    const a = (i / 7) * Math.PI * 2;
    m.userData = { angle: a, radius: 2.15 + (i % 3) * 0.2, speed: 0.25 + i * 0.04, y: (i - 3) * 0.18 };
    m.position.set(Math.cos(a) * m.userData.radius, m.userData.y, Math.sin(a) * m.userData.radius);
    group.add(m);
    shards.push(m);
  }

  // Particles
  const dustCount = reduced ? 120 : 420;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x57D8FF,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    sizeAttenuation: true
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  let visible = true;
  const onMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  if (!window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('pointermove', onMove, { passive: true });
  }

  let scrollBoost = 0;
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    scrollBoost = Math.min(1, Math.max(0, -r.top / Math.max(r.height, 1)));
    visible = r.bottom > 0 && r.top < window.innerHeight;
  }, { passive: true });

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!running || (!visible && document.hidden)) return;

    const t = performance.now() * 0.001;
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    group.rotation.y = t * 0.18 + mouseX * 0.35;
    group.rotation.x = mouseY * 0.22 + scrollBoost * 0.4;
    group.position.y = Math.sin(t * 0.6) * 0.08;

    core.rotation.y = -t * 0.25;
    shell.rotation.y = t * 0.12;
    shell.rotation.z = t * 0.05;
    ring.rotation.z = t * 0.4;
    ring2.rotation.z = -t * 0.25;

    shards.forEach((m) => {
      const u = m.userData;
      u.angle += u.speed * 0.008;
      m.position.x = Math.cos(u.angle) * u.radius;
      m.position.z = Math.sin(u.angle) * u.radius;
      m.position.y = u.y + Math.sin(t + u.angle) * 0.12;
      m.rotation.x = t * 0.8;
      m.rotation.y = t * 1.1;
    });

    dust.rotation.y = t * 0.02;
    camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.3 + 0.15 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', resize);

  // Theme-reactive emissives
  const mo = new MutationObserver(() => {
    const d = isDark();
    amb.intensity = d ? 0.35 : 0.55;
    dustMat.color.setHex(d ? 0x57D8FF : 0x635BFF);
    ringMat.emissive.setHex(d ? 0x57D8FF : 0x635BFF);
  });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

// ===== GSAP ANIMATIONS =====
function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 0.9, delay: 0.2, ease: 'power3.out' });
  gsap.from('.hero-title .line', { y: 80, opacity: 0, duration: 1, stagger: 0.12, delay: 0.35, ease: 'power3.out' });
  gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.9, delay: 0.7, ease: 'power3.out' });
  gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, delay: 0.9, ease: 'power3.out' });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Work cards
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 50,
      opacity: 0,
      duration: 0.7,
      delay: (i % 2) * 0.1,
      ease: 'power3.out'
    });
  });

  // Process steps
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 90%' },
      y: 40,
      opacity: 0,
      duration: 0.65,
      delay: i * 0.08,
      ease: 'power3.out'
    });
  });

  // Service cards
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: (i % 2) * 0.1,
      ease: 'power3.out'
    });
  });

  // Review cards
  gsap.utils.toArray('.review-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 50,
      opacity: 0,
      duration: 0.75,
      delay: i * 0.12,
      ease: 'power3.out'
    });
  });
}

// ===== FILTERS =====
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ===== TESTIMONIALS =====
function initTestimonials() {
  const items = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  if (!items.length) return;

  let current = 0;
  let interval;

  function show(index) {
    items.forEach((item, i) => item.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    current = index;
  }

  function next() {
    show((current + 1) % items.length);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      show(parseInt(dot.dataset.index, 10));
      resetInterval();
    });
  });

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(next, 5500);
  }

  resetInterval();
}

// ===== FORM (Formspree AJAX) =====
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const action = form.getAttribute('action') || '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameEl = form.querySelector('[name="name"]');
    const emailEl = form.querySelector('[name="email"]');
    const msgEl = form.querySelector('[name="message"]');
    const isEn = document.documentElement.lang === 'en' || document.body.dataset.lang === 'en';
    const emailOk = emailEl && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    if (!nameEl?.value.trim() || !emailOk || !msgEl?.value.trim()) {
      const status = document.getElementById('form-status');
      if (status) {
        status.hidden = false;
        status.className = 'form-status error';
        status.setAttribute('aria-live', 'polite');
        status.textContent = isEn ? 'Please fill name, valid email and message.' : 'Заполните имя, корректный email и сообщение.';
      }
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;

    const original = btn.textContent;
    btn.textContent = isEn ? 'Sending…' : 'Отправка…';
    btn.style.pointerEvents = 'none';
    btn.setAttribute('disabled', 'true');
    if (status) status.hidden = true;

    try {
      const data = new FormData(form);
      const res = await fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        btn.textContent = isEn ? 'Sent!' : 'Отправлено!';
        if (status) {
          status.hidden = false;
          status.className = 'form-status success';
          status.textContent = isEn
            ? 'Message sent. I will reply soon.'
            : 'Сообщение отправлено. Отвечу в ближайшее время.';
        }
        form.reset();
      } else {
        throw new Error('Network');
      }
    } catch (err) {
      btn.textContent = original;
      if (status) {
        status.hidden = false;
        status.className = 'form-status error';
        status.textContent = isEn
          ? 'Something went wrong. Please write to email or Telegram.'
          : 'Что-то пошло не так. Напишите на email или в Telegram.';
      }
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.style.pointerEvents = '';
      btn.removeAttribute('disabled');
    }, 3200);
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-link');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ===== COUNTERS (fixed) =====
function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  stats.forEach(stat => {
    const target = parseInt(stat.dataset.count || stat.dataset.static || stat.textContent, 10) || 0;
    // Always show final value as baseline (works without JS / IO)
    if (!stat.dataset.ready) {
      stat.textContent = String(target);
      stat.dataset.ready = '1';
    }
  });

  if (reduced || !('IntersectionObserver' in window)) return;

  const animated = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const stat = entry.target;
      if (animated.has(stat)) return;
      animated.add(stat);
      const target = parseInt(stat.dataset.count || '0', 10) || 0;
      const duration = 1400;
      const start = performance.now();
      stat.textContent = '0';
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        stat.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
        else stat.textContent = String(target);
      }
      requestAnimationFrame(tick);
      observer.unobserve(stat);
    });
  }, { threshold: 0.4 });

  stats.forEach(stat => observer.observe(stat));
}


function initTilt() {
  if (document.body.classList.contains('touch')) return;
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    const max = 8;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * max * 2;
      const rotX = (0.5 - y) * max * 2;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== CURSOR TRAIL =====
function initCursorTrail() {
  if (document.body.classList.contains('touch')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let trail = document.querySelector('.cursor-trail');
  if (!trail) {
    trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.setAttribute('aria-hidden', 'true');
    document.body.appendChild(trail);
  }

  let tx = 0, ty = 0, mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    trail.classList.add('active');
  });

  function anim() {
    tx += (mx - tx) * 0.08;
    ty += (my - ty) * 0.08;
    trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(anim);
  }
  anim();
}

// ===== SUPPORT CHAT =====
function initChat() {
  const widget = document.getElementById('chat-widget');
  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const minimize = document.getElementById('chat-minimize');
  if (!widget || !toggle) return;

  const FORMSPREE = 'https://formspree.io/f/xaeqrznk';

  const FAQ = {
    price: {
      title: {
        ru: 'Сколько стоит визуализация?',
        en: 'How much does visualization cost?'
      },
      body: {
        ru: `<p>Стоимость зависит от сложности и объёма:</p>
<ul>
<li><strong>Простой продукт</strong> — от 15 000 ₽ (1–3 ракурса)</li>
<li><strong>Сложный продукт / упаковка</strong> — 25–60 000 ₽</li>
<li><strong>Архитектура (экстерьер)</strong> — от 40 000 ₽ за ключевой ракурс</li>
<li><strong>Персонаж game-ready</strong> — от 80 000 ₽</li>
<li><strong>Motion / ролик</strong> — индивидуально, от 50 000 ₽</li>
</ul>
<p>Точную смету даю после брифа. Напишите задачу — отвечу с ориентиром по цене и срокам.</p>`,
        en: `<p>Price depends on complexity and scope:</p>
<ul>
<li><strong>Simple product</strong> — from $150–200 (1–3 angles)</li>
<li><strong>Complex product / packaging</strong> — $250–600</li>
<li><strong>Architecture (exterior)</strong> — from $400 per key view</li>
<li><strong>Game-ready character</strong> — from $800</li>
<li><strong>Motion / film</strong> — custom, from $500</li>
</ul>
<p>Exact quote after the brief. Send your task — I’ll reply with a price and timeline range.</p>`
      }
    },
    time: {
      title: {
        ru: 'Какие сроки выполнения?',
        en: 'What are the timelines?'
      },
      body: {
        ru: `<p>Типичные сроки:</p>
<ul>
<li><strong>Продуктовый рендер</strong> — 3–10 дней</li>
<li><strong>Архитектурный экстерьер</strong> — 1–3 недели</li>
<li><strong>Character (full pipeline)</strong> — 3–6 недель</li>
<li><strong>Motion 10–15 сек</strong> — 1–3 недели</li>
</ul>
<p>Срочный заказ возможен (+30–50% к стоимости). После согласования брифа фиксируем дедлайн в договоре.</p>`,
        en: `<p>Typical timelines:</p>
<ul>
<li><strong>Product render</strong> — 3–10 days</li>
<li><strong>Architectural exterior</strong> — 1–3 weeks</li>
<li><strong>Character (full pipeline)</strong> — 3–6 weeks</li>
<li><strong>Motion 10–15 sec</strong> — 1–3 weeks</li>
</ul>
<p>Rush jobs are possible (+30–50%). After the brief we lock the deadline in the agreement.</p>`
      }
    },
    brief: {
      title: {
        ru: 'Что нужно для старта?',
        en: 'What do you need to start?'
      },
      body: {
        ru: `<p>Чтобы начать, достаточно:</p>
<ul>
<li>Краткое описание задачи и цели (реклама, e-com, pitch…)</li>
<li>Референсы (Pinterest, скрины, конкуренты)</li>
<li>Чертежи / CAD / фото продукта — если есть</li>
<li>Желаемые ракурсы и сроки</li>
</ul>
<p>Если ничего нет — помогу собрать бриф на созвоне или в переписке. После этого даю смету и план работ.</p>`,
        en: `<p>To start, I need:</p>
<ul>
<li>Short description of the task and goal (ads, e-com, pitch…)</li>
<li>References (Pinterest, screenshots, competitors)</li>
<li>Drawings / CAD / product photos — if available</li>
<li>Desired angles and deadline</li>
</ul>
<p>If you have nothing yet — I’ll help build the brief on a call or in chat. Then you get a quote and work plan.</p>`
      }
    },
    revisions: {
      title: {
        ru: 'Сколько правок входит?',
        en: 'How many revisions are included?'
      },
      body: {
        ru: `<p>В стандартный пакет входит:</p>
<ul>
<li><strong>2 раунда правок</strong> на этапе блокига / освещения</li>
<li><strong>1 раунд</strong> на финальном композитинге</li>
</ul>
<p>Мелкие правки (цвет, кроп, логотип) — без доплаты. Крупные изменения композиции или модели после утверждения — оцениваются отдельно. Все этапы согласуем, чтобы правок было минимум.</p>`,
        en: `<p>Standard package includes:</p>
<ul>
<li><strong>2 revision rounds</strong> at blocking / lighting stage</li>
<li><strong>1 round</strong> at final compositing</li>
</ul>
<p>Small tweaks (color, crop, logo) — free. Major composition or model changes after approval are quoted separately. We align at every stage to keep revisions minimal.</p>`
      }
    },
    formats: {
      title: {
        ru: 'В каких форматах отдача?',
        en: 'What delivery formats?'
      },
      body: {
        ru: `<p>По умолчанию отдаю:</p>
<ul>
<li><strong>PNG / JPEG</strong> — 4K–8K под web и print</li>
<li><strong>TIFF</strong> — по запросу для полиграфии</li>
<li><strong>MP4 / ProRes</strong> — для motion</li>
<li>Исходники сцены (Blender / C4D) — по договорённости</li>
</ul>
<p>Могу подготовить версии под Instagram, баннеры, презентации и каталог. Напишите, где будет использоваться — подстрою.</p>`,
        en: `<p>Default delivery:</p>
<ul>
<li><strong>PNG / JPEG</strong> — 4K–8K for web and print</li>
<li><strong>TIFF</strong> — on request for print</li>
<li><strong>MP4 / ProRes</strong> — for motion</li>
<li>Scene sources (Blender / C4D) — by agreement</li>
</ul>
<p>I can prepare versions for Instagram, banners, decks and catalogs. Tell me where it will be used — I’ll adapt.</p>`
      }
    },
    remote: {
      title: {
        ru: 'Работаете удалённо / с другими странами?',
        en: 'Do you work remotely / internationally?'
      },
      body: {
        ru: `<p>Да. Работаю полностью удалённо с клиентами по всему миру.</p>
<ul>
<li>Коммуникация: Telegram, Email, Zoom / Google Meet</li>
<li>Оплата: перевод, карта, для зарубежных клиентов — удобный способ обсуждаем</li>
<li>Договор и NDA — по запросу</li>
<li>Часовой пояс: MSK (UTC+3), гибко подстраиваюсь</li>
</ul>
<p>Язык общения: русский и английский.</p>`,
        en: `<p>Yes. I work fully remote with clients worldwide.</p>
<ul>
<li>Comms: Telegram, Email, Zoom / Google Meet</li>
<li>Payment: transfer, card; for international clients we agree on a convenient method</li>
<li>Contract and NDA — on request</li>
<li>Timezone: MSK (UTC+3), flexible</li>
</ul>
<p>Languages: Russian and English.</p>`
      }
    }
  };

  function isEn() {
    return document.documentElement.lang === 'en';
  }

  function showView(name) {
    document.querySelectorAll('.chat-view').forEach(v => {
      v.classList.toggle('active', v.dataset.view === name);
    });
  }

  function openWidget() {
    widget.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closeWidget() {
    widget.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (widget.classList.contains('open')) closeWidget();
    else {
      openWidget();
      showView('home');
    }
  });

  if (minimize) {
    minimize.addEventListener('click', (e) => {
      e.stopPropagation();
      closeWidget();
    });
  }

  document.addEventListener('click', (e) => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      closeWidget();
    }
  });

  // FAQ items
  document.querySelectorAll('.chat-faq-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.faq;
      const item = FAQ[key];
      if (!item) return;
      const lang = isEn() ? 'en' : 'ru';
      document.getElementById('faq-title').textContent = item.title[lang];
      document.getElementById('faq-body').innerHTML = item.body[lang];
      showView('faq');
    });
  });

  document.getElementById('chat-faq-back')?.addEventListener('click', () => showView('home'));
  document.getElementById('chat-live-back')?.addEventListener('click', () => showView('home'));

  document.getElementById('chat-ask-btn')?.addEventListener('click', () => {
    showView('live');
    setTimeout(() => document.getElementById('chat-input')?.focus(), 200);
  });

  document.getElementById('chat-operator-btn')?.addEventListener('click', () => {
    showView('live');
    setTimeout(() => document.getElementById('chat-input')?.focus(), 200);
  });

  document.getElementById('chat-faq-operator')?.addEventListener('click', () => {
    showView('live');
    setTimeout(() => document.getElementById('chat-input')?.focus(), 200);
  });

  // Live form
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const body = document.getElementById('chat-body');

  function updatePlaceholder() {
    if (!input) return;
    input.placeholder = isEn()
      ? (input.dataset.placeholderEn || 'Write a message…')
      : (input.dataset.placeholderRu || 'Напишите сообщение…');
  }
  updatePlaceholder();

  // Hook into lang toggle — re-run when lang changes via MutationObserver on html lang
  const langObs = new MutationObserver(updatePlaceholder);
  langObs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  function addMsg(text, type) {
    if (!body) return;
    const div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    if (type === 'bot') {
      div.innerHTML = '<div class="chat-msg-meta">AF Support</div><p></p>';
      div.querySelector('p').textContent = text;
    } else {
      div.innerHTML = '<p></p>';
      div.querySelector('p').textContent = text;
    }
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');
    if (input) input.value = '';

    const pending = isEn() ? 'Sending…' : 'Отправка…';
    addMsg(pending, 'bot');
    const bots = body.querySelectorAll('.chat-msg.bot');
    const lastBot = bots[bots.length - 1];

    try {
      const data = new FormData();
      data.append('message', text);
      data.append('_subject', 'Чат поддержки — портфолио AF');
      data.append('source', 'support-chat');
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        lastBot.querySelector('p').textContent = isEn()
          ? 'Message received. Alexander will reply soon by email or Telegram.'
          : 'Сообщение получено. Александр ответит скоро на email или в Telegram.';
      } else {
        throw new Error('fail');
      }
    } catch (e) {
      lastBot.querySelector('p').textContent = isEn()
        ? 'Could not send. Please write to Telegram @uguro or email.'
        : 'Не удалось отправить. Напишите в Telegram @uguro или на email.';
    }
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(input?.value || '');
  });
}

// ===== REVIEWS GALLERY (AF Client Experience) =====
function initReviewsGallery() {
  const root = document.querySelector('[data-reviews-root]');
  const stage = document.getElementById('reviews-stage');
  const gallery = document.getElementById('reviews-gallery');
  if (!root || !stage) return;

  const cards = Array.from(stage.querySelectorAll('.rx-card'));
  const dots = Array.from(document.querySelectorAll('#rx-dots .rx-dot'));
  const prevBtn = document.getElementById('rx-prev');
  const nextBtn = document.getElementById('rx-next');
  const soundBtn = document.getElementById('rx-sound');
  const dialog = document.getElementById('rx-dialog');
  const total = cards.length;
  let index = 0;
  let soundOn = false;
  let audioCtx = null;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    reduced = e.matches;
    layout();
  });

  function isEn() {
    return document.documentElement.lang === 'en';
  }

  function layout() {
    cards.forEach((card, i) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-far');
      const d = (i - index + total) % total;
      // map relative positions for 3 cards
      if (i === index) {
        card.classList.add('is-active');
      } else if (i === (index - 1 + total) % total) {
        card.classList.add('is-prev');
      } else if (i === (index + 1) % total) {
        card.classList.add('is-next');
      } else {
        card.classList.add('is-far');
      }
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (gallery) {
      gallery.setAttribute('aria-label', isEn() ? 'Client testimonials' : 'Отзывы клиентов');
    }
  }

  function go(to) {
    if (to < 0) to = total - 1;
    if (to >= total) to = 0;
    if (to === index) return;
    index = to;
    layout();
    playTick();
  }

  function playTick() {
    if (!soundOn || reduced) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 420;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.03, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start(now);
      o.stop(now + 0.14);
    } catch (_) {}
  }

  prevBtn?.addEventListener('click', () => go(index - 1));
  nextBtn?.addEventListener('click', () => go(index + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => go(parseInt(dot.dataset.index, 10)));
  });

  // Keyboard when gallery focused
  gallery?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
  });

  // Swipe
  let px = 0, py = 0, tracking = false;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    tracking = true;
    px = e.clientX;
    py = e.clientY;
    stage.setPointerCapture?.(e.pointerId);
  });
  stage.addEventListener('pointerup', (e) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) go(index + 1);
      else go(index - 1);
    }
  });
  stage.addEventListener('pointercancel', () => { tracking = false; });

  // Click side cards to navigate
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.rx-more')) return;
      const i = parseInt(card.dataset.index, 10);
      if (i !== index) go(i);
    });
  });

  // Pointer light on active card
  if (!isTouch && !reduced) {
    stage.addEventListener('pointermove', (e) => {
      const active = stage.querySelector('.rx-card.is-active .rx-card-inner');
      if (!active) return;
      const r = active.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      active.style.setProperty('--rx-mx', x + '%');
      active.style.setProperty('--rx-my', y + '%');
    });
  }

  // Sound toggle
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    const en = isEn();
    soundBtn.setAttribute(
      'aria-label',
      soundOn
        ? (en ? soundBtn.dataset.enAriaOn : soundBtn.dataset.ruAriaOn)
        : (en ? soundBtn.dataset.enAriaOff : soundBtn.dataset.ruAriaOff)
    );
    if (soundOn) playTick();
  });

  // Dialog
  let lastFocus = null;
  function openDialog(card) {
    if (!dialog) return;
    lastFocus = document.activeElement;
    const name = card.dataset.author || '';
    const role = isEn() ? (card.dataset.roleEn || '') : (card.dataset.roleRu || '');
    const quoteEl = card.querySelector('.rx-quote p');
    const quote = quoteEl ? quoteEl.textContent : '';
    const idxLabel = card.querySelector('.rx-index')?.textContent || '';
    document.getElementById('rx-dialog-title').textContent = name;
    document.getElementById('rx-dialog-role').textContent = role;
    document.getElementById('rx-dialog-quote').textContent = quote;
    document.getElementById('rx-dialog-index').textContent = idxLabel;
    dialog.hidden = false;
    playTick();
    const closeBtn = dialog.querySelector('.rx-dialog-close');
    closeBtn?.focus();
  }

  function closeDialog() {
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    lastFocus?.focus?.();
  }

  cards.forEach(card => {
    card.querySelector('.rx-more')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openDialog(card);
    });
  });

  dialog?.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href')?.startsWith('#')) {
        closeDialog();
        return;
      }
      e.preventDefault();
      closeDialog();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog && !dialog.hidden) closeDialog();
  });

  // Scroll reveal via GSAP if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduced) {
    gsap.from('.reviews-intro', {
      scrollTrigger: { trigger: root, start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
    gsap.from('.reviews-gallery', {
      scrollTrigger: { trigger: root, start: 'top 75%' },
      y: 50, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out'
    });
  }

  // Lang change — refresh roles text on cards (data-ru already handled globally)
  const langObs = new MutationObserver(() => {
    cards.forEach(card => {
      const role = card.querySelector('.rx-role');
      if (role) {
        role.textContent = isEn() ? (card.dataset.roleEn || role.textContent) : (card.dataset.roleRu || role.textContent);
      }
    });
    if (gallery) {
      gallery.setAttribute('aria-label', isEn() ? 'Client testimonials' : 'Отзывы клиентов');
    }
    if (prevBtn) prevBtn.setAttribute('aria-label', isEn() ? 'Previous testimonial' : 'Предыдущий отзыв');
    if (nextBtn) nextBtn.setAttribute('aria-label', isEn() ? 'Next testimonial' : 'Следующий отзыв');
  });
  langObs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  layout();
}

// ===== FLOATING BACK TO TOP =====
function initToTop() {
  const btn = document.getElementById('to-top');
  if (!btn) return;

  const SHOW_AFTER = 480; // px scrolled
  let ticking = false;

  function update() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > SHOW_AFTER) {
      btn.classList.add('is-visible');
      btn.hidden = false;
    } else {
      btn.classList.remove('is-visible');
      // keep in DOM for animation out; hide after transition
      window.setTimeout(() => {
        if (!btn.classList.contains('is-visible')) btn.hidden = true;
      }, 350);
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  btn.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  // lang aria
  const syncAria = () => {
    const en = document.documentElement.lang === 'en';
    btn.setAttribute('aria-label', en ? (btn.dataset.enAria || 'Back to top') : (btn.dataset.ruAria || 'Наверх'));
  };
  syncAria();
  new MutationObserver(syncAria).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}

// ===== PROCESS TIMELINE =====
function initProcessTimeline() {
  const root = document.querySelector('[data-process-root]');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll('.pt-step'));
  if (!steps.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const orbit = document.getElementById('process-orbit');
  let index = 0;
  let animating = false;
  const DURATION = reduced ? 0 : 900; // ms panel transition

  function setActive(i, fromUser) {
    if (i < 0 || i >= steps.length) return;
    if (i === index && fromUser) return;
    if (animating && fromUser) return;
    animating = true;
    index = i;

    steps.forEach((step, idx) => {
      const on = idx === index;
      step.classList.toggle('is-active', on);
      step.classList.toggle('is-open', on);
      const btn = step.querySelector('.pt-marker');
      if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      // stagger content fade
      const content = step.querySelector('.pt-content');
      if (content) {
        content.style.transition = reduced ? 'none' : 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
        if (on) {
          content.style.opacity = '0';
          content.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              content.style.opacity = '1';
              content.style.transform = 'translateY(0)';
            });
          });
        }
      }
    });

    // progress line
    const prog = document.getElementById('pt-progress');
    if (prog) {
      const pct = steps.length <= 1 ? 100 : (index / (steps.length - 1)) * 100;
      prog.style.height = pct + '%';
    }

    // nav buttons state
    const prev = document.getElementById('pt-prev');
    const next = document.getElementById('pt-next');
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === steps.length - 1;

    // dots
    root.querySelectorAll('.pt-dot').forEach((d, di) => {
      d.classList.toggle('is-active', di === index);
      d.setAttribute('aria-current', di === index ? 'true' : 'false');
    });

    window.setTimeout(() => { animating = false; }, DURATION);
  }

  steps.forEach((step, i) => {
    step.querySelector('.pt-marker')?.addEventListener('click', () => setActive(i, true));
    step.querySelector('.pt-title')?.addEventListener('click', () => setActive(i, true));
  });

  document.getElementById('pt-prev')?.addEventListener('click', () => setActive(index - 1, true));
  document.getElementById('pt-next')?.addEventListener('click', () => setActive(index + 1, true));
  root.querySelectorAll('.pt-dot').forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.index, 10);
      if (!Number.isNaN(i)) setActive(i, true);
    });
  });

  // Keyboard when timeline focused
  const timeline = document.getElementById('process-timeline');
  timeline?.setAttribute('tabindex', '0');
  timeline?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActive(index + 1, true);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActive(index - 1, true);
    }
  });

  // Soft scroll spy — only when step is clearly centered, slower threshold
  if ('IntersectionObserver' in window && !reduced) {
    let scrollLock = false;
    const io = new IntersectionObserver((entries) => {
      if (scrollLock || animating) return;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          const i = parseInt(entry.target.dataset.step, 10);
          if (!Number.isNaN(i) && i !== index) setActive(i, false);
        }
      });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: [0.55, 0.7] });
    steps.forEach(s => io.observe(s));

    // pause spy briefly after manual click
    const origSet = setActive;
    // already handled via animating flag
  }

  // Orbit parallax
  if (orbit && !reduced && !window.matchMedia('(pointer: coarse)').matches) {
    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 14;
      ty = (e.clientY / window.innerHeight - 0.5) * 10;
    }, { passive: true });
    (function tick() {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      orbit.style.transform = `rotateX(${-my}deg) rotateY(${mx}deg)`;
      requestAnimationFrame(tick);
    })();
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduced) {
    gsap.from('.process-hero', {
      scrollTrigger: { trigger: root, start: 'top 78%' },
      y: 36, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    gsap.from('.process-close', {
      scrollTrigger: { trigger: '.process-close', start: 'top 88%' },
      y: 28, opacity: 0, duration: 1, ease: 'power3.out'
    });
  }

  setActive(0, false);
}


function initLightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('img');
  const imgs = () => Array.from(document.querySelectorAll('.work-image img, .project-gallery img')).filter(i => i.src);
  let list = [];
  let index = 0;
  function open(i) {
    list = imgs();
    if (!list.length) return;
    index = (i + list.length) % list.length;
    img.src = list[index].src;
    img.alt = list[index].alt || '';
    box.hidden = false;
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('is-open');
    box.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.work-image img').forEach((el, i) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      list = imgs();
      const idx = list.indexOf(el);
      open(idx >= 0 ? idx : 0);
    });
  });
  box.querySelector('.lightbox-close')?.addEventListener('click', close);
  box.querySelector('.lightbox-prev')?.addEventListener('click', () => open(index - 1));
  box.querySelector('.lightbox-next')?.addEventListener('click', () => open(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(index - 1);
    if (e.key === 'ArrowRight') open(index + 1);
  });
}


function initBrief() {
  const apply = document.getElementById('brief-apply');
  const msg = document.querySelector('#contact-form textarea[name="message"], #contact-form [name="message"]');
  if (!apply || !msg) return;

  const labels = {
    ru: {
      product: 'Продуктовая визуализация', arch: 'Архитектурная визуализация',
      character: 'Character design', motion: 'Motion / animation', other: 'Другое',
      stills: 'статичные кадры', turntable: '360° / turntable', animation: 'анимация', model: '3D-модель',
      photo: 'фотореализм', stylized: 'стилизация', cinematic: 'кинематограф', minimal: 'минимализм',
      asap: 'как можно скорее', '2w': 'до 2 недель', '1m': 'до месяца', flex: 'гибкие сроки',
      s: 'до 50 000 ₽', m: '50–150 000 ₽', l: '150 000 ₽+', '': 'не указан'
    },
    en: {
      product: 'Product visualization', arch: 'Architectural visualization',
      character: 'Character design', motion: 'Motion / animation', other: 'Other',
      stills: 'still frames', turntable: '360° / turntable', animation: 'animation', model: '3D model',
      photo: 'photoreal', stylized: 'stylized', cinematic: 'cinematic', minimal: 'minimal',
      asap: 'ASAP', '2w': 'up to 2 weeks', '1m': 'up to a month', flex: 'flexible',
      s: 'under $500', m: '$500–1500', l: '$1500+', '': 'not set'
    }
  };

  apply.addEventListener('click', () => {
    const isEn = document.documentElement.lang === 'en' || document.body.dataset.lang === 'en';
    const L = isEn ? labels.en : labels.ru;
    const type = document.getElementById('brief-type')?.value || '';
    const result = document.getElementById('brief-result')?.value || '';
    const style = document.getElementById('brief-style')?.value || '';
    const time = document.getElementById('brief-time')?.value || '';
    const budget = document.getElementById('brief-budget')?.value || '';
    if (isEn) {
      msg.value = [
        'Project request draft:',
        `• Type: ${L[type] || type || '—'}`,
        `• Deliverable: ${L[result] || result || '—'}`,
        `• Style: ${L[style] || style || '—'}`,
        `• Timeline: ${L[time] || time || '—'}`,
        `• Budget: ${L[budget] || L['']}`,
        '',
        'Please calculate a quote. Details:'
      ].join('\\n');
    } else {
      msg.value = [
        'Черновик заявки:',
        `• Тип: ${L[type] || type || '—'}`,
        `• Результат: ${L[result] || result || '—'}`,
        `• Стиль: ${L[style] || style || '—'}`,
        `• Сроки: ${L[time] || time || '—'}`,
        `• Бюджет: ${L[budget] || L['']}`,
        '',
        'Прошу рассчитать стоимость. Дополнительно:'
      ].join('\\n');
    }
    msg.focus();
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function initCopyEmail() {
  const btn = document.getElementById('copy-email');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = 'enemy1032@gmail.com';
    const isEn = document.documentElement.lang === 'en' || document.body.dataset.lang === 'en';
    try {
      await navigator.clipboard.writeText(email);
      const prev = btn.textContent;
      btn.textContent = isEn ? 'Copied' : 'Скопировано';
      setTimeout(() => { btn.textContent = prev; }, 1800);
    } catch (_) {
      btn.textContent = email;
    }
  });
}


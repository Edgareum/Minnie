/* ============================================================
   MAIN.JS — Slideshow, Gallery, Scroll Reveal, Petals, QR
   ============================================================ */

// ---- PETALS ----
(function spawnPetals() {
  const container = document.getElementById('petals');
  const symbols = ['🌸', '🌺', '🌼', '✿', '❀'];
  const COUNT = 18;
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.8 + Math.random() * 1.2}rem;
      animation-duration: ${7 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 15}s;
      opacity: ${0.4 + Math.random() * 0.5};
    `;
    container.appendChild(el);
  }
})();

// ---- SLIDESHOW ----
(function initSlideshow() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const indicatorContainer = document.getElementById('slideIndicators');
  let current = 0;
  let timer = null;
  const INTERVAL = 4500;

  // Build indicators
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'indicator' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    indicatorContainer.appendChild(btn);
  });

  function getIndicators() {
    return Array.from(indicatorContainer.querySelectorAll('.indicator'));
  }

  function goTo(index, direction) {
    const prevSlide = slides[current];
    prevSlide.classList.add('exiting');
    prevSlide.classList.remove('active');
    setTimeout(() => prevSlide.classList.remove('exiting'), 1400);

    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');

    const indicators = getIndicators();
    indicators.forEach((btn, i) => btn.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  document.getElementById('nextBtn').addEventListener('click', () => { next(); startTimer(); });
  document.getElementById('prevBtn').addEventListener('click', () => { prev(); startTimer(); });

  startTimer();
})();

// ---- SCROLL REVEAL FOR CARDS ----
(function initScrollReveal() {
  const cards = document.querySelectorAll('.person-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  cards.forEach(card => observer.observe(card));
})();

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- QR CODE GENERATOR ----
(function initQR() {
  const canvas = document.getElementById('qrCanvas');
  const btn = document.getElementById('qrGenBtn');
  const input = document.getElementById('qrUrlInput');
  const hint = document.getElementById('qrHint');

  function generateQR(url) {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    QRCode.toCanvas(canvas, cleanUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#1a1220',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    }, function(err) {
      if (err) {
        hint.textContent = '生成失败，请检查链接格式';
      } else {
        hint.textContent = `✅ QR已生成 → ${cleanUrl}`;
      }
    });
  }

  btn.addEventListener('click', () => generateQR(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') generateQR(input.value);
  });

  // Try to auto-detect current URL (works when deployed)
  const currentUrl = window.location.href;
  if (currentUrl && !currentUrl.includes('localhost') && !currentUrl.includes('127.0.0.1') && !currentUrl.includes('file://')) {
    input.value = currentUrl;
    generateQR(currentUrl);
    hint.textContent = `✅ 已自动生成当前页面 QR`;
  } else {
    // Generate a placeholder to show the QR area nicely
    QRCode.toCanvas(canvas, 'https://your-github-pages-url.github.io', {
      width: 200,
      margin: 1,
      color: { dark: '#1a1220', light: '#ffffff' }
    }, () => {});
  }
})();

// ---- PARALLAX ON HERO ----
(function initParallax() {
  const hero = document.getElementById('hero');
  const heroContent = hero.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
      hero.querySelector('.hero-overlay').style.opacity = 0.6 + scrolled / window.innerHeight * 0.4;
    }
  }, { passive: true });
})();

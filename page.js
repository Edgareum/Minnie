// Shared JS for individual person pages — petals + carousel + lightbox
(function spawnPetals() {
  const container = document.getElementById('petals');
  if (!container) return;
  const symbols = ['🌸', '🌺', '🌼', '✿', '❀'];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${0.9 + Math.random() * 1.1}rem;
      animation-duration: ${8 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 14}s;
      opacity: ${0.4 + Math.random() * 0.45};
    `;
    container.appendChild(el);
  }
})();

// Duplicate gallery items for seamless infinite scroll
(function initCarousel() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  const items = track.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // If there's only 1 item, don't clone or animate
  if (items.length === 1) {
    track.classList.add('single-item');
    const section = track.closest('.gallery-section');
    if (section) section.classList.add('gallery-section-single');
    return;
  }

  // Clone all items and append for seamless loop
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('data-clone', 'true');
    track.appendChild(clone);
  });

  // Adjust animation speed based on number of items
  const totalItems = items.length;
  const speed = Math.max(12, totalItems * 4); // 4s per item, min 12s
  track.style.animationDuration = speed + 's';
})();

// Lightbox gallery
(function initLightbox() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  // Collect only original images (not clones) for lightbox navigation
  const originalItems = track.querySelectorAll('.gallery-item:not([data-clone])');
  if (!originalItems.length) return;

  const images = [];
  originalItems.forEach(item => {
    const img = item.querySelector('img');
    if (img) images.push(img.src);
  });

  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="关闭">✕</button>
    <button class="lightbox-nav lightbox-prev" aria-label="上一张">‹</button>
    <button class="lightbox-nav lightbox-next" aria-label="下一张">›</button>
    <img src="" alt=""/>
    <div class="lightbox-counter"></div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector('img');
  const lbCounter = lightbox.querySelector('.lightbox-counter');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbPrev = lightbox.querySelector('.lightbox-prev');
  const lbNext = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    lbImg.src = images[currentIndex];
    lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    lbPrev.style.display = images.length > 1 ? '' : 'none';
    lbNext.style.display = images.length > 1 ? '' : 'none';
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  }

  // Attach click to ALL items (originals + clones)
  const allItems = track.querySelectorAll('.gallery-item');
  allItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      // Find matching original index
      const idx = images.indexOf(img.src);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevImage);
  lbNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevImage();
      else nextImage();
    }
  }, { passive: true });
})();

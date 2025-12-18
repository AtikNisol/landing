// Навигация: подсветка активной секции через IntersectionObserver
(function() {
  const links = Array.from(document.querySelectorAll('.toc a'));
  const map = new Map(links.map(a => [document.querySelector(a.getAttribute('href')), a]));

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const link = map.get(visible.target);
    if (!link) return;
    links.forEach(l => l.setAttribute('aria-current', 'false'));
    link.setAttribute('aria-current', 'true');
  }, { rootMargin: '-30% 0px -60% 0px', threshold: [0.2, 0.6, 1] });

  map.forEach((_, section) => observer.observe(section));
})();

// До/После: включаем только выбранный трек
(function() {
  const before = document.getElementById('audio-before');
  const after = document.getElementById('audio-after');
  const controls = document.querySelector('.before-after__controls');
  if (!before || !after || !controls) return;

  const setVariant = (v) => {
    if (v === 'before') { after.pause(); before.currentTime = 0; before.play(); }
    else { before.pause(); after.currentTime = 0; after.play(); }
  };

  controls.querySelectorAll('.btn').forEach(btn => {
    const variant = btn.dataset.variant;
    if (variant) btn.addEventListener('click', () => setVariant(variant));
  });

  const stopBtn = controls.querySelector('[data-action="stop"]');
  if (stopBtn) {
    stopBtn.addEventListener('click', () => { before.pause(); after.pause(); before.currentTime = 0; after.currentTime = 0; });
  }

  const vol = controls.querySelector('input[type="range"]');
  const applyVolume = (v) => { before.volume = v; after.volume = v; };
  if (vol) {
    applyVolume(parseFloat(vol.value || '0.8'));
    vol.addEventListener('input', () => applyVolume(parseFloat(vol.value)));
  }
})();

// Галерея: простое увеличение при клике (lightbox)
(function() {
  const images = document.querySelectorAll('.gallery__item img');
  if (!images.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);display:none;place-items:center;z-index:9999;';
  const pic = document.createElement('img');
  pic.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;border:1px solid #2a2f43;';
  overlay.appendChild(pic);
  overlay.addEventListener('click', () => overlay.style.display = 'none');
  document.body.appendChild(overlay);
  images.forEach(img => img.addEventListener('click', () => { pic.src = img.src; overlay.style.display = 'grid'; }));
})();

// Прогрессивная загрузка: отключаем автозапуск видео при сниженной динамике
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(v => { v.autoplay = false; v.pause(); });
  }
})();

// Индикатор прогресса чтения
(function() {
  const bar = document.querySelector('.reading-progress');
  if (!bar) return;
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const height = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    const progress = Math.max(0, Math.min(1, scrollTop / height));
    bar.style.width = (progress * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

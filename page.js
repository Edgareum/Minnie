// Shared JS for individual person pages — petals only
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

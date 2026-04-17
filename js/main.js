// ── Floating background stars ──
const emojis = ['⭐', '✨', '💫', '🌟', '⚡', '🎉', '🎈', '💖', '🦋', '🌸'];
const layer = document.getElementById('starsLayer');

for (let i = 0; i < 30; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  s.style.left = Math.random() * 100 + 'vw';
  s.style.animationDuration = (6 + Math.random() * 10) + 's';
  s.style.animationDelay = (Math.random() * 12) + 's';
  s.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
  layer.appendChild(s);
}

// ── Cursor sprinkle trail ──
const sprinkleEmojis = ['✨', '⭐', '💫', '🌟', '💖', '🎀', '🦄', '🌸', '🎊', '💥', '⚡', '🍭'];
let lastSprinkle = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSprinkle < 30) return;
  lastSprinkle = now;

  for (let k = 0; k < 3; k++) {
    const el = document.createElement('div');
    el.className = 'sprinkle';
    el.textContent = sprinkleEmojis[Math.floor(Math.random() * sprinkleEmojis.length)];
    const size = 0.7 + Math.random() * 1.1;
    el.style.fontSize = size + 'rem';
    el.style.left = (e.clientX - 10 + (Math.random() - 0.5) * 20) + 'px';
    el.style.top  = (e.clientY - 10 + (Math.random() - 0.5) * 20) + 'px';
    el.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
    el.style.setProperty('--dy', (20 + Math.random() * 60) + 'px');
    el.style.setProperty('--dr', (Math.random() * 360 - 180) + 'deg');
    el.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
});

// ── Mega confetti on title click ──
const CONFETTI_COLORS = [
  '#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffff00',
  '#00ff00', '#00ffcc', '#0088ff', '#8800ff', '#ff00ff',
  '#ff44aa', '#ffffff', '#ff6699', '#66ffff'
];
const CONFETTI_SHAPES = ['2px', '50%', '0'];

function spawnConfettiBurst(originX, originY) {
  const count = 88; // 4 bursts × 88 ≈ 350 total
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';

    const w     = 6 + Math.random() * 10;
    const h     = 8 + Math.random() * 16;
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
    const dur   = (1.2 + Math.random() * 2) + 's';
    const spreadX = (Math.random() - 0.5) * window.innerWidth * 1.4;
    const rot   = (Math.random() * 1440 - 720) + 'deg';

    el.style.setProperty('--w',     w + 'px');
    el.style.setProperty('--h',     h + 'px');
    el.style.setProperty('--color', color);
    el.style.setProperty('--br',    shape);
    el.style.setProperty('--dur',   dur);
    el.style.setProperty('--top',   originY + 'px');
    el.style.setProperty('--left',  originX + 'px');
    el.style.setProperty('--fdx',   spreadX + 'px');
    el.style.setProperty('--fdr',   rot);
    el.style.animationDelay = (Math.random() * 0.3) + 's';

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ── Fullscreen glowing heart on background click ──
function spawnScreenHeart() {
  const existing = document.querySelector('.screen-heart');
  if (existing) existing.remove();

  const wrap = document.createElement('div');
  wrap.className = 'screen-heart';
  wrap.innerHTML = `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85 C50 85 5 55 5 28 C5 14 16 5 28 5 C37 5 45 11 50 18 C55 11 63 5 72 5 C84 5 95 14 95 28 C95 55 50 85 50 85Z"
      fill="none" stroke="#ff1155" stroke-width="3.5"/>
  </svg>`;
  document.body.appendChild(wrap);
  wrap.addEventListener('animationend', () => wrap.remove());
}

document.addEventListener('click', (e) => {
  // Don't trigger on interactive elements
  if (e.target.closest('button, a, .modal, .ticker-wrap, h1')) return;
  spawnScreenHeart();
});

document.getElementById('title').addEventListener('click', (e) => {
  spawnConfettiBurst(e.clientX, e.clientY);
  setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.2, -20), 80);
  setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.8, -20), 160);
  setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.5, -20), 240);
});

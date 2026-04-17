// ── Puzzle Engine ──────────────────────────────────────────────────────────

const WRONG_MESSAGES = [
  'Falsch!!! 😱', 'Nochmal!! 💪', 'Fast... aber leider nein! 🤔',
  'Nicht ganz! 🙈', 'Versuch\'s nochmal! 💫', 'Hmm, das stimmt nicht! 😅',
  'Noch ein Versuch! 🎯', 'Das war\'s nicht... 🌀', 'Knapp daneben! 🔍'
];

const CONFETTI_COLORS = [
  '#ff0000','#ff4400','#ff8800','#ffcc00','#ffff00',
  '#00ff00','#00ffcc','#0088ff','#8800ff','#ff00ff',
  '#ff44aa','#ffffff','#ff6699','#66ffff'
];
const CONFETTI_SHAPES = ['2px','50%','0'];

function spawnConfettiBurst(originX, originY) {
  for (let i = 0; i < 88; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const w     = 6  + Math.random() * 10;
    const h     = 8  + Math.random() * 16;
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

function normalize(str) {
  return String(str).trim().toLowerCase()
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ');
}

function initPuzzle(config) {
  const { number, answer, nextUrl, altAnswers = [] } = config;

  // ── Chain guard via URL param (works on file:// across all browsers) ──
  const params = new URLSearchParams(window.location.search);
  const unlocked = parseInt(params.get('u') ?? '1');
  console.log(`[PuzzleEngine] Puzzle ${number} init. URL unlocked=${unlocked}`);
  if (number > unlocked) {
    const target = String(unlocked).padStart(2, '0') + '.html?u=' + unlocked;
    console.warn(`[PuzzleEngine] Chain guard → redirect to ${target}`);
    window.location.replace(target);
    return;
  }

  // ── Floating stars ──
  const emojis = ['⭐','✨','💫','🌟','⚡','🎉','🎈','💖','🦋','🌸'];
  const layer = document.getElementById('starsLayer');
  if (layer) {
    for (let i = 0; i < 25; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDuration  = (6 + Math.random() * 10) + 's';
      s.style.animationDelay     = (Math.random() * 12) + 's';
      s.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
      layer.appendChild(s);
    }
  }

  // ── Cursor sprinkle ──
  const sprinkleEmojis = ['✨','⭐','💫','🌟','💖','🎀','🦄','🌸','🎊','💥','⚡','🍭'];
  let lastSprinkle = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSprinkle < 35) return;
    lastSprinkle = now;
    for (let k = 0; k < 2; k++) {
      const el = document.createElement('div');
      el.className = 'sprinkle';
      el.textContent = sprinkleEmojis[Math.floor(Math.random() * sprinkleEmojis.length)];
      el.style.fontSize = (0.7 + Math.random() * 1) + 'rem';
      el.style.left = (e.clientX + (Math.random() - 0.5) * 20) + 'px';
      el.style.top  = (e.clientY + (Math.random() - 0.5) * 20) + 'px';
      el.style.setProperty('--dx', (Math.random() - 0.5) * 80 + 'px');
      el.style.setProperty('--dy', (20 + Math.random() * 60) + 'px');
      el.style.setProperty('--dr', (Math.random() * 360 - 180) + 'deg');
      el.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  });

  // ── Progress bar ──
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = (number / 27 * 100) + '%';

  // ── Answer elements ──
  const submitBtn = document.getElementById('submitBtn');
  const errorMsg  = document.getElementById('errorMsg');
  const input     = document.getElementById('answerInput');
  const radios    = document.querySelectorAll('input[type="radio"][name="answer"]');

  function getInputValue() {
    if (radios.length > 0) {
      const checked = document.querySelector('input[type="radio"][name="answer"]:checked');
      return checked ? checked.value : '';
    }
    return input ? input.value : '';
  }

  function checkAnswer() {
    const raw = getInputValue().trim();
    console.log(`[PuzzleEngine] checkAnswer: raw="${raw}"`);
    if (!raw) { console.log('[PuzzleEngine] Empty input, ignoring.'); return; }
    const norm = normalize(raw);
    const correct = normalize(answer);
    const alts    = altAnswers.map(normalize);
    console.log(`[PuzzleEngine] norm="${norm}", correct="${correct}", alts=${JSON.stringify(alts)}`);
    if (norm === correct || alts.includes(norm)) {
      console.log('[PuzzleEngine] ✅ Correct!');
      onCorrect();
    } else {
      console.log('[PuzzleEngine] ❌ Wrong.');
      onWrong();
    }
  }

  function onWrong() {
    const card = document.querySelector('.puzzle-card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      card.addEventListener('animationend', () => card.classList.remove('shake'), { once: true });
    }
    if (errorMsg) {
      const msg = WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
      errorMsg.textContent = msg;
      errorMsg.classList.remove('blink');
      void errorMsg.offsetWidth;
      errorMsg.classList.add('blink');
      errorMsg.style.display = 'block';
      setTimeout(() => { errorMsg.style.display = 'none'; }, 2800);
    }
  }

  function onCorrect() {
    spawnConfettiBurst(window.innerWidth / 2, window.innerHeight / 3);
    setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.15, -10), 90);
    setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.85, -10), 180);
    setTimeout(() => spawnConfettiBurst(window.innerWidth * 0.5, -10),  270);
    const overlay = document.getElementById('winOverlay');
    if (overlay) overlay.classList.add('show');
    // Pass unlock level via URL param — works on file:// across all browsers
    const next = number + 1;
    const separator = nextUrl.includes('?') ? '&' : '?';
    const destination = nextUrl + separator + 'u=' + next;
    console.log(`[PuzzleEngine] ✅ Correct! Navigating to: ${destination}`);
    setTimeout(() => { window.location.href = destination; }, 2600);
  }

  if (submitBtn) submitBtn.addEventListener('click', checkAnswer);
  if (input)     input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(); });

  // ── Tool modals ──
  function bindTool(btnId, modalId, closeId) {
    const btn   = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);
    if (btn && modal) {
      btn.addEventListener('click', (e) => { e.stopPropagation(); modal.classList.toggle('open'); });
      if (close) close.addEventListener('click', () => modal.classList.remove('open'));
    }
  }
  bindTool('caesarBtn', 'caesarModal', 'caesarClose');
  bindTool('calcBtn',   'calcModal',   'calcClose');

  // Caesar cipher logic
  const caesarInput  = document.getElementById('caesarInput');
  const caesarShift  = document.getElementById('caesarShift');
  const caesarOutput = document.getElementById('caesarOutput');
  function runCaesar() {
    if (!caesarInput || !caesarOutput) return;
    const text  = caesarInput.value;
    const shift = ((parseInt(caesarShift?.value || '0') % 26) + 26) % 26;
    const result = text.split('').map(c => {
      if (c >= 'a' && c <= 'z') return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97);
      if (c >= 'A' && c <= 'Z') return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65);
      return c;
    }).join('');
    caesarOutput.value = result;
  }
  caesarInput?.addEventListener('input', runCaesar);
  caesarShift?.addEventListener('input', runCaesar);

  // Calculator logic
  const calcInput   = document.getElementById('calcInput');
  const calcResult  = document.getElementById('calcResult');
  const calcCompute = document.getElementById('calcCompute');
  function runCalc() {
    if (!calcInput || !calcResult) return;
    try {
      const expr = calcInput.value.replace(/[^0-9+\-*/.() ]/g, '');
      if (!expr) { calcResult.textContent = ''; return; }
      const val = Function('"use strict"; return (' + expr + ')')();
      calcResult.textContent = '= ' + (Math.round(val * 10000) / 10000);
    } catch { calcResult.textContent = 'Fehler!'; }
  }
  calcCompute?.addEventListener('click', runCalc);
  calcInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') runCalc(); });
}

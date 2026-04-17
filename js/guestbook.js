const overlay = document.getElementById('guestbookOverlay');
const closeBtn = document.getElementById('guestbookClose');
const openBtn  = document.getElementById('guestbookBtn');
const list     = document.getElementById('guestbookList');

openBtn.addEventListener('click', openGuestbook);
closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});

function openGuestbook() {
  overlay.classList.add('open');
  if (list.childElementCount > 0) return; // already loaded

  GUESTBOOK_ENTRIES.forEach(entry => list.appendChild(buildEntry(entry)));
}

function buildEntry(entry) {
  const div = document.createElement('div');
  div.className = 'gb-entry';
  const linkHtml = entry.link
    ? `<div class="gb-link">→ <a href="${entry.link.url}" style="color:#00ffff;text-decoration:underline;">${escapeHtml(entry.link.text)}</a></div>`
    : '';
  div.innerHTML = `
    <div class="gb-entry-header">
      <span class="gb-name">${escapeHtml(entry.name)} <span class="gb-emoji">${entry.emoji ?? ''}</span></span>
      <span class="gb-date">${escapeHtml(entry.date)}</span>
    </div>
    <div class="gb-location">📍 ${escapeHtml(entry.location)}</div>
    <div class="gb-message">${escapeHtml(entry.message)}</div>
    ${linkHtml}
  `;
  return div;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

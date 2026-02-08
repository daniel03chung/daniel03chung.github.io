const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const response = document.getElementById("response");

// Spawn falling heartbreak emojis across the top of the viewport
function spawnHeartbreaks(count = 18) {
  let container = document.querySelector('.fall-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'fall-container';
    document.body.appendChild(container);
  }

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'fall-emoji';
    el.textContent = '💔';

    // random horizontal start (within visible width)
    const startX = Math.random() * (window.innerWidth - 40) + 8;
    // slight random delay and duration variety
    const delay = Math.random() * 0.35;
    const extraDuration = (Math.random() - 0.5) * 0.6; // +/-
    const duration = Math.max(1.5, 2 + extraDuration);

    el.style.left = `${startX}px`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.opacity = `${0.9 - Math.random() * 0.25}`;

    // small horizontal drift via transform animation override using CSS transition
    const drift = (Math.random() - 0.5) * 120;
    el.style.transform = `translateY(-10px) translateX(0px) rotate(${(Math.random()-0.5)*40}deg)`;

    container.appendChild(el);

    // remove element after animation finishes
    const removeMs = (duration + delay) * 1000 + 300;
    setTimeout(() => {
      el.remove();
    }, removeMs);
  }
}

// Spawn a single big heart from the Yes button on hover (one at a time)
let _singleHeartActive = false;
function spawnSingleHeart() {
  if (_singleHeartActive) return;
  _singleHeartActive = true;

  const el = document.createElement('div');
  el.className = 'single-heart';

  // use the regular heart emoji, spawn from the top of the viewport
  el.textContent = '❤️';

  // center horizontally over the Yes button, but start at the very top of the browser
  const yRect = yesBtn.getBoundingClientRect();
  const centerX = window.scrollX + yRect.left + yRect.width / 2;
  el.style.left = `${Math.max(8, centerX)}px`;
  el.style.top = `0px`;

  // make the fall slower and slightly randomized
  const extra = (Math.random() - 0.5) * 1.4; // +/- variation
  el.style.animationDuration = `${Math.max(2.2, 3.2 + extra)}s`;

  document.body.appendChild(el);

  el.addEventListener('animationend', () => {
    el.remove();
    _singleHeartActive = false;
  }, { once: true });
}

// show single falling heart when hovering the Yes button
yesBtn.addEventListener('mouseenter', () => spawnSingleHeart());

yesBtn.addEventListener("click", () => {
  window.location.href = 'yes.html';
});

// Move the "No" button away when the mouse gets close
noBtn.addEventListener("mouseenter", () => {
  const container = document.querySelector('.card') || document.body;
  const cRect = container.getBoundingClientRect();
  const bRect = noBtn.getBoundingClientRect();

  const currentOffsetX = bRect.left - cRect.left;
  const currentOffsetY = bRect.top - cRect.top;

  // Restore original smaller jump but clamp within the card
  const allowedMaxX = Math.max(cRect.width - bRect.width - 10, 0);
  const allowedMaxY = Math.max(cRect.height - bRect.height - 10, 0);

  const baseMaxX = 250;
  const baseMaxY = 80;

  const maxJumpX = Math.min(baseMaxX, allowedMaxX);
  const maxJumpY = Math.min(baseMaxY, allowedMaxY);

  const deltaX = (Math.random() - 0.5) * 2 * maxJumpX;
  const deltaY = (Math.random() - 0.5) * 2 * maxJumpY;

  let newOffsetX = currentOffsetX + deltaX;
  let newOffsetY = currentOffsetY + deltaY;

  newOffsetX = Math.max(0, Math.min(newOffsetX, allowedMaxX));
  newOffsetY = Math.max(0, Math.min(newOffsetY, allowedMaxY));

  const translateX = newOffsetX - currentOffsetX;
  const translateY = newOffsetY - currentOffsetY;

  noBtn.style.transform = `translate(${translateX}px, ${translateY}px)`;
  // spawn falling heartbreak emojis when the No button jumps
  spawnHeartbreaks();
});

// If the user clicks "No", navigate directly to the No page (no prompts)
noBtn.addEventListener("click", () => {
  window.location.href = 'no.html';
});
// =========================================================
// YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// MOBILE NAV
// =========================================================
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  navToggle.classList.toggle('open');
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMobile.classList.remove('open'));
});

// =========================================================
// WAVE RAIL — animated oscilloscope path (guitar / music motif)
// =========================================================
const wavePath = document.querySelector('.wave-path');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildWave(t) {
  const width = 200;
  const height = 2000;
  const points = 60;
  let d = `M 0 0`;
  for (let i = 0; i <= points; i++) {
    const y = (i / points) * height;
    const freq1 = 0.012;
    const freq2 = 0.028;
    const amp = 34 + 18 * Math.sin(y * 0.004 + t * 0.6);
    const x = 100
      + amp * Math.sin(y * freq1 + t)
      + (amp * 0.4) * Math.sin(y * freq2 - t * 1.4);
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

let waveT = 0;
function animateWave() {
  waveT += 0.006;
  if (wavePath) wavePath.setAttribute('d', buildWave(waveT));
  if (!reduceMotion) requestAnimationFrame(animateWave);
}

if (wavePath) {
  if (reduceMotion) {
    wavePath.setAttribute('d', buildWave(0));
  } else {
    animateWave();
  }
}

// =========================================================
// SCROLL REVEAL
// =========================================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// =========================================================
// SKILL BARS — fill on scroll into view
// =========================================================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const level = el.getAttribute('data-level');
      el.style.setProperty('--target-width', level + '%');
      // slight delay so it feels intentional, not instant
      setTimeout(() => el.classList.add('filled'), 120);
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(el => skillObserver.observe(el));

// =========================================================
// TIMELINE — mark items in-view (dot fill animation)
// =========================================================
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

timelineItems.forEach(el => timelineObserver.observe(el));

// =========================================================
// HERO NAME — per-character reveal on load
// =========================================================
function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char-reveal';
    span.style.animationDelay = `${0.35 + i * 0.045}s`;
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
  });
}

document.querySelectorAll('.hero-name .line').forEach(splitChars);

// =========================================================
// HERO TERMINAL — typewriter effect
// =========================================================
const terminalEl = document.getElementById('typedTerminal');

const terminalLines = [
  { prompt: '$ cat about.txt', out: 'Roshan Thapa — 19 — Nepal' },
  { prompt: '$ node skills.js', out: 'C, C++, Python, JS, SQL/NoSQL, Git' },
  { prompt: '$ echo $HOBBIES', out: 'logic-building, guitar, music' },
  { prompt: '$ ./status', out: 'Open to internships & collaboration_' }
];

async function typeLine(text, container, speed = 26) {
  for (const ch of text) {
    container.textContent += ch;
    await new Promise(r => setTimeout(r, speed));
  }
}

async function runTerminal() {
  if (!terminalEl) return;

  if (reduceMotion) {
    terminalEl.innerHTML = terminalLines
      .map(l => `<span class="prompt">${l.prompt}</span><span class="out">${l.out}</span>`)
      .join('');
    return;
  }

  for (const line of terminalLines) {
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    terminalEl.appendChild(promptSpan);
    await typeLine(line.prompt, promptSpan, 22);
    await new Promise(r => setTimeout(r, 180));

    const outSpan = document.createElement('span');
    outSpan.className = 'out';
    terminalEl.appendChild(outSpan);
    await typeLine(line.out, outSpan, 14);
    await new Promise(r => setTimeout(r, 350));
  }

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  terminalEl.appendChild(cursor);
}

// start typing once hero is visible / after brief delay for load feel
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(runTerminal, 500);
});

// =========================================================
// NAV — active link highlight on scroll
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a, .nav-mobile a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      link.style.color = 'var(--white)';
    }
  });
}, { threshold: 0.5, rootMargin: '-80px 0px -50% 0px' });

sections.forEach(sec => navObserver.observe(sec));

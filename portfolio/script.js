/* ── DOM refs ───────────────────────────────────────────────── */
const nav          = document.getElementById('nav');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.querySelector('.nav__links');
const scrollTopBtn = document.getElementById('scrollTop');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Nav: scroll shadow + hamburger ─────────────────────────── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
});

// close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

/* ── Typed-text hero effect ─────────────────────────────────── */
const phrases = [
  'Senior Technical Project Manager',
  'Senior Program Manager',
  'PMP-Certified Leader',
  'Cloud & AI Specialist',
  'Agile Practitioner',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (deleting) {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
  } else {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
  }

  let delay = deleting ? 50 : 100;
  if (!deleting && charIdx === current.length) {
    delay = 1800;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting  = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay     = 400;
  }
  setTimeout(typeLoop, delay);
}

if (prefersReducedMotion) {
  typedEl.textContent = phrases[0];
} else {
  typeLoop();
}

/* ── Scroll-reveal (IntersectionObserver) ───────────────────── */
const revealTargets = document.querySelectorAll(
  '.section__title, .about__text, .about__stats, .skill-card, ' +
  '.project-card, .timeline__item, .contact__cta, .contact__socials, .stat'
);

if (!prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // stagger siblings slightly
        const siblings = [...entry.target.parentElement.children];
        const delay    = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ── Animated counters (About stats) ────────────────────────── */
const statNumbers = document.querySelectorAll('.stat__number');

if (prefersReducedMotion) {
  statNumbers.forEach(el => { el.textContent = el.dataset.target; });
} else {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current  = 0;
      const step   = Math.ceil(target / 50);
      const tick   = () => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

/* ── Project filter ─────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Scroll-to-top button ───────────────────────────────────── */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ── Footer year ────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

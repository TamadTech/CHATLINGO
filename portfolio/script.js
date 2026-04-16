/* ── DOM refs ───────────────────────────────────────────────── */
const nav         = document.getElementById('nav');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.querySelector('.nav__links');
const scrollTopBtn = document.getElementById('scrollTop');

/* ── Nav: scroll shadow + hamburger ─────────────────────────── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Typed-text hero effect ─────────────────────────────────── */
const phrases = [
  'Full-Stack Developer',
  'UI/UX Enthusiast',
  'Open-Source Contributor',
  'Problem Solver',
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
typeLoop();

/* ── Scroll-reveal (IntersectionObserver) ───────────────────── */
const revealTargets = document.querySelectorAll(
  '.section__title, .about__text, .about__stats, .skill-card, ' +
  '.project-card, .timeline__item, .contact__form, .contact__socials, .stat'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
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

/* ── Animated counters (About stats) ────────────────────────── */
const statNumbers = document.querySelectorAll('.stat__number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 50);
    const tick   = () => {
      current = Math.min(current + step, target);
      el.textContent = current + (target >= 100 ? '+' : '+');
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ── Skill-bar animation ────────────────────────────────────── */
const skillBars = document.querySelectorAll('.skill-bar__fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const bar = entry.target;
    bar.style.width = bar.dataset.width + '%';
    barObserver.unobserve(bar);
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));

/* ── Project filter ─────────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Contact form validation ────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function validate() {
  let ok = true;

  const name      = document.getElementById('name');
  const nameErr   = document.getElementById('nameError');
  const email     = document.getElementById('email');
  const emailErr  = document.getElementById('emailError');
  const message   = document.getElementById('message');
  const msgErr    = document.getElementById('messageError');

  // name
  if (name.value.trim().length < 2) {
    nameErr.textContent = 'Please enter your name.';
    name.classList.add('invalid');
    ok = false;
  } else {
    nameErr.textContent = '';
    name.classList.remove('invalid');
  }

  // email
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.value.trim())) {
    emailErr.textContent = 'Please enter a valid email address.';
    email.classList.add('invalid');
    ok = false;
  } else {
    emailErr.textContent = '';
    email.classList.remove('invalid');
  }

  // message
  if (message.value.trim().length < 10) {
    msgErr.textContent = 'Message must be at least 10 characters.';
    message.classList.add('invalid');
    ok = false;
  } else {
    msgErr.textContent = '';
    message.classList.remove('invalid');
  }

  return ok;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  // Simulate async submit
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;

  setTimeout(() => {
    form.reset();
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled    = false;
    formSuccess.style.display = 'block';
    setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
  }, 1200);
});

/* ── Scroll-to-top button ───────────────────────────────────── */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Footer year ────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

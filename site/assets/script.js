/* Wayne Jones CPA — site interactions */

// === Sticky header ===
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 24), { passive: true });

// === Mobile nav ===
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// === Scroll reveals ===
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach(el => io.observe(el));
}

// === Lead form ===
const form = document.querySelector('.lead-form');
if (form) form.addEventListener('submit', async (e) => {
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) return; // let native validation show
  e.preventDefault();
  const placeholder = form.action.includes('FORMSPREE_ID');
  if (placeholder) {
    status.className = 'form-status ok';
    status.textContent = 'Thanks! This is a demo — connect a Formspree ID to receive real submissions.';
    form.reset();
    return;
  }
  status.textContent = 'Sending…'; status.className = 'form-status';
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (res.ok) { status.className = 'form-status ok'; status.textContent = 'Thanks — we\'ll be in touch shortly.'; form.reset(); }
    else throw new Error();
  } catch { status.className = 'form-status err'; status.textContent = 'Something went wrong — please call (706) 232-8565.'; }
});

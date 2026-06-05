/* ============================================================
   Wayne H. Jones, CPA — "Engraved" site interactions
   Vanilla JS, no dependencies. All listeners null-guarded.
   Respects prefers-reduced-motion (shows final states).
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveals + hairline draw ---------- */
  (function reveals() {
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal, .reveal-clip'));
    var ruleEls = Array.prototype.slice.call(document.querySelectorAll('[data-rule]'));
    var all = revealEls.concat(ruleEls);
    if (!all.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      all.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    all.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Number count-ups ---------- */
  (function countUps() {
    var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length) return;

    function paint(el, value) {
      var pad = parseInt(el.getAttribute('data-pad'), 10);
      var str = String(value);
      if (pad && str.length < pad) {
        while (str.length < pad) { str = '0' + str; }
      }
      el.textContent = str;
    }

    function run(el) {
      var target = parseInt(el.getAttribute('data-to'), 10);
      if (isNaN(target)) return;
      if (reduceMotion) { paint(el, target); return; }

      var duration = 1300;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - p, 3);
        paint(el, Math.round(target * eased));
        if (p < 1) {
          window.requestAnimationFrame(step);
        } else {
          paint(el, target);
        }
      }
      window.requestAnimationFrame(step);
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
      nums.forEach(function (el) {
        var t = parseInt(el.getAttribute('data-to'), 10);
        if (!isNaN(t)) paint(el, t);
      });
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Sticky header condense ---------- */
  (function header() {
    var bar = document.querySelector('[data-header]');
    if (!bar) return;
    var ticking = false;
    function update() {
      if (window.scrollY > 24) {
        bar.classList.add('is-condensed');
      } else {
        bar.classList.remove('is-condensed');
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  /* ---------- Mobile nav (toggle + Escape + focus return) ---------- */
  (function mobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    function open() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
    }
    function close(returnFocus) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        close(false);
      } else {
        open();
      }
    });

    // Close when a nav link is chosen
    nav.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.tagName === 'A') close(false);
    });

    // Escape closes and returns focus to the toggle
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && nav.classList.contains('is-open')) {
        close(true);
      }
    });

    // Reset state if resized up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && nav.classList.contains('is-open')) {
        close(false);
      }
    });
  })();

  /* ---------- Contact form (demo-success fallback) ---------- */
  (function leadForm() {
    var form = document.querySelector('[data-lead-form]');
    if (!form) return;
    var status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', function (e) {
      // If a real Formspree ID is wired in, let the POST proceed normally.
      var action = form.getAttribute('action') || '';
      if (action.indexOf('FORMSPREE_ID') === -1) return;

      // Otherwise, demo mode: intercept and confirm in-page.
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      if (status) {
        status.textContent = 'Thank you — your request has been noted. Wayne will be in touch shortly.';
        status.classList.add('is-success');
      }
      form.reset();
    });
  })();

})();

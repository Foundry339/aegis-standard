/*
 * Aegis Standard, site interactions
 * No dependencies. Handles: mobile nav toggle, in-page smooth scroll
 * with nav auto-close, footer year, and the Book an Event form.
 */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  function closeNav() {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleNav() {
    var isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', toggleNav);

    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Book an Event form ---------- */
  var eventForm = document.getElementById('event-form');
  var formStatus = document.getElementById('form-status');

  if (eventForm && formStatus) {
    var requiredFields = eventForm.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      field.addEventListener('blur', function () {
        field.setAttribute('data-touched', 'true');
      });
    });

    eventForm.addEventListener('submit', function (event) {
      if (!eventForm.checkValidity()) {
        event.preventDefault();
        requiredFields.forEach(function (field) {
          field.setAttribute('data-touched', 'true');
        });
        formStatus.textContent = 'Please fill in all required fields before submitting.';
        formStatus.className = 'form-status error';
        return;
      }

      // No backend is wired up on this demo (action="#"). When a real
      // endpoint (e.g. Formspree) is set on the form's action attribute,
      // remove this block so the native submission goes through.
      var actionUrl = eventForm.getAttribute('action');
      if (!actionUrl || actionUrl === '#') {
        event.preventDefault();
        formStatus.textContent = 'Thanks, request received. This demo form is not connected to a live inbox yet, connect it to Formspree or similar to go live.';
        formStatus.className = 'form-status success';
        eventForm.reset();
        requiredFields.forEach(function (field) {
          field.removeAttribute('data-touched');
        });
      }
    });
  }

  /* ---------- Subtle reveal-on-scroll for cards ---------- */
  var revealTargets = document.querySelectorAll('.card, .about-media, .about-content');

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      el.style.transition = 'opacity 420ms ease, transform 420ms ease';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }
})();

// Simple SPA navigation + mobile sidebar toggle
(function () {
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('.content-section'));
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');

  function showSection(hash) {
    const id = (hash || '#about').replace('#', '');
    sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    if (window.matchMedia('(max-width: 768px)').matches) {
      sidebar.classList.remove('open');
    }
    // scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.getAttribute('href');
      history.replaceState(null, '', target);
      showSection(target);
    });
  });

  showSection(location.hash);

  toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });
})();
// === Contact form -> Google Sheets (Apps Script Web App) ===
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Your deployed Apps Script Web App URL:
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7v1dckxOLMEQIsRw0_YPUODrl6LM38gqx5KXw3Uhmeff1hp915G60ShGElNzD-U0l/exec';

  const statusEl = document.getElementById('contact-status');
  const submitBtn = form.querySelector('.submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    submitBtn.disabled = true;
    const original = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: new FormData(form),           // multipart/form-data (no manual headers)
        headers: { 'Accept': 'application/json' }
      });

      let ok = res.ok;
      try {
        const data = await res.json();
        ok = ok && (data.ok !== false);
      } catch (_) { /* ignore parse error; many deployments still succeed */ }

      if (ok) {
        form.reset();
        statusEl.textContent = 'Thanks! Your message has been sent.';
        statusEl.className = 'form-status';
        // Optional: focus the status for screen readers
        statusEl.tabIndex = -1; statusEl.focus();
      } else {
        statusEl.textContent = 'Hmm, something went wrong. Please try again or email me directly.';
        statusEl.className = 'form-status error';
      }
    } catch {
      statusEl.textContent = 'Network error. Please try again.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
})();

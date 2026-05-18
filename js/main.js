// ===========================
// DIPROXY INTERACTIVE SCRIPTS
// ===========================

// Scroll fade-in observer
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    // Close on link click
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // Highlight active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === currentPage) a.classList.add('active');
  });
});

// ===========================
// COUNTDOWN TIMER (games.html)
// ===========================
function startCountdown(targetId, deadlineKey, daysFromNow) {
  const el = document.getElementById(targetId);
  if (!el) return;

  let deadline = localStorage.getItem(deadlineKey);
  if (!deadline) {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    deadline = d.toISOString();
    localStorage.setItem(deadlineKey, deadline);
  }

  function update() {
    const now = new Date();
    const end = new Date(deadline);
    let diff = end - now;
    if (diff < 0) diff = 0;

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    el.innerHTML =
      `<span class="cd-unit"><span class="cd-num">${String(days).padStart(2,'0')}</span><span class="cd-label">Days</span></span>` +
      `<span class="cd-sep">:</span>` +
      `<span class="cd-unit"><span class="cd-num">${String(hours).padStart(2,'0')}</span><span class="cd-label">Hrs</span></span>` +
      `<span class="cd-sep">:</span>` +
      `<span class="cd-unit"><span class="cd-num">${String(mins).padStart(2,'0')}</span><span class="cd-label">Min</span></span>` +
      `<span class="cd-sep">:</span>` +
      `<span class="cd-unit"><span class="cd-num">${String(secs).padStart(2,'0')}</span><span class="cd-label">Sec</span></span>`;
  }

  update();
  setInterval(update, 1000);
}

// ===========================
// CONTACT FORM VALIDATION (contact.html)
// ===========================
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    form.querySelectorAll('.field-input').forEach(el => el.classList.remove('error'));

    // Validate Name
    const name = document.getElementById('name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('name-error', 'Please enter your full name.');
      name.classList.add('error');
      valid = false;
    }

    // Validate Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError('email-error', 'Please enter a valid email address.');
      email.classList.add('error');
      valid = false;
    }

    // Validate Subject
    const subject = document.getElementById('subject');
    if (!subject.value) {
      showError('subject-error', 'Please select a subject.');
      subject.classList.add('error');
      valid = false;
    }

    // Validate Message
    const message = document.getElementById('message');
    if (!message.value.trim() || message.value.trim().length < 20) {
      showError('message-error', 'Message must be at least 20 characters.');
      message.classList.add('error');
      valid = false;
    }

    if (valid) {
      showSuccess();
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.field-input').forEach(input => {
    input.addEventListener('blur', function() {
      this.classList.remove('error');
      const errId = this.id + '-error';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function showSuccess() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form && success) {
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      success.style.opacity = '0';
      setTimeout(() => {
        success.style.opacity = '1';
        success.style.transform = 'translateY(0)';
      }, 50);
    }, 400);
  }
}

// ===========================
// ANIMATED COUNTER (index.html stats)
// ===========================
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// Run counter animation when stats section is visible
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-row');
  if (statsSection) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounters(); obs.disconnect(); } });
    }, { threshold: 0.5 });
    obs.observe(statsSection);
  }
});

// Init contact form
document.addEventListener('DOMContentLoaded', setupContactForm);

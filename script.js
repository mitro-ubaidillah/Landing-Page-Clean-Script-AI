const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu?.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll('#mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
  });
});

const waitlistForm = document.querySelector('#waitlist-form');
const emailInput = document.querySelector('#email');
const formMessage = document.querySelector('.form-message');

// URL deployment Google Apps Script web app (lihat waitlist-appscript/Code.gs).
// Ganti dengan URL /exec milikmu setelah deploy web app.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec';

waitlistForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!email || !emailInput.validity.valid) {
    formMessage.textContent = 'Masukkan alamat email yang valid terlebih dahulu.';
    formMessage.classList.add('error');
    emailInput.focus();
    return;
  }

  const submitBtn = waitlistForm.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  formMessage.classList.remove('error');
  formMessage.textContent = 'Mengirim...';

  try {
    // Apps Script web app: fire-and-forget dengan mode no-cors (bodynya berupa
    // JSON string — dikirim sebagai text/plain agar tidak memicu preflight CORS).
    // Response tidak bisa dibaca, karenanya UI bersifat optimistik.
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ email }),
    });
    formMessage.textContent = 'Terima kasih! Email kamu tercatat — kami akan mengabari saat CleanScript AI siap.';
    emailInput.value = '';
  } catch (err) {
    formMessage.classList.add('error');
    formMessage.textContent = 'Gagal mengirim. Coba lagi, atau hubungi kami langsung.';
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

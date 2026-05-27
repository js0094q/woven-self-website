const hamburgerBtn = document.querySelector('.hamburger');
const closeMobileNavBtn = document.getElementById('close-mobile-nav');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavPanel = document.getElementById('mobile-nav-panel');

const toggleNav = () => {
  const isExpanded = hamburgerBtn?.getAttribute('aria-expanded') === 'true';
  hamburgerBtn?.setAttribute('aria-expanded', String(!isExpanded));
  mobileNav?.classList.toggle('translate-x-full');
  mobileNavPanel?.classList.toggle('hidden');
};

if (hamburgerBtn && mobileNav && mobileNavPanel && closeMobileNavBtn) {
  hamburgerBtn.addEventListener('click', toggleNav);
  closeMobileNavBtn.addEventListener('click', toggleNav);
  mobileNavPanel.addEventListener('click', toggleNav);

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileNav.classList.contains('translate-x-full')) toggleNav();
    });
  });
}

const launchForm = document.getElementById('launch-form');
const launchSubmit = document.getElementById('launch-submit');
const launchSuccess = document.getElementById('launch-success');
const launchError = document.getElementById('launch-error');

const serializeLaunchForm = (form) => {
  const formData = new FormData(form);
  const payload = {};

  formData.forEach((value, key) => {
    if (!key) return;
    payload[key] = value;
  });

  payload._source = window.location.pathname;
  return payload;
};

if (launchForm && launchSubmit && launchSuccess && launchError) {
  launchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const honeypot = launchForm.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim()) {
      launchForm.reset();
      return;
    }

    if (!launchForm.checkValidity()) {
      launchForm.reportValidity();
      return;
    }

    launchSubmit.disabled = true;
    launchSubmit.textContent = 'Sending...';
    launchSuccess.classList.add('hidden');
    launchError.classList.add('hidden');

    try {
      const response = await fetch(launchForm.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serializeLaunchForm(launchForm))
      });

      if (!response.ok) throw new Error('Launch list signup failed');

      launchForm.classList.add('hidden');
      launchSuccess.classList.remove('hidden');
    } catch (error) {
      launchSubmit.disabled = false;
      launchSubmit.textContent = 'Notify Me';
      launchError.classList.remove('hidden');
    }
  });
}

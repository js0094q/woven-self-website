(() => {
  'use strict';

  const menu = document.getElementById('mobile-nav');
  const backdrop = document.getElementById('mobile-nav-panel');
  const openButton = document.querySelector('.hamburger');
  const closeButton = document.getElementById('close-mobile-nav');
  const desktopBreakpoint = window.matchMedia('(min-width: 1151px)');
  let menuOpen = false;
  let previousFocus = null;
  let savedScrollY = 0;
  let savedBodyStyles = null;
  let backgroundState = [];

  const focusableSelector = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusableItems = () => {
    if (!menu) return [];
    return [...menu.querySelectorAll(focusableSelector)].filter((item) => (
      !item.hidden && item.getAttribute('aria-hidden') !== 'true'
      && item.getClientRects().length > 0
    ));
  };

  const setBackgroundInert = (inert) => {
    const backgroundNodes = [...document.body.children].filter((node) => (
      node !== menu && node !== backdrop && node.tagName !== 'SCRIPT'
    ));

    if (inert) {
      backgroundState = backgroundNodes.map((node) => ({ node, inert: node.inert }));
      backgroundNodes.forEach((node) => { node.inert = true; });
    } else {
      backgroundState.forEach(({ node, inert: wasInert }) => {
        if (node.isConnected) node.inert = wasInert;
      });
      backgroundState = [];
    }
  };

  const lockScroll = () => {
    savedScrollY = window.scrollY;
    savedBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  };

  const unlockScroll = () => {
    if (!savedBodyStyles) return;
    Object.entries(savedBodyStyles).forEach(([property, value]) => {
      document.body.style[property] = value;
    });
    savedBodyStyles = null;
    window.scrollTo(0, savedScrollY);
  };

  const closeMenu = ({ restoreFocus = true, focusTarget = null } = {}) => {
    if (!menu || !backdrop || !menuOpen) return;
    menuOpen = false;
    menu.hidden = true;
    menu.classList.add('hidden');
    menu.inert = true;
    menu.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    backdrop.classList.add('hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    openButton?.setAttribute('aria-expanded', 'false');
    setBackgroundInert(false);
    unlockScroll();
    if (restoreFocus || focusTarget) {
      const target = focusTarget || (previousFocus?.isConnected ? previousFocus : openButton);
      if (target instanceof HTMLElement && !target.inert) target.focus();
    }
    previousFocus = null;
  };

  const openMenu = () => {
    if (!menu || !backdrop || menuOpen || desktopBreakpoint.matches) return;
    menuOpen = true;
    previousFocus = document.activeElement;
    lockScroll();
    setBackgroundInert(true);
    menu.hidden = false;
    menu.inert = false;
    menu.classList.remove('hidden');
    menu.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    backdrop.classList.remove('hidden');
    backdrop.setAttribute('aria-hidden', 'false');
    openButton?.setAttribute('aria-expanded', 'true');
    (closeButton || getFocusableItems()[0] || menu).focus();
  };

  if (menu && backdrop && openButton && closeButton) {
    menu.inert = true;
    menu.hidden = true;
    menu.classList.add('hidden');
    menu.setAttribute('aria-hidden', 'true');
    backdrop.hidden = true;
    backdrop.classList.add('hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    openButton.setAttribute('aria-expanded', 'false');

    openButton.addEventListener('click', openMenu);
    closeButton.addEventListener('click', () => closeMenu());
    backdrop.addEventListener('click', () => closeMenu());

    menu.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      const samePageFragment = destination.origin === window.location.origin
        && destination.pathname === window.location.pathname
        && destination.search === window.location.search
        && destination.hash.length > 1;
      const fragmentTarget = samePageFragment
        ? document.getElementById(decodeURIComponent(destination.hash.slice(1)))
        : null;

      closeMenu();
      if (fragmentTarget) {
        if (!fragmentTarget.hasAttribute('tabindex')) fragmentTarget.setAttribute('tabindex', '-1');
        window.requestAnimationFrame(() => fragmentTarget.focus());
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = getFocusableItems();
      if (items.length === 0) {
        event.preventDefault();
        menu.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !menu.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !menu.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });

    desktopBreakpoint.addEventListener('change', (event) => {
      if (!event.matches) return;
      const focusWasInMenu = menu.contains(document.activeElement);
      const primaryNavLink = document.querySelector('.nav a[href]');
      closeMenu({ restoreFocus: false, focusTarget: focusWasInMenu ? primaryNavLink : null });
    });
  }

  const form = document.querySelector('.contact-form');
  const formContainer = document.getElementById('contact-form-container');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('form-error-message');
  const submitButton = form?.querySelector('[type="submit"]');

  if (form && formContainer && successMessage && errorMessage && submitButton) {
    successMessage.setAttribute('role', 'status');
    successMessage.setAttribute('aria-live', 'polite');
    successMessage.setAttribute('tabindex', '-1');
    errorMessage.setAttribute('role', 'alert');
    errorMessage.setAttribute('aria-live', 'assertive');
    errorMessage.setAttribute('tabindex', '-1');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity() || submitButton.disabled) return;

      const endpoint = new URL(form.action, window.location.href);
      if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'formspree.io') {
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
        errorMessage.focus();
        return;
      }

      const submitLabel = submitButton.querySelector('.btn-label') || submitButton;
      const originalText = submitLabel.textContent;
      submitButton.disabled = true;
      submitLabel.textContent = 'Sending...';
      errorMessage.classList.add('hidden');
      successMessage.classList.add('hidden');

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);

      try {
        const response = await fetch(endpoint.href, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Submission failed');

        formContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.focus();
      } catch {
        errorMessage.classList.remove('hidden');
        errorMessage.focus();
        submitButton.disabled = false;
        submitLabel.textContent = originalText;
      } finally {
        window.clearTimeout(timeoutId);
      }
    });
  }
})();

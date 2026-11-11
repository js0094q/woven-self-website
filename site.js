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

  // Enhance existing inquiry links; their secure destinations remain the no-JS fallback.
  const inquiryLinks = [...document.querySelectorAll('a[href="https://thewovenself.clientsecure.me/contact-widget"]')];
  if (!inquiryLinks.length || typeof HTMLDialogElement === 'undefined') return;

  const contact = document.createElement('dialog');
  contact.id = 'woven-contact';
  contact.className = 'woven-contact';
  contact.setAttribute('aria-labelledby', 'woven-contact-title');
  contact.innerHTML = `
    <button class="woven-contact-close" type="button" aria-label="Close contact options" autofocus>×</button>
    <img class="woven-contact-logo" src="/images/logo.png" alt="The Woven Self — Every part has a voice. Every thread tells a story.">
    <h2 id="woven-contact-title">Contact Woven Self</h2>
    <p class="woven-contact-intro">Choose the right place to connect.</p>
    <div class="woven-contact-actions">
      <a href="https://thewovenself.clientsecure.me/contact-widget" target="_blank" rel="noopener noreferrer"><span><strong>Contact Loren</strong><small>Clinical inquiries · secure SimplePractice form</small></span><span aria-hidden="true">↗</span></a>
      <a href="https://thewovenself.clientsecure.me/request" target="_blank" rel="noopener noreferrer"><span><strong>Request an Appointment</strong><small>Explore availability through SimplePractice</small></span><span aria-hidden="true">↗</span></a>
      <a href="mailto:joseph@wovenself.com"><span><strong>Contact Joseph</strong><small>Practice administration, insurance &amp; billing</small></span><span aria-hidden="true">↗</span></a>
    </div>
    <p class="woven-contact-privacy">SimplePractice opens in a new tab. Please keep clinical details there, not in email.</p>
    <a class="woven-contact-portal" href="https://thewovenself.clientsecure.me/sign-in" target="_blank" rel="noopener noreferrer">Existing clients: sign in to your portal ↗</a>`;
  document.body.append(contact);
  let contactTrigger = null;
  let contactOverflow = '';
  const restoreContactFocus = () => contactTrigger?.focus({ preventScroll: true });
  const closeContact = () => {
    if (!contact.open) return;
    contact.close();
    document.body.style.overflow = contactOverflow;
    restoreContactFocus();
  };
  contact.querySelector('button').addEventListener('click', closeContact);
  contact.addEventListener('cancel', (event) => { event.preventDefault(); closeContact(); });
  contact.addEventListener('click', (event) => {
    if (event.target !== contact) return;
    const box = contact.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeContact();
  });
  contact.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...contact.querySelectorAll('button, a[href]')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  // Use verified hosted SimplePractice flows: the embedded client's close
  // control did not work during integration QA. No clinical data touches this site.
  contact.addEventListener('click', (event) => {
    const action = event.target.closest('a');
    if (!action) return;
    closeContact();
  }, true);
  inquiryLinks.forEach((link) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', contact.id);
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const fromMobileMenu = menu?.contains(link);
      closeMenu({ restoreFocus: false });
      contactTrigger = fromMobileMenu ? openButton : link;
      contactOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      contact.showModal();
    });
  });
})();

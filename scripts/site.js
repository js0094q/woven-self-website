(() => {
  'use strict';

  const STORAGE_KEYS = {
    exitIntent: 'woven_exit_intent_dismissed_v1',
    memoirSequence: 'wovenself_memoir_sequence_progress_v1',
    memoirLeadMagnet: 'wovenself_memoir_lead_magnet_v1'
  };

  const MEMOIR_SEQUENCE_STEPS = [
    {
      title: 'Welcome + Excerpt',
      description: 'Email 1 in your memoir sequence: Welcome + excerpt.',
      ctaText: 'Open First Chapter PDF',
      ctaHref: '/unfolding-origami#lead-magnets'
    },
    {
      title: 'Story Behind the Memoir',
      description: 'Email 2 in your memoir sequence: Story behind the memoir.',
      ctaText: 'Read the Story of the Memoir',
      ctaHref: '/unfolding-origami#about-book'
    },
    {
      title: 'Healing Themes',
      description: 'Email 3 in your memoir sequence: Healing themes and emotional threads.',
      ctaText: 'Explore the Emotional Threads Guide',
      ctaHref: '/unfolding-origami#about-book'
    },
    {
      title: 'Launch Updates',
      description: 'Email 4 in your memoir sequence: Launch updates and next milestones.',
      ctaText: 'See upcoming events',
      ctaHref: '/unfolding-origami#events-heading'
    },
    {
      title: 'Preorder CTA',
      description: 'Email 5 in your memoir sequence: Preorder CTA.',
      ctaText: 'Join the preorder list',
      ctaHref: '/unfolding-origami#launch'
    }
  ];

  const clampMemoirStep = (step) => {
    const total = MEMOIR_SEQUENCE_STEPS.length;
    const safeStep = Number.parseInt(step, 10);
    if (!Number.isFinite(safeStep) || safeStep < 1) return 1;
    return Math.min(safeStep, total);
  };

  const sequenceStorageGet = (key, fallback = null) => {
    try {
      const value = window.localStorage.getItem(key);
      return value !== null ? value : fallback;
    } catch (_error) {
      return fallback;
    }
  };

  const sequenceStorageSet = (key, value) => {
    try {
      if (value === null || value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
    } catch (_error) {
      return;
    }
  };

  const normalizeSequenceEmail = (value) => {
    if (!value) return '';
    return String(value).trim().toLowerCase();
  };

  const getMemoirSequenceState = () => {
    const rawState = sequenceStorageGet(STORAGE_KEYS.memoirSequence, '{}');
    try {
      return JSON.parse(rawState || '{}') || {};
    } catch (_error) {
      return {};
    }
  };

  const setMemoirSequenceState = (state) => {
    if (!state || typeof state !== 'object') return;
    sequenceStorageSet(STORAGE_KEYS.memoirSequence, JSON.stringify(state));
  };

  const getMemoirSequenceStep = (emailValue) => {
    const email = normalizeSequenceEmail(emailValue);
    if (!email) {
      return 1;
    }

    const state = getMemoirSequenceState();
    return clampMemoirStep(state[email] || 1);
  };

  const advanceMemoirSequenceStep = (emailValue) => {
    const email = normalizeSequenceEmail(emailValue);
    if (!email) return 1;

    const state = getMemoirSequenceState();
    const current = clampMemoirStep(state[email] || 1);
    const next = clampMemoirStep(current + 1);
    state[email] = next;
    setMemoirSequenceState(state);
    return next;
  };

  const getStoredLeadMagnet = () => {
    const stored = sequenceStorageGet(STORAGE_KEYS.memoirLeadMagnet, '');
    return stored ? String(stored) : '';
  };

  const setStoredLeadMagnet = (value) => {
    const cleaned = value ? String(value).trim() : '';
    if (!cleaned) {
      sequenceStorageSet(STORAGE_KEYS.memoirLeadMagnet, '');
      return;
    }

    sequenceStorageSet(STORAGE_KEYS.memoirLeadMagnet, cleaned);
  };

  const FILE_DOWNLOAD_EXTENSIONS = /\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|zip|jpg|jpeg|png|webp|gif|svg|mp3|mp4|mov)$/i;

  const toSnakeCase = (value) => value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();

  const toTrackPayload = (target, fallback) => {
    const payload = {
      target: fallback
    };

    if (!target || !target.dataset) {
      return payload;
    }

    Object.keys(target.dataset).forEach((key) => {
      if (key === 'trackAction') return;
      const normalizedKey = toSnakeCase(key.replace(/^track/, ''));
      if (normalizedKey) {
        payload[normalizedKey] = target.dataset[key];
      }
    });

    return payload;
  };

  const ensureHiddenField = (form, name, value) => {
    if (!form || !name) return;

    let field = form.querySelector(`input[name="${name}"]`);
    if (!field) {
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      form.appendChild(field);
    }

    field.value = value == null ? '' : String(value);
  };

  const syncMemoirLeadMagnetToForms = () => {
    const storedLeadMagnet = getStoredLeadMagnet();
    if (!storedLeadMagnet) return;

    document.querySelectorAll('form[data-api-form][data-form="memoir_launch"]').forEach((form) => {
      ensureHiddenField(form, 'lead_magnet', storedLeadMagnet);
    });
  };

  const getMemoirSequenceTemplate = (step) => {
    const safeStep = clampMemoirStep(step);
    return MEMOIR_SEQUENCE_STEPS[safeStep - 1] || MEMOIR_SEQUENCE_STEPS[MEMOIR_SEQUENCE_STEPS.length - 1];
  };

  const renderMemoirSequencePanel = (form, step) => {
    const safeStep = clampMemoirStep(step);
    const container = form.closest('.launch-form-card') || form.parentElement;
    if (!container) return;

    const existing = container.querySelector('[data-memoir-sequence]');
    if (existing) {
      existing.remove();
    }

    const template = getMemoirSequenceTemplate(safeStep);
    const panel = document.createElement('div');
    panel.className = 'memoir-sequence-card';
    panel.setAttribute('data-memoir-sequence', '1');

    panel.innerHTML = `
      <p class="memoir-sequence-step">Memoir sequence email ${safeStep} of ${MEMOIR_SEQUENCE_STEPS.length}</p>
      <h3>${template.title}</h3>
      <p>${template.description}</p>
      <a
        href="${template.ctaHref}"
        class="btn-secondary inline-flex mt-3"
        data-track-action="memoir_cta_click"
      >
        ${template.ctaText}
      </a>
    `;

    container.appendChild(panel);
  };

  const setMemoirSequenceMetadata = (form, emailValue) => {
    const currentStep = getMemoirSequenceStep(emailValue);
    ensureHiddenField(form, 'sequence_name', 'memoir_launch');
    ensureHiddenField(form, 'sequence_step', String(currentStep));

    const storedLeadMagnet = getStoredLeadMagnet();
    if (storedLeadMagnet) {
      ensureHiddenField(form, 'lead_magnet', storedLeadMagnet);
    }

    return currentStep;
  };

  const parseHref = (value) => {
    if (!value) return null;
    try {
      return new URL(value, window.location.href);
    } catch (_error) {
      return null;
    }
  };

  const isLikelyFileDownload = (href, target) => {
    if (!href) return false;
    if (target && target.hasAttribute && target.hasAttribute('download')) return true;

    const parsed = parseHref(href);
    if (!parsed) return false;
    const path = (parsed.pathname || '').toLowerCase();
    return FILE_DOWNLOAD_EXTENSIONS.test(path);
  };

  const isSignupForm = (formType, formName) => {
    const value = `${formType || formName || ''}`.toLowerCase();
    if (!value) return false;

    return value.includes('memoir') || value.includes('launch') || value.includes('signup') || value.includes('newsletter');
  };

  const track = (action, params = {}) => {
    if (window.wovenTrack) {
      window.wovenTrack(action, params);
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, params);
    }
  };

  const ensureExitIntentModal = () => {
    if (document.getElementById('exit-intent-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'exit-intent-modal';
    modal.className = 'exit-intent hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Join the memoir launch list');
    modal.innerHTML = `
      <div class="exit-intent-inner">
        <button type="button" class="exit-intent-close" data-exit-intent-close aria-label="Close">&times;</button>
        <h2 class="font-serif text-2xl">Before you leave</h2>
        <p class="mt-2">Receive launch notes and memoir updates from Loren.</p>
        <form
          action="/api/forms"
          method="POST"
          data-api-form
          data-form="memoir_exit"
          class="mt-4 space-y-3"
          data-form-success="You&rsquo;re on the Memoir Launch List."
        >
          <input type="hidden" name="form_type" value="memoir_exit" />
          <input type="text" name="first_name" placeholder="First name" class="w-full" />
          <input name="email" type="email" placeholder="Email" required class="w-full" />
          <input type="text" name="website" autocomplete="off" class="hp-field" tabindex="-1" aria-hidden="true" />
          <input type="hidden" name="cf-turnstile-token" />
          <div data-turnstile data-turnstile-sitekey="1x00000000000000000000AA" aria-label="Cloudflare Turnstile"></div>
          <button class="btn-primary w-full" type="submit">Join the Memoir Launch List</button>
          <p class="form-state success hidden" data-form-success></p>
          <p class="form-state error hidden" data-form-error></p>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
  };

  const initNavigation = () => {
    const hamburgerBtn = document.querySelector('.hamburger');
    const closeMobileNavBtn = document.getElementById('close-mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');

    if (!hamburgerBtn || !closeMobileNavBtn || !mobileNav || !mobileNavPanel) {
      return;
    }

    const toggleNav = () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      const nextState = String(!isExpanded);
      hamburgerBtn.setAttribute('aria-expanded', nextState);
      mobileNav.classList.toggle('translate-x-full');
      mobileNavPanel.classList.toggle('hidden');
    };

    hamburgerBtn.addEventListener('click', toggleNav);
    closeMobileNavBtn.addEventListener('click', toggleNav);
    mobileNavPanel.addEventListener('click', toggleNav);

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!mobileNav.classList.contains('translate-x-full')) {
          toggleNav();
        }
      });
    });
  };

  const initTurnstile = async () => {
    const forms = document.querySelectorAll('[data-turnstile]');
    if (!forms.length) return;

    const loadTurnstileScript = () => new Promise((resolve, reject) => {
      if (typeof window.turnstile !== 'undefined') {
        resolve();
        return;
      }

      const existing = document.querySelector('script[data-woven-turnstile]');
      if (existing) {
        if (existing.getAttribute('data-woven-turnstile-ready') === '1') {
          resolve();
          return;
        }

        existing.addEventListener('load', () => {
          existing.setAttribute('data-woven-turnstile-ready', '1');
          resolve();
        });
        existing.addEventListener('error', () => reject(new Error('turnstile-script-error')));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.wovenTurnstile = '1';

      script.addEventListener('load', () => {
        script.setAttribute('data-woven-turnstile-ready', '1');
        resolve();
      });
      script.addEventListener('error', () => reject(new Error('turnstile-script-error')));
      document.head.appendChild(script);
    });

    try {
      await loadTurnstileScript();
    } catch (_error) {
      return;
    }

    forms.forEach((container) => {
      if (container.dataset.wovenTurnstileReady === '1') return;

      const form = container.closest('form');
      if (!form) return;

      const tokenInput = form.querySelector('input[name="cf-turnstile-token"]');
      if (!tokenInput) return;

      const sitekey = container.dataset.turnstileSitekey || window.WOVEN_TURNSTILE_SITE_KEY || '';
      if (!sitekey) return;

      window.turnstile.render(container, {
        sitekey,
        callback: (token) => {
          tokenInput.value = token || '';
        },
        'expired-callback': () => {
          tokenInput.value = '';
        },
        'error-callback': () => {
          tokenInput.value = '';
        }
      });

      container.dataset.wovenTurnstileReady = '1';
    });
  };

  const renderRequestState = (form, ok, options = {}) => {
    const success = form.querySelector('[data-form-success]');
    const error = form.querySelector('[data-form-error]');
    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = !ok;
      submitButton.textContent = ok ? submitButton.dataset.defaultText || submitButton.textContent : submitButton.textContent;
    }

    if (ok) {
      if (error) error.classList.add('hidden');
      if (success) {
        success.classList.remove('hidden');
        success.setAttribute('role', 'status');
      }
      if (options.message) {
        success.textContent = options.message;
      }
      form.classList.add('hidden');
      return;
    }

    if (error) {
      error.classList.remove('hidden');
      error.setAttribute('role', 'alert');
      error.textContent = options.message || 'The submission did not go through. Please try again.';
    }
  };

  const submitWithEndpoint = async (form, data) => {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload.message || payload.error || 'Submission failed';
      throw new Error(message);
    }

    return payload;
  };

  const serializeForm = (form) => {
    const formData = new FormData(form);
    const payload = {};

    formData.forEach((value, key) => {
      if (!key) return;
      payload[key] = value;
    });

    payload._source = window.location.pathname;

    return payload;
  };

  const initForms = () => {
    const forms = document.querySelectorAll('form[data-api-form]');
    if (!forms.length) return;

    forms.forEach((form) => {
      const submitButton = form.querySelector('[type="submit"]');
      const formTypeFromAttribute = (form.getAttribute('data-form') || '').toLowerCase();
      const isMemoirLaunch = formTypeFromAttribute === 'memoir_launch';
      const successMessage = form.getAttribute('data-form-success') || form.getAttribute('data-success-text') || 'Thank you. You are on the list.';
      if (submitButton && !submitButton.dataset.defaultText) {
        submitButton.dataset.defaultText = submitButton.textContent;
      }

      if (isMemoirLaunch) {
        syncMemoirLeadMagnetToForms();
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const hp = form.querySelector('input[name="website"]');
        if (hp && hp.value.trim()) {
          form.reset();
          return;
        }

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Submitting...';
        }

        const formError = form.querySelector('[data-form-error]');
        if (formError) {
          formError.classList.add('hidden');
        }

        try {
          const emailValue = (form.querySelector('input[name="email"]') || {}).value || '';
          const formType = form.getAttribute('data-form') || form.querySelector('input[name="form_type"]')?.value || 'lead_form';
          const normalizedType = `${formType}`.toLowerCase();
          const isEmail = isSignupForm(formType, normalizedType);
          const isMemoirLaunchSubmit = normalizedType === 'memoir_launch';
          let memoirSequenceStep = null;

          if (isMemoirLaunchSubmit) {
            memoirSequenceStep = setMemoirSequenceMetadata(form, emailValue);
          }

          const payload = serializeForm(form);
          const response = await submitWithEndpoint(form, payload);

          if (isEmail) {
            track('email_signup', {
              form_name: formType,
              source: payload._source || window.location.pathname
            });
          }

          if (normalizedType === 'memoir_launch') {
            track('memoir_launch_submit', {
              form_name: formType,
              source: payload._source || window.location.pathname,
              sequence_step: memoirSequenceStep,
              sequence_name: payload.sequence_name || 'memoir_launch',
              lead_magnet: payload.lead_magnet || ''
            });

            if (memoirSequenceStep) {
              advanceMemoirSequenceStep(emailValue);
              renderMemoirSequencePanel(form, memoirSequenceStep);
              track('memoir_sequence_step', {
                sequence_name: payload.sequence_name || 'memoir_launch',
                sequence_step: memoirSequenceStep,
                sequence_next_step: memoirSequenceStep >= MEMOIR_SEQUENCE_STEPS.length ? MEMOIR_SEQUENCE_STEPS.length : memoirSequenceStep + 1,
                lead_magnet: payload.lead_magnet || '',
                source: payload._source || window.location.pathname
              });
            }
          }

          track('form_submission', {
            form_name: formType,
            source: payload._source || window.location.pathname,
            status: response && response.ok ? 'success' : 'accepted'
          });
          renderRequestState(form, true, { message: successMessage });
        } catch (error) {
          renderRequestState(form, false, { message: error.message || 'Could not process this request.' });
          track('form_submission_failed', {
            form_name: form.getAttribute('data-form') || 'lead_form',
            source: window.location.pathname,
            message: error.message || 'submission_error'
          });
        }

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.defaultText || 'Submit';
        }
      });
    });
  };

  const initTracking = () => {
    document.body.addEventListener('click', (event) => {
      const target = event.target.closest('[data-track-action], a[href]');
      if (!target) return;

      const action = target.dataset.trackAction;
      const href = target.getAttribute('href') || '';
      const actionTarget = href || target.getAttribute('aria-label') || target.textContent.trim();
      const payload = toTrackPayload(target, actionTarget);
      const leadMagnetTarget = target.closest('[data-lead-magnet]');
      const leadMagnet = leadMagnetTarget ? leadMagnetTarget.getAttribute('data-lead-magnet') : '';

      if (leadMagnet) {
        setStoredLeadMagnet(leadMagnet);
        syncMemoirLeadMagnetToForms();
        payload.lead_magnet = leadMagnet;
        if (!action) {
          track('lead_magnet_click', {
            ...payload,
            lead_magnet: leadMagnet,
            source: href || window.location.pathname
          });
        }
      }

      if (action) {
        const normalizedAction = action.toLowerCase();
        track(action, payload);

        if (normalizedAction.includes('booking')) {
          track('booking_click', payload);
        }

        if (normalizedAction.includes('memoir') && normalizedAction.includes('launch')) {
          track('memoir_launch_click', payload);
        }

        if (normalizedAction.includes('memoir') && normalizedAction.includes('cta')) {
          track('memoir_cta_click', payload);
        }

        return;
      }

      if (!href) return;

      if (href.startsWith('mailto:')) {
        track('email_link_click', {
          ...payload,
          destination: href
        });
        return;
      }

      if (href.startsWith('tel:')) {
        track('phone_link_click', {
          ...payload,
          destination: href
        });
        return;
      }

      const parsed = parseHref(href);
      if (!parsed) return;

      if (isLikelyFileDownload(href, target)) {
        track('file_download', {
          ...payload,
          destination: parsed.href
        });
        return;
      }

      if ((parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname !== window.location.hostname) {
        track('outbound_link_click', {
          ...payload,
          destination: parsed.href
        });
      }
    });
  };

  const initExitIntent = () => {
    const modal = document.getElementById('exit-intent-modal');
    const form = modal ? modal.querySelector('form') : null;
    const closeBtn = modal ? modal.querySelector('[data-exit-intent-close]') : null;

    if (!modal || localStorage.getItem(STORAGE_KEYS.exitIntent)) return;

    const show = () => {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      track('exit_intent_modal_viewed');
    };

    const hide = () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      localStorage.setItem(STORAGE_KEYS.exitIntent, '1');
      if (form) {
        form.remove();
      }
      document.removeEventListener('mouseout', onMouseOut);
    };

    const onMouseOut = (event) => {
      if (event.clientY <= 0) {
        show();
        track('exit_intent_modal_shown');
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', hide);
    }

    document.addEventListener('mouseout', onMouseOut);
  };

  const initStickyCTA = () => {
    const cta = document.querySelector('.sticky-mobile-cta');
    if (!cta) return;

    const onScroll = () => {
      if (window.scrollY > 640) {
        cta.classList.add('is-visible');
      } else {
        cta.classList.remove('is-visible');
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
  };

  const init = () => {
    ensureExitIntentModal();
    initNavigation();
    initTurnstile();
    initForms();
    initTracking();
    initStickyCTA();
    initExitIntent();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(() => {
  const compactParams = (params = {}) => {
    return Object.keys(params).reduce((acc, key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  const resolveGaId = () => {
    if (window.WOVEN_GA_MEASUREMENT_ID) return window.WOVEN_GA_MEASUREMENT_ID;

    const current = document.currentScript;
    if (current && current.dataset && current.dataset.gaId) {
      return current.dataset.gaId;
    }

    const tag = document.querySelector('script[src*="gtag/js"]');
    if (tag && tag.src) {
      try {
        const id = new URL(tag.src, window.location.href).searchParams.get('id');
        if (id) return id;
      } catch (_error) {
        return 'G-PLACEHOLDER';
      }
    }

    return 'G-PLACEHOLDER';
  };

  const resolveFbId = () => {
    if (window.WOVEN_FB_PIXEL_ID) return window.WOVEN_FB_PIXEL_ID;

    const current = document.currentScript;
    if (current && current.dataset && current.dataset.fbPixelId) {
      return current.dataset.fbPixelId;
    }

    return '000000000000000';
  };

  const GA_MEASUREMENT_ID = resolveGaId();
  const FB_PIXEL_ID = resolveFbId();

  const GA_EVENT_ALIASES = {
    email_signup: { name: 'sign_up', params: { method: 'email_form' } },
    memoir_launch_submit: { name: 'generate_lead', params: { lead_type: 'memoir_launch' } },
    memoir_sequence_step: { name: 'generate_lead', params: { lead_type: 'memoir_sequence' } },
    lead_magnet_click: { name: 'generate_lead', params: { lead_type: 'memoir_lead_magnet' } },
    form_submission: { name: 'form_submit', params: { form_status: 'submitted' } },
    form_submission_failed: { name: 'form_submit', params: { form_status: 'failed' } },
    booking_click: { name: 'generate_lead', params: { lead_type: 'booking' } },
    memoir_cta_click: { name: 'select_content', params: { content_type: 'memoir_cta' } },
    memoir_launch_click: { name: 'select_content', params: { content_type: 'memoir_launch' } },
    share_click: { name: 'share', params: { content_type: 'social_share' } },
    share_copy_click: { name: 'share', params: { content_type: 'social_share', method: 'copy_link' } },
    social_content_click: { name: 'select_content', params: { content_type: 'social_content' } },
    substack_click: { name: 'view_content', params: { content_type: 'substack_essay' } },
    blog_post_click: { name: 'select_content', params: { content_type: 'blog_post' } },
    outbound_link_click: { name: 'click', params: { link_type: 'outbound' } },
    file_download: { name: 'file_download', params: {} }
  };

  const FB_EVENT_ALIASES = {
    email_signup: 'Lead',
    memoir_launch_submit: 'Lead',
    memoir_sequence_step: 'Lead',
    memoir_launch_click: 'ViewContent',
    social_content_click: 'ViewContent',
    substack_click: 'ViewContent',
    lead_magnet_click: 'Lead',
    booking_click: 'Lead',
    share_click: 'ViewContent',
    share_copy_click: 'ViewContent',
    blog_post_click: 'ViewContent',
    form_submission: 'CompleteRegistration'
  };

  const track = (eventName, params = {}) => {
    if (typeof eventName !== 'string' || !eventName) return;

    const cleanParams = compactParams({
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params
    });

    if (window.dataLayer && window.gtag) {
      window.gtag('event', eventName, cleanParams);
    }

    const alias = GA_EVENT_ALIASES[eventName];
    if (alias && alias.name && alias.name !== eventName) {
      window.gtag('event', alias.name, compactParams({
        ...cleanParams,
        ...alias.params
      }));
    }

    if (window.fbq) {
      const payload = compactParams({
        content_name: cleanParams.content_name || document.title,
        content_category: cleanParams.content_category || 'writings',
        content_type: cleanParams.content_type || 'article',
        ...cleanParams
      });

      const fbAlias = FB_EVENT_ALIASES[eventName];
      if (fbAlias) {
        window.fbq('track', fbAlias, payload);
      }
      window.fbq('trackCustom', eventName, payload);
    }
  };

  window.wovenTrack = track;

  const gtag = (...args) => {
    if (!window.dataLayer) window.dataLayer = [];
    window.dataLayer.push(args);
  };

  window.gtag = gtag;

  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-PLACEHOLDER') {
    window.dataLayer = window.dataLayer || [];
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  if (typeof window.fbq === 'undefined') {
    const fbq = function(){
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
    };
    window.fbq = window.fbq || fbq;
    if (!window.fbq.queue) {
      window.fbq.queue = [];
    }

    if (FB_PIXEL_ID && FB_PIXEL_ID !== '000000000000000') {
      const loadPixel = () => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);

        if (window.fbq) {
          window.fbq('init', FB_PIXEL_ID);
          window.fbq('track', 'PageView');
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPixel);
      } else {
        loadPixel();
      }
    }
  }
})();

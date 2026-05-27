(() => {
  'use strict';

  const calendarGrid = document.getElementById('content-calendar-grid');
  const calendarIndicator = document.getElementById('calendar-indicator');
  const calendarEmpty = document.getElementById('content-calendar-empty');
  const calendarError = document.getElementById('content-calendar-error');

  const CHANNELS = {
    carousels: {
      label: 'Carousels',
      action: 'social_content_click',
      fallback: 'Nervous system insights · trauma education · memoir excerpts'
    },
    reels: {
      label: 'Reels',
      action: 'social_content_click',
      fallback: 'Readings · reflective prompts · writing process'
    },
    quotes: {
      label: 'Quote graphics',
      action: 'social_content_click',
      fallback: 'Minimal neutral quote assets'
    },
    substack: {
      label: 'Substack',
      action: 'substack_click',
      fallback: 'Identity, memory, nervous-system survival, emotional healing'
    }
  };

  const weekSortValue = (value) => {
    if (!value || typeof value !== 'string') return -1;

    const match = value.match(/^(\d{4})-W(\d{2})$/i);
    if (!match) return -1;

    const year = Number.parseInt(match[1], 10);
    const week = Number.parseInt(match[2], 10);

    if (!Number.isFinite(year) || !Number.isFinite(week)) return -1;

    return year * 100 + week;
  };

  const safeWeekLabel = (rawWeek) => {
    if (!rawWeek || typeof rawWeek !== 'string') return 'Upcoming week';

    const match = rawWeek.match(/^(\d{4})-W(\d{2})$/i);
    if (!match) return rawWeek;

    const year = Number.parseInt(match[1], 10);
    const week = Number.parseInt(match[2], 10);
    if (!Number.isFinite(year) || !Number.isFinite(week)) return rawWeek;

    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay() || 7;
    const monday = new Date(jan4);
    monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1));

    const weekStart = new Date(monday);
    weekStart.setUTCDate(monday.getUTCDate() + (week - 1) * 7);

    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

    const format = (date) => date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return `Week of ${format(weekStart)}–${format(weekEnd)} · ${rawWeek}`;
  };

  const buildItemNode = (item, config, weekValue) => {
    const li = document.createElement('li');
    li.className = 'calendar-topic';

    const title = document.createElement('p');
    title.className = 'calendar-topic-title';
    title.textContent = item.title || 'Planned topic';
    li.appendChild(title);

    const body = document.createElement('p');
    body.className = 'calendar-topic-description';
    body.textContent = item.topic || 'Editorial topic pending';
    li.appendChild(body);

    const meta = document.createElement('p');
    meta.className = 'calendar-topic-meta';
    const metaItems = [];

    if (item.status) metaItems.push(item.status);
    if (item.source) metaItems.push(item.source);
    if (metaItems.length) {
      meta.textContent = metaItems.join(' · ');
      li.appendChild(meta);
    }

    if (item.ctaText || item.ctaUrl) {
      const cta = item.ctaUrl ? document.createElement('a') : document.createElement('span');
      cta.className = 'calendar-topic-cta';
      cta.textContent = item.ctaText || 'View details';
      cta.dataset.trackAction = config.action;
      cta.dataset.trackChannel = config.label;
      cta.dataset.trackWeek = weekValue;
      cta.dataset.trackTitle = item.title || 'Planned topic';

      if (item.ctaUrl) {
        cta.href = item.ctaUrl;
        if (item.ctaUrl.startsWith('http')) {
          cta.target = '_blank';
          cta.rel = 'noopener noreferrer';
        }
      }

      if (item.source) {
        cta.dataset.trackSource = item.source;
      }

      li.appendChild(cta);
    }

    return li;
  };

  const buildChannelList = (label, key, items, weekValue) => {
    const config = CHANNELS[key] || {
      label: String(label || key || 'Items'),
      action: 'social_content_click',
      fallback: 'Planned'
    };

    const wrapper = document.createElement('article');
    wrapper.className = 'calendar-channel';

    const heading = document.createElement('h3');
    heading.className = 'calendar-channel-title';
    heading.textContent = config.label;
    wrapper.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'calendar-topic-list';

    if (!Array.isArray(items) || !items.length) {
      const placeholder = document.createElement('li');
      placeholder.className = 'calendar-empty';
      placeholder.textContent = config.fallback || 'Planned';
      list.appendChild(placeholder);
    } else {
      items.forEach((item) => {
        list.appendChild(buildItemNode(item, config, weekValue));
      });
    }

    wrapper.appendChild(list);
    return wrapper;
  };

  const buildWeekCard = (weekEntry, totalWeeks) => {
    const week = weekEntry || {};
    const weekValue = week.week || `week-${Math.random().toString(36).slice(2, 8)}`;

    const card = document.createElement('section');
    card.className = 'calendar-week-card';

    const header = document.createElement('div');
    header.className = 'calendar-week-header';

    const weekTitle = document.createElement('h2');
    weekTitle.className = 'calendar-week-title';
    weekTitle.textContent = safeWeekLabel(weekValue);

    const theme = document.createElement('p');
    theme.className = 'calendar-week-theme';
    theme.textContent = week.theme || `Editorial theme for ${totalWeeks} week${totalWeeks === 1 ? '' : 's'}.`;

    header.appendChild(weekTitle);
    header.appendChild(theme);

    const matrix = document.createElement('div');
    matrix.className = 'calendar-matrix';

    matrix.appendChild(buildChannelList('Carousels', 'carousels', week.carousels, weekValue));
    matrix.appendChild(buildChannelList('Reels', 'reels', week.reels, weekValue));
    matrix.appendChild(buildChannelList('Quote graphics', 'quotes', week.quotes, weekValue));
    matrix.appendChild(buildChannelList('Substack', 'substack', week.substack, weekValue));

    card.appendChild(header);
    card.appendChild(matrix);
    return card;
  };

  const render = (weeks, maxWeeks = 4) => {
    if (!calendarGrid) return;

    const safeWeeks = Array.isArray(weeks) ? [...weeks] : [];
    const sortedWeeks = safeWeeks
      .filter((entry) => entry && typeof entry === 'object')
      .sort((a, b) => weekSortValue(b.week || '') - weekSortValue(a.week || ''))
      .slice(0, maxWeeks);

    if (!sortedWeeks.length) {
      calendarGrid.classList.add('hidden');
      calendarEmpty.classList.remove('hidden');
      return;
    }

    calendarGrid.classList.remove('hidden');
    calendarEmpty.classList.add('hidden');
    calendarGrid.textContent = '';
    sortedWeeks.forEach((entry, index) => {
      calendarGrid.appendChild(buildWeekCard(entry, sortedWeeks.length));
    });

    if (calendarIndicator) {
      calendarIndicator.textContent = `Scaffold loaded for the next ${Math.min(sortedWeeks.length, maxWeeks)} weeks.`;
    }
  };

  const init = async () => {
    if (!calendarGrid) return;

    const MAX_WEEKS = 4;

    try {
      const response = await fetch('social-calendar.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('calendar-unreachable');

      const payload = await response.json();
      const weeks = payload?.weeks || [];
      const configured = payload?.planning_horizon_weeks && Number.isFinite(Number(payload.planning_horizon_weeks))
        ? Math.max(1, Number(payload.planning_horizon_weeks))
        : MAX_WEEKS;

      render(weeks, configured);
    } catch (_error) {
      calendarGrid.classList.add('hidden');
      calendarError.classList.remove('hidden');
      if (calendarIndicator) {
        calendarIndicator.textContent = 'Calendar unavailable while loading scaffold data.';
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(() => {
  'use strict';

  const postsGrid = document.getElementById('posts-grid');
  const searchInput = document.getElementById('search');
  const clusterFilter = document.getElementById('cluster-filter');
  const emptyState = document.getElementById('posts-empty');
  const errorBox = document.getElementById('posts-error');
  const cadenceIndicator = document.getElementById('cadence-indicator');
  const clusterGoalPanel = document.getElementById('cluster-goals');

  let posts = [];

  const TARGET_POSTS_PER_WEEK = 2;

  const CLUSTER_LABELS = {
    therapy: 'Therapy cluster',
    memoir: 'Memoir & literary cluster'
  };

  const CLUSTER_SCHEMA = {
    therapy: {
      label: 'Therapy cluster',
      targets: [
        'EMDR',
        'IFS',
        'trauma responses',
        'attachment',
        'nervous system regulation',
        'anxiety',
        'emotional abuse'
      ]
    },
    memoir: {
      label: 'Memoir & literary cluster',
      targets: [
        'memory fragmentation',
        'coercive control',
        'identity collapse',
        'body memory',
        'delayed recognition',
        'rebuilding selfhood'
      ]
    }
  };

  const norm = (value) => (value || '').toString().toLowerCase().trim();

  const cluster = (post) => norm(post.cluster || post.articleSection || 'therapy');

  const clusterLabel = (value) => {
    const normalized = norm(value);
    return CLUSTER_LABELS[normalized] || (normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'General');
  };

  const postWeek = (value, fallbackDate) => {
    if (value) return value;
    if (!fallbackDate) return 'untracked';

    const date = new Date(`${fallbackDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return 'untracked';

    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const dayCount = Math.floor((date - yearStart) / 86400000);
    const week = Math.ceil((dayCount + yearStart.getUTCDay() + 1) / 7);

    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  };

  const makeTag = (tag) => {
    const span = document.createElement('span');
    span.className = 'inline-block text-xs px-2 py-1 rounded-full border border-[var(--color-border)] mr-2 mb-2';
    span.textContent = tag;
    return span;
  };

  const renderClusterGoals = () => {
    if (!clusterGoalPanel) return;

    const goalRows = Object.keys(CLUSTER_SCHEMA)
      .sort()
      .map((key) => {
        const termText = CLUSTER_SCHEMA[key].targets.join(', ');
        return `<li><strong>${CLUSTER_SCHEMA[key].label}</strong>: ${termText}</li>`;
      });

    clusterGoalPanel.innerHTML = `
      <p class="text-sm opacity-85">Cadence target: <strong>${TARGET_POSTS_PER_WEEK} posts/week</strong></p>
      <p class="text-sm mt-2 mb-1">Cluster focus list for future scheduling:</p>
      <ul class="list-disc pl-5 text-sm leading-relaxed">${goalRows.join('')}</ul>
    `;
  };

  const renderCadence = (sortedPosts) => {
    if (!cadenceIndicator) return;

    const buckets = sortedPosts.reduce((acc, post) => {
      const key = postWeek(post.publish_week, post.date);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const weekKeys = Object.keys(buckets).filter((key) => key !== 'untracked').sort().reverse();
    const activeWeek = weekKeys[0];

    if (!activeWeek) {
      cadenceIndicator.textContent = 'Cadence scaffold ready: 2 posts/week goal configured; add publish_week in each post for live tracking.';
      return;
    }

    const publishedThisWeek = buckets[activeWeek];
    const byCluster = sortedPosts.reduce((acc, post) => {
      const week = postWeek(post.publish_week, post.date);
      if (week !== activeWeek) return acc;

      const key = cluster(post);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const clusterText = Object.entries(byCluster)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => `${clusterLabel(name)}: ${count}`)
      .join(' · ');

    const remaining = Math.max(0, TARGET_POSTS_PER_WEEK - publishedThisWeek);
    const status = remaining === 0 ? 'goal met' : `${remaining} more needed`;
    cadenceIndicator.textContent = `${activeWeek}: ${publishedThisWeek} published post(s) (${status}). ${clusterText}`;
  };

  const populateClusterFilter = (sortedPosts) => {
    if (!clusterFilter) return;

    const existingValue = norm(clusterFilter.value);
    const clusters = [...new Set(sortedPosts.map((post) => cluster(post)))].filter(Boolean).sort();

    clusterFilter.innerHTML = '';

    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All topics';
    clusterFilter.appendChild(allOption);

    clusters.forEach((key) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = clusterLabel(key);
      clusterFilter.appendChild(option);
    });

    clusterFilter.value = existingValue || '';
  };

  const readingTime = (post) => {
    const words = Number(post.word_count || post.estimated_word_count || 0);
    if (words > 0) return Math.max(1, Math.round(words / 200));
    const excerptWords = norm(post.excerpt).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(excerptWords / 120));
  };

  const render = (list) => {
    postsGrid.textContent = '';

    if (!list.length) {
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    list.forEach((post) => {
      const card = document.createElement('a');
      card.className = 'card bg-white/70 p-8 rounded-3xl transition-transform hover:-translate-y-1 block';
      card.href = `/blog/${encodeURIComponent(post.slug)}`;
      card.setAttribute('aria-label', post.title);
      card.dataset.trackAction = 'blog_post_click';
      card.dataset.trackSlug = post.slug;
      card.dataset.trackSection = post.articleSection || 'Therapy';
      card.dataset.trackCluster = cluster(post);
      card.dataset.trackTitle = post.title;
      card.dataset.trackPublishWeek = post.publish_week || '';

      const clusterName = clusterLabel(cluster(post));
      const published = post.publish_week || post.date || '';

      const header = document.createElement('div');
      header.className = 'text-xs uppercase tracking-widest opacity-75';
      header.textContent = `${clusterName} · ${readingTime(post)} min read · ${published}`;

      const title = document.createElement('h2');
      title.className = 'text-2xl sm:text-3xl font-serif font-semibold text-[var(--color-primary)] mt-2';
      title.textContent = `${post.title} | The Woven Self Blog`;

      const excerpt = document.createElement('p');
      excerpt.className = 'mt-4';
      excerpt.textContent = post.excerpt || '';

      const tags = document.createElement('div');
      tags.className = 'mt-5';
      (post.tags || []).slice(0, 8).forEach((tag) => {
        tags.appendChild(makeTag(tag));
      });

      const readMore = document.createElement('p');
      readMore.className = 'mt-4 font-semibold underline underline-offset-4';
      readMore.textContent = 'Read →';

      card.appendChild(header);
      card.appendChild(title);
      card.appendChild(excerpt);
      card.appendChild(tags);
      card.appendChild(readMore);
      postsGrid.appendChild(card);
    });
  };

  const applyFilter = () => {
    const q = norm(searchInput?.value || '');
    const selectedCluster = norm(clusterFilter?.value || '');

    const filtered = posts.filter((post) => {
      const inSearch = !q ||
        norm(post.title).includes(q) ||
        norm(post.excerpt).includes(q) ||
        norm((post.keywords || []).join(' ')).includes(q) ||
        norm(post.slug).includes(q);

      const inCluster = !selectedCluster || cluster(post) === selectedCluster;

      return inSearch && inCluster;
    });

    render(filtered);
  };

  const init = async () => {
    try {
      const response = await fetch('posts.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('posts.json not found');
      posts = await response.json();
      posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const sortedPosts = [...posts];

      populateClusterFilter(sortedPosts);
      render(sortedPosts);
      renderCadence(sortedPosts);
      renderClusterGoals();

      if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
      }
      if (clusterFilter) {
        clusterFilter.addEventListener('change', applyFilter);
      }
    } catch (_error) {
      errorBox.classList.remove('hidden');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

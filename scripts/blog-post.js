(() => {
  'use strict';

  const metaTitle = document.querySelector('title');
  const canonical = document.querySelector('link[rel="canonical"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  const metaDescription = document.querySelector('meta[name="description"]');

  const postMeta = document.getElementById('post-meta');
  const postContent = document.getElementById('post-content');
  const shareX = document.getElementById('share-twitter');
  const shareLinkedin = document.getElementById('share-linkedin');
  const shareCopy = document.getElementById('share-copy');
  const relatedList = document.getElementById('related-posts');
  const prevNext = document.getElementById('post-prev-next');
  const loadingState = document.getElementById('post-loading');
  const errorState = document.getElementById('post-error');
  const postSchema = document.getElementById('post-schema');

  const getSlug = () => {
    const fromPath = window.location.pathname.startsWith('/blog/') ? window.location.pathname.replace('/blog/', '').replace(/\/$/, '') : '';
    if (fromPath) return decodeURIComponent(fromPath);
    const params = new URLSearchParams(window.location.search);
    return params.get('slug') || '';
  };

  const getPlainText = (value) => {
    const text = (value || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
      .replace(/[#_*~>|\[\]]/g, ' ')
      .replace(/<[^>]+>/g, ' ');

    return text.replace(/\s+/g, ' ').trim();
  };

  const countWords = (value) => getPlainText(value).split(/\s+/).filter(Boolean).length;

  const readTime = (words) => Math.max(1, Math.round((Number(words) || 0) / 200));

  const normalizePostUrl = (slug) => `/blog/${encodeURIComponent(slug)}`;

  const toTitleCase = (value) => {
    const raw = `${value || ''}`.trim();
    if (!raw) return '';
    return raw
      .split(/[\s-_]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const updateMeta = ({
    title,
    excerpt,
    section,
    cluster,
    publishWeek,
    slug,
    keywords,
    image,
    date,
    readMinutes,
    authorUrl,
    markdownText
  }) => {
    const withSuffix = `${title} | The Woven Self Blog`;

    if (metaTitle) metaTitle.textContent = withSuffix;
    if (ogTitle) ogTitle.setAttribute('content', withSuffix);
    if (twTitle) twTitle.setAttribute('content', withSuffix);

    const desc = excerpt || 'Therapy-informed writing by Loren Galese, LPC in New Jersey.';
    if (metaDescription) metaDescription.setAttribute('content', desc);
    if (ogDesc) ogDesc.setAttribute('content', desc);
    if (twDesc) twDesc.setAttribute('content', desc);

    const currentUrl = `${window.location.origin}${normalizePostUrl(slug)}`;
    if (canonical) canonical.setAttribute('href', currentUrl);
    if (ogUrl) ogUrl.setAttribute('content', currentUrl);

    if (shareX) {
      shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(withSuffix)}&url=${encodeURIComponent(currentUrl)}`;
      shareX.dataset.trackAction = 'share_click';
      shareX.dataset.trackNetwork = 'x';
      shareX.dataset.trackDestination = currentUrl;
    }
    if (shareLinkedin) {
      shareLinkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      shareLinkedin.dataset.trackAction = 'share_click';
      shareLinkedin.dataset.trackNetwork = 'linkedin';
      shareLinkedin.dataset.trackDestination = currentUrl;
    }
    if (shareCopy) {
      shareCopy.setAttribute('data-url', currentUrl);
      shareCopy.dataset.trackAction = 'share_copy_click';
      shareCopy.dataset.trackNetwork = 'copy';
      shareCopy.dataset.trackDestination = currentUrl;
      shareCopy.textContent = 'Copy link';
    }

    if (postMeta) {
      const clusterName = toTitleCase(cluster || section || 'Therapy');
      postMeta.innerHTML = `
        <h1 class="text-4xl sm:text-5xl font-serif font-bold">${withSuffix}</h1>
        <div class="mt-4 text-sm opacity-80">${clusterName} · ${readMinutes} min read · ${publishWeek || date || ''}</div>
      `;
    }

    if (postSchema) {
      const sectionOrCluster = section || cluster || 'Therapy';
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: desc,
        image: image || 'https://wovenself.com/images/social-share.jpg',
        wordCount: Number(countWords(markdownText || '')),
        keywords: (keywords || []).join(', '),
        articleSection: sectionOrCluster,
        genre: sectionOrCluster,
        datePublished: date || undefined,
        dateModified: date || undefined,
        author: {
          '@type': 'Person',
          name: 'Loren Galese',
          url: authorUrl
        },
        publisher: {
          '@type': 'ProfessionalService',
          name: 'The Woven Self Therapeutic Services, LLC',
          url: 'https://wovenself.com/'
        },
        mainEntityOfPage: currentUrl,
        url: currentUrl,
        inLanguage: 'en-US',
        isPartOf: {
          '@type': 'Blog',
          name: 'The Woven Self Blog',
          url: 'https://wovenself.com/blog'
        },
        about: {
          '@type': 'Thing',
          name: publishWeek ? `Published in ${publishWeek}` : 'The Woven Self Blog'
        }
      };
      postSchema.textContent = JSON.stringify(schema);
    }
  };

  const safeMarkdown = (value) => {
    if (!window.marked || !window.marked.parse) {
      return `<p>${(value || '').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
    }
    return window.marked.parse(value || '', {
      mangle: false,
      headerIds: true,
      breaks: true
    });
  };

  const renderPost = (post, markdownText, sortedPosts) => {
    if (loadingState) loadingState.classList.add('hidden');

    const readMinutes = readTime(countWords(markdownText));
    const section = post.articleSection || 'Therapy';
    const cluster = post.cluster || section;
    const publishWeek = post.publish_week || '';
    const keywords = post.keywords || [];
    const image = post.image || 'https://wovenself.com/images/social-share.jpg';
    const authorUrl = post.author_url || 'https://wovenself.com/about';

    updateMeta({
      title: post.title,
      excerpt: post.excerpt,
      section,
      cluster,
      publishWeek,
      slug: post.slug,
      keywords,
      image,
      date: post.date,
      readMinutes,
      authorUrl,
      markdownText
    });

    postContent.innerHTML = `<div class="prose max-w-none">${safeMarkdown(markdownText)}</div>`;

    const idx = sortedPosts.findIndex((entry) => entry.slug === post.slug);
    if (prevNext) {
      const prev = sortedPosts[idx + 1];
      const next = sortedPosts[idx - 1];
      prevNext.innerHTML = '';

      const makeLink = (postData, label) => {
        if (!postData) return '<span class="text-sm opacity-80">No ' + label + ' post</span>';
        return `<a class="inline-flex items-center gap-2 underline underline-offset-4" href="/blog/${encodeURIComponent(postData.slug)}">${label}: ${postData.title}</a>`;
      };

      const prevWrap = document.createElement('div');
      prevWrap.innerHTML = makeLink(prev, 'Previous');
      const nextWrap = document.createElement('div');
      nextWrap.className = 'mt-3';
      nextWrap.innerHTML = makeLink(next, 'Next');
      prevNext.appendChild(prevWrap);
      prevNext.appendChild(nextWrap);
    }

    if (relatedList) {
      const related = sortedPosts.filter((entry) => {
        if (entry.slug === post.slug) return false;
        if (entry.articleSection && post.articleSection && entry.articleSection === post.articleSection) return true;
        return (entry.tags || []).some((tag) => (post.tags || []).includes(tag));
      }).slice(0, 3);

      relatedList.innerHTML = '';
      if (!related.length) {
        relatedList.innerHTML = '<p>No related posts yet.</p>';
        return;
      }

      related.forEach((entry) => {
        const card = document.createElement('a');
        card.className = 'block rounded-2xl border border-[var(--color-border)] p-4 hover:bg-white transition';
        card.href = `/blog/${encodeURIComponent(entry.slug)}`;
        card.innerHTML = `
          <p class="text-xs uppercase opacity-80">${entry.articleSection || 'Therapy'}</p>
          <h3 class="mt-1 text-lg font-serif">${entry.title}</h3>
        `;
        relatedList.appendChild(card);
      });
    }
  };

  const loadPost = async () => {
    const slug = getSlug();
    if (!slug) {
      throw new Error('Missing slug');
    }

    const postsResponse = await fetch('posts.json', { cache: 'no-store' });
    if (!postsResponse.ok) throw new Error('Unable to load posts');
    const posts = await postsResponse.json();
    const sortedPosts = [...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const post = sortedPosts.find((entry) => entry.slug === slug);
    if (!post) throw new Error('Post not found');

    const mdResponse = await fetch(`posts/${encodeURIComponent(slug)}.md`, { cache: 'no-store' });
    if (!mdResponse.ok) throw new Error('Post file not found');
    const markdownText = await mdResponse.text();

    renderPost(post, markdownText, sortedPosts);

    const shareText = document.getElementById('memoir-launch-link')?.getAttribute('href');
    if (shareCopy) {
      shareCopy.addEventListener('click', (event) => {
        event.preventDefault();
        const url = new URL(window.location.href);
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(url.toString()).then(() => {
            shareCopy.textContent = 'Copied';
          });
        }
      });
    }

    const memoirCta = document.getElementById('memoir-cta-link');
    if (memoirCta && shareText) {
      memoirCta.href = shareText;
    }
  };

  const showError = () => {
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState) {
      errorState.classList.remove('hidden');
      errorState.innerHTML = '<h2 class="text-3xl font-serif font-bold">Post not found</h2><p class="mt-3">Return to <a href="/blog" class="underline underline-offset-4">the blog</a>.</p>';
    }
  };

  const init = () => {
    loadPost().catch(showError);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Progressively enhance the saved posts; keep them visible if the feed fails. */
(() => {
  const grid = document.querySelector('[data-substack-posts]');
  const template = grid?.querySelector('article');
  if (!template) return;

  const allowedURL = (value, hosts) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && hosts.includes(url.hostname)
        && !url.username && !url.password && (!url.port || url.port === '443');
    } catch { return false; }
  };
  const postHosts = ['quietalchemywloren.substack.com'];
  const imageHosts = ['substackcdn.com', 'substack-post-media.s3.amazonaws.com'];
  const dateFormat = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
  });
  const hideBrokenImage = image => {
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    if (image.complete && !image.naturalWidth) image.hidden = true;
  };
  grid.querySelectorAll('img').forEach(hideBrokenImage);

  async function refreshPosts() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('/api/substack', {
        signal: controller.signal, credentials: 'omit',
      });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.posts)) return;
      const posts = data.posts.filter(post => post && typeof post.title === 'string'
        && post.title.trim() && allowedURL(post.url, postHosts)
        && new URL(post.url).pathname.startsWith('/p/')
        && typeof post.publishedAt === 'string'
        && Number.isFinite(Date.parse(post.publishedAt))).slice(0, 3);
      if (!posts.length) return;
      const cards = posts.map(post => {
        const card = template.cloneNode(true);
        card.querySelector('h3').textContent = post.title;
        card.querySelector('[data-post-description]').textContent =
          typeof post.description === 'string' ? post.description : '';
        const time = card.querySelector('time');
        time.dateTime = post.publishedAt;
        time.textContent = dateFormat.format(new Date(post.publishedAt));
        const link = card.querySelector('a');
        link.href = post.url;
        link.setAttribute('aria-label', `Read ${post.title} on Substack`);
        const image = card.querySelector('img');
        if (allowedURL(post.image, imageHosts)) {
          image.hidden = false;
          image.src = post.image;
          hideBrokenImage(image);
        } else {
          image.remove();
        }
        return card;
      });
      // Do not replace a card while someone is using its keyboard focus.
      if (!grid.contains(document.activeElement)) grid.replaceChildren(...cards);
    } catch {
      // Saved cards remain readable without JavaScript, network, or Substack.
    } finally {
      clearTimeout(timeout);
    }
  }
  refreshPosts();
})();

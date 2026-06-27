# The Woven Self Website

A minimalist, accessible static website for The Woven Self Therapeutic Services, LLC, the therapy and author platform for Loren Galese, LPC.

Live site:

```txt
https://wovenself.com
```

The site is built with plain HTML, CSS, Tailwind CDN, small client-side JavaScript, and static Markdown/JSON blog content. It is deployed through GitHub and Vercel. No Node.js install or build step is required for local development.

## Purpose

The website supports two primary goals:

1. Therapy practice visibility
   - Present Loren's clinical background and therapeutic approach.
   - Make it easy for prospective clients to learn about services.
   - Direct users to book through Headway.
   - Provide a clear and accessible contact pathway.
2. Author platform and book marketing
   - Promote Loren's author work.
   - Support preorder and launch activity for *Unfolding Origami: A Memoir*.
   - Host blog and reflection content.
   - Provide a central hub for readers, media, bookstores, podcasts, and collaborators.

## Tech Stack

- HTML
- CSS
- Tailwind CSS via CDN
- JavaScript
- Markdown
- JSON
- Vercel
- GitHub

## Project Structure

```txt
/
  index.html
  about.html
  author.html
  blog.html
  preorder.html
  preorder-thank-you.html
  styles.css
  vercel.json
  sitemap.xml
  robots.txt
  README.md
  /blog/
    post.html
    posts.json
    /posts/
      the-parts-we-carry.md
      what-healing-actually-looks-like.md
  /images/
    logo.png
    loren-galese.jpg
    loren-author-hero.jpeg
    loren-author-seated.jpeg
    loren-author-bw.jpeg
    loren-author-smiling.jpeg
    loren-author-smiling-outdoor.jpeg
    unfolding-origami-cover.jpg
  /design/
    /unfolding-origami-launch-card/
  /marketing/
    /book-launch/
```

Some folders may be untracked depending on the current branch state. Do not add or modify untracked folders unless intentionally working on those assets.

## Key Pages

| Page | Purpose |
| --- | --- |
| `/` | Main therapy website homepage |
| `/about` or `/about.html` | Loren's clinical background and therapeutic approach |
| `/author` or `/author.html` | Loren's author page and book preorder landing page |
| `/preorder` or `/preorder.html` | Signed paperback preorder page |
| `/preorder-thank-you` or `/preorder-thank-you.html` | Stripe preorder thank-you page |
| `/blog` or `/blog.html` | Blog index |
| `/blog/post.html?slug=...` | Dynamic blog post renderer |
| `/blog/:slug` | Clean blog post URL rewritten by Vercel |

## Current Book Campaign Details

| Field | Detail |
| --- | --- |
| Book title | *Unfolding Origami: A Memoir* |
| Author | Loren Galese |
| Price | $24.99 |
| Release date | July 20 |
| Preorder incentive | Signed copy plus a surprise from Loren |
| Primary preorder page | `https://wovenself.com/author` |
| Stripe payment link | `https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00` |
| Primary CTA | Preorder Now |

The active site uses `Unfolding Origami` for the book title. Campaign assets should use `Unfolding Origami` consistently; verify copy against the live page files before publishing.

## Local Development

Run the site locally from the repository root:

```bash
python3 -m http.server 8080
```

Open:

```txt
http://localhost:8080
```

Test key pages:

```txt
http://localhost:8080/
http://localhost:8080/about.html
http://localhost:8080/author.html
http://localhost:8080/preorder.html
http://localhost:8080/blog.html
http://localhost:8080/blog/post.html?slug=the-parts-we-carry
```

## Deployment

The site is deployed through Vercel from the GitHub main branch.

Standard workflow:

```bash
git status
git pull origin main
# make edits
python3 -m http.server 8080
# verify locally
git add README.md
git commit -m "Update project README"
git push origin main
```

After pushing to main, Vercel should automatically deploy the latest version.

## Vercel Configuration

The site uses `vercel.json` for clean URLs, security headers, and rewrites.

Expected behavior:

- Clean URLs are enabled, so `.html` pages can be requested without the extension.
- `/unfolding` rewrites to `/author.html`.
- `/blog/:slug` rewrites to `/blog/post.html?slug=:slug`.

Do not remove existing security headers unless replacing them with equivalent or stronger protection.

## Blog System

The blog is static.

Blog metadata is stored in:

```txt
/blog/posts.json
```

Each post has a Markdown file in:

```txt
/blog/posts/
```

Example post entry:

```json
{
  "slug": "the-parts-we-carry",
  "title": "The Parts We Carry",
  "date": "2026-02-13",
  "excerpt": "A gentle look at how protective parts form, and what changes when we stop fighting them.",
  "tags": ["IFS", "trauma", "nervous system"]
}
```

The dynamic post page fetches:

```txt
/blog/posts.json
/blog/posts/{slug}.md
```

When adding a new blog post:

1. Add the Markdown file to `/blog/posts/`.
2. Add a matching metadata entry to `/blog/posts.json`.
3. Test the post locally using `/blog/post.html?slug=your-post-slug`.

## Image Guidelines

Use images from:

```txt
/images/
```

Recommended standards:

| Image type | Recommendation |
| --- | --- |
| Hero images | Max width around 1400px |
| Card or section images | Max width around 900px |
| Format | JPEG or PNG |
| JPEG quality | 75-85 |
| Loading | Use `loading="lazy"` except above-the-fold hero images |
| Decoding | Use `decoding="async"` |
| Alt text | Required for all meaningful images |

Preferred Loren author images:

```txt
/images/loren-author-hero.jpeg
/images/loren-author-seated.jpeg
/images/loren-author-bw.jpeg
/images/loren-author-smiling.jpeg
/images/loren-author-smiling-outdoor.jpeg
```

Do not use oversized raw images directly on the live site.

## SEO and Metadata

Each major page should include:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- Open Graph metadata
- Twitter card metadata
- Structured data where appropriate

When changing public page routes, update `sitemap.xml`, canonical URLs, and any relevant Vercel rewrites together.

## Stripe Preorder Setup

The website uses a Stripe-hosted Payment Link for book preorders. The site does not collect or store credit card data.

Live Stripe Payment Link:

```txt
https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00
```

Website flow:

```txt
Author Page -> Preorder Page -> Stripe Checkout -> Thank You Page
```

Configure the Stripe Payment Link success redirect to:

```txt
https://wovenself.com/preorder-thank-you.html
```

Do not commit Stripe secret keys, restricted keys, API keys, webhook secrets, or customer data.

## Safety Notes

- Preserve existing security headers and CSP behavior in `vercel.json`.
- Do not collect therapy-related, clinical, or protected health information through preorder checkout flows.
- Keep contact and booking pathways clear: therapy scheduling goes through Headway; preorder payments go through Stripe.
- Keep examples executable or clearly illustrative when updating documentation.

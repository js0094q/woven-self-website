# Flodesk Build Guide — Newsletter Part 2

## Campaign Purpose

This is the second preorder campaign newsletter for *Unfolding Origami: A Memoir*.

The goal is not just to announce preorders again. The goal is to give subscribers a reason to re-engage:

1. The official cover is now live.
2. Preorders are open.
3. A private excerpt is available through a hidden website page.
4. The excerpt link gives readers an early, intimate reason to care about the book.

---

## Design Direction

Match the website section titled:

> The Official Cover Is Here

Use the same visual language:

| Element | Direction |
|---|---|
| Background | warm neutral / paper tone |
| Accent | dark blue from the book cover |
| Typography | serif headline, clean sans body |
| Mood | literary, restrained, intimate |
| CTA style | rounded buttons, uniform size |
| Imagery | updated official cover |

Do not make this look like a therapy-services email. This should feel like a book campaign email that still belongs visually to The Woven Self.

---

## Recommended Flodesk Structure

### 1. Logo/Header Block

- Use the updated campaign or Woven Self logo.
- Keep it small-to-medium.
- Center aligned.
- Avoid a heavy banner.

---

### 2. Hero Block

Headline:

```text
The Official Cover Is Here
```

Subheadline/body:

```text
Unfolding Origami: A Memoir is now available for preorder.
```

Include brief opening copy from the Flodesk copy file.

CTA buttons:

- Preorder Your Signed Copy
- Preorder on Amazon Kindle

Links:

Signed paperback:

```text
https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00
```

Kindle ebook:

```text
https://www.amazon.com/dp/B0H27BM8K1
```

---

### 3. Cover Image Block

Use the updated official cover.

Recommended settings:

| Setting | Value |
|---|---|
| Width | 320–420 px desktop |
| Mobile | full width with margin |
| Alignment | center |
| Corner radius | none unless current campaign style uses rounded corners |
| Shadow | subtle only |
| Background | dark blue or warm neutral |

---

### 4. Excerpt Section

Headline:

```text
A Quiet First Look at Loren Galese’s Upcoming Memoir
```

Use this exact phrase as the linked CTA text as requested.

CTA text:

```text
A Quiet First Look at Loren Galese’s Upcoming Memoir
```

CTA URL:

```text
https://wovenself.com/excerpt-unfolding-origami.html
```

Add short content note in body copy, not as a warning banner:

```text
Please read at your own pace.
```

---

### 5. Preorder Reminder Block

Use concise copy.

Mention:

- Signed paperback preorders are available now through The Woven Self.
- Kindle ebook preorders are available now through Amazon for $9.95.

CTA buttons:

- Preorder Signed Paperback
- Preorder Kindle Ebook

---

### 6. Footer

Include:

```text
The Woven Self Therapeutic Services, LLC
New Jersey
Instagram: @lorengaleseauthor
Substack: Quiet Alchemy with Loren
```

---

## Recommended Flodesk Colors

Use these unless the existing campaign files define final approved values.

| Token | Value |
|---|---|
| Dark book-cover blue | #1C283C |
| Warm paper background | #F4EFE7 |
| Cream | #FFF8F0 |
| Muted rose accent | #9B5F6F |
| Body text | #24313A |
| Soft border | #E4D7CC |
| White | #FFFFFF |

---

## Recommended Flodesk Fonts

Use the closest available Flodesk equivalents.

| Use | Font |
|---|---|
| Headlines | Playfair Display or Cormorant Garamond |
| Body | Inter, Lato, or similar clean sans |
| Buttons | Inter/Lato uppercase or semibold |

---

## Recommended Font Sizes

| Element | Desktop | Mobile |
|---|---|---|
| Main headline | 36–44 px | 30–34 px |
| Section headline | 26–32 px | 24–28 px |
| Body | 16–18 px | 16 px |
| Button | 14–16 px | 14–16 px |
| Footer | 12–13 px | 12–13 px |

---

## QA Before Sending

Before test send:

- Confirm the cover image is the updated official cover.
- Confirm the excerpt link opens:
  - https://wovenself.com/excerpt-unfolding-origami.html
- Confirm the PDF opens from the hidden excerpt page.
- Confirm the hidden page is not in navigation.
- Confirm the hidden page is not in sitemap.xml.
- Confirm the hidden page has:
  - `<meta name="robots" content="noindex,nofollow" />`
- Confirm signed paperback CTA links to Stripe.
- Confirm Kindle CTA links to Amazon.
- Confirm Kindle price is listed as $9.95.
- Confirm signed paperback price remains $24.99.
- Confirm the email has a plain-text fallback.
- Send test email to Loren and Joe before scheduling.

---

## Asset Handling Instructions

Copy the uploaded excerpt PDF into the repo as:

```text
/assets/unfolding-origami-excerpt.pdf
```

Do not rename the public file with spaces.

Do not expose the uploaded filename directly in URLs.

---

## Sitemap Instructions

Do not add this page to sitemap.xml.

The page is intentionally hidden for now.

---

## Navigation Instructions

Do not add this page to:

- desktop nav
- mobile nav
- blog index
- footer nav
- homepage sections
- author page CTAs unless explicitly requested later

The only intended entry point for now is the Flodesk newsletter link.

---

## Robots / Indexing Instructions

The hidden excerpt page must include:

```html
<meta name="robots" content="noindex,nofollow" />
```

The page should not be marketed as private in a security sense. It is hidden-by-link only, not password protected.

Do not imply confidentiality.

Use language like:

```text
private first-look excerpt
```

not:

```text
secure private excerpt
```

---

## Important Copy Rules

Use:

```text
Unfolding Origami: A Memoir
```

Do not use:

```text
Folding Origami
```

Use:

```text
Loren Galese
```

Use:

```text
A Quiet First Look at Loren Galese’s Upcoming Memoir
```

as the excerpt CTA/link language.

Use:

```text
The Official Cover Is Here
```

as the main newsletter hero framing.

Mention:

```text
Kindle ebook preorders are available through Amazon for $9.95.
```

Mention:

```text
Signed paperback preorders are $24.99.
```

---

## Validation Commands

Run:

```bash
npm run lint
```

If no lint script exists, run whatever repo validation currently exists.

Also run:

```bash
grep -R "Folding Origami" .
grep -R "excerpt-unfolding-origami" sitemap.xml
```

Expected:

- No incorrect Folding Origami references in public campaign files.
- No excerpt-unfolding-origami.html entry in sitemap.xml.

Then test locally:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/excerpt-unfolding-origami.html
```

Confirm:

- page loads
- cover image loads
- PDF button opens the excerpt
- Stripe button opens signed paperback preorder
- Amazon button opens Kindle preorder
- mobile layout works
- no horizontal scrolling
- CTA buttons are uniform

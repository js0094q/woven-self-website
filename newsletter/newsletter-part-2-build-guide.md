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

### 2. Hero Cover Announcement Block

Headline:

```text
The Official Cover Is Here
```

Subheadline/body:

```text
Unfolding Origami: A Memoir is now available for preorder.
```

Release line:

```text
Releasing July 20th, 2026
```

Use the official cover image in this block. Keep the layout cover-led and uncluttered.

No link is required for this image block.

---

### 3. Author Note Block

Use Loren’s revised note as the body copy:

```text
I’m so grateful to finally share the official cover with you. This book has been years in the making, and seeing it take shape as something real, visible, and close to readers’ hands has been emotional in a way I’m still trying to find language for.
```

```text
Having the beautiful opportunity to have Sarah Edmondson be an early reader and share her thoughts about my memoir is overwhelming, in the best way. She, along with her husband Anthony “Nippy,” hosts the podcast A Little Bit Culty and also wrote the book A Little Bit Culty: Navigating Cults, Control, and Coercion. They have spent years since their escape from NXIVM learning about control and manipulation, untangling their own experience within a cult while interviewing people who have survived their own version of hell.
```

```text
I learned about Sarah, Nippy, and NXIVM in early 2021 while watching The Vow in a COVID stupor. Listening to their stories and hearing them recount what happened pulled back more of the curtain on my own experience, which allowed me to write this memoir. I will forever be grateful for that and for how impactful it can be to hear someone’s story and relate it to your own.
```

```text
It’s been my goal with this memoir: to share my story and connect with others and their stories.
```

---

### 4. Signed Paperback CTA Block

CTA text:

```text
Preorder Signed Paperback
```

CTA link:

```text
https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00
```

Recommended settings:

| Setting | Value |
|---|---|
| Width | full image block |
| Mobile | full width |
| Alignment | center |
| Button style | dark filled rounded button |
| Background | warm neutral |

---

### 5. Kindle Ebook CTA Block

CTA text:

```text
Preorder Kindle Ebook
```

CTA link:

```text
https://www.amazon.com/Unfolding-Origami-Memoir-Loren-Galese-ebook/dp/B0H27BM8K1
```

Use the same size and spacing as the signed paperback CTA block.

---

### 6. Excerpt Section

Headline:

```text
A Quiet First Look at Loren Galese’s Upcoming Memoir
```

Body:

```text
As a thank-you for signing up early, I wanted to share an excerpt from Unfolding Origami before it’s available.
```

Content note:

```text
This excerpt includes depictions of trauma, including sexual violence, that may be distressing to some. Reader discretion is advised, and those who may be affected are encouraged to seek support from a qualified professional trained in trauma-informed therapeutic services.
```

Use a soft cream content-note treatment with dark body text. Do not style it like an alarming warning banner.

CTA text:

```text
Read the Excerpt
```

CTA URL:

```text
https://wovenself.com/excerpt-unfolding-origami
```

---

### 7. Preorder Reminder Blocks

Use concise copy.

Mention:

- Signed paperback preorders are available now through The Woven Self.
- Kindle ebook preorders are available now through Amazon for $9.95.

CTA buttons:

- Preorder Signed Paperback
- Preorder Kindle Ebook

---

### 8. Closing Note Block

Use Loren’s revised closing note:

```text
Thank you for supporting this journey. Whether you preordered, follow me on Substack, or told a friend about the book, you have made an impact. This story was something I never thought I would share, so sharing it has been a whirlwind.
```

```text
This book signifies a shift from someone who was quiet and full of shame to someone sharing her survival story as strength, no longer letting fear stop her.
```

Signoff:

```text
With gratitude,
Loren
```

Keep this centered and personal. Use serif body text and italic rose accent for the signoff.

---

### 9. Footer

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
  - https://wovenself.com/excerpt-unfolding-origami
- Confirm the PDF opens directly from the excerpt URL.
- Confirm no intermediary page appears.
- Confirm the clean excerpt URL is in sitemap.xml.
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

Do not use the older incorrect title in active newsletter copy or generated image sources.

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

Spell these references exactly in the author note:

- Sarah Edmondson
- Anthony “Nippy,”
- A Little Bit Culty
- A Little Bit Culty: Navigating Cults, Control, and Coercion
- NXIVM
- The Vow

---

## Validation Commands

Run:

```bash
find newsletter/part-2-images -maxdepth 1 -type f | sort
```

Confirm the expected PNG and JPG image blocks exist, including both split hero blocks.

Also run:

```bash
git diff --check
```

Run source checks for the old incorrect title and the removed chapter-title line across `newsletter/` and `newsletter/part-2-images/`. Both checks should return no newsletter-source matches.

Test locally:

```bash
python3 -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/newsletter/part-2-images/preview.html
```

Confirm:

- page loads
- cover image loads
- split hero blocks appear in order
- revised excerpt and closing copy appears
- mobile layout works
- no horizontal scrolling
- CTA buttons are uniform

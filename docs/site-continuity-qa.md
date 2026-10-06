# Site continuity and final QA

Workstream 4, October 4, 2026. Base: current main, `a27696f`.

The existing cream, green, sage, pink, serif headings, Inter body text, rounded cards, and memoir navy sections are preserved. Existing public routes and transaction destinations are preserved.

## Changes

| Area | Finding and correction |
| --- | --- |
| Architecture | Therapy now appears alongside coaching, groups, and the memoir in the opening homepage cards. Existing sections remain. |
| Navigation | Consistent Home, Therapy, Coaching, Groups, Author, About, Contact order. Groups uses the existing peer-support route. Speaking and writing remain accessible in the footer. No supervision service was added. |
| Active states | Removed contradictory mobile highlights. Exact pages use `aria-current="page"`; author-related subpages use a parent location marker. |
| Header | Reduced the repeated name treatment and mobile header height from 134px to 102px at 320px. Logo returns home and has an accessible link name. |
| Footer | Added wrapping navigation, consistent copyright treatment, and comfortable touch targets. Removed the repeated clinical-method tagline that conflicted with the approved body copy. |
| CTAs | Reused existing primary, outline, secondary, and author CTA classes. Added normal-flow layout, minimum touch height, base outline padding/radius, wrapping, and non-shrinking arrow circles. Removed repeated text arrows from buttons. Fixed the book-section anchor and kept internal links in the same tab. |
| Cards and headings | Consistent card heading size and responsive padding. Fixed fixed-line-height utility conflicts that caused large heading letters to overlap. No forced equal card heights. |
| Copy | Removed old homepage Greek-life group/coaching positioning. Aligned About coaching copy and clinical approach metadata. Replaced generic scheduling link text and outdated author/preorder-page wording. Removed literal and encoded em dashes, including punctuation in quotations without changing their words. |
| Accessibility | Closed mobile drawer is hidden and inert. Added Escape, focus containment/return, background inert state, resize handling, skip links, labelled navigation, visible focus, correct Therapy heading hierarchy, form announcements and result focus, autocomplete, and reduced-motion support. Existing meaningful alt text and form privacy boundaries remain. |
| Blog continuity | Removed the duplicated Markdown title below the generated page title and made additional top-level Markdown headings section headings. |

## Workstream dependencies

- Incorporated completed coaching content from `e82c008`, including `coaching.css` and the About coaching section.
- Incorporated completed group content and interest-form behavior from `2914ceb`, including the group promotion on the coaching page and supporting group styles.
- These were composed in this branch without changing the other workstreams' checkouts. This branch contains the combined content needed for continuity QA.
- Workstream 1's broader shared design-system changes remain a separate integration dependency. This branch makes minimal fixes to the existing CTA classes rather than adding another button system. Its header/footer/menu changes must be retained when that workstream is integrated. The two stylesheet approaches should be reconciled at that point, followed by a check of the combined site.

## Verification

- Browser layout and runtime checks cover twelve page states at 1440px, 1280px, 768px, and 320px: homepage, Therapy, Coaching, Groups, Author, About, Contact, Speaking, Substack, preorder, thank-you, and a loaded blog post.
- Contact remains the homepage section, not a new route. Contact form behavior was tested separately from full-page screenshots.
- Final check results are recorded in the local QA output. Keyboard checks cover hidden-menu behavior, Tab and Shift+Tab containment, Escape, focus return, contact-anchor navigation, and resize to desktop.
- Both forms were exercised with intercepted failure and success responses, including retry. No test messages were transmitted. Live delivery, inbox routing, or automated email-list enrollment is not claimed.
- Source continuity test: twelve pages, required strategic copy, current group/coaching positioning, matching navigation, unique IDs, internal routes/fragments, and no literal/encoded em dashes.
- Security-header test, JavaScript syntax check, and diff whitespace check passed.
- The existing excerpt test fails on unchanged current main as well as this branch: it expects an older direct-PDF configuration, while current main retains an HTML redirect and Amazon excerpt destinations. The baseline failure was reproduced. The existing route was preserved.
- The full repository-privacy/archive test was not run against this partial checkout. Edited files contain no credentials, client information, or absolute home-directory paths.

## Remaining concerns

- Legacy preorder and thank-you copy still refers to the July release and preorder fulfillment. Actual signed-copy availability and fulfillment require a business decision before those transaction claims are rewritten.
- Formspree delivery and interest-list operations require live verification. The group form sends an interest request through the existing backend; it does not automatically enroll someone.
- Tailwind CDN production warning and the local Vercel analytics-script 404 are existing preview behavior. No browser JavaScript exceptions were observed in the completed confirmation checks.
- Local changes are committed for review. No push, merge to main, publication, or live account changes are part of this work.

## Files changed

- `index.html`, `about.html`, `therapy.html`, `coaching.html`, `peer-support.html`
- `author.html`, `speaking.html`, `substack.html`, `blog.html`, `blog/post.html`
- `preorder.html`, `preorder-thank-you.html`
- `site-updates.css`, `coaching.css`, `site-navigation.js`
- `tests/site-continuity.test.mjs`, `docs/site-continuity-qa.md`

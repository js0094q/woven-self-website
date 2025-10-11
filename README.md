# The Woven Self marketing site

A responsive, accessibility-forward landing page for Lauren Rivers, LPC and The Woven Self Therapeutic Services. The site highlights trauma therapy offerings, secure Alma booking, and makes it easy for new clients to connect.

## Tech stack
- Plain HTML + utility-first Tailwind CDN for layout
- Hand-authored CSS in `styles.css` for brand styling and motion controls
- Vanilla JavaScript for mobile navigation, Alma booking tracking, and contact form submission
- Playwright smoke tests for multi-browser/device coverage

## Getting started
1. **Install dependencies (installs Playwright browsers automatically)**
   ```bash
   npm install
   ```
   On Linux CI or fresh containers, add the system dependencies once:
   ```bash
   npm run playwright:install-deps
   ```
2. **Preview locally**
   ```bash
   npx http-server -p 4173
   ```
   Visit [http://localhost:4173](http://localhost:4173) and open `index.html`.
3. **Run automated checks**
   ```bash
   npm test
   ```
   This executes Playwright tests across desktop Chromium, desktop Firefox, Mobile Safari, and Pixel 5 viewports against the static `index.html` file.

## Contact form
- Powered by Formspree — update `FORM_ENDPOINT` in `index.html` with your production form ID before deploying.
- While testing locally (including in Playwright), the script simulates a network call so you can validate success messaging offline.

## Deployment
- Optimized for Vercel. The included `vercel.json` enforces security headers and clean URLs.
- Ensure the domain has an active SSL certificate (Vercel handles this automatically when you add a custom domain).

## Manual QA checklist
- [ ] Confirm hero buttons route to the Alma booking portal and Services section.
- [ ] Test hamburger navigation on narrow screens.
- [ ] Submit the contact form with valid data and verify the success state.
- [ ] Resize the browser to confirm responsive layouts across breakpoints.
- [ ] Validate embedded Google Map loads with `loading="lazy"`.
- [ ] Run `npm test` and resolve any Playwright failures before releasing.

## Accessibility considerations
- Skip navigation link for keyboard users
- Focus-visible styling for all interactive elements
- Semantic landmarks (`header`, `main`, `section`, `footer`) and descriptive headings
- `aria-live` feedback on form submission results
- Content avoids flashing animations and honours `prefers-reduced-motion`

## Content updates
- Replace placeholder testimonials with approved client statements.
- Update pricing, availability, and contact information as needed.
- Add the final privacy policy page and update the footer link once published.


# The Woven Self — static site

A minimalist, accessible static website for The Woven Self (wovenself.com), built with plain HTML + Tailwind CDN, deployed through GitHub → Vercel.

## Tech
- Plain HTML + CSS (no build step)
- Tailwind CSS via CDN
- Static blog (Markdown + JSON index)
- Vercel hosting and continuous deployment

## Quick start
```bash
python3 -m http.server 8080
```

## Stripe Preorder Setup
The website uses a Stripe-hosted Payment Link for book preorders. The site does not collect or store credit card data.

### Live Stripe Payment Link
https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00

### Product
Product name:
Folding Origami: A Memoir — Signed Paperback Preorder

Product description:
Preorder a signed paperback copy of Folding Origami: A Memoir by Loren Galese.
Release date: July 20. Each preorder includes a surprise from the author.
This is a preorder. Signed paperback copies will ship after release and printing are complete. If the fulfillment timeline changes materially, preorder customers will be notified by email.

### Price
$24.99 one-time payment.

### Website integration
The live Stripe Payment Link is used on `/preorder.html`.
The website flow is:
Author Page → Preorder Page → Stripe Checkout → Thank You Page

Configure the Stripe Payment Link success redirect to `https://wovenself.com/preorder-thank-you.html`.

Do not commit Stripe secret keys, restricted keys, API keys, or webhook secrets.

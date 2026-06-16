# Website Component Specs

## Scope

This file defines an optional campaign-section component that can be added to `author.html` or a future book landing page. Do not redesign the full website. Preserve the existing site structure, navigation, therapy links, Stripe checkout flow, security behavior, and page hierarchy.

The component should use `styles-campaign.css` classes:

- `campaign-section`
- `campaign-paper-card`
- `origami-corner`
- `campaign-label`
- `campaign-title`
- `campaign-body`
- `campaign-divider`
- `campaign-badge`
- `campaign-button`

## Optional Campaign Section

```html
<section class="campaign-section py-16" aria-labelledby="unfolding-origami-campaign-title">
  <div class="mx-auto max-w-5xl px-6">
    <div class="campaign-paper-card origami-corner p-8 md:p-10">
      <p class="campaign-label">Preorders open</p>
      <h2 id="unfolding-origami-campaign-title" class="campaign-title mt-3 text-3xl md:text-5xl">
        Unfolding Origami: A Memoir
      </h2>
      <p class="campaign-body mt-5 max-w-3xl">
        A trauma therapist's memoir about surviving trauma, re-defining your shape, and folding back to yourself.
      </p>
      <div class="campaign-divider my-7"></div>
      <div class="flex flex-wrap gap-3" aria-label="Preorder details">
        <span class="campaign-badge">Signed copy</span>
        <span class="campaign-badge">Surprise from Loren</span>
        <span class="campaign-badge">$24.99</span>
        <span class="campaign-badge">July 20</span>
      </div>
      <p class="campaign-body mt-7 max-w-3xl">
        For readers who have survived quietly, questioned themselves deeply, or are learning to trust their own instincts again.
      </p>
      <div class="mt-8 flex flex-wrap items-center gap-4">
        <a
          class="campaign-button"
          href="https://buy.stripe.com/dRm28r0bp9Mc8ocdD53cc00"
          target="_blank"
          rel="noopener noreferrer"
        >
          Preorder Now
        </a>
        <a class="campaign-body font-semibold underline underline-offset-4" href="/author.html">
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>
```

## Implementation Notes

- Include `styles-campaign.css` before using this component.
- Keep the component optional and scoped.
- Keep the Stripe URL unchanged.
- Keep the secondary `Learn More` link pointed to `/author.html`.
- Do not add payment handling, lead capture, therapy intake, or clinical forms.
- Do not use this component as a reason to change the full website design.

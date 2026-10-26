# deknit

Seven-page responsive static marketing site using design 2, Regular, airy.

## Preview

Run `python -m http.server 8000` in this directory and open http://localhost:8000.
No build step or dependencies are required. Deploy the repository root on any static host. Fonts load from Google Fonts with local fallbacks.

## Pages

- Home: index.html
- Services: services.html
- Academy: academy.html
- About: about.html
- Let's talk: lets-talk.html
- Privacy Policy: privacy.html
- Terms: terms.html

Shared presentation is in styles.css. Minimal form behavior is in script.js. The ribbon illustration is an accessible inline SVG in index.html.

## Before launch

- Replace the Calendly placeholder with the real booking URL or embed.
- Connect forms to a submission service. They currently open a mailto draft, validate required fields, and never claim a submission has been saved. Visitors must send the draft themselves.
- Set Academy chat hours and packages.
- Add founder photo and approved display name.
- Replace both legal policy placeholders with reviewed text.
- Verify the supplied service terms and Stripe customer portal availability before launch.

Each page also lists its placeholders in the footer. All supplied marketing copy is retained. No pricing, testimonials, client logos, or performance statistics have been added.

## Checks

Run `python tests/check_site.py` and `node --check script.js`.

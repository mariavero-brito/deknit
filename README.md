# deknit

Eight-page responsive static marketing site using design 2, Regular, airy.

## Preview

Run `python -m http.server 8000` in this directory and open http://localhost:8000.
No build step or dependencies are required. Deploy the repository root on any static host. Production hosting is Netlify (see netlify.toml): publish directory is the repository root and there is no build command. Fonts load from Google Fonts with local fallbacks.

## Pages

- Home: index.html
- Services: services.html
- Academy: academy.html
- About: about.html
- Let's talk: lets-talk.html
- Privacy Policy: privacy.html
- Terms: terms.html
- FAQ: faq.html (linked from Services, not in the main navigation)

Shared presentation is in styles.css. Minimal form behavior is in script.js. The ribbon illustration is an accessible inline SVG in index.html.

## Before launch

- Calendly is connected at https://calendly.com/get-deknit/30min. Review availability before launch.
- Forms are connected to Formspree as documented below. Live submission and email delivery have not been tested; do not send test submissions without the owner's explicit authorization.
- Set Academy chat hours and packages.
- Privacy Policy and Terms contain tailored drafts. Set the effective date, add a business address once you have one (see CAN-SPAM note below), then remove the draft banners before launch.
- Verify the supplied service terms and Stripe customer portal availability before launch.

All supplied marketing copy is retained. No pricing, testimonials, client logos, or performance statistics have been added.

## Checks

Run `python tests/check_site.py` and `node --check script.js`, then `node --test tests/forms.test.cjs` (mocked fetch only; no real submissions).


## Formspree

Project: deknit. Free plan, no paid features enabled.

| Form | Page | Endpoint | Notification recipient |
| --- | --- | --- | --- |
| deknit Contact | lets-talk.html | https://formspree.io/f/xgaaaygd | get.deknit@gmail.com |
| deknit Academy Waitlist | academy.html | https://formspree.io/f/mbgggkrj | get.deknit@gmail.com |

Name, email, and company are required on both forms. Contact message is required; waitlist message is optional. Waitlist team_size is required with a minimum of 1 (whole numbers in HTML). Backend workflow validations mirror these requirements. Existing labels and styling are retained.

The account email get.deknit@gmail.com was marked Verified in Formspree on October 26, 2026. No verification was pending. This confirms configuration, not inbox delivery. hello@deknit.com stays public and forwards through Porkbun; form notifications bypass that forwarding address.

Formshield is enabled on both forms; the standard free _gotcha honeypot is included in the HTML. CAPTCHA was already disabled and remains disabled for the AJAX integration. Do not enable a CAPTCHA without integrating its token handling.

JavaScript sends FormData with Accept: application/json, waits for an HTTP success and ok:true before showing success, blocks concurrent submissions, and preserves entries on validation, quota, server, malformed-response, and network errors. A 30-second timeout does not automatically retry because the request may already have reached Formspree. Without JavaScript the POST action still works using Formspree's hosted response.

Free-plan limits: 50 submissions per month shared across the account, unlimited forms/projects, 30 days of submission history, and up to two linked email addresses. File uploads, autoresponse emails, custom hosted thank-you redirects, and submission API access are not enabled. Monitor Usage in Formspree; no automatic upgrade has been authorized. See https://formspree.io/plans and https://help.formspree.io/articles/account-management/account-limits/.

No live submissions were sent. After deployment, an owner-authorized test should check both acceptance and inbox/spam delivery. Privacy and Terms remain drafts with unrelated business details still to complete.


## Business address

Privacy and Terms currently list no street address. Commercial email (for example Academy waitlist updates) generally needs a valid postal address in the footer under CAN-SPAM, so add a mailbox address before sending marketing email.

document.querySelectorAll('[data-formspree-form]').forEach(form => {
  const status = form.querySelector('[role="status"]');
  const button = form.querySelector('button[type="submit"]');
  const originalLabel = button.textContent;
  let pending = false;
  form.addEventListener('input', () => {
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    if (!pending) status.textContent = '';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const values = new FormData(form);
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending...';
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Sending...';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: values, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) {
        const errors = Array.isArray(data?.errors) ? data.errors : [];
        errors.forEach(error => {
          const field = form.elements.namedItem(error.field);
          if (field && typeof field.setAttribute === 'function') field.setAttribute('aria-invalid', 'true');
        });
        const detail = errors.map(error => error.message).filter(message => typeof message === 'string').join(' ');
        status.textContent = detail
          ? 'Could not submit: ' + detail + ' Your entries are still here. Please correct them and try again, or email hello@deknit.com.'
          : response.status === 429
            ? 'The form is temporarily at its submission limit. Your entries are still here. Please email hello@deknit.com or try again later.'
            : 'We could not confirm your submission. Your entries are still here. Please try again later or email hello@deknit.com.';
        return;
      }
      form.reset();
      status.textContent = form.dataset.kind === 'Academy waitlist'
        ? "Thanks! Your waitlist request was received. We'll email you when the academy opens."
        : "Thanks! Your message was received. We'll be in touch.";
    } catch (error) {
      status.textContent = 'We could not confirm your submission because the connection failed or timed out. Your entries are still here. It may have reached us; please check before retrying, or email hello@deknit.com.';
    } finally {
      clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
});

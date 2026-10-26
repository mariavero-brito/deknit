document.querySelectorAll('[data-email-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const lines = ['Name: ' + values.get('name'), 'Email: ' + values.get('email'), 'Company: ' + values.get('company')];
    if (values.has('team_size')) lines.push('Team size: ' + values.get('team_size'));
    lines.push('', "What's tangled?", String(values.get('message') || ''));
    const href = 'mailto:get.deknit@gmail.com?subject=' + encodeURIComponent('deknit: ' + form.dataset.kind) + '&body=' + encodeURIComponent(lines.join('\n'));
    const status = form.querySelector('[role="status"]');
    status.replaceChildren(document.createTextNode('Your email app will open a draft. Send it there to complete your request. If it does not open, email get.deknit@gmail.com. '));
    const retry = document.createElement('a');
    retry.href = href; retry.textContent = 'Open email draft';
    status.append(retry);
    window.location.href = href;
  });
});

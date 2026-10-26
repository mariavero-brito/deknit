// Runs the actual browser handler against isolated doubles. Never sends network requests.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../script.js'), 'utf8');
function setup(fetch, valid = true, kind = 'Discovery call enquiry') {
  const handlers = {}, status = {textContent: ''}, button = {textContent: 'Send', disabled: false};
  const field = {setAttribute(name, value) {this[name] = value;}};
  const form = {
    action: 'https://formspree.io/f/example', dataset: {kind}, resets: 0, value: 'Keep my entry',
    querySelector: selector => selector.startsWith('button') ? button : status,
    querySelectorAll: () => [], addEventListener: (name, handler) => handlers[name] = handler,
    reportValidity: () => valid, setAttribute() {}, removeAttribute() {},
    elements: {namedItem: () => field}, reset() {this.resets++; this.value = '';}
  };
  vm.runInNewContext(source, {
    document: {querySelectorAll: () => [form]}, fetch,
    FormData: class {constructor(f) {this.source = f;}}, AbortController, setTimeout, clearTimeout
  });
  return {form, status, button, field, submit: () => handlers.submit({preventDefault() {}})};
}
const reply = (ok, data, status = ok ? 200 : 422) => ({ok, status, json: async () => data});
test('waits for confirmed acceptance and blocks concurrent submissions', async () => {
  let release, calls = 0;
  const s = setup((url, opts) => {
    calls++; assert.equal(opts.method, 'POST'); assert.equal(opts.headers.Accept, 'application/json');
    return new Promise(resolve => release = resolve);
  });
  const pending = s.submit();
  assert.equal(s.button.disabled, true); assert.equal(s.form.resets, 0);
  await s.submit(); assert.equal(calls, 1);
  release(reply(true, {ok: true})); await pending;
  assert.equal(s.form.resets, 1); assert.match(s.status.textContent, /message was received/);
  assert.equal(s.button.disabled, false); assert.equal(s.button.textContent, 'Send');
});
test('validation prevents requests', async () => {
  const s = setup(() => {throw new Error('must not fetch');}, false);
  await s.submit(); assert.equal(s.form.resets, 0); assert.equal(s.status.textContent, '');
});
test('validation errors preserve entries and mark the field', async () => {
  const s = setup(async () => reply(false, {errors: [{field: 'email', message: 'Invalid email'}]}));
  await s.submit(); assert.equal(s.form.value, 'Keep my entry');
  assert.equal(s.field['aria-invalid'], 'true'); assert.match(s.status.textContent, /Invalid email/);
  assert.equal(s.button.disabled, false);
});
for (const [name, fetch] of [
  ['quota', async () => reply(false, {}, 429)],
  ['server', async () => reply(false, {}, 500)],
  ['unconfirmed success', async () => reply(true, {})],
  ['malformed JSON', async () => ({ok: true, json: async () => {throw Error('invalid JSON');}})],
  ['network', async () => {throw Error('offline');}],
  ['timeout', async () => {throw Object.assign(Error('timeout'), {name: 'AbortError'});}]
]) test(name + ' preserves entries and permits a later retry', async () => {
  const s = setup(fetch); await s.submit();
  assert.equal(s.form.resets, 0); assert.equal(s.form.value, 'Keep my entry');
  assert.equal(s.button.disabled, false); assert.match(s.status.textContent, /entries are still here/);
});
test('waitlist success uses the waitlist message', async () => {
  const s = setup(async () => reply(true, {ok:true}), true, 'Academy waitlist');
  await s.submit(); assert.match(s.status.textContent, /waitlist request was received/);
});

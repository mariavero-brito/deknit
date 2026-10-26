// Opens a click-to-open card when the page is loaded or navigated with its anchor,
// for example services.html#untangle. Without JavaScript the cards still open on click.
(function () {
  function openFromHash() {
    var id = '';
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (error) { return; }
    if (!id) return;
    var target = document.getElementById(id);
    if (target && target.tagName === 'DETAILS') target.open = true;
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();

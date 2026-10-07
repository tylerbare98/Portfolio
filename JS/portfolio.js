if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  document.querySelectorAll('[data-local]').forEach(link => { link.href = link.dataset.local; });
}

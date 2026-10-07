if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  document.querySelectorAll('[data-local]').forEach(link => { link.href = link.dataset.local; });
}

const navigation = document.querySelector('.site-nav');
const toolbar = navigation.querySelector('.nav-toolbar');
const menuToggle = navigation.querySelector('.menu-toggle');
const menuLinks = navigation.querySelector('.nav-links');
const compactNavigation = window.matchMedia('(max-width:800px)');

const closeNavigation = (restoreFocus = false) => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuLinks.hidden = compactNavigation.matches;
  if (restoreFocus) menuToggle.focus();
};

const updateNavigation = () => {
  const focusedLink = menuLinks.contains(document.activeElement);
  const focusedToggle = document.activeElement === menuToggle;
  menuToggle.hidden = !compactNavigation.matches;
  closeNavigation(compactNavigation.matches && focusedLink);
  if (!compactNavigation.matches && focusedToggle) menuLinks.querySelector('a').focus();
};

toolbar.classList.add('menu-ready');
updateNavigation();
compactNavigation.addEventListener('change', updateNavigation);
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuLinks.hidden = !open;
});
menuToggle.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    menuToggle.setAttribute('aria-expanded', 'true');
    menuLinks.hidden = false;
    menuLinks.querySelector('a').focus();
  }
});
navigation.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    event.preventDefault();
    closeNavigation(true);
  }
});
navigation.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget)) closeNavigation();
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target)) closeNavigation();
});
menuLinks.addEventListener('click', event => {
  if (event.target.closest('a') && compactNavigation.matches) closeNavigation(true);
});

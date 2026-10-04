const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.classList.add('enhanced');
  nav.classList.add('collapsible');
  function setExpanded(expanded) {
    menuButton.setAttribute('aria-expanded', String(expanded));
    nav.classList.toggle('open', expanded);
  }
  menuButton.addEventListener('click', () => {
    setExpanded(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setExpanded(false);
      menuButton.focus();
    }
  });
}


/**
 * ui.js — the menu
 *
 * Controls accessibility standards (focus management, escape key) and slide-out animations.
 */

(function () {
  const menu = document.getElementById('menu');
  const menuOpenBtn = document.getElementById('menu-open');
  const menuCloseBtn = document.getElementById('menu-close');
  const menuBackdrop = document.getElementById('menu-backdrop');
  const menuLinks = document.querySelectorAll('.menu__link');

  if (!menu || !menuOpenBtn || !menuCloseBtn || !menuBackdrop) {
    console.error('Terranova UI: Required menu DOM elements not found.');
    return;
  }

  // Set initial accessibility states
  menuOpenBtn.setAttribute('aria-expanded', 'false');
  menuOpenBtn.setAttribute('aria-haspopup', 'true');

  function setMenu(open) {
    if (open) {
      menu.classList.add('is-open');
      menuOpenBtn.setAttribute('aria-expanded', 'true');
      // Set timeout to avoid focus animation jitter or layout issues, focus the close button
      setTimeout(() => {
        menuCloseBtn.focus({ preventScroll: true });
      }, 50);
    } else {
      menu.classList.remove('is-open');
      menuOpenBtn.setAttribute('aria-expanded', 'false');
      // Return focus to the trigger button
      menuOpenBtn.focus();
    }
  }

  // Open button click
  menuOpenBtn.addEventListener('click', () => {
    setMenu(true);
  });

  // Close button click
  menuCloseBtn.addEventListener('click', () => {
    setMenu(false);
  });

  // Backdrop click closes the menu
  menuBackdrop.addEventListener('click', () => {
    setMenu(false);
  });

  // Escape key handler (only active when menu is open)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
    }
  });

  // Every link click closes the menu
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setMenu(false);
    });
  });

  // Basic Focus Trap: prevent tabbing out of the menu panel while open
  menu.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;

    if (event.key === 'Tab') {
      const focusableElements = [
        menuCloseBtn,
        ...Array.from(menuLinks),
        document.querySelector('.menu__mail')
      ].filter(el => el && typeof el.focus === 'function');

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab -> Wrap around to the last element
        if (document.activeElement === firstEl) {
          lastEl.focus();
          event.preventDefault();
        }
      } else {
        // Tab -> Wrap around to the first element
        if (document.activeElement === lastEl) {
          firstEl.focus();
          event.preventDefault();
        }
      }
    }
  });
})();

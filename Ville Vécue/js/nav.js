
  // ── Hamburger menu toggle ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    mobileNav.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', menuOpen);
    mobileNav.setAttribute('aria-hidden', !menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileNav.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      menuOpen = false;
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      mobileNav.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });

  // ── Dropdown desktop ──
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  let dropdownOpen = false;

  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownOpen = !dropdownOpen;
    dropdownToggle.setAttribute('aria-expanded', dropdownOpen);
    dropdownMenu.classList.toggle('open', dropdownOpen);
  });

  // Fermer en cliquant ailleurs
  document.addEventListener('click', () => {
    if (dropdownOpen) {
      dropdownOpen = false;
      dropdownToggle.setAttribute('aria-expanded', false);
      dropdownMenu.classList.remove('open');
    }
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownOpen) {
      dropdownOpen = false;
      dropdownToggle.setAttribute('aria-expanded', false);
      dropdownMenu.classList.remove('open');
    }
  });

  // ── Accordéon mobile Ateliers ──
  const accordionToggle = document.querySelector('.mobile-accordion-toggle');
  const accordionBody = document.querySelector('.mobile-accordion-body');

  accordionToggle.addEventListener('click', () => {
    const isOpen = accordionBody.classList.toggle('open');
    accordionToggle.classList.toggle('open', isOpen);
  });
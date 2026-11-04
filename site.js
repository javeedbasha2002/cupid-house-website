const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
const WAITRPOS_MENU_URL = ''; // Add Cupid House's public WaitrPOS customer app URL here.

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  nav?.classList.toggle('is-open', !expanded);
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const viewer = document.querySelector('.photo-viewer');
if (viewer) {
  const viewerImage = viewer.querySelector('img');
  const viewerCaption = viewer.querySelector('p');
  const closeViewer = () => viewer.close();
  viewer.querySelector('.viewer-close')?.addEventListener('click', closeViewer);
  viewer.addEventListener('click', (event) => { if (event.target === viewer) closeViewer(); });
  document.querySelectorAll('.hero-photo').forEach((photo) => {
    const open = () => {
      const image = photo.querySelector('img');
      viewerImage.src = image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = photo.querySelector('figcaption').textContent.trim();
      viewer.showModal();
    };
    photo.addEventListener('click', open);
    photo.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
    });
  });
}

// The menu QR is generated from the current public menu URL, so it stays correct
// when the template is deployed to a new café domain. The readable menu link
// remains available if the QR image service cannot be reached.
const localMenuUrl = new URL('menu.html', window.location.href).href;
const menuUrl = WAITRPOS_MENU_URL || localMenuUrl;
document.querySelectorAll('[data-qr]').forEach((image) => {
  const params = new URLSearchParams({ text: menuUrl, size: '240', margin: '2', dark: '6b142d', light: 'f6efe6', format: 'svg' });
  image.src = `https://quickchart.io/qr?${params.toString()}`;
});

if (WAITRPOS_MENU_URL) {
  document.querySelectorAll('a[href="menu.html"]').forEach((link) => {
    link.href = WAITRPOS_MENU_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  const handoffLink = document.querySelector('[data-waitr-menu]');
  if (handoffLink) {
    handoffLink.href = WAITRPOS_MENU_URL;
    handoffLink.removeAttribute('aria-disabled');
    handoffLink.target = '_blank';
    handoffLink.rel = 'noopener noreferrer';
    document.querySelector('[data-menu-status]')?.remove();
  }
  if (document.body.hasAttribute('data-menu-handoff')) {
    window.location.replace(WAITRPOS_MENU_URL);
  }
} else {
  document.querySelector('[data-waitr-menu]')?.addEventListener('click', (event) => event.preventDefault());
}

const revealTargets = document.querySelectorAll('.welcome, .night-card, .photo-strip, .story-copy, .visit-layout, .menu-spotlight');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    reveal.observe(target);
  });
}

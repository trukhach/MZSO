const header = document.querySelector('.site-header');
const toggle = header.querySelector('.menu-toggle');
const menuLabel = toggle.querySelector('.visually-hidden');
const nav = header.querySelector('#site-nav');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const mobile = matchMedia('(max-width: 870px)');

function setMenu(open, restoreFocus = false) {
  nav.classList.toggle('is-open', open);
  nav.inert = mobile.matches && !open;
  toggle.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? 'Закрыть меню' : 'Открыть меню';
  if (restoreFocus) toggle.focus();
}

function syncMenu() {
  const focusWasInMenu = nav.contains(document.activeElement);
  toggle.hidden = !mobile.matches;
  setMenu(false, mobile.matches && focusWasInMenu);
  if (!mobile.matches && document.activeElement === toggle) navLinks[0].focus();
}

syncMenu();
mobile.addEventListener('change', syncMenu);

toggle.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') === 'false');
});

nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || !mobile.matches) return;

  if (link.hash) document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
  setMenu(false, !link.hash);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false, true);
});

document.addEventListener('click', (event) => {
  if (!nav.classList.contains('is-open') || header.contains(event.target)) return;
  setMenu(false, nav.contains(document.activeElement));
});

header.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenu(false);
});

const sections = navLinks
  .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
  .sort((a, b) => a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

let scrollFrame = 0;
let currentLink = null;

function updateNavigation() {
  scrollFrame = 0;
  header.classList.toggle('is-scrolled', window.scrollY > 4);
  const marker = header.offsetHeight + Math.min(window.innerHeight * .26, 160);
  let nextLink = null;

  for (const { link, target } of sections) {
    if (target.getBoundingClientRect().top > marker) break;
    nextLink = link;
  }

  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    nextLink = sections.at(-1).link;
  }

  if (nextLink === currentLink) return;
  currentLink?.removeAttribute('aria-current');
  nextLink?.setAttribute('aria-current', 'location');
  currentLink = nextLink;
}

function scheduleNavigation() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNavigation);
}

window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('pageshow', scheduleNavigation);
updateNavigation();

if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.add('is-visible');
      observer.unobserve(target);
    }
  });

  for (const element of document.querySelectorAll('[data-reveal]')) {
    if (element.getBoundingClientRect().top < window.innerHeight) continue;
    element.classList.add('will-reveal');
    observer.observe(element);
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();

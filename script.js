// Set active nav link based on pathname, including section matches (e.g., /products/* -> products.html)
document.addEventListener('DOMContentLoaded', function () {
  try {
    const links = document.querySelectorAll('.app-header .nav .nav-links a.frutiger-aero-button');
    const path = window.location.pathname.replace(/\/index\.html$/,'').replace(/\/$/, '');
    const segments = path.split('/').filter(Boolean);
    // join then strip any trailing .html so '/support.html' -> 'support'
    const current = segments.join('/').replace(/\.html$/,''); // e.g. 'products' or 'products/fence-features'

    console.debug('nav-active: current path=', window.location.pathname, 'normalized=', current);

    links.forEach(link => {
      // Resolve the link's path relative to the current document so ../ links work correctly
      let url;
      try { url = new URL(link.getAttribute('href'), location.href); } catch (e) { return; }
      let linkPath = url.pathname.replace(/\/$/, '');
      // normalize and remove leading slash
      let linkBase = linkPath.replace(/^\//, '');
      // strip .html if present
      linkBase = linkBase.replace(/\.html$/, '');

      // Determine match: exact page OR current is inside link's section
      const isExact = (current === linkBase) || (current === '' && (linkBase === '' || linkBase === 'index'));
      const isSection = linkBase && (current === linkBase || current.startsWith(linkBase + '/'));

      if (isExact || isSection) {
        console.debug('nav-active: matching link', link.getAttribute('href'), '->', linkBase, 'match type:', isExact ? 'exact' : (isSection ? 'section' : 'none'));
        link.setAttribute('aria-current', 'page');
        link.classList.add('active');
        // Mark parent <li> so browsers without :has() can style the lifted tab
        if (link.parentElement && link.parentElement.tagName === 'LI') {
          link.parentElement.classList.add('active-tab');
        }
      } else {
        link.removeAttribute('aria-current');
        link.classList.remove('active');
        if (link.parentElement && link.parentElement.tagName === 'LI') {
          link.parentElement.classList.remove('active-tab');
        }
      }
    });
  } catch (err) { console.error(err); }
});

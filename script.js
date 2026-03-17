/**
 * Citri Software - UI Controller
 * Handles: Active Nav States, Logo Animations, and Path Normalization
 */

document.addEventListener('DOMContentLoaded', function () {
    try {
        // 1. SELECTORS
        const links = document.querySelectorAll('.nav-links a.frutiger-aero-button');
        const logoGroup = document.querySelector('.brand-group');
        
        // 2. PATH NORMALIZATION
        // Strips leading/trailing slashes and index.html to find the "base" page name
        const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
        const segments = path.split('/').filter(Boolean);
        const current = segments.join('/').replace(/\.html$/, ''); 

        console.debug('Citri-UI: Path detected ->', current || 'home');

        // 3. ACTIVE STATE LOGIC
        links.forEach(link => {
            let url;
            try { 
                url = new URL(link.getAttribute('href'), location.href); 
            } catch (e) { 
                return; 
            }

            // Normalize link path for comparison
            let linkPath = url.pathname.replace(/\/$/, '');
            let linkBase = linkPath.replace(/^\//, '').replace(/\.html$/, '');

            // Check for Exact match or Section match (e.g., /products/details matches /products)
            const isExact = (current === linkBase) || (current === '' && (linkBase === '' || linkBase === 'index'));
            const isSection = linkBase && (current === linkBase || current.startsWith(linkBase + '/'));

            if (isExact || isSection) {
                // Apply Active Glow & ARIA states
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                
                // Lift parent container if needed
                if (link.parentElement && link.parentElement.tagName === 'LI') {
                    link.parentElement.classList.add('active-tab');
                }
                
                console.debug('Citri-UI: Activated ->', linkBase);
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                if (link.parentElement && link.parentElement.tagName === 'LI') {
                    link.parentElement.classList.remove('active-tab');
                }
            }
        });

        // 4. INTERACTIVE LOGO (Extra Polish)
        // This ensures the wobble triggers cleanly on the logo group
        if (logoGroup) {
            logoGroup.addEventListener('mouseenter', () => {
                console.debug('Citri-UI: Logo Wobble Start');
            });
        }

    } catch (err) { 
        console.error('Citri-UI Error:', err); 
    }
});
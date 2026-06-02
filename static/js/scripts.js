const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];

function parseCssLength(value, rootFontSize) {
    const normalized = `${value || ''}`.trim();
    if (!normalized) {
        return 0;
    }

    const numeric = Number.parseFloat(normalized);
    if (Number.isNaN(numeric)) {
        return 0;
    }

    if (normalized.endsWith('rem')) {
        return numeric * rootFontSize;
    }

    return numeric;
}

function lockSidebarCard() {
    const sidebar = document.querySelector('.profile-sidebar');
    const card = sidebar ? sidebar.querySelector('.profile-card') : null;

    if (!sidebar || !card) {
        return;
    }

    if (window.innerWidth <= 991) {
        sidebar.classList.remove('sidebar-locked');
        sidebar.style.removeProperty('--sidebar-lock-top');
        sidebar.style.removeProperty('--sidebar-lock-left');
        sidebar.style.removeProperty('--sidebar-lock-width');
        sidebar.style.removeProperty('--profile-card-height');
        return;
    }

    sidebar.classList.remove('sidebar-locked');

    window.requestAnimationFrame(() => {
        if (window.innerWidth <= 991) {
            return;
        }

        const rect = sidebar.getBoundingClientRect();
        const cardHeight = card.offsetHeight;
        const rootStyles = window.getComputedStyle(document.documentElement);
        const rootFontSize = Number.parseFloat(rootStyles.fontSize) || 16;
        const sidebarOffset = parseCssLength(rootStyles.getPropertyValue('--sidebar-offset'), rootFontSize);

        sidebar.style.setProperty('--sidebar-lock-top', `${sidebarOffset}px`);
        sidebar.style.setProperty('--sidebar-lock-left', `${rect.left}px`);
        sidebar.style.setProperty('--sidebar-lock-width', `${sidebar.offsetWidth}px`);
        sidebar.style.setProperty('--profile-card-height', `${cardHeight}px`);
        sidebar.classList.add('sidebar-locked');
    });
}

function bindConfigLinks(yml) {
    const optionalLinks = [
        ['sidebar-email-link', yml['sidebar-email-link']],
        ['sidebar-github-link', yml['sidebar-github-link']],
        ['sidebar-scholar-link', yml['sidebar-scholar-link']],
        ['sidebar-orcid-link', yml['sidebar-orcid-link']],
        ['sidebar-rg-link', yml['sidebar-rg-link']]
    ];

    optionalLinks.forEach(([id, href]) => {
        const element = document.getElementById(id);
        if (!element) {
            return;
        }
        if (href && href !== '#') {
            element.href = href;
            element.classList.remove('is-placeholder');
        } else {
            element.removeAttribute('href');
            element.classList.add('is-placeholder');
        }
    });
}

function refreshScrollSpy() {
    // No-op: Using native IntersectionObserver which auto-refreshes
}

function setActiveNavLink(hash) {
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === hash;
        link.classList.toggle('active', isActive);
    });
    updateMobileIndicator(hash);
}

function updateMobileIndicator(hash) {
    const indicator = document.getElementById('mobileSectionIndicator');
    if (!indicator) return;
    const activeLink = document.querySelector(`#navbarResponsive .nav-link[href="${hash}"]`);
    indicator.textContent = activeLink ? activeLink.textContent : '';
}

function enhanceDetailsAnimations(root = document) {
    const detailsElements = root.querySelectorAll('details');
    detailsElements.forEach((details) => {
        if (details.dataset.enhanced === 'true') {
            return;
        }
        details.dataset.enhanced = 'true';

        const body = details.querySelector('.details-body');
        if (!body) {
            return;
        }

        if (details.hasAttribute('open')) {
            details.classList.add('is-open');
        }

        details.addEventListener('toggle', () => {
            if (details.open) {
                details.classList.add('is-open');
            } else {
                details.classList.remove('is-open');
            }

            refreshScrollSpy();
        });
    });
}


window.addEventListener('DOMContentLoaded', event => {

    // Custom scroll spy using native IntersectionObserver
    // More reliable than Bootstrap ScrollSpy on mobile browsers
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    const sections = [];

    navLinks.forEach(link => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#')) {
            const section = document.querySelector(hash);
            if (section) {
                sections.push({ id: hash, element: section, link: link });
            }
        }
    });

    let currentActive = null;

    const observerCallback = (entries) => {
        // Find the section that's most visible in the viewport
        let maxRatio = 0;
        let mostVisible = null;

        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                mostVisible = entry.target;
            }
        });

        if (mostVisible && mostVisible.id !== currentActive) {
            currentActive = mostVisible.id;
            const hash = '#' + currentActive;

            // Update nav links
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === hash);
            });

            // Update mobile indicator
            updateMobileIndicator(hash);
        }
    };

    const observer = new IntersectionObserver(observerCallback, {
        root: null, // Use viewport
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the middle 20% of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(({ element }) => observer.observe(element));

    // Initialize with current hash or first section
    if (window.location.hash && document.querySelector(window.location.hash)) {
        setActiveNavLink(window.location.hash);
    } else if (sections.length > 0) {
        setActiveNavLink(sections[0].id);
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');
    responsiveNavItems.forEach(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            const hash = responsiveNavItem.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                setActiveNavLink(hash);
                window.setTimeout(refreshScrollSpy, 120);
            }

            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                if (key.endsWith('-link')) {
                    return;
                }
                try {
                    document.getElementById(key).textContent = yml[key];
                } catch {
                    console.warn(`Unknown config key: ${key}`);
                }

            })
            bindConfigLinks(yml);
            lockSidebarCard();
        })
        .catch(error => console.error(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
                enhanceDetailsAnimations(document.getElementById(name + '-md'));
                refreshScrollSpy();
                lockSidebarCard();
            })
            .catch(error => console.error(error));
    })

    window.addEventListener('hashchange', () => {
        if (window.location.hash) {
            setActiveNavLink(window.location.hash);
        }
        refreshScrollSpy();
    });

    window.addEventListener('load', lockSidebarCard);
    window.addEventListener('resize', lockSidebarCard);

}); 

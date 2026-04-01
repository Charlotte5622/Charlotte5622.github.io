const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'awards', 'experience', 'publications'];
let scrollSpyInstance = null;

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

        const rect = card.getBoundingClientRect();
        const cardHeight = card.offsetHeight;
        const rootStyles = window.getComputedStyle(document.documentElement);
        const sidebarOffset = Number.parseFloat(rootStyles.getPropertyValue('--sidebar-offset')) || 0;

        sidebar.style.setProperty('--sidebar-lock-top', `${Math.max(rect.top, sidebarOffset)}px`);
        sidebar.style.setProperty('--sidebar-lock-left', `${rect.left}px`);
        sidebar.style.setProperty('--sidebar-lock-width', `${rect.width}px`);
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
    if (!scrollSpyInstance) {
        return;
    }

    window.requestAnimationFrame(() => {
        scrollSpyInstance.refresh();
    });
}

function setActiveNavLink(hash) {
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === hash;
        link.classList.toggle('active', isActive);
    });
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

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        scrollSpyInstance = new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

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

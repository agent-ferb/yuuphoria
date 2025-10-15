/**
 * Main JavaScript file for the portfolio website.
 * Handles component loading and mobile navigation.
 */

document.addEventListener("DOMContentLoaded", function() {

    const initializeMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNavContainer = document.getElementById('mobile-nav');

        if (menuToggle && mobileNavContainer) {
            menuToggle.addEventListener('click', function() {
                menuToggle.classList.toggle('active');
                mobileNavContainer.classList.toggle('active');
            });
        }
    };

    const initializeActiveNavLinks = () => {
        const navLinks = document.querySelectorAll('.header-nav-center a');
        if (navLinks.length === 0) return; // Exit if nav isn't loaded yet

        const currentPath = window.location.pathname.split("/").pop();

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Reset active class on all links first
            link.classList.remove('active');

            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
        
        // Handle homepage case where currentPath might be empty
        if (currentPath === '' || currentPath === 'index.html') {
             const homeLink = document.querySelector('.header-nav-center a[href="index.html"]');
             if(homeLink) homeLink.classList.add('active');
        }
    };

    const loadComponent = (elementId, filePath, callback) => {
        const element = document.getElementById(elementId);
        if (element) {
            fetch(filePath)
                .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${filePath}`))
                .then(data => {
                    element.innerHTML = data;
                    if (callback) callback();
                })
                .catch(error => console.error("Error loading component:", error));
        }
    };

    // Load components and then initialize scripts that depend on them
    loadComponent("header-placeholder", "header.html", () => {
        initializeMobileMenu();
        initializeActiveNavLinks(); // Initialize active links AFTER header is loaded
    });
    
    loadComponent("footer-placeholder", "footer.html");

});
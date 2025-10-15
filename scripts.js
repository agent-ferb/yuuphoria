/**
 * Main JavaScript file for the portfolio website.
 * Handles component loading and mobile navigation.
 * Current Date: October 14, 2025
 */

document.addEventListener("DOMContentLoaded", function() {

    // --- Mobile Menu Toggle Function ---
    // This function finds the menu button and adds the click event.
    // We will call this function AFTER the header has been loaded.
    const initializeMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', function() {
                menuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });
        }
    };

    // --- NEW: Active Navigation Link Logic ---
    // This function finds the current page link and adds the 'active' class.
    const initializeActiveNavLinks = () => {
        const navLinks = document.querySelectorAll('.header-nav-center a');
        const currentPath = window.location.pathname;

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            // Handle root path case for index.html
            if (linkPath === "index.html" && (currentPath === '/' || currentPath.endsWith('/index.html'))) {
                link.classList.add('active');
                return;
            }
            
            // Handle other pages, ensuring it's not the homepage link
            if (linkPath !== "index.html" && currentPath.endsWith(linkPath)) {
                link.classList.add('active');
            }
        });
    };

    // --- Reusable Component Loader ---
    // This function fetches HTML content and injects it into the page.
    // It now accepts a 'callback' function to run after loading is complete.
    const loadComponent = (elementId, filePath, callback) => {
        const element = document.getElementById(elementId);
        if (element) {
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // If a callback function was provided, execute it now.
                    if (callback) {
                        callback();
                    }
                })
                .catch(error => {
                    console.error("Error loading component:", error);
                    element.innerHTML = `<p style="color:red; text-align:center;">Failed to load ${elementId}.</p>`;
                });
        }
    };

    // Load the footer.
    loadComponent("footer-placeholder", "footer.html");

    // Load the header, and AFTER it's loaded, initialize BOTH the mobile menu and the active link logic.
    loadComponent("header-placeholder", "header.html", () => {
        initializeMobileMenu();
        initializeActiveNavLinks();
    });

}); // This is the correct closing brace for the 'DOMContentLoaded' event listener.
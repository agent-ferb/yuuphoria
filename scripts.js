/**
 * Main JavaScript file for the portfolio website.
 * Handles component loading and mobile navigation.
 * Current Date: October 14, 2025
 */

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. Reusable Component Loader ---
    // This function fetches the content of a file (like header.html) 
    // and injects it into a specified element on the page.
    const loadComponent = (elementId, filePath) => {
        const element = document.getElementById(elementId);
        // Only proceed if the placeholder element exists on the page
        if (element) {
            fetch(filePath)
                .then(response => {
                    // Check if the file was found
                    if (!response.ok) {
                        throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    // Place the loaded HTML content into the placeholder
                    element.innerHTML = data;
                })
                .catch(error => {
                    console.error("Error loading component:", error);
                    element.innerHTML = `<p style="color:red; text-align:center;">Failed to load ${elementId}.</p>`;
                });
        }
    };

    // Load the header and footer into their respective placeholders
    loadComponent("header-placeholder", "header.html");
    loadComponent("footer-placeholder", "footer.html");


    // --- 2. Mobile Menu Toggle ---
    // We need to wait a moment for the header to be loaded before we can find the menu button.
    // A simple timeout is a straightforward way to do this.
    setTimeout(() => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');

        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', function() {
                // Toggle the 'active' class on both the button (for the 'X' animation)
                // and the nav container (to slide it into view).
                menuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });
        }
    }, 50); // 50 milliseconds should be enough for the local file to load.

});
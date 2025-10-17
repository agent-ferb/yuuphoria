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

    // --- NEW FUNCTION: Photo Stack for Journey Page ---
    const initializeJourneyPhotoStack = () => {
        // 1. 查找所有 .post-card-image 容器
        const imageContainers = document.querySelectorAll(".post-card-image");

        // 如果此页面上没有 .post-card-image 元素 (例如在 index.html)，则提前退出
        if (imageContainers.length === 0) return;

        imageContainers.forEach(container => {
            // 2. 查找容器内的所有图片
            const images = container.querySelectorAll("img");
            
            // 3. 仅当图片多于 1 张时，才激活堆叠效果
            if (images.length > 1) {
                
                // 为容器添加 'photo-stack' 类以激活 CSS 样式
                container.classList.add("photo-stack");

                // --- 创建翻页箭头 ---
                
                // 创建 "Next" 按钮 (右)
                const nextBtn = document.createElement("button");
                nextBtn.classList.add("stack-nav", "stack-nav-next");
                nextBtn.innerHTML = "&#8250;"; // HTML 实体: >
                nextBtn.setAttribute("aria-label", "Next Photo");
                
                // 创建 "Prev" 按钮 (左)
                const prevBtn = document.createElement("button");
                prevBtn.classList.add("stack-nav", "stack-nav-prev");
                prevBtn.innerHTML = "&#8249;"; // HTML 实体: <
                prevBtn.setAttribute("aria-label", "Previous Photo");

                // 将按钮添加到容器中
                container.appendChild(prevBtn);
                container.appendChild(nextBtn);

                // --- 添加点击事件逻辑 ---

                // 点击 "Next"
                nextBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); // 防止触发卡片点击 (如果未来有的话)
                    // 获取当前所有图片 (顺序会变)
                    const currentImages = container.querySelectorAll("img");
                    // 将第一张 (最顶上) 的图片移动到容器的末尾
                    container.appendChild(currentImages[0]);
                });

                // 点击 "Prev"
                prevBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    // 获取当前所有图片的数组
                    const currentImages = Array.from(container.querySelectorAll("img"));
                    // 获取最后一张 (最底下) 的图片
                    const lastImage = currentImages[currentImages.length - 1];
                    // 将最后一张图片移动到容器的开头
                    container.prepend(lastImage);
                });
            }
        });
    };
    // --- END NEW FUNCTION ---

    // Load components and then initialize scripts that depend on them
    loadComponent("header-placeholder", "header.html", () => {
        initializeMobileMenu();
        initializeActiveNavLinks(); // Initialize active links AFTER header is loaded
    });
    
    loadComponent("footer-placeholder", "footer.html");

    // 在页面加载时运行照片堆叠函数
    initializeJourneyPhotoStack();
});
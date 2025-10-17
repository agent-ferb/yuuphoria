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

                // --- 4. NEW: 解决问题 #4 (保留角度) ---
                // 定义初始堆叠的角度
                // (这些角度对应我们即将修改的 CSS)
                const initialRotations = ['3deg', '-2deg', '2deg'];

                images.forEach((img, index) => {
                    // 从数组中获取角度，如果照片多于3张，则默认为 0
                    const rotation = initialRotations[index] || '0deg';
                    
                    // 将这个角度作为 "邮票" 永久地盖在图片上
                    img.style.setProperty('--rotation', rotation);
                });
                // --- END NEW SECTION ---

                // --- 5. 重构翻页逻辑 ---
                const goToNext = () => {
                    const currentImages = container.querySelectorAll("img");
                    container.appendChild(currentImages[0]); // 将第一张移到末尾
                };

                const goToPrev = () => {
                    const currentImages = Array.from(container.querySelectorAll("img"));
                    const lastImage = currentImages[currentImages.length - 1];
                    container.prepend(lastImage); // 将最后一张移到开头
                };

                // --- 5. 创建箭头 (用于桌面端) ---
                const nextBtn = document.createElement("button");
                nextBtn.classList.add("stack-nav", "stack-nav-next");
                // nextBtn.innerHTML = "&#8250;"; // <-- 已按您的建议移除
                nextBtn.setAttribute("aria-label", "Next Photo");
                
                const prevBtn = document.createElement("button");
                prevBtn.classList.add("stack-nav", "stack-nav-prev");
                // prevBtn.innerHTML = "&#8249;"; // <-- 已按您的建议移除
                prevBtn.setAttribute("aria-label", "Previous Photo");

                container.appendChild(prevBtn);
                container.appendChild(nextBtn);

                // --- 6. 绑定桌面端点击事件 ---
                nextBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); 
                    goToNext();
                });

                prevBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    goToPrev();
                });

                // --- 7. NEW: 添加移动端滑动事件 ---
                let touchstartX = 0;
                let touchendX = 0;
                const swipeThreshold = 60; // 滑动超过 60px 才触发

                container.addEventListener('touchstart', (e) => {
                    touchstartX = e.changedTouches[0].screenX;
                }, { passive: true }); // 使用 passive 提高性能

                container.addEventListener('touchend', (e) => {
                    touchendX = e.changedTouches[0].screenX;
                    handleSwipe();
                }, { passive: true });

                const handleSwipe = () => {
                    const deltaX = touchendX - touchstartX;
                    
                    if (deltaX < -swipeThreshold) {
                        // 向左滑动 (Next)
                        goToNext();
                    } else if (deltaX > swipeThreshold) {
                        // 向右滑动 (Prev)
                        goToPrev();
                    }
                    // 重置
                    touchstartX = 0;
                    touchendX = 0;
                }
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
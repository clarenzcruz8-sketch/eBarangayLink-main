// ========================================
// ENHANCED GOVERNMENT WEBSITE JAVASCRIPT
// eBarangayLink - Premium Interactions
// ========================================

(function() {
    'use strict';

    // ==========================================
    // PAGE LOADER
    // ==========================================
    if (window) {
    window.addEventListener('load', function() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            setTimeout(function() {
                loader.classList.add('hidden');
                // Enable scroll after loader
                document.body.style.overflow = 'visible';
            }, 800);
        }
    });
}

    // Disable scroll until page loads
    document.body.style.overflow = 'hidden';

    // ==========================================
    // DOM READY
    // ==========================================
    if (document) {
    document.addEventListener('DOMContentLoaded', function() {
        
        // ==========================================
        // MOBILE MENU TOGGLE
        // ==========================================
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mainNav = document.getElementById('mainNav');
        const body = document.body;
        
        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        }

        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });

        // ==========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ==========================================
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // ==========================================
        // SCROLL PROGRESS BAR
        // ==========================================
        const scrollProgress = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight);
            
            if (scrollProgress) {
                scrollProgress.style.transform = `scaleX(${scrolled})`;
            }
        });

        // ==========================================
        // SCROLL TO TOP BUTTON
        // ==========================================
        const scrollTopBtn = document.getElementById('arrowUp');
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // ==========================================
        // HEADER SCROLL EFFECT
        // ==========================================
        const header = document.getElementById('mainHeader');
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });

        // ==========================================
        // ACTIVE NAV LINK ON SCROLL
        // ==========================================
        const sections = document.querySelectorAll('section[id], main[id]');
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // ==========================================
        // DEMO BUTTON SCROLL
        // ==========================================
        const demoBtn = document.getElementById('demoBtn');
        const learnMoreBtn = document.getElementById('learnMoreBtn');
        
        if (demoBtn) {
            demoBtn.addEventListener('click', function() {
                const demoSection = document.getElementById('demo');
                if (demoSection) {
                    const headerOffset = 90;
                    const elementPosition = demoSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function() {
                const aboutSection = document.getElementById('aboutSection');
                if (aboutSection) {
                    const headerOffset = 90;
                    const elementPosition = aboutSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }

        // ==========================================
        // LOGIN BUTTON REDIRECT
        // ==========================================
        const loginBtn = document.getElementById('landingPageLogin');
        if (loginBtn) {
            loginBtn.addEventListener('click', function() {
                window.location.href = '/Sign-up.html';
            });
        }

        // ==========================================
        // INTERSECTION OBSERVER FOR ANIMATIONS
        // ==========================================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Stagger animation
                }
            });
        }, observerOptions);

        // Add animations to elements
        const animatedElements = document.querySelectorAll(
            '.about-card, .feature-card, .process-card, .developer-card, ' +
            '.stat-card, .demo-video-wrapper, .trust-item'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        // ==========================================
        // VIDEO PLAY OVERLAY
        // ==========================================
        const videoPlayOverlay = document.getElementById('videoPlayOverlay');
        if (videoPlayOverlay) {
            videoPlayOverlay.addEventListener('click', function() {
                this.style.display = 'none';
                const iframe = this.nextElementSibling;
                if (iframe && iframe.tagName === 'IFRAME') {
                    const src = iframe.getAttribute('src');
                    iframe.setAttribute('src', src + '&autoplay=1');
                }
            });
        }

        // ==========================================
        // STATS COUNTER ANIMATION
        // ==========================================
        const statNumbers = document.querySelectorAll('.stat-number');
        let statsAnimated = false;

        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    statNumbers.forEach(stat => {
                        animateCounter(stat);
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }

        function animateCounter(element) {
            const target = element.textContent.trim();
            const isPercentage = target.includes('%');
            const isPlusSign = target.includes('+');
            const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
            
            if (isNaN(numericValue)) return;

            let current = 0;
            const increment = numericValue / 60; // 60 frames
            const duration = 2000; // 2 seconds
            const frameTime = duration / 60;

            const counter = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(counter);
                }
                
                let displayValue = Math.floor(current);
                if (numericValue % 1 !== 0) {
                    displayValue = current.toFixed(1);
                }
                
                element.textContent = displayValue + (isPlusSign ? '+' : '') + (isPercentage ? '%' : '');
            }, frameTime);
        }

        // ==========================================
        // PARALLAX EFFECT FOR HERO
        // ==========================================
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                
                if (scrolled < heroSection.offsetHeight) {
                    heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                }
            });
        }

        // ==========================================
        // FORM VALIDATION (if exists)
        // ==========================================
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;

                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });

                if (isValid) {
                    // Submit form or show success message
                    console.log('Form is valid and ready to submit');
                    // form.submit();
                }
            });
        });

        // ==========================================
        // KEYBOARD NAVIGATION
        // ==========================================
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }

            // Arrow up key scrolls to top
            if (e.key === 'Home' && e.ctrlKey) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        // ==========================================
        // LAZY LOAD IMAGES
        // ==========================================
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // ==========================================
        // PREVENT ANIMATION ON RESIZE
        // ==========================================
        let resizeTimer;
        window.addEventListener('resize', function() {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });

        // ==========================================
        // CONSOLE MESSAGE
        // ==========================================
        console.log(
            '%c 🇵🇭 eBarangayLink - Government Digital Platform ',
            'background: linear-gradient(135deg, #0038A8 0%, #CE1126 100%); color: white; font-size: 16px; padding: 12px 24px; border-radius: 4px; font-weight: bold;'
        );
        console.log(
            '%c Developed for Barangay Parada, Sta. Maria, Bulacan ',
            'background: #f5f7fa; color: #0038A8; font-size: 12px; padding: 8px 16px; border-radius: 4px;'
        );
        console.log(
            '%c For technical support, contact the development team ',
            'color: #6b7280; font-size: 11px; padding: 4px 0;'
        );

        // ==========================================
        // PERFORMANCE MONITORING
        // ==========================================
        if (window.performance) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
                }, 0);
            });
        }

    }); // End DOMContentLoaded
}

    // ==========================================
    // SERVICE WORKER (Optional - for PWA)
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Uncomment to enable service worker
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('Service Worker registered'))
            //     .catch(err => console.log('Service Worker registration failed'));
        });
    }

})();
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.querySelector('.status-text');
    const skipLoader = document.getElementById('skip-loader');

    // --- Preloader Logic ---

    // DOMContentLoaded is fired when the initial HTML document has been completely loaded and parsed,
    // without waiting for stylesheets, images, and subframes to finish loading.
    // We use it here to start the fake progress bar animation early.

    // window.load is fired when the whole page has loaded, including all dependent resources
    // such as stylesheets, scripts, iframes, and images. This is the safest point
    // to assume the user can see the full content, so we use it to finally hide the preloader.

    let progress = 0;
    let fakeProgressInterval;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startFakeProgress = () => {
        if (prefersReducedMotion) {
            updateProgress(100);
            completeLoading();
            return;
        }

        fakeProgressInterval = setInterval(() => {
            progress += Math.random() * 2.5; // Slower progress
            if (progress >= 90) {
                progress = 90;
                clearInterval(fakeProgressInterval);
            }
            updateProgress(progress);
        }, 200);
    };

    const updateProgress = (value) => {
        const percentage = Math.min(value, 100);
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);

        if (percentage < 30) {
            statusText.textContent = '正在初始化...';
        } else if (percentage < 70) {
            statusText.textContent = '準備資源中...';
        } else if (percentage < 100) {
            statusText.textContent = '即將完成...';
        } else {
            statusText.textContent = '載入完成！';
        }
    };

    const completeLoading = () => {
        clearInterval(fakeProgressInterval);
        clearTimeout(loadingTimeout);

        updateProgress(100);

        setTimeout(() => {
            mainContent.style.visibility = 'visible';
            mainContent.classList.add('visible');
            preloader.classList.add('hidden');

            // Restore scrolling
            document.body.style.overflow = '';

            // After the preloader is hidden, remove it from the DOM to prevent interference
            preloader.addEventListener('transitionend', () => {
                preloader.remove();
            });
        }, 400);
    };

    // Start the loading process
    document.body.style.overflow = 'hidden'; // Lock scroll
    startFakeProgress();

    // Listen for the final load event
    window.addEventListener('load', completeLoading);

    // Timeout fallback
    const loadingTimeout = setTimeout(completeLoading, 16000); // 16 seconds

    // Skip button
    skipLoader.addEventListener('click', () => {
        completeLoading();
    });


    // --- Existing Interactivity ---

    const backToTopButton = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    // Smooth scroll for anchor links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Back to top button visibility
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Section visibility on scroll for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    if (!prefersReducedMotion) {
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
         sections.forEach(section => {
            section.classList.add('visible');
        });
    }
});
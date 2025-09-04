document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
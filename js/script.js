// Quickinn Cloud PMS - JavaScript

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.header-content')) {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav?.classList.remove('active');
            mobileMenuToggle?.classList.remove('active');
        });
    });

    // Pricing Toggle
    const billingToggle = document.getElementById('billingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const priceAmounts = document.querySelectorAll('.pricing-price .amount');

    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;

            // Update toggle labels
            toggleLabels.forEach(label => {
                if (label.dataset.period === 'annual') {
                    label.classList.toggle('active', isAnnual);
                } else {
                    label.classList.toggle('active', !isAnnual);
                }
            });

            // Update prices
            priceAmounts.forEach(amount => {
                const monthly = amount.dataset.monthly;
                const annual = amount.dataset.annual;
                amount.textContent = isAnnual ? annual : monthly;
            });
        });

        // Make labels clickable
        toggleLabels.forEach(label => {
            label.addEventListener('click', function() {
                const isAnnual = this.dataset.period === 'annual';
                billingToggle.checked = isAnnual;
                billingToggle.dispatchEvent(new Event('change'));
            });
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '';
                }
            });

            // Email validation
            const emailField = contactForm.querySelector('[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#ef4444';
                }
            }

            if (!isValid) {
                alert('Please fill in all required fields correctly.');
                return;
            }

            // Show success message
            alert('Thank you for your message! Our team will get back to you within 24 hours.');

            // Reset form
            contactForm.reset();

            // In a real application, you would send this data to a server
            console.log('Form submitted:', data);
        });

        // Clear error styling on input
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .pricing-card, .team-card, ' +
        '.value-card, .award-item, .stat-card, .mv-card, .faq-item, ' +
        '.more-feature-item, .step-card, .benefit-card'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Add active class to current page nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number, .hero-stats .stat strong');

    const animateCounter = (element) => {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasK = text.includes('K');
        const hasM = text.includes('M');
        const hasPercent = text.includes('%');

        let value = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(value)) return;

        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const current = start + (value - start) * easeProgress;

            let displayValue = Math.round(current);
            if (value < 10) {
                displayValue = current.toFixed(1);
            }

            let suffix = '';
            if (hasK) suffix = 'K';
            if (hasM) suffix = 'M';
            if (hasPercent) suffix = '%';
            if (hasPlus) suffix += '+';

            element.textContent = displayValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    // Observe stats for counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header?.classList.remove('scroll-up', 'scroll-down');
        return;
    }

    if (currentScroll > lastScroll && currentScroll > 80) {
        // Scrolling down
        header?.classList.remove('scroll-up');
        header?.classList.add('scroll-down');
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        header?.classList.remove('scroll-down');
        header?.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
});

// Add header scroll styles
const headerStyle = document.createElement('style');
headerStyle.textContent = `
    .header {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .header.scroll-down {
        transform: translateY(-100%);
    }
    .header.scroll-up {
        transform: translateY(0);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(headerStyle);

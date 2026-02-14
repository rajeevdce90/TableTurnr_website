// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip empty hash links
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) navLinks.classList.remove('mobile-menu-open');
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-menu-open');
    });
}

// Calendly Integration Function
function openCalendly() {
    if (!window.Calendly) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        document.head.appendChild(script);
        
        script.onload = function() {
            openCalendlyWidget();
        };
    } else {
        openCalendlyWidget();
    }
}

function openCalendlyWidget() {
    const calendlyUrl = 'https://calendly.com/lightspeed-insights/30min';
    
    if (window.Calendly) {
        window.Calendly.initPopupWidget({
            url: calendlyUrl
        });
    } else {
        window.open(calendlyUrl, '_blank', 'width=800,height=600');
    }
}

// Free Trial CTA — opens Calendly as placeholder (swap with real signup URL later)
function openFreeTrial() {
    // TODO: Replace with actual free trial signup URL when ready
    openCalendly();
}

// Modal page functions for Team and Blog
function showTeamPage() {
    document.getElementById('team-page').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function showBlogPage() {
    document.getElementById('blog-page').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hidePages() {
    document.getElementById('team-page').style.display = 'none';
    document.getElementById('blog-page').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hidePages();
    }
});

// Scroll animations — observe elements for reveal
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply scroll animation to cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card-v2, .flow-step, .foresight-item, .result-item, .integration-category, .security-item, .feature-badge-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Navbar scroll effect — add shadow when scrolling
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (navLinks && toggle && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
        navLinks.classList.remove('mobile-menu-open');
    }
});

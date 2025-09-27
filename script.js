// Feature Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

// ROI Calculator functionality
    const revenueInput = document.getElementById('revenue');
    const employeesInput = document.getElementById('employees');
    const foodCostInput = document.getElementById('foodCost');
    
    const foodWasteSavingsEl = document.getElementById('foodWasteSavings');
    const laborSavingsEl = document.getElementById('laborSavings');
    const timeSavingsEl = document.getElementById('timeSavings');
    const totalSavingsEl = document.getElementById('totalSavings');
    
    function calculateSavings() {
        const monthlyRevenue = parseFloat(revenueInput.value) || 0;
        const employees = parseFloat(employeesInput.value) || 0;
        const foodCostPercent = parseFloat(foodCostInput.value) || 0;
        
        // Calculate annual revenue
        const annualRevenue = monthlyRevenue * 12;
        
        // Food waste savings (15% reduction of food costs)
        const annualFoodCost = annualRevenue * (foodCostPercent / 100);
        const foodWasteSavings = annualFoodCost * 0.15;
        
        // Labor savings (12% of total labor costs - estimated at 30% of revenue)
        const estimatedLaborCost = annualRevenue * 0.30;
        const laborSavings = estimatedLaborCost * 0.12;
        
        // Time savings (3 hours daily at $15/hour average)
        const timeSavings = 3 * 365 * 15;
        
        // Total savings
        const totalSavings = foodWasteSavings + laborSavings + timeSavings;
        
        // Update display
        foodWasteSavingsEl.textContent = formatCurrency(foodWasteSavings);
        laborSavingsEl.textContent = formatCurrency(laborSavings);
        timeSavingsEl.textContent = formatCurrency(timeSavings);
        totalSavingsEl.textContent = formatCurrency(totalSavings);
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    // Add event listeners
    revenueInput.addEventListener('input', calculateSavings);
    employeesInput.addEventListener('input', calculateSavings);
    foodCostInput.addEventListener('input', calculateSavings);
    
    // Initial calculation
    calculateSavings();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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

// Add mobile menu styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links.mobile-menu-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(style);

// Button handlers now use Calendly integration

// Calendly Integration Function
function openCalendly() {
    // Load Calendly widget script if not already loaded
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
    // TableTurnr demo scheduling link
    const calendlyUrl = 'https://calendly.com/lightspeed-insights/30min';
    
    if (window.Calendly) {
        window.Calendly.initPopupWidget({
            url: calendlyUrl
        });
    } else {
        // Fallback: open in new window
        window.open(calendlyUrl, '_blank', 'width=800,height=600');
    }
}

// Old form modal removed - now using Calendly integration

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

// Legacy Google Forms functions removed - now using Calendly integration

// Scroll animations
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

// Observe elements for animation
document.querySelectorAll('.feature-card, .problem-item, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Number Counter Animation for ROI Benefits
function animateNumbers() {
    const numbers = document.querySelectorAll('.benefit-number');

    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-value'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format the number based on its value
            if (target >= 1000) {
                // For large numbers like 75000, add dollar sign and commas
                if (number.textContent.includes('$')) {
                    number.textContent = '$' + Math.floor(current).toLocaleString();
                } else {
                    number.textContent = Math.floor(current).toLocaleString();
                }
            } else if (number.textContent.includes('%')) {
                // For percentages
                number.textContent = Math.floor(current) + '%';
            } else {
                // For regular numbers
                number.textContent = Math.floor(current);
            }
        }, 20);
    });
}

// Observe ROI section for animation trigger
const roiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            roiObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Start observing the ROI section
const roiSection = document.querySelector('.roi-benefits');
if (roiSection) {
    roiObserver.observe(roiSection);
}

// iOS App Demo Slideshow Functionality
document.addEventListener('DOMContentLoaded', function() {
    const screenshotItems = document.querySelectorAll('.screenshot-item');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active and prev classes from all items
        screenshotItems.forEach((item, i) => {
            item.classList.remove('active', 'prev');
            if (i < index) {
                item.classList.add('prev');
            }
        });

        // Remove active class from all nav dots
        navDots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and nav dot
        if (screenshotItems[index]) {
            screenshotItems[index].classList.add('active');
        }
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % screenshotItems.length;
        showSlide(next);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5500); // Change slide every 5.5 seconds
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Add click functionality to nav dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide(); // Restart auto-slide after manual navigation
        });
    });

    // Initialize first slide
    showSlide(0);

    // Start auto-slideshow
    startAutoSlide();

    // Pause auto-slide when user hovers over the container
    const container = document.querySelector('.app-screenshots-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
    }
});

// Add loading states to buttons (exclude solution tab buttons and nav dots)
document.querySelectorAll('button:not(.solution-tab-button):not(.tab-button):not(.nav-dot)').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type !== 'submit' && !this.classList.contains('btn-primary')) return;

        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;

        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
        }, 2000);
    });
});
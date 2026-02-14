/**
 * TableTurnr Email Configuration
 * ================================
 * Central file for all company email addresses.
 * Update emails here and they will be reflected across the entire website.
 */

const TABLETURNR_EMAILS = {
    // General support & contact
    support: 'support@tableturnr.com',

    // Sales inquiries
    sales: 'sales@vigilense.ai',

    // Security related
    security: 'security@tableturnr.com',

    // Legal department
    legal: 'legal@tableturnr.com',

    // Privacy inquiries
    privacy: 'privacy@tableturnr.com',

    // Data Protection Officer
    dpo: 'dpo@tableturnr.com',

    // Careers / job inquiries
    careers: 'careers@tableturnr.com',
};

/**
 * Apply emails to the page after DOM loads.
 * Elements use data-email="key" to reference an email from the config above.
 * 
 * Usage in HTML:
 *   <a data-email="support"></a>          — sets href and text to support email
 *   <a data-email="sales">Contact Sales</a> — sets href only, keeps custom text
 *   <span data-email="legal"></span>      — sets text content to legal email
 */
function applyEmails() {
    document.querySelectorAll('[data-email]').forEach(el => {
        const key = el.getAttribute('data-email');
        const email = TABLETURNR_EMAILS[key];
        if (!email) return;

        if (el.tagName === 'A') {
            el.href = 'mailto:' + email;
            // Only set text if the element has no custom text content
            if (!el.textContent.trim() || el.textContent.trim() === el.getAttribute('data-email')) {
                el.textContent = email;
            }
        } else {
            el.textContent = email;
        }
    });
}

// Auto-apply when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEmails);
} else {
    applyEmails();
}

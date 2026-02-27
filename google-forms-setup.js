// Google Forms Integration for TableTurnr Demo Requests
// Replace the values below with your actual Google Forms data

// STEP 1: Replace with your Google Forms URL
// Get this from: Google Forms → Send → Link icon → Copy URL
// Change 'edit' to 'formResponse' at the end
const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSc-YOUR_FORM_ID_HERE/formResponse';

// STEP 2: Replace these entry IDs with your actual field IDs
// Get these by viewing page source of your Google Form and searching for "entry."
const FORM_FIELDS = {
    restaurant_name: 'entry.XXXXXXXX',  // Replace with actual entry ID
    contact_name: 'entry.XXXXXXXX',     // Replace with actual entry ID
    email: 'entry.XXXXXXXX',            // Replace with actual entry ID
    phone: 'entry.XXXXXXXX',            // Replace with actual entry ID
    locations: 'entry.XXXXXXXX',        // Replace with actual entry ID
    revenue: 'entry.XXXXXXXX',          // Replace with actual entry ID
    challenge: 'entry.XXXXXXXX'         // Replace with actual entry ID
};

// STEP 3: Email notification webhook (optional)
const EMAIL_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Updated submission function
async function submitToGoogleForms(data) {
    try {
        // Create form data for Google Forms submission
        const googleFormData = new FormData();
        
        // Map form data to Google Forms fields
        googleFormData.append(FORM_FIELDS.restaurant_name, data.restaurant_name || '');
        googleFormData.append(FORM_FIELDS.contact_name, data.contact_name || '');
        googleFormData.append(FORM_FIELDS.email, data.email || '');
        googleFormData.append(FORM_FIELDS.phone, data.phone || '');
        googleFormData.append(FORM_FIELDS.locations, data.locations || '');
        googleFormData.append(FORM_FIELDS.revenue, data.revenue || '');
        googleFormData.append(FORM_FIELDS.challenge, data.challenge || '');
        
        // Submit to Google Forms
        await fetch(GOOGLE_FORMS_URL, {
            method: 'POST',
            body: googleFormData,
            mode: 'no-cors' // Required for Google Forms
        });
        
        // Send email notification to sales@tableturnr.com
        await sendEmailNotification(data);
        
        // Also save to localStorage as backup
        const leads = JSON.parse(localStorage.getItem('tableturner_leads') || '[]');
        leads.push({
            ...data,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('tableturner_leads', JSON.stringify(leads));
        
        return true;
        
    } catch (error) {
        console.error('Form submission error:', error);
        throw error;
    }
}

// Function to send email notification
async function sendEmailNotification(data) {
    try {
        // Send notification email via webhook
        await fetch(EMAIL_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: 'sales@tableturnr.com',
                subject: `🚨 New TableTurnr Demo Request - ${data.restaurant_name}`,
                html: `
                    <h2>New Demo Request Received!</h2>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #667eea; margin-top: 0;">Restaurant Details:</h3>
                        <p><strong>Restaurant Name:</strong> ${data.restaurant_name}</p>
                        <p><strong>Contact Person:</strong> ${data.contact_name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                        <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
                        <p><strong>Number of Locations:</strong> ${data.locations}</p>
                        ${data.revenue ? `<p><strong>Monthly Revenue:</strong> ${data.revenue}</p>` : ''}
                        ${data.challenge ? `<p><strong>Biggest Challenge:</strong> ${data.challenge}</p>` : ''}
                    </div>
                    <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Next Steps:</h3>
                        <p>✅ Contact within 24 hours</p>
                        <p>✅ Schedule personalized demo</p>
                        <p>✅ Prepare ROI calculations based on their details</p>
                    </div>
                    <p style="color: #666; font-size: 0.9rem;">
                        Submitted on: ${new Date().toLocaleString()}<br>
                        Source: TableTurnr Landing Page
                    </p>
                `
            })
        });
    } catch (error) {
        console.warn('Email notification failed:', error);
        // Don't throw error - form submission should still succeed
    }
}
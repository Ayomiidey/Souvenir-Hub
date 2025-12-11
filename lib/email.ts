import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: Date;
}

// Email template for admin notification
const createAdminNotificationTemplate = (data: ContactEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .field-label { font-weight: bold; color: #555; }
    .field-value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
    .message-box { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #764ba2; margin-top: 10px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 New Contact Form Submission</h1>
      <p>You have received a new message from your website contact form.</p>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="field-label">👤 Customer Name:</div>
        <div class="field-value">${data.firstName} ${data.lastName}</div>
      </div>
      
      <div class="field">
        <div class="field-label">📧 Email Address:</div>
        <div class="field-value">
          <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a>
        </div>
      </div>
      
      ${data.phone ? `
      <div class="field">
        <div class="field-label">📱 Phone Number:</div>
        <div class="field-value">
          <a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a>
        </div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="field-label">📝 Subject:</div>
        <div class="field-value">${data.subject}</div>
      </div>
      
      <div class="field">
        <div class="field-label">💬 Message:</div>
        <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div class="field">
        <div class="field-label">⏰ Submitted At:</div>
        <div class="field-value">${data.submittedAt.toLocaleString()}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>🔗 <strong>Quick Actions:</strong></p>
      <p>
        <a href="mailto:${data.email}?subject=Re: ${data.subject}" 
           style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
          Reply via Email
        </a>
        <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contact" 
           style="background: #764ba2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
          View in Dashboard
        </a>
      </p>
      <p style="margin-top: 20px; font-size: 12px;">
        This email was sent from your Classy Souvenir contact form system.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email template for customer confirmation
const createCustomerConfirmationTemplate = (data: ContactEmailData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for contacting us</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .highlight { background: white; padding: 20px; border-radius: 4px; border-left: 4px solid #667eea; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Message Received!</h1>
      <p>Thank you for contacting Classy Souvenir</p>
    </div>
    
    <div class="content">
      <p>Hi ${data.firstName},</p>
      
      <p>We've received your message and wanted to confirm that it's been successfully submitted to our team.</p>
      
      <div class="highlight">
        <h3>📋 Your Message Summary:</h3>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Submitted:</strong> ${data.submittedAt.toLocaleString()}</p>
      </div>
      
      <p>🕐 <strong>What happens next?</strong></p>
      <ul>
        <li>Our customer service team will review your message</li>
        <li>We'll respond within 24 hours during business days</li>
        <li>You'll receive a reply at: <strong>${data.email}</strong></li>
      </ul>
      
      <p>If you have any urgent questions, feel free to call us at <strong>+1 (555) 123-4567</strong> during business hours (Mon-Fri, 9 AM - 6 PM EST).</p>
      
      <p>Thank you for choosing Classy Souvenir!</p>
      
      <p>Best regards,<br>
      The Classy Souvenir Team</p>
    </div>
    
    <div class="footer">
      <p>This is an automated confirmation email. Please do not reply directly to this email.</p>
      <p>For immediate assistance, contact us at info@souvenirshop.com</p>
    </div>
  </div>
</body>
</html>
`;

// Send notification to admin
export async function sendAdminNotification(data: ContactEmailData) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      subject: `🔔 New Contact Form: ${data.subject}`,
      html: createAdminNotificationTemplate(data),
      replyTo: data.email, // Allow admin to reply directly to customer
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
}

// Send confirmation to customer
export async function sendCustomerConfirmation(data: ContactEmailData) {
  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: data.email,
      subject: 'Thank you for contacting Classy Souvenir - Message Received',
      html: createCustomerConfirmationTemplate(data),
      replyTo: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
    return { success: false, error };
  }
}

export { resend };
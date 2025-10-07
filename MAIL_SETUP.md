# Environment Variables for Email Configuration

To enable email functionality for contact forms and admin replies, you need to set up the following environment variables in your `.env.local` file:

## Required Environment Variables

```env
# Resend API Configuration (for sending emails)
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Admin Email Configuration
ADMIN_EMAIL=admin@yourdomain.com
```

## How to Set Up:

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Configure Your Domain (Optional but Recommended)
1. In Resend dashboard, go to Domains
2. Add your domain (e.g., yourdomain.com)
3. Verify domain ownership by adding DNS records
4. This allows you to send emails from your domain

### 3. Update .env.local File
Create or update your `.env.local` file in the root directory:

```env
# Replace with your actual values
RESEND_API_KEY=re_YourActualAPIKey_Here
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Other existing environment variables...
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
# ... etc
```

### 4. Restart Your Development Server
After adding the environment variables, restart your development server:

```bash
npm run dev
```

## Features Enabled:

✅ **Contact Form Emails**: Customers receive confirmation emails
✅ **Admin Notifications**: You receive email notifications for new contact messages  
✅ **Admin Replies**: Send professional email replies directly from the admin panel
✅ **Email Templates**: Beautiful HTML email templates for all communications

## Testing:

1. Submit a contact form on your website
2. Check if you receive an admin notification email
3. Check if the customer receives a confirmation email
4. Try replying to a message from the admin panel

## Troubleshooting:

- **No emails received**: Check your RESEND_API_KEY is correct
- **Emails go to spam**: Verify your domain in Resend
- **API errors**: Check your API key permissions and account limits
- **Wrong sender email**: Update RESEND_FROM_EMAIL to match your verified domain

## Free Tier Limits:

Resend free tier includes:
- 3,000 emails per month
- 100 emails per day
- Perfect for small to medium websites

For higher volume, upgrade to a paid plan.
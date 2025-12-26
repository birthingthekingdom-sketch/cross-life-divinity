# Stripe Webhook Configuration Guide

## Overview

Your Cross Life School of Divinity platform uses Stripe webhooks to automatically process payments and grant course access. This guide explains how to configure webhooks in your Stripe account.

---

## Webhook Endpoint URL

Your platform's webhook endpoint is:

```
https://your-domain.manus.space/api/stripe/webhook
```

**Replace `your-domain` with your actual published domain prefix.**

For example, if your site is published at `clsd.manus.space`, your webhook URL would be:
```
https://clsd.manus.space/api/stripe/webhook
```

---

## Required Webhook Events

Configure your Stripe webhook to listen for these specific events:

### Payment Events
- `checkout.session.completed` - Triggers when a student completes a course purchase or subscription
- `payment_intent.succeeded` - Confirms successful payment processing
- `payment_intent.payment_failed` - Handles failed payment attempts

### Subscription Events
- `customer.subscription.created` - Creates new subscription access
- `customer.subscription.updated` - Updates subscription status changes
- `customer.subscription.deleted` - Removes access when subscription ends
- `invoice.payment_succeeded` - Processes recurring subscription payments
- `invoice.payment_failed` - Handles failed subscription renewals

---

## Step-by-Step Setup Instructions

### 1. Access Stripe Dashboard

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**

### 2. Configure the Endpoint

1. **Endpoint URL**: Enter your webhook URL (see above)
2. **Description** (optional): "Cross Life School of Divinity - Course Access"
3. **Events to send**: Click **Select events**

### 3. Select Required Events

In the event selection interface:

1. Search for and select each event listed in the "Required Webhook Events" section above
2. Alternatively, you can select **Select all checkout events**, **Select all customer events**, and **Select all invoice events** to ensure comprehensive coverage

### 4. Save and Retrieve Signing Secret

1. Click **Add endpoint** to save
2. Stripe will display your **Signing secret** (starts with `whsec_`)
3. **IMPORTANT**: Copy this secret immediately - you'll need it for the next step

### 5. Add Signing Secret to Platform

The webhook signing secret is already configured in your platform's environment variables as `STRIPE_WEBHOOK_SECRET`. If you need to update it:

1. Go to your platform's **Management UI** → **Settings** → **Secrets**
2. Find `STRIPE_WEBHOOK_SECRET`
3. Update the value with your new signing secret from Stripe
4. Save changes

---

## Testing the Webhook

### Using Stripe CLI (Recommended for Development)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Make a test purchase on your platform
4. Verify events appear in the CLI output

### Using Stripe Dashboard

1. In **Developers** → **Webhooks**, click on your endpoint
2. Click **Send test webhook**
3. Select `checkout.session.completed`
4. Click **Send test webhook**
5. Verify the response shows a `200` status code

---

## What the Webhook Does

When Stripe sends webhook events to your platform, the system automatically:

### For Payment Plan Checkouts (`checkout.session.completed` with payment plan metadata)
1. Creates payment plan record in database with:
   - Plan type (Learning Path, Bundle, or Chaplaincy)
   - Total amount and monthly amount
   - Payment schedule (6 monthly payments)
2. Records first payment in payment history
3. Enrolls user in courses based on plan type:
   - **Learning Path**: Enrolls in all courses in the selected path
   - **Bundle**: Enrolls in 3 selected courses
   - **Chaplaincy**: Enrolls in chaplaincy training course
4. Sends payment plan enrollment email with payment schedule

### For Full Payment Checkouts (`checkout.session.completed` with full payment metadata)
1. Enrolls user in courses immediately
2. Sends full payment receipt email with transaction details
3. Grants lifetime access to purchased courses

### For Course Purchases (`checkout.session.completed` - legacy)
1. Retrieves the student's email and purchased course ID from the session metadata
2. Creates or updates the student's user account
3. Grants access to the purchased course
4. Sends a welcome email with course access instructions

### For Subscriptions (`customer.subscription.created`)
1. Grants access to **all 14 courses** in the catalog
2. Sets subscription status to "active"
3. Sends subscription confirmation email

### For Monthly Payment Plan Payments (`invoice.payment_succeeded` with payment plan metadata)
1. Records payment in payment history
2. Updates payment plan progress
3. Sends monthly payment receipt email
4. If final payment, sends payment plan completion email

### For Subscription Renewals (`invoice.payment_succeeded` - for All-Access Subscription)
1. Extends subscription access for another billing period
2. Sends payment receipt email

### For Subscription Cancellations (`customer.subscription.deleted`)
1. Removes access to subscription-based courses
2. Preserves access to individually purchased courses
3. Sends cancellation confirmation email

---

## Webhook Security

Your platform automatically verifies webhook authenticity using:

1. **Signature Verification**: Every webhook request is verified using the `STRIPE_WEBHOOK_SECRET`
2. **Timestamp Validation**: Prevents replay attacks by checking request timestamps
3. **Event Deduplication**: Processes each event only once using Stripe's event ID

**Never disable signature verification in production.**

---

## Monitoring Webhook Health

### In Stripe Dashboard

1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View the **Recent deliveries** section to see:
   - Success/failure rates
   - Response times
   - Error messages (if any)

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Incorrect webhook secret | Update `STRIPE_WEBHOOK_SECRET` in platform settings |
| `404 Not Found` | Incorrect webhook URL | Verify your published domain and update endpoint URL |
| `500 Server Error` | Platform error processing event | Check server logs in Management UI → Dashboard |
| Timeout errors | Webhook processing takes too long | Contact support - may need optimization |

---

## Pricing Configuration

Your platform is configured with these prices:

### Learning Paths
- **Full Payment**: $399 USD (one-time)
- **Payment Plan**: $66.50/month × 6 months (0% interest)
- **Access**: Lifetime access to 4-6 courses in structured sequence

### 3-Course Bundles
- **Full Payment**: $299 USD (one-time)
- **Payment Plan**: $49.83/month × 6 months (0% interest)
- **Access**: Lifetime access to 3 selected courses

### Chaplaincy Training
- **Full Payment**: $275 USD (one-time)
- **Payment Plan**: $45.83/month × 6 months (0% interest)
- **Access**: Lifetime access to chaplaincy certification program

### Individual Course Purchase
- **Price**: $89 USD per course
- **Type**: One-time payment
- **Access**: Lifetime access to purchased course

### All-Access Subscription
- **Price**: $49 USD per month
- **Type**: Recurring monthly
- **Minimum**: 6 months commitment
- **Access**: All 18 courses while subscription is active
- **Billing**: Automatic monthly renewal

To modify pricing:
1. Update prices in Stripe Dashboard → **Products**
2. Update the price IDs in your platform code (contact developer)

---

## Production Checklist

Before launching to students:

- [ ] Webhook endpoint configured in Stripe Dashboard
- [ ] All 8 required events selected
- [ ] Signing secret added to platform environment variables
- [ ] Test purchase completed successfully
- [ ] Test subscription created successfully
- [ ] Webhook deliveries showing `200` success responses
- [ ] Email notifications working (check spam folder)
- [ ] Platform published to production domain
- [ ] Stripe account activated (not in test mode)

---

## Support and Troubleshooting

### Webhook Not Receiving Events

1. Verify your platform is published (not in preview mode)
2. Check that the webhook URL matches your published domain
3. Ensure the endpoint is set to **Live mode** (not Test mode) in Stripe

### Students Not Receiving Access

1. Check **Developers** → **Webhooks** → **Recent deliveries** for errors
2. Verify the `checkout.session.completed` event was received
3. Check that course metadata was included in the Stripe checkout session
4. Review server logs for processing errors

### Need Help?

- **Stripe Documentation**: [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)
- **Platform Support**: Contact your development team
- **Stripe Support**: Available in your Stripe Dashboard

---

## Advanced Configuration

### Custom Domain Setup

If you're using a custom domain (not `.manus.space`):

1. Update the webhook endpoint URL in Stripe to match your custom domain
2. Ensure SSL certificate is valid
3. Test webhook delivery after domain change

### Multiple Environments

For development/staging/production environments:

1. Create separate webhook endpoints for each environment
2. Use different signing secrets for each
3. Configure environment-specific secrets in platform settings

---

**Last Updated**: December 2024  
**Platform Version**: 2.0 (Stripe Checkout Sessions)  
**Stripe API Version**: 2025-11-17.clover

---

## Payment Flow Architecture

### Stripe Checkout Sessions (Current Implementation)

The platform now uses **Stripe Checkout Sessions** for all payments, which provides:

- ✅ Hosted checkout page (no embedded forms)
- ✅ PCI compliance by default
- ✅ Mobile-optimized payment experience
- ✅ Automatic payment retry logic
- ✅ Built-in fraud prevention

**Payment Flow:**
1. User selects payment option (payment plan or full payment)
2. Frontend calls `/api/payment-plans/create-checkout-session`
3. Backend creates Stripe Checkout Session with metadata
4. User redirects to Stripe's hosted checkout page
5. User completes payment on Stripe's secure page
6. Stripe sends `checkout.session.completed` webhook
7. Webhook handler processes enrollment and sends emails
8. User redirects back to success page

**Metadata Stored in Checkout Session:**
- `userId` - User ID for enrollment
- `planType` - LEARNING_PATH, BUNDLE, or CHAPLAINCY_TRAINING
- `paymentMethod` - payment_plan or full_payment
- `learningPathId` - For Learning Path purchases
- `selectedCourses` - For Bundle purchases (comma-separated course IDs)

### Email Notifications

The platform automatically sends emails for:

1. **Payment Plan Enrollment** - Sent when first payment succeeds
   - Payment schedule details
   - Course access confirmation
   - Monthly payment reminders

2. **Full Payment Receipt** - Sent for one-time payments
   - Transaction details and receipt
   - Course access confirmation
   - Support information

3. **Monthly Payment Receipt** - Sent for each monthly payment
   - Payment confirmation
   - Payments remaining
   - Next payment date

4. **Payment Plan Completion** - Sent when final payment succeeds
   - Congratulations message
   - Total amount paid
   - Continued access confirmation

5. **Failed Payment Notification** - Sent when payment fails
   - Payment failure notice
   - Retry instructions
   - Support contact information

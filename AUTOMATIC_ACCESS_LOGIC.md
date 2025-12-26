# Automatic Access Granting Logic

## Overview

The Cross Life School of Divinity platform automatically grants course access when payments succeed through Stripe webhooks. This document explains the detailed logic for both one-time course purchases and monthly subscriptions.

---

## Architecture

### Components

1. **Stripe Webhook Handler** (`server/stripe-webhook.ts`)
   - Receives webhook events from Stripe
   - Verifies webhook signatures for security
   - Routes events to appropriate handlers

2. **Database Layer** (`server/db.ts`)
   - Manages course enrollments
   - Tracks purchases and subscriptions
   - Handles user access records

3. **Frontend Integration**
   - Automatically detects new enrollments
   - Redirects users to course content
   - Updates UI to reflect access status

---

## Webhook Security

### Signature Verification

```typescript
const sig = req.headers["stripe-signature"];
event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
```

**Process:**
1. Extract Stripe signature from request headers
2. Verify signature using `STRIPE_WEBHOOK_SECRET`
3. Reject requests with invalid signatures (prevents fraud)
4. Only process verified events

**Security Benefits:**
- Prevents unauthorized access grants
- Protects against replay attacks
- Ensures events come from Stripe, not malicious actors

---

## One-Time Course Purchase Flow

### Trigger Event: `checkout.session.completed`

When a student completes a $89 course purchase:

### Step 1: Extract Purchase Metadata

```typescript
const userId = parseInt(session.metadata?.userId || "0");
const type = session.metadata?.type; // "course_purchase"
const courseId = parseInt(session.metadata?.courseId || "0");
```

**Metadata includes:**
- `userId`: Student's database ID
- `type`: "course_purchase" (distinguishes from subscription)
- `courseId`: Specific course being purchased

### Step 2: Create Purchase Record

```typescript
await db.createCoursePurchase({
  userId,
  courseId,
  stripeCustomerId: session.customer as string,
  stripePaymentIntentId: session.payment_intent as string,
  amount: session.amount_total || 0,
  status: "completed",
});
```

**Database record includes:**
- Purchase amount ($89 = 8900 cents)
- Stripe customer ID (for refunds/support)
- Payment intent ID (for tracking)
- Status: "completed"
- Timestamp of purchase

### Step 3: Grant Course Access

```typescript
const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
if (!isEnrolled) {
  await db.createCourseEnrollment({
    userId,
    courseId,
    accessCodeId: 0, // 0 = purchase-based enrollment
  });
}
```

**Access granting logic:**
1. Check if user already has access (prevents duplicates)
2. If not enrolled, create enrollment record
3. Set `accessCodeId: 0` to indicate purchase-based access
4. Enrollment is **permanent** (lifetime access)

### Step 4: Student Can Access Course

**Immediate effects:**
- Student sees course in "My Courses" dashboard
- Can start lessons immediately
- Progress tracking begins
- Can earn certificate upon completion

---

## Monthly Subscription Flow

### Trigger Event: `customer.subscription.created`

When a student subscribes for $49/month:

### Step 1: Extract Subscription Metadata

```typescript
const userId = parseInt(subscription.metadata?.userId || "0");
```

**Metadata includes:**
- `userId`: Student's database ID
- Subscription ID from Stripe
- Customer ID for billing

### Step 2: Create Subscription Record

```typescript
await db.createSubscription({
  userId,
  stripeCustomerId: subscription.customer as string,
  stripeSubscriptionId: subscription.id,
  status: subscription.status, // "active"
  currentPeriodStart: new Date(subscription.current_period_start * 1000),
  currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  cancelAtPeriodEnd: subscription.cancel_at_period_end,
});
```

**Database record includes:**
- Subscription status: "active", "canceled", "past_due", or "unpaid"
- Current billing period dates
- Cancellation status (for end-of-period cancellations)

### Step 3: Grant Access to ALL Courses

```typescript
const allCourses = await db.getAllCourses();

for (const course of allCourses) {
  const isEnrolled = await db.isUserEnrolledInCourse(userId, course.id);
  if (!isEnrolled) {
    await db.createCourseEnrollment({
      userId,
      courseId: course.id,
      accessCodeId: 0, // 0 = subscription-based enrollment
    });
  }
}
```

**Access granting logic:**
1. Retrieve all 14 courses from database
2. Loop through each course
3. Check if user already has access (skip if yes)
4. Create enrollment for each course not yet enrolled
5. Set `accessCodeId: 0` for subscription-based access

### Step 4: Student Can Access All Courses

**Immediate effects:**
- All 14 courses appear in "My Courses" dashboard
- Can start any lesson in any course
- Progress tracked across all courses
- Can earn certificates for any completed course

---

## Subscription Updates

### Trigger Event: `customer.subscription.updated`

When subscription status changes (renewal, payment failure, etc.):

### Update Logic

```typescript
const existing = await db.getSubscriptionByStripeId(subscription.id);

if (existing) {
  await db.updateSubscription(existing.id, {
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}
```

**Status updates:**
- `active` → Subscription is current, access continues
- `past_due` → Payment failed, grace period (access continues)
- `unpaid` → Payment failed multiple times (access may be revoked)
- `canceled` → Subscription ended (access removed at period end)

**Access impact:**
- Status changes don't immediately revoke access
- Access continues until `currentPeriodEnd` date
- Allows grace period for payment issues

---

## Subscription Cancellation

### Trigger Event: `customer.subscription.deleted`

When a subscription is canceled or expires:

### Cancellation Logic

```typescript
const existing = await db.getSubscriptionByStripeId(subscription.id);

if (existing) {
  await db.updateSubscription(existing.id, {
    status: "canceled",
  });
}
```

**Access handling:**
- Subscription status set to "canceled"
- Access continues until `currentPeriodEnd` (already paid for)
- After period ends, subscription-based enrollments are inactive
- **Individually purchased courses remain accessible** (lifetime access)

**Important distinction:**
- Subscription cancellation ≠ account deletion
- Student keeps purchased courses forever
- Can resubscribe anytime to regain all-access

---

## Payment Success Confirmation

### Trigger Event: `payment_intent.succeeded`

Confirms payment was successfully processed:

### Confirmation Logic

```typescript
const purchase = await db.getCoursePurchaseByPaymentIntent(paymentIntent.id);

if (purchase) {
  await db.updateCoursePurchase(purchase.id, {
    status: "completed",
  });
}
```

**Purpose:**
- Double-confirms payment success
- Updates purchase record status
- Provides audit trail for accounting
- Triggers email receipt (if configured)

---

## Payment Failure Handling

### Trigger Event: `payment_intent.payment_failed`

When a payment attempt fails:

### Failure Logic

```typescript
const purchase = await db.getCoursePurchaseByPaymentIntent(paymentIntent.id);

if (purchase) {
  await db.updateCoursePurchase(purchase.id, {
    status: "failed",
  });
}
```

**Failure handling:**
- Purchase status set to "failed"
- No course access granted
- Student notified to retry payment
- Can attempt purchase again

**For subscriptions:**
- Status changes to "past_due"
- Stripe retries payment automatically
- Access continues during retry period
- After final failure, status becomes "unpaid"

---

## Access Verification

### How the Platform Checks Access

When a student tries to access a course:

```typescript
// Frontend check
const { data: enrollmentStatus } = trpc.auth.checkEnrollment.useQuery();

// Backend verification
const enrollment = await db.getUserCourseEnrollment(userId, courseId);
const subscription = await db.getUserActiveSubscription(userId);

// Access granted if:
// 1. User has direct course enrollment (purchase or access code), OR
// 2. User has active subscription
```

**Access rules:**
1. **Direct enrollment** (purchased course) → Always accessible
2. **Active subscription** → All courses accessible
3. **Expired subscription** → Only purchased courses accessible
4. **No enrollment or subscription** → Redirect to pricing page

---

## Database Schema

### Course Enrollments Table

```sql
CREATE TABLE course_enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  access_code_id INT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_enrollment (user_id, course_id)
);
```

**Key fields:**
- `user_id`: Student who has access
- `course_id`: Course they can access
- `access_code_id`: 0 = purchase/subscription, >0 = access code
- `enrolled_at`: When access was granted

### Course Purchases Table

```sql
CREATE TABLE course_purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  amount INT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key fields:**
- `amount`: Price in cents (8900 = $89)
- `status`: "completed", "failed", "refunded"
- `stripe_payment_intent_id`: For tracking/refunds

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key fields:**
- `status`: "active", "canceled", "past_due", "unpaid"
- `current_period_end`: When access expires if not renewed
- `cancel_at_period_end`: TRUE = canceling at end of period

---

## Edge Cases Handled

### 1. Duplicate Enrollments

**Problem:** Student purchases same course twice

**Solution:**
```typescript
const isEnrolled = await db.isUserEnrolledInCourse(userId, courseId);
if (!isEnrolled) {
  // Only create enrollment if not already enrolled
}
```

**Result:** No duplicate enrollments, no errors

### 2. Subscription Upgrade

**Problem:** Student has purchased courses, then subscribes

**Solution:**
- Subscription grants access to all courses
- Purchased courses remain in database
- If subscription cancels, purchased courses still accessible

**Result:** Seamless upgrade, no loss of purchased access

### 3. Webhook Retry

**Problem:** Stripe retries webhooks if response is slow/failed

**Solution:**
- Check if enrollment already exists before creating
- Use `UNIQUE KEY` constraint on enrollments table
- Idempotent operations (safe to run multiple times)

**Result:** No duplicate access grants, no errors

### 4. Partial Payment Failure

**Problem:** Payment intent fails after checkout session completes

**Solution:**
- Wait for `payment_intent.succeeded` before confirming
- `checkout.session.completed` grants access immediately
- If payment fails later, `payment_intent.payment_failed` updates status

**Result:** Access granted on success, tracked on failure

---

## Testing the Flow

### Test One-Time Purchase

1. Create test student account
2. Navigate to course pricing page
3. Click "Purchase Course" ($89)
4. Complete Stripe test checkout (use test card: `4242 4242 4242 4242`)
5. Verify webhook received: `checkout.session.completed`
6. Check database: course_enrollments table has new record
7. Check frontend: course appears in "My Courses"
8. Verify lesson access works

### Test Subscription

1. Create test student account
2. Navigate to subscription pricing page
3. Click "Subscribe" ($49/month)
4. Complete Stripe test checkout
5. Verify webhooks received:
   - `checkout.session.completed`
   - `customer.subscription.created`
6. Check database: subscriptions table has new record
7. Check database: course_enrollments has 14 records (all courses)
8. Check frontend: all 14 courses appear in "My Courses"
9. Verify lesson access works for all courses

### Test Subscription Cancellation

1. Cancel subscription in Stripe Dashboard
2. Verify webhook received: `customer.subscription.deleted`
3. Check database: subscription status = "canceled"
4. Check frontend: courses still accessible until period end
5. Wait until period end date passes
6. Verify: subscription courses no longer accessible
7. Verify: purchased courses still accessible

---

## Monitoring and Debugging

### Webhook Logs

Check webhook delivery in Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View **Recent deliveries**
4. Check response codes (200 = success)

### Server Logs

Check platform logs for webhook processing:
```bash
# View webhook handler logs
grep "Checkout completed" server.log
grep "Subscription updated" server.log
grep "Course purchase completed" server.log
```

### Database Queries

Verify access was granted:
```sql
-- Check course enrollments for user
SELECT * FROM course_enrollments WHERE user_id = ?;

-- Check active subscriptions
SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active';

-- Check course purchases
SELECT * FROM course_purchases WHERE user_id = ? ORDER BY purchased_at DESC;
```

---

## Troubleshooting

### Student Says They Paid But Have No Access

**Diagnosis steps:**

1. **Check Stripe Dashboard**
   - Find payment in Stripe Dashboard
   - Verify payment succeeded
   - Check if webhook was sent

2. **Check Webhook Delivery**
   - Go to webhook endpoint in Stripe
   - Find the `checkout.session.completed` event
   - Check response code (should be 200)
   - View response body for errors

3. **Check Database**
   ```sql
   SELECT * FROM course_enrollments WHERE user_id = ?;
   SELECT * FROM course_purchases WHERE user_id = ?;
   ```
   - If no records, webhook didn't process
   - If records exist, frontend issue

4. **Manual Fix (if needed)**
   ```sql
   INSERT INTO course_enrollments (user_id, course_id, access_code_id)
   VALUES (?, ?, 0);
   ```

### Webhook Failing with 401 Error

**Cause:** Incorrect webhook secret

**Solution:**
1. Get signing secret from Stripe Dashboard
2. Update `STRIPE_WEBHOOK_SECRET` in platform settings
3. Restart dev server
4. Test webhook again

### Subscription Not Granting All Courses

**Cause:** Loop may have failed partway through

**Solution:**
1. Check server logs for errors
2. Manually grant missing enrollments:
   ```sql
   -- Find courses user is missing
   SELECT id, title FROM courses 
   WHERE id NOT IN (
     SELECT course_id FROM course_enrollments WHERE user_id = ?
   );
   
   -- Grant access to missing courses
   INSERT INTO course_enrollments (user_id, course_id, access_code_id)
   VALUES (?, ?, 0);
   ```

---

## Summary

### One-Time Purchase ($89/course)
1. Student completes checkout
2. Webhook: `checkout.session.completed`
3. Create purchase record
4. Grant access to specific course
5. **Result:** Lifetime access to one course

### Monthly Subscription ($49/month)
1. Student completes subscription checkout
2. Webhook: `customer.subscription.created`
3. Create subscription record
4. Grant access to all 14 courses
5. **Result:** Access to all courses while subscribed

### Key Principles
- **Automatic:** No manual intervention required
- **Secure:** Webhook signature verification prevents fraud
- **Idempotent:** Safe to process multiple times
- **Auditable:** Full database trail of all access grants
- **Flexible:** Handles purchases, subscriptions, upgrades, cancellations

---

**Last Updated:** December 2024  
**Platform Version:** 1.0  
**Related Files:**
- `server/stripe-webhook.ts` - Webhook handler
- `server/db.ts` - Database operations
- `STRIPE_WEBHOOK_SETUP.md` - Configuration guide

# Website Integration URLs - Cross Life School of Divinity

## URLs for Linking from www.crosslifeschoolofdivinity.org

After publishing your platform, use these URLs to link from your main website.

---

## Published Platform URLs

### Base URL (After Publishing)
Your platform will be published at:
```
https://cross-life-divinity.manus.space
```

**Note:** You can customize the domain prefix in Management UI → Settings → Domains, or bind a custom domain.

---

## URLs for Student Access

### 1. Public Homepage (Student Registration)
**URL:** `https://cross-life-divinity.manus.space/`

**Purpose:** 
- Public landing page with promotional graphics
- Shows pricing and course information
- "Create Free Account" and "Sign In" buttons
- Redirects logged-in users to their dashboard

**Use on www.crosslifeschoolofdivinity.org:**
```html
<!-- Link from main website -->
<a href="https://cross-life-divinity.manus.space/">
  Enroll in Online Courses
</a>

<!-- Or as a button -->
<a href="https://cross-life-divinity.manus.space/" class="btn btn-primary">
  Start Learning Today
</a>
```

### 2. Student Registration Page (Direct)
**URL:** `https://cross-life-divinity.manus.space/register`

**Purpose:**
- Direct link to account creation
- Bypasses homepage, goes straight to registration

**Use on www.crosslifeschoolofdivinity.org:**
```html
<a href="https://cross-life-divinity.manus.space/register">
  Create Student Account
</a>
```

### 3. Student Login Page
**URL:** `https://cross-life-divinity.manus.space/login`

**Purpose:**
- Direct link for existing students to log in

**Use on www.crosslifeschoolofdivinity.org:**
```html
<a href="https://cross-life-divinity.manus.space/login">
  Student Login
</a>
```

### 4. Browse Courses Page
**URL:** `https://cross-life-divinity.manus.space/courses`

**Purpose:**
- View all 14 courses
- See course descriptions and lesson counts
- Enroll in courses (requires login)

**Use on www.crosslifeschoolofdivinity.org:**
```html
<a href="https://cross-life-divinity.manus.space/courses">
  View Course Catalog
</a>
```

### 5. Pricing Page
**URL:** `https://cross-life-divinity.manus.space/pricing`

**Purpose:**
- View subscription and individual course pricing
- Start checkout process

**Use on www.crosslifeschoolofdivinity.org:**
```html
<a href="https://cross-life-divinity.manus.space/pricing">
  View Pricing & Enroll
</a>
```

---

## URLs for Admin Access

### 6. Admin Login (with Auto-Redirect to Admin Dashboard)
**URL:** `https://cross-life-divinity.manus.space/admin`

**Purpose:**
- Direct link for administrators
- Automatically redirects to admin dashboard after login
- Shows admin interface with course management, student follow-ups, revenue tracking

**Use on www.crosslifeschoolofdivinity.org:**
```html
<!-- Admin access link -->
<a href="https://cross-life-divinity.manus.space/admin">
  Admin Portal
</a>

<!-- Or in footer for staff -->
<a href="https://cross-life-divinity.manus.space/admin" class="text-sm">
  Staff Login
</a>
```

### 7. Role Toggle Page (Switch Between Student/Admin Views)
**URL:** `https://cross-life-divinity.manus.space/toggle-role`

**Purpose:**
- For users who have both student and admin roles
- Allows switching between student dashboard and admin dashboard
- Useful for testing or administrators who are also taking courses

**Use on www.crosslifeschoolofdivinity.org:**
```html
<a href="https://cross-life-divinity.manus.space/toggle-role">
  Switch Role (Student/Admin)
</a>
```

**Note:** This page is also accessible from the top navigation bar when logged in (shows "Student View" or "Admin" button).

---

## Recommended Links for Main Website

### Navigation Menu
```html
<nav>
  <a href="https://www.crosslifeschoolofdivinity.org/">Home</a>
  <a href="https://www.crosslifeschoolofdivinity.org/about">About</a>
  <a href="https://cross-life-divinity.manus.space/courses">Online Courses</a>
  <a href="https://cross-life-divinity.manus.space/pricing">Pricing</a>
  <a href="https://www.crosslifeschoolofdivinity.org/contact">Contact</a>
  <a href="https://cross-life-divinity.manus.space/login">Student Login</a>
</nav>
```

### Homepage Call-to-Action
```html
<section class="hero">
  <h1>Transform Your Ministry Through Biblical Excellence</h1>
  <p>CPD-accredited online theology courses</p>
  <a href="https://cross-life-divinity.manus.space/" class="btn-primary">
    Start Learning Today
  </a>
  <a href="https://cross-life-divinity.manus.space/courses" class="btn-secondary">
    Browse Courses
  </a>
</section>
```

### Footer Links
```html
<footer>
  <div class="footer-section">
    <h3>For Students</h3>
    <ul>
      <li><a href="https://cross-life-divinity.manus.space/register">Create Account</a></li>
      <li><a href="https://cross-life-divinity.manus.space/login">Student Login</a></li>
      <li><a href="https://cross-life-divinity.manus.space/courses">Course Catalog</a></li>
      <li><a href="https://cross-life-divinity.manus.space/pricing">Pricing</a></li>
    </ul>
  </div>
  <div class="footer-section">
    <h3>For Staff</h3>
    <ul>
      <li><a href="https://cross-life-divinity.manus.space/admin">Admin Portal</a></li>
    </ul>
  </div>
</footer>
```

---

## Deep Links (Specific Courses)

You can link directly to specific courses using their IDs:

### Course-Specific URLs
```
https://cross-life-divinity.manus.space/courses/OLD_TESTAMENT_SURVEY
https://cross-life-divinity.manus.space/courses/NEW_TESTAMENT_SURVEY
https://cross-life-divinity.manus.space/courses/SYSTEMATIC_THEOLOGY
https://cross-life-divinity.manus.space/courses/BIBLICAL_HERMENEUTICS
https://cross-life-divinity.manus.space/courses/FUNDAMENTALS_OF_APOLOGETICS
https://cross-life-divinity.manus.space/courses/EVANGELISM_AND_DISCIPLESHIP
https://cross-life-divinity.manus.space/courses/DISCIPLESHIP_TRAINING
https://cross-life-divinity.manus.space/courses/PRAYER_AND_INTERCESSION
https://cross-life-divinity.manus.space/courses/CHRISTIAN_LEADERSHIP
https://cross-life-divinity.manus.space/courses/BIBLICAL_WORSHIP
https://cross-life-divinity.manus.space/courses/PASTORAL_COUNSELING
https://cross-life-divinity.manus.space/courses/CHURCH_ADMINISTRATION
https://cross-life-divinity.manus.space/courses/HOMILETICS
https://cross-life-divinity.manus.space/courses/DISCOVERING_SPIRITUAL_GIFTS
```

**Example Use:**
```html
<a href="https://cross-life-divinity.manus.space/courses/SYSTEMATIC_THEOLOGY">
  Learn Systematic Theology
</a>
```

---

## Custom Domain Setup (Optional)

If you want to use a custom domain like `learn.crosslifeschoolofdivinity.org`:

### Steps:
1. **Publish your platform** (see instructions below)
2. Go to **Management UI** → **Settings** → **Domains**
3. Click **"Add Custom Domain"**
4. Enter: `learn.crosslifeschoolofdivinity.org`
5. Follow DNS configuration instructions
6. Wait for SSL certificate provisioning (automatic)

### After Custom Domain Setup:
All URLs would change to:
```
https://learn.crosslifeschoolofdivinity.org/
https://learn.crosslifeschoolofdivinity.org/courses
https://learn.crosslifeschoolofdivinity.org/admin
```

---

## How to Publish Your Platform

**IMPORTANT:** I cannot publish for you. You must do this through the Management UI.

### Publishing Steps:

1. **Open Management UI:**
   - Click the Management UI icon (top-right of chatbox)

2. **Verify Checkpoint:**
   - You should see the latest checkpoint: "Platform ready for publishing"
   - Version: `91c6e70a`

3. **Click Publish Button:**
   - Located in the top-right of Management UI header
   - Button is enabled after creating a checkpoint

4. **Wait for Deployment:**
   - Takes 2-5 minutes
   - You'll see deployment progress

5. **Get Your Published URL:**
   - After publishing, you'll receive the live URL
   - Default format: `https://cross-life-divinity.manus.space`

6. **Test Your Platform:**
   - Visit the published URL
   - Test student registration
   - Test admin login
   - Verify all features work

---

## After Publishing Checklist

### ✅ Immediate Actions:

1. **Test All URLs:**
   - [ ] Homepage loads correctly
   - [ ] Student registration works
   - [ ] Admin login redirects properly
   - [ ] Courses page displays all 14 courses
   - [ ] Pricing page shows correct amounts

2. **Configure Stripe Webhook:**
   - [ ] Follow `STRIPE_WEBHOOK_SETUP.md` guide
   - [ ] Add webhook endpoint: `https://cross-life-divinity.manus.space/api/stripe/webhook`
   - [ ] Test payment flow

3. **Update Main Website:**
   - [ ] Add links to www.crosslifeschoolofdivinity.org
   - [ ] Test all links from main site
   - [ ] Update navigation menu
   - [ ] Add footer links

4. **Backup Database:**
   - [ ] Follow `DATABASE_EXPORT_GUIDE.md`
   - [ ] Export full database to SQL file
   - [ ] Store in Google Drive/Dropbox

### ✅ Within First Week:

1. **Monitor Platform:**
   - [ ] Check student registrations
   - [ ] Verify payment processing
   - [ ] Review any error logs

2. **Test Student Experience:**
   - [ ] Create test student account
   - [ ] Enroll in course
   - [ ] Complete a lesson
   - [ ] Generate certificate

3. **Test Admin Features:**
   - [ ] Create follow-up
   - [ ] Check revenue dashboard
   - [ ] Test bulk import lessons

---

## Quick Reference Card

### For Students:
- **Homepage:** `https://cross-life-divinity.manus.space/`
- **Register:** `https://cross-life-divinity.manus.space/register`
- **Login:** `https://cross-life-divinity.manus.space/login`
- **Courses:** `https://cross-life-divinity.manus.space/courses`
- **Pricing:** `https://cross-life-divinity.manus.space/pricing`

### For Admins:
- **Admin Portal:** `https://cross-life-divinity.manus.space/admin`
- **Role Toggle:** `https://cross-life-divinity.manus.space/toggle-role`

### For Website Integration:
- **Main CTA:** Link to homepage (`/`)
- **Course Catalog:** Link to courses (`/courses`)
- **Staff Access:** Link to admin (`/admin`)

---

## Support & Documentation

### Guides Created:
- ✅ `STRIPE_WEBHOOK_SETUP.md` - Payment configuration
- ✅ `AUTOMATIC_ACCESS_LOGIC.md` - How payments grant access
- ✅ `PLATFORM_SUSTAINABILITY_BACKUP.md` - Long-term sustainability
- ✅ `DATABASE_EXPORT_GUIDE.md` - Backup instructions
- ✅ `WEBSITE_INTEGRATION_URLS.md` - This document

### Need Help?
- **Manus Support:** https://help.manus.im
- **Stripe Support:** https://support.stripe.com
- **TiDB Support:** https://tidbcloud.com/support

---

## Summary

**Your platform is ready to publish!** After clicking the Publish button in Management UI, you'll have a live seminary platform with:

- 14 complete theology courses
- 140 seminary-quality lessons
- ACH subscription payments ($49/month)
- Individual course purchases ($89 each)
- Student and admin dashboards
- CPD certificates with QR verification
- Follow-up tracking system
- Revenue monitoring

**Use the URLs above to integrate with www.crosslifeschoolofdivinity.org and start enrolling students!**

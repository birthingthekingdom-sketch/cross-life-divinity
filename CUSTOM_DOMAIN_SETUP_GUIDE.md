# Custom Domain Setup Guide - Cross Life School of Divinity

## Goal
Set up `learn.crosslifeschoolofdivinity.org` as your platform's custom domain

---

## Step 1: Configure Domain in Manus (Do This First)

### Instructions:

1. **Open Management UI**
   - Click the Management UI icon (top-right of chatbox)
   - Or open the right panel if already visible

2. **Navigate to Domain Settings**
   - Click **"Settings"** in the left sidebar
   - Click **"Domains"** in the settings sub-menu

3. **Add Custom Domain**
   - Click **"Add Custom Domain"** button
   - Enter: `learn.crosslifeschoolofdivinity.org`
   - Click **"Add"** or **"Save"**

4. **Copy DNS Records**
   - Manus will show you DNS records to add
   - It will look something like this:

   ```
   Type: CNAME
   Name: learn
   Value: [something].manus.space (or similar)
   TTL: 3600 (or Auto)
   ```

   - **IMPORTANT:** Write down or screenshot these DNS records
   - You'll need them for the next step

---

## Step 2: Configure DNS in GoDaddy

### Instructions:

1. **Log into GoDaddy**
   - Go to https://godaddy.com
   - Sign in to your account

2. **Access DNS Management**
   - Click **"My Products"** or **"Domains"**
   - Find `crosslifeschoolofdivinity.org`
   - Click **"DNS"** or **"Manage DNS"**

3. **Add CNAME Record**
   - Click **"Add"** or **"Add Record"**
   - Select **"CNAME"** from the dropdown

4. **Enter DNS Details** (from Manus)
   - **Type:** CNAME
   - **Name:** `learn` (or `@` if Manus says to use root domain)
   - **Value:** [paste the value Manus gave you]
   - **TTL:** 1 Hour (or 3600 seconds, or leave as default)

5. **Save the Record**
   - Click **"Save"** or **"Add Record"**
   - GoDaddy will confirm the record was added

---

## Step 3: Wait for DNS Propagation

### What Happens Now:

- **DNS propagation time:** 5 minutes to 48 hours (usually 15-60 minutes)
- **Manus will automatically:**
  - Detect when DNS is configured correctly
  - Provision SSL certificate (HTTPS)
  - Activate your custom domain

### How to Check Progress:

1. **In Manus Management UI → Settings → Domains:**
   - Status will show "Pending" → "Verifying" → "Active"
   - When it shows **"Active"**, your domain is ready!

2. **Test the domain:**
   - Try visiting: `https://learn.crosslifeschoolofdivinity.org`
   - If it loads your platform, it's working!

---

## Step 4: Your Final Shareable URLs

### Once the domain is active, use these URLs:

**For Students (Registration & Homepage):**
```
https://learn.crosslifeschoolofdivinity.org
```

**For Students (Direct to Landing Page):**
```
https://learn.crosslifeschoolofdivinity.org/landing
```

**For Admin (Staff Login):**
```
https://learn.crosslifeschoolofdivinity.org/admin
```

**For Course Catalog:**
```
https://learn.crosslifeschoolofdivinity.org/courses
```

**For Pricing Page:**
```
https://learn.crosslifeschoolofdivinity.org/pricing
```

---

## Troubleshooting

### "Domain not found" or "Can't connect"
- **Wait longer:** DNS can take up to 48 hours (usually much faster)
- **Check DNS:** Use https://dnschecker.org to verify CNAME record propagated
- **Verify GoDaddy:** Make sure you saved the CNAME record correctly

### "Not secure" or SSL error
- **Wait for SSL:** Manus provisions SSL automatically, takes 5-30 minutes after DNS propagates
- **Check Manus status:** Domain status should show "Active" with green checkmark

### "Wrong website loads"
- **Check CNAME value:** Make sure you copied the exact value from Manus
- **No typos:** Verify `learn.crosslifeschoolofdivinity.org` is spelled correctly

### Still not working after 24 hours?
- **Contact Manus support:** https://help.manus.im
- **Check GoDaddy:** Verify CNAME record is visible in DNS management

---

## Alternative Subdomain Options

If you prefer a different subdomain, you can use:

- `courses.crosslifeschoolofdivinity.org`
- `seminary.crosslifeschoolofdivinity.org`
- `online.crosslifeschoolofdivinity.org`
- `study.crosslifeschoolofdivinity.org`
- `portal.crosslifeschoolofdivinity.org`

Just replace `learn` with your preferred subdomain in both Manus and GoDaddy.

---

## What to Do While Waiting for DNS

While DNS propagates (15-60 minutes typically), you can:

1. ✅ Update your GoDaddy website with the new URLs (they'll work once DNS propagates)
2. ✅ Configure Stripe webhooks using the new domain
3. ✅ Test the platform using the old Manus URL
4. ✅ Prepare marketing materials with the new domain

---

## After Domain is Active

### Update These Places:

1. **GoDaddy Website (crosslifeschoolofdivinity.org):**
   - Update all links to point to new domain
   - Navigation menu, footer, call-to-action buttons

2. **Stripe Webhook:**
   - Update webhook endpoint to: `https://learn.crosslifeschoolofdivinity.org/api/stripe/webhook`

3. **Marketing Materials:**
   - Email signatures
   - Business cards
   - Social media profiles
   - Promotional materials

4. **Google/Social Media:**
   - Update website URL in Google My Business
   - Update Facebook page website
   - Update LinkedIn company page

---

## Summary

**Your Steps:**
1. ✅ Manus Management UI → Settings → Domains → Add `learn.crosslifeschoolofdivinity.org`
2. ✅ Copy DNS records from Manus
3. ✅ GoDaddy → DNS Management → Add CNAME record
4. ✅ Wait 15-60 minutes for DNS propagation
5. ✅ Verify domain is "Active" in Manus
6. ✅ Share your new URLs with students!

**Your Final URLs:**
- Students: `https://learn.crosslifeschoolofdivinity.org/landing`
- Admin: `https://learn.crosslifeschoolofdivinity.org/admin`

**Simple, professional, and permanent!** 🎓

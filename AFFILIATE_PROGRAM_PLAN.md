# Affiliate Program Implementation Plan
## Cross Life School of Divinity

---

## Executive Summary

This document outlines the complete implementation plan for a custom affiliate program that enables churches, ministries, and individuals to earn recurring commissions by referring students to Cross Life School of Divinity courses.

**Commission Structure:**
- **Subscriptions:** 25% recurring monthly commission (lifetime)
- **Single Courses:** 35% one-time commission ($31.15 per $89 course)

**Timeline:** 4-6 weeks for complete implementation
**Database:** ✅ Already created (5 tables)

---

## Phase 1: Core Backend Infrastructure (Week 1-2)

### 1.1 Affiliate Registration System
**Estimated Time:** 3-4 days

**Backend Tasks:**
- Create affiliate registration API endpoint
- Generate unique affiliate codes (e.g., `CHURCH-HOPE-2024`)
- Implement affiliate approval workflow (pending → active)
- Build affiliate profile management endpoints
- Add email notifications for approval/rejection

**Deliverables:**
- `server/affiliate-router.ts` - Complete TRPC router
- Affiliate registration, approval, and profile management APIs
- Email templates for affiliate onboarding

### 1.2 Referral Tracking System
**Estimated Time:** 4-5 days

**Backend Tasks:**
- Implement cookie-based tracking (60-day attribution window)
- Create referral link click tracking
- Build signup attribution system
- Track IP addresses and user agents for fraud prevention
- Create conversion tracking (signup → paid customer)

**Technical Implementation:**
- Middleware to detect `?ref=AFFILIATE_CODE` in URLs
- Set secure HTTP-only cookie with affiliate code
- Track clicks in `affiliate_clicks` table
- Link new signups to affiliates via `affiliate_referrals` table

**Deliverables:**
- Referral tracking middleware
- Click analytics system
- Attribution logic integrated with signup flow

### 1.3 Commission Calculation Engine
**Estimated Time:** 3-4 days

**Backend Tasks:**
- Calculate commissions on course purchases (35%)
- Calculate commissions on subscription signups (25% recurring)
- Handle subscription renewals (automatic commission)
- Implement commission approval workflow
- Build commission cancellation logic (refunds, chargebacks)

**Business Rules:**
- Commissions start as "pending" (7-day fraud check period)
- Auto-approve after 7 days
- Cancel commissions on refunds
- Track lifetime value per referral

**Deliverables:**
- Commission calculation functions
- Automated commission creation on payments
- Integration with Stripe webhooks

---

## Phase 2: Affiliate Dashboard (Week 2-3)

### 2.1 Affiliate Portal Frontend
**Estimated Time:** 5-6 days

**Pages to Build:**
1. **Affiliate Registration Page** (`/affiliate/apply`)
   - Application form
   - Terms and conditions
   - Payout method selection

2. **Affiliate Dashboard** (`/affiliate/dashboard`)
   - Overview stats (clicks, referrals, earnings)
   - Referral link generator with copy button
   - Recent activity feed
   - Performance charts (Chart.js)

3. **Earnings Page** (`/affiliate/earnings`)
   - Detailed commission history table
   - Filter by status (pending, approved, paid)
   - Export to CSV functionality
   - Lifetime earnings summary

4. **Payouts Page** (`/affiliate/payouts`)
   - Payout history
   - Request payout button (minimum $50)
   - Payout method management
   - Transaction details

5. **Marketing Materials** (`/affiliate/resources`)
   - Downloadable banners and graphics
   - Email templates (copy to clipboard)
   - Social media post templates
   - Course catalog PDFs
   - Affiliate program guidelines

**UI Components:**
- Referral link card with one-click copy
- Earnings summary cards
- Commission status badges
- Performance charts and graphs
- Payout request modal

**Deliverables:**
- Complete affiliate portal with 5 pages
- Responsive design for mobile access
- Marketing materials library

### 2.2 Affiliate Analytics
**Estimated Time:** 2-3 days

**Features:**
- Click-through rate (CTR) tracking
- Conversion rate analytics
- Top performing affiliates leaderboard
- Revenue per affiliate
- Geographic distribution of clicks
- Device/browser analytics

**Deliverables:**
- Analytics dashboard with visualizations
- Real-time stats updates
- Export reports functionality

---

## Phase 3: Admin Management Tools (Week 3-4)

### 3.1 Admin Affiliate Management
**Estimated Time:** 4-5 days

**Admin Pages:**
1. **Affiliate Overview** (`/admin/affiliates`)
   - List all affiliates with status
   - Search and filter functionality
   - Quick actions (approve, suspend, delete)
   - Performance metrics per affiliate

2. **Affiliate Detail View** (`/admin/affiliates/:id`)
   - Full affiliate profile
   - Referral history
   - Commission breakdown
   - Payout history
   - Activity timeline
   - Manual commission adjustments

3. **Commission Management** (`/admin/commissions`)
   - All commissions table
   - Bulk approve/reject
   - Manual commission creation
   - Commission disputes handling
   - Refund processing

4. **Payout Processing** (`/admin/payouts`)
   - Pending payout requests
   - Batch payout processing
   - PayPal integration (optional)
   - Manual payout recording
   - Payout history and reconciliation

**Features:**
- Affiliate approval workflow
- Commission override capabilities
- Fraud detection alerts
- Custom commission rates per affiliate
- Bulk operations (approve, pay, suspend)

**Deliverables:**
- Complete admin affiliate management system
- Payout processing interface
- Commission management tools

### 3.2 Reporting and Analytics
**Estimated Time:** 2-3 days

**Admin Reports:**
- Monthly affiliate performance report
- Commission liability report (pending payouts)
- Top performers dashboard
- Conversion funnel analysis
- Revenue attribution report
- Fraud detection report

**Deliverables:**
- Comprehensive reporting dashboard
- Exportable reports (PDF, CSV)
- Scheduled email reports

---

## Phase 4: Integration and Automation (Week 4-5)

### 4.1 Payment System Integration
**Estimated Time:** 3-4 days

**Integration Points:**
1. **Stripe Course Purchases**
   - Detect affiliate attribution on checkout
   - Calculate and record commission
   - Handle refunds and chargebacks

2. **Stripe Subscriptions**
   - Record initial commission
   - Track recurring payments
   - Calculate monthly commissions automatically
   - Handle subscription cancellations

3. **Webhook Handlers**
   - `payment_intent.succeeded` → Record commission
   - `invoice.paid` → Record recurring commission
   - `charge.refunded` → Cancel commission
   - `customer.subscription.deleted` → Stop commissions

**Deliverables:**
- Complete Stripe integration
- Automated commission recording
- Refund handling logic

### 4.2 Email Automation
**Estimated Time:** 2-3 days

**Email Templates:**
1. **Affiliate Onboarding**
   - Welcome email with login instructions
   - Getting started guide
   - Marketing materials link

2. **Application Status**
   - Application received confirmation
   - Approval notification
   - Rejection notification (with reason)

3. **Commission Notifications**
   - New referral notification
   - Commission earned notification
   - Commission approved notification

4. **Payout Notifications**
   - Payout request received
   - Payout processed confirmation
   - Monthly earnings summary

**Deliverables:**
- 10+ email templates
- Automated email triggers
- Email preferences management

### 4.3 Fraud Prevention
**Estimated Time:** 2 days

**Security Measures:**
- IP address tracking and duplicate detection
- Self-referral prevention (can't refer yourself)
- Cookie manipulation detection
- Suspicious pattern alerts
- Manual review queue for high-value commissions
- Rate limiting on referral links

**Deliverables:**
- Fraud detection system
- Admin alert dashboard
- Automated suspicious activity flagging

---

## Phase 5: Marketing and Launch (Week 5-6)

### 5.1 Public Affiliate Program Page
**Estimated Time:** 3 days

**Page Content:**
- Program overview and benefits
- Commission structure explanation
- Success stories and testimonials
- Application process walkthrough
- FAQ section
- "Apply Now" CTA

**Deliverables:**
- Professional landing page (`/affiliate-program`)
- SEO optimization
- Conversion-optimized design

### 5.2 Marketing Materials Creation
**Estimated Time:** 3-4 days

**Assets to Create:**
1. **Graphics**
   - 5 banner sizes (leaderboard, rectangle, skyscraper)
   - Social media graphics (Facebook, Instagram, Twitter)
   - Email signature banners

2. **Copy Templates**
   - 10 email templates
   - 20 social media posts
   - Blog post templates
   - Newsletter content

3. **Documentation**
   - Affiliate handbook (PDF)
   - Quick start guide
   - Best practices document
   - Terms and conditions

**Deliverables:**
- Complete marketing kit
- Downloadable resources
- Affiliate handbook

### 5.3 Testing and Launch
**Estimated Time:** 3-4 days

**Testing Checklist:**
- [ ] Affiliate registration flow
- [ ] Referral link tracking
- [ ] Cookie attribution (60-day window)
- [ ] Commission calculations (subscription & course)
- [ ] Payout request process
- [ ] Admin approval workflow
- [ ] Email notifications
- [ ] Fraud prevention
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

**Launch Tasks:**
- Soft launch with 5-10 beta affiliates
- Gather feedback and iterate
- Fix any bugs discovered
- Full public launch
- Announcement email to existing users
- Social media promotion

**Deliverables:**
- Fully tested affiliate system
- Launch announcement materials
- Support documentation

---

## Technical Architecture

### Database Schema (✅ Already Created)
```
affiliates
├── id, userId, affiliateCode
├── status, commissionRates
├── earnings (total, pending, paid)
└── timestamps

affiliate_referrals
├── id, affiliateId, referredUserId
├── referralCode, status
└── timestamps

affiliate_commissions
├── id, affiliateId, referralId
├── amount, type, status
└── timestamps

affiliate_payouts
├── id, affiliateId, amount
├── payoutMethod, status
└── timestamps

affiliate_clicks
├── id, affiliateId, affiliateCode
├── ipAddress, userAgent
└── timestamp
```

### API Endpoints Structure
```
/api/affiliate
├── POST /register - Apply to become affiliate
├── GET /dashboard - Get dashboard stats
├── GET /referrals - List referrals
├── GET /commissions - List commissions
├── GET /payouts - List payouts
├── POST /payout/request - Request payout
└── GET /marketing-materials - Get resources

/api/admin/affiliate
├── GET /list - List all affiliates
├── POST /approve/:id - Approve affiliate
├── POST /suspend/:id - Suspend affiliate
├── GET /commissions - Manage commissions
├── POST /payout/process - Process payouts
└── GET /analytics - View reports
```

---

## Success Metrics

### Key Performance Indicators (KPIs)
1. **Affiliate Growth**
   - Target: 50 active affiliates in first 3 months
   - Target: 200 active affiliates in first year

2. **Referral Conversion**
   - Target: 10% conversion rate (clicks → signups)
   - Target: 5% conversion rate (signups → paid)

3. **Revenue Attribution**
   - Target: 20% of new revenue from affiliates (Month 6)
   - Target: 40% of new revenue from affiliates (Month 12)

4. **Average Commission**
   - Target: $150/month per active affiliate
   - Target: $1,800/year per active affiliate

5. **Return on Investment**
   - Target: 3:1 revenue to commission ratio
   - Target: Break-even on affiliate costs within 90 days

---

## Budget and Resources

### Development Time Estimate
- **Phase 1:** 10-13 days (Backend)
- **Phase 2:** 7-9 days (Affiliate Dashboard)
- **Phase 3:** 6-8 days (Admin Tools)
- **Phase 4:** 7-9 days (Integration)
- **Phase 5:** 6-7 days (Marketing & Launch)

**Total:** 36-46 days (approximately 6-8 weeks)

### Ongoing Costs
- **Monthly Payout Processing:** Variable (based on affiliate earnings)
- **Email Service:** Included in existing plan
- **Support Time:** 2-4 hours/week for affiliate support

---

## Risk Mitigation

### Potential Risks and Solutions

1. **Fraud Risk**
   - **Solution:** 7-day pending period, IP tracking, manual review for high-value commissions

2. **Payout Delays**
   - **Solution:** Clear payout schedule (monthly), minimum $50 threshold, automated processing

3. **Low Affiliate Engagement**
   - **Solution:** Onboarding training, marketing materials, monthly newsletters, performance bonuses

4. **Technical Issues**
   - **Solution:** Comprehensive testing, staged rollout, 24/7 monitoring

5. **Commission Disputes**
   - **Solution:** Clear terms and conditions, transparent tracking, admin dispute resolution process

---

## Next Steps

### Immediate Actions (This Week)
1. ✅ Create database schema
2. ⏳ Update presentation with affiliate program details
3. ⏳ Get stakeholder approval on commission structure
4. ⏳ Begin Phase 1 development

### Week 1-2 Goals
- Complete backend infrastructure
- Set up referral tracking
- Build commission calculation engine

### Week 3-4 Goals
- Launch affiliate dashboard
- Build admin management tools
- Create marketing materials

### Week 5-6 Goals
- Complete integrations
- Beta test with 5-10 affiliates
- Public launch

---

## Conclusion

This affiliate program will create a powerful growth engine for Cross Life School of Divinity by leveraging the networks of churches and ministries. The 25% recurring commission structure provides sustainable income for partners while maintaining healthy margins for the school.

**Projected Impact:**
- 50 affiliates × 4 referrals/month × $30 subscription = $6,000/month new revenue
- Commission cost: $1,500/month (25%)
- Net new revenue: $4,500/month

**Year 1 Projection:**
- 200 active affiliates
- 800 new students via affiliates
- $288,000 in affiliate-driven revenue
- $72,000 in commission payouts
- **$216,000 net new revenue**

This represents a highly profitable customer acquisition channel with built-in motivation for partners to promote quality theological education.

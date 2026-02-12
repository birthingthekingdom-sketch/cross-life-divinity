# Cross Life School of Divinity - Platform Sustainability & Backup Guide

## Platform Sustainability Analysis

### ✅ What Makes This Platform Sustainable

#### 1. **Modern, Maintained Technology Stack**
- **React 19** - Latest stable version with long-term support
- **TypeScript** - Industry standard for type-safe JavaScript
- **Tailwind CSS 4** - Actively maintained, modern CSS framework
- **tRPC** - Type-safe API layer with growing adoption
- **Drizzle ORM** - Modern database toolkit with active development
- **Stripe** - Industry-leading payment processor (99.99% uptime SLA)

All core technologies are:
- Actively maintained by large communities
- Have long-term support commitments
- Used by thousands of production applications
- Well-documented with extensive resources

#### 2. **Database Sustainability (TiDB Cloud)**
- **Managed Database Service** - No server maintenance required
- **Automatic Backups** - TiDB provides automated daily backups
- **99.99% Uptime SLA** - Enterprise-grade reliability
- **Scalability** - Can handle growth from 10 to 10,000+ students
- **MySQL Compatible** - Easy migration path if needed

#### 3. **Hosting Sustainability (Manus Platform)**
- **Managed Hosting** - Infrastructure handled by Manus
- **Automatic SSL Certificates** - HTTPS enabled by default
- **CDN Integration** - Fast global content delivery
- **Automatic Deployments** - One-click publishing from checkpoints
- **Version Control** - All checkpoints saved with rollback capability

#### 4. **Payment Processing Sustainability**
- **Stripe Integration** - Handles all payment complexity
- **PCI Compliance** - Stripe maintains compliance, not you
- **Webhook Automation** - Automatic course access granting
- **Subscription Management** - Recurring billing handled automatically
- **ACH Support** - Bank transfer payments for lower fees

#### 5. **Content Sustainability**
- **140 Seminary-Quality Lessons** - Complete curriculum ready to deliver
- **Database-Driven Content** - Easy to update without code changes
- **Bulk Import System** - Can add/update lessons via CSV
- **No Hard-Coded Content** - All course data in database

### ⚠️ Sustainability Considerations

#### 1. **Dependency on Manus Platform**
- Platform is hosted on Manus infrastructure
- If Manus service ends, you'll need to migrate to another host
- **Mitigation:** Full code backup available (see below)

#### 2. **Database Dependency on TiDB**
- Database hosted on TiDB Cloud
- **Mitigation:** MySQL-compatible, easy to export/migrate

#### 3. **Third-Party Service Dependencies**
- Stripe (payments)
- Manus OAuth (authentication)
- **Mitigation:** Standard services with export capabilities

---

## Backup & Export Options

### 1. **Code Backup (Full Project Download)**

#### Via Management UI (Recommended)
1. Open your project in Manus
2. Go to **Management UI** → **Code** panel
3. Click **"Download All Files"** button
4. Saves complete project as ZIP file

**What's Included:**
- All source code (client, server, shared)
- Configuration files (package.json, tsconfig.json, etc.)
- Database schema definitions
- All custom components and pages
- Complete git history

#### Via Checkpoint Export
Each checkpoint is a full snapshot:
- Download checkpoint: `manus-webdev://a4fb3ed7`
- Contains entire project state at that moment
- Can be restored or deployed elsewhere

### 2. **Database Backup**

#### Option A: TiDB Cloud Dashboard (Automatic)
- TiDB automatically backs up your database daily
- Access via TiDB Cloud dashboard
- Restore to any point in time (within retention period)

#### Option B: Manual Database Export
1. Go to **Management UI** → **Database** panel
2. Click **Settings** (bottom-left corner)
3. View full connection details:
   - Host, Port, Username, Password
4. Use MySQL tools to export:

```bash
# Using mysqldump
mysqldump -h <host> -P <port> -u <username> -p <database> > backup.sql

# Or use MySQL Workbench, DBeaver, or any MySQL client
```

#### Option C: SQL Export via Platform
```sql
-- Export all courses
SELECT * FROM courses;

-- Export all lessons
SELECT * FROM lessons;

-- Export all enrollments
SELECT * FROM enrollments;

-- Export all users
SELECT * FROM users;
```

Save results as CSV or SQL for backup.

### 3. **Content Backup (Lessons & Courses)**

#### Bulk Export via Admin Dashboard
1. Navigate to **Admin Dashboard**
2. Use **Bulk Import Lessons** feature in reverse:
   - Export lessons to CSV format
   - Includes all lesson content, Scripture references, etc.

#### Database Query Export
Run these queries in Management UI → Database:

```sql
-- Export complete course catalog
SELECT 
  c.id, c.title, c.code, c.description, c.category,
  COUNT(l.id) as lesson_count
FROM courses c
LEFT JOIN lessons l ON c.id = l.courseId
GROUP BY c.id;

-- Export all lesson content
SELECT 
  l.id, l.courseId, c.title as course_title,
  l.title, l.content, l.videoUrl, l.lessonOrder,
  l.createdAt, l.updatedAt
FROM lessons l
JOIN courses c ON l.courseId = c.id
ORDER BY c.id, l.lessonOrder;
```

### 4. **Student Data Backup**

```sql
-- Export student enrollments
SELECT 
  u.email, u.name, u.role,
  c.title as course_title,
  e.enrolledAt, e.completedAt,
  e.progress, e.quizScore
FROM enrollments e
JOIN users u ON e.userId = u.id
JOIN courses c ON e.courseId = c.id;

-- Export student progress
SELECT 
  u.email, u.name,
  COUNT(DISTINCT e.courseId) as courses_enrolled,
  AVG(e.progress) as avg_progress,
  SUM(CASE WHEN e.completedAt IS NOT NULL THEN 1 ELSE 0 END) as courses_completed
FROM users u
JOIN enrollments e ON u.id = e.userId
WHERE u.role = 'student'
GROUP BY u.id;
```

### 5. **Payment & Revenue Backup**

```sql
-- Export payment history
SELECT 
  u.email, u.name,
  p.stripePaymentIntentId,
  p.amount, p.currency, p.status,
  p.createdAt
FROM payments p
JOIN users u ON p.userId = u.id
ORDER BY p.createdAt DESC;

-- Export subscription data
SELECT 
  u.email, u.name,
  s.stripeSubscriptionId,
  s.status, s.currentPeriodStart, s.currentPeriodEnd,
  s.cancelAtPeriodEnd
FROM subscriptions s
JOIN users u ON s.userId = u.id;
```

---

## Migration Strategy (If Needed)

### Scenario: Moving Away from Manus Platform

#### Step 1: Download Complete Codebase
- Download all files from Management UI → Code panel
- Includes full React + Node.js application

#### Step 2: Export Database
- Use TiDB export or mysqldump
- Save complete database backup

#### Step 3: Choose New Hosting
**Recommended Options:**
- **Vercel** (frontend) + **Railway** (backend + database)
- **Netlify** (frontend) + **Heroku** (backend + database)
- **AWS Amplify** (full-stack)
- **DigitalOcean App Platform** (full-stack)

#### Step 4: Update Configuration
```bash
# Update environment variables for new host
DATABASE_URL=<new-database-url>
STRIPE_SECRET_KEY=<your-stripe-key>
JWT_SECRET=<your-jwt-secret>
```

#### Step 5: Deploy
```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Deploy to new host
# (Follow host-specific deployment guide)
```

---

## Recommended Backup Schedule

### Daily (Automatic)
- ✅ TiDB Cloud automatic database backups
- ✅ Manus platform checkpoint history

### Weekly (Manual)
- 📥 Download full project code (ZIP)
- 📥 Export database to SQL file
- 📥 Export lesson content to CSV

### Monthly (Manual)
- 📥 Export student enrollment data
- 📥 Export payment/revenue reports
- 📥 Export analytics and metrics

### Before Major Changes
- 📥 Create checkpoint in Manus
- 📥 Download complete project backup
- 📥 Export database snapshot

---

## Emergency Recovery Plan

### If Platform Goes Down
1. **Check Status:** Verify if it's temporary downtime
2. **Access Backups:** Retrieve latest code + database backup
3. **Deploy Elsewhere:** Use migration strategy above
4. **Update DNS:** Point domain to new host
5. **Restore Data:** Import database backup
6. **Test Thoroughly:** Verify all features work

### If Database Corrupted
1. **Stop All Access:** Prevent further damage
2. **Restore from TiDB Backup:** Use point-in-time recovery
3. **Verify Data Integrity:** Check critical tables
4. **Resume Operations:** Re-enable student access

### If Code Issues
1. **Rollback to Previous Checkpoint:** Use Manus rollback feature
2. **Identify Issue:** Review recent changes
3. **Fix and Test:** Correct problem in safe environment
4. **Deploy Fix:** Create new checkpoint

---

## Long-Term Sustainability Recommendations

### 1. **Regular Backups**
- Set calendar reminders for weekly/monthly backups
- Store backups in multiple locations (local + cloud)
- Test restore process quarterly

### 2. **Documentation**
- Keep this guide updated with any changes
- Document custom features or integrations
- Maintain list of environment variables

### 3. **Monitoring**
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor Stripe webhook success rates
- Track student enrollment and engagement metrics

### 4. **Financial Sustainability**
- ACH payments reduce transaction fees (0.8% vs 2.9% for cards)
- $49/month subscription model provides recurring revenue
- 140 lessons = strong value proposition for retention

### 5. **Content Updates**
- Plan quarterly content reviews
- Add new courses based on student demand
- Update existing lessons with fresh examples

---

## Cost Analysis

### Monthly Operating Costs (Estimated)

| Service | Cost | Notes |
|---------|------|-------|
| Manus Hosting | Varies | Check Manus pricing |
| TiDB Cloud Database | $0-50 | Free tier available, scales with usage |
| Stripe Fees | 0.8% + $5/ACH | Per transaction (ACH), or 2.9% + $0.30 (card) |
| Domain (if custom) | $12/year | Optional |

### Revenue Potential

**Subscription Model ($49/month):**
- 10 students = $490/month
- 50 students = $2,450/month
- 100 students = $4,900/month

**One-Time Course Sales ($89/course):**
- 10 courses/month = $890/month
- 50 courses/month = $4,450/month

**Break-Even:** ~10-20 active subscribers covers all operating costs

---

## Conclusion

### ✅ Platform IS Sustainable Because:
1. Built on proven, actively maintained technologies
2. Managed services handle infrastructure complexity
3. Complete backup and export capabilities
4. Clear migration path if needed
5. Revenue model supports ongoing costs
6. 140 lessons of content already created

### 🎯 Action Items for Maximum Sustainability:
1. ✅ Download complete project backup NOW
2. ✅ Export database to SQL file
3. ✅ Save Stripe webhook configuration
4. ✅ Document all environment variables
5. ✅ Set up weekly backup reminders
6. ✅ Test database export/import process
7. ✅ Create emergency contact list (Manus support, TiDB support, Stripe support)

**Your platform is production-ready and sustainable for long-term operation.**

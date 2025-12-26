# Manual Database Export Guide - Cross Life School of Divinity

## Quick Overview

This guide shows you how to export ALL your platform data (courses, lessons, students, payments, etc.) from the TiDB database to backup files on your computer.

---

## Method 1: Export via Management UI (Easiest)

### Step 1: Get Database Connection Details

1. Open your Cross Life School of Divinity project
2. Click the **Management UI** icon (top-right of chatbox)
3. Navigate to **Database** panel (left sidebar)
4. Scroll to bottom-left and click **Settings** ⚙️
5. You'll see your database connection details:

```
Host: gateway01.us-west-2.prod.aws.tidbcloud.com
Port: 4000
Database: cross_life_divinity
Username: [your-username]
Password: [your-password]
```

**IMPORTANT:** Copy these details to a secure note. You'll need them for the export.

### Step 2: Choose Your Export Tool

Pick ONE of these options based on what you're comfortable with:

---

## Option A: Using MySQL Workbench (Recommended for Non-Technical Users)

### Download & Install
- **Windows/Mac:** Download from [mysql.com/products/workbench](https://www.mysql.com/products/workbench/)
- **Free and user-friendly**

### Steps to Export

1. **Open MySQL Workbench**

2. **Create New Connection:**
   - Click "+" next to "MySQL Connections"
   - Enter connection details:
     - Connection Name: `Cross Life Divinity`
     - Hostname: `gateway01.us-west-2.prod.aws.tidbcloud.com`
     - Port: `4000`
     - Username: `[from Management UI]`
     - Password: Click "Store in Vault" and enter password
     - Default Schema: `cross_life_divinity`
   - Click "Test Connection" to verify
   - Click "OK" to save

3. **Connect to Database:**
   - Double-click your new connection
   - Enter password if prompted

4. **Export Database:**
   - Go to **Server** → **Data Export**
   - Select `cross_life_divinity` database
   - Choose tables to export (select all):
     - ✅ courses
     - ✅ lessons
     - ✅ users
     - ✅ enrollments
     - ✅ payments
     - ✅ subscriptions
     - ✅ access_codes
     - ✅ follow_ups
     - ✅ (all other tables)
   - Export Options:
     - ✅ "Export to Self-Contained File"
     - Choose location: `Desktop/CLSD_Backup_2025-12-05.sql`
     - ✅ "Include Create Schema"
   - Click **Start Export**

5. **Verify Export:**
   - Check that the `.sql` file was created
   - File should be several MB in size (contains all your data)

---

## Option B: Using DBeaver (Cross-Platform, Free)

### Download & Install
- Download from [dbeaver.io](https://dbeaver.io/)
- Works on Windows, Mac, Linux

### Steps to Export

1. **Open DBeaver**

2. **Create New Connection:**
   - Click "New Database Connection" (plug icon)
   - Select **MySQL**
   - Click "Next"

3. **Enter Connection Details:**
   - Host: `gateway01.us-west-2.prod.aws.tidbcloud.com`
   - Port: `4000`
   - Database: `cross_life_divinity`
   - Username: `[from Management UI]`
   - Password: `[from Management UI]`
   - ✅ Check "Save password"
   - Click "Test Connection"
   - Click "Finish"

4. **Export Database:**
   - Right-click on `cross_life_divinity` database
   - Select **Tools** → **Export Data**
   - Choose export format: **SQL**
   - Select all tables
   - Output file: `Desktop/CLSD_Backup_2025-12-05.sql`
   - Click "Start"

5. **Verify Export:**
   - Check that the `.sql` file exists
   - Open in text editor to verify it contains data

---

## Option C: Using Command Line (For Technical Users)

### Requirements
- MySQL client installed on your computer
- Terminal/Command Prompt access

### Export Command

```bash
# Replace [USERNAME] and [PASSWORD] with your actual credentials
mysqldump \
  -h gateway01.us-west-2.prod.aws.tidbcloud.com \
  -P 4000 \
  -u [USERNAME] \
  -p[PASSWORD] \
  --ssl-mode=REQUIRED \
  --databases cross_life_divinity \
  --single-transaction \
  --routines \
  --triggers \
  > CLSD_Backup_2025-12-05.sql
```

### Windows Command Prompt:
```cmd
mysqldump -h gateway01.us-west-2.prod.aws.tidbcloud.com -P 4000 -u [USERNAME] -p[PASSWORD] --ssl-mode=REQUIRED --databases cross_life_divinity --single-transaction --routines --triggers > CLSD_Backup_2025-12-05.sql
```

### Verify Export:
```bash
# Check file size (should be several MB)
ls -lh CLSD_Backup_2025-12-05.sql

# View first few lines
head -n 20 CLSD_Backup_2025-12-05.sql
```

---

## Option D: Export Individual Tables as CSV (Simple Backup)

If you just want quick backups of key data without installing tools:

### Via Management UI → Database Panel

1. **Open Management UI → Database**

2. **Run these queries one at a time:**

#### Export All Courses
```sql
SELECT * FROM courses;
```
- Click "Export" → Save as `courses_backup.csv`

#### Export All Lessons (Most Important!)
```sql
SELECT * FROM lessons;
```
- Click "Export" → Save as `lessons_backup.csv`

#### Export All Students
```sql
SELECT * FROM users WHERE role = 'student';
```
- Click "Export" → Save as `students_backup.csv`

#### Export All Enrollments
```sql
SELECT * FROM enrollments;
```
- Click "Export" → Save as `enrollments_backup.csv`

#### Export All Payments
```sql
SELECT * FROM payments;
```
- Click "Export" → Save as `payments_backup.csv`

#### Export All Subscriptions
```sql
SELECT * FROM subscriptions;
```
- Click "Export" → Save as `subscriptions_backup.csv`

3. **Save all CSV files to a folder:**
   - Create folder: `CLSD_Database_Backup_2025-12-05`
   - Store all CSV files inside

---

## What Gets Backed Up

Your database export includes:

### Core Content (Most Important)
- ✅ **14 Courses** - All course titles, descriptions, categories
- ✅ **140 Lessons** - Complete lesson content, Scripture references, word studies
- ✅ **Course Structure** - Lesson ordering, course codes

### Student Data
- ✅ **User Accounts** - Names, emails, roles
- ✅ **Enrollments** - Which students are in which courses
- ✅ **Progress Tracking** - Completion percentages, quiz scores
- ✅ **Certificates** - Issued certificates with QR codes

### Business Data
- ✅ **Payments** - All payment transactions
- ✅ **Subscriptions** - Active/cancelled subscriptions
- ✅ **Revenue History** - Complete financial records

### Administrative Data
- ✅ **Access Codes** - Enrollment codes
- ✅ **Follow-Ups** - Student engagement tracking
- ✅ **Webinars** - Scheduled sessions

---

## How to Restore from Backup

### If You Need to Restore Data:

#### Using MySQL Workbench:
1. Connect to database
2. Go to **Server** → **Data Import**
3. Select "Import from Self-Contained File"
4. Choose your backup `.sql` file
5. Click "Start Import"

#### Using Command Line:
```bash
mysql \
  -h gateway01.us-west-2.prod.aws.tidbcloud.com \
  -P 4000 \
  -u [USERNAME] \
  -p[PASSWORD] \
  --ssl-mode=REQUIRED \
  cross_life_divinity < CLSD_Backup_2025-12-05.sql
```

#### Using CSV Files:
1. Open Management UI → Database
2. Delete existing data: `DELETE FROM [table_name];`
3. Import CSV via database tool or bulk insert queries

---

## Backup Schedule Recommendations

### Weekly Backups (Recommended)
- **Every Sunday night** or **Monday morning**
- Export full database to `.sql` file
- Name with date: `CLSD_Backup_2025-12-08.sql`
- Keep last 4 weeks of backups

### Before Major Changes
- Before adding new courses
- Before bulk lesson updates
- Before changing payment settings
- Before publishing platform updates

### Monthly Archives
- Keep one backup per month indefinitely
- Store in secure cloud storage (Google Drive, Dropbox, OneDrive)

---

## Storage Recommendations

### Where to Store Backups

1. **Local Computer:**
   - Create folder: `Documents/CLSD_Backups/`
   - Organize by date

2. **Cloud Storage (Highly Recommended):**
   - **Google Drive** - Free 15GB
   - **Dropbox** - Free 2GB
   - **OneDrive** - Free 5GB
   - Create folder: `CLSD_Database_Backups`

3. **External Hard Drive:**
   - Monthly backup to USB drive
   - Store in safe location

### Backup File Sizes (Estimated)

- Full SQL export: **5-20 MB** (with 140 lessons)
- Individual CSV files: **1-5 MB total**
- Grows as you add students and content

---

## Quick Backup Checklist

### ✅ Weekly Backup (15 minutes)

1. [ ] Open Management UI → Database → Settings
2. [ ] Copy database connection details
3. [ ] Open MySQL Workbench or DBeaver
4. [ ] Connect to database
5. [ ] Export to SQL file with today's date
6. [ ] Verify file was created (check file size)
7. [ ] Upload to Google Drive/Dropbox
8. [ ] Delete backups older than 4 weeks

### ✅ Monthly Archive (20 minutes)

1. [ ] Create full SQL export
2. [ ] Export individual CSV files for key tables
3. [ ] Create folder: `CLSD_Backup_[Month]_[Year]`
4. [ ] Store SQL + CSV files in folder
5. [ ] Upload to cloud storage
6. [ ] Keep indefinitely

---

## Troubleshooting

### "Connection Failed" Error
- ✅ Check that you copied connection details correctly
- ✅ Verify SSL/TLS is enabled in connection settings
- ✅ Check your internet connection
- ✅ Confirm database is running (check Management UI)

### "Access Denied" Error
- ✅ Verify username and password are correct
- ✅ Copy password directly from Management UI (no typos)
- ✅ Check that user has export permissions

### Export File is Empty or Too Small
- ✅ Make sure you selected all tables
- ✅ Check "Include data" option is enabled
- ✅ Verify database actually contains data (run SELECT queries first)

### Can't Find MySQL Workbench Export Option
- ✅ Make sure you're connected to the database first
- ✅ Look under **Server** menu (not Database menu)
- ✅ Try **Management** → **Export Data** instead

---

## Emergency Contact Information

### If You Need Help:

**Manus Support:**
- Submit request: https://help.manus.im

**TiDB Cloud Support:**
- Dashboard: https://tidbcloud.com
- Documentation: https://docs.pingcap.com/tidbcloud

**MySQL Tools Help:**
- MySQL Workbench: https://dev.mysql.com/doc/workbench/en/
- DBeaver: https://dbeaver.io/docs/

---

## Summary

### Your Database Contains:
- 14 complete theology courses
- 140 seminary-quality lessons
- All student accounts and progress
- Complete payment and subscription history
- Administrative data and settings

### Best Backup Method:
1. **Use MySQL Workbench** (easiest for most users)
2. **Export full database** to `.sql` file weekly
3. **Store in cloud** (Google Drive, Dropbox)
4. **Keep 4 weeks** of backups + monthly archives

### Time Required:
- **First time:** 30 minutes (setup + export)
- **Weekly backups:** 10-15 minutes
- **Worth it:** Priceless data protection

**Your 140 lessons and student data are too valuable to lose. Back them up regularly!**

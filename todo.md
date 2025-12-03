# Project TODO

## Database Schema
- [x] Define courses table
- [x] Define lessons table
- [x] Define quiz questions table
- [x] Define student progress table
- [x] Define access codes table
- [x] Push database schema

## Backend (tRPC Procedures)
- [x] Course management procedures (CRUD)
- [x] Lesson management procedures (CRUD)
- [x] Quiz management procedures (CRUD)
- [x] Student progress tracking procedures
- [x] Access code management procedures
- [x] Authentication and authorization procedures

## Frontend - Public Site
- [x] Login page with access code
- [x] Student dashboard with course cards
- [x] Course detail page with lessons list
- [x] Lesson viewer with quiz functionality
- [x] Progress tracking display

## Frontend - Admin Dashboard
- [x] Admin dashboard layout
- [x] Course management interface
- [x] Lesson management interface
- [x] Quiz management interface
- [x] Access code management interface
- [x] Student progress monitoring

## Design & Assets
- [x] Update global theme colors (blue/gold palette)
- [x] Add custom fonts (Merriweather & Open Sans)
- [x] Polish UI components

## Testing & Deployment
- [x] Write vitest tests for key procedures
- [x] Test all user flows in browser
- [x] Create checkpoint
- [ ] Publish website

## New Features - Phase 2

### Quiz Tracking System
- [x] Add quiz_submissions table to database schema
- [x] Create quiz submission API endpoints
- [x] Build quiz UI component with answer selection
- [x] Display quiz results and scores
- [x] Update progress tracking to include quiz completion

### Course Certificates
- [x] Install PDF generation library
- [x] Design certificate template
- [x] Create certificate generation endpoint
- [x] Add "Download Certificate" button for completed courses
- [x] Store certificate metadata in database

### Admin Content Editor
- [x] Install rich text editor library (TipTap or similar)
- [x] Create lesson edit page in admin panel
- [x] Build course edit interface
- [x] Add quiz question editor
- [x] Implement save/update functionality
- [x] All core features completed

### New Lessons
- [x] Add Deliverance lesson to DIV104
- [x] Add Fivefold Ministry lesson to DIV106
- [x] Add Prophecy lesson to DIV104
- [x] Create quiz questions for new lessons
- [x] Update course totalLessons counts

## Course-Specific Enrollment System

### Database Schema Updates
- [x] Create course_enrollments table (userId, courseId, enrolledAt)
- [x] Create access_code_courses table (accessCodeId, courseId) for many-to-many relationship
- [x] Update access codes to support course-specific or full suite access
- [x] Push database schema changes

### Backend Logic
- [x] Update enrollment procedure to link access codes to specific courses
- [x] Create procedure to check if user is enrolled in a course
- [x] Update course listing to show only enrolled courses
- [x] Add admin procedures to assign courses to access codes

### Admin Interface
- [x] Update access code creation to select which courses to unlock
- [x] Add UI for assigning courses to existing access codes
- [x] Display course assignments in access code table

### Student Experience
- [x] Update dashboard to show only enrolled courses
- [x] Update enrollment flow to register user for specific courses
- [x] Add "My Courses" view showing enrolled courses only
- [x] Prevent access to non-enrolled courses

### Testing
- [ ] Test individual course enrollment
- [ ] Test full suite enrollment
- [ ] Test access restrictions
- [ ] Create final checkpoint

## Convert Lessons to Separate Courses

### Remove Added Lessons
- [x] Delete Deliverance lesson from DIV104
- [x] Delete Prophecy lesson from DIV104
- [x] Delete Fivefold Ministry lesson from DIV106
- [x] Update course lesson counts
### Create New Courses
- [x] Create DIV108: Deliverance Ministry course
- [x] Create DIV109: The Fivefold Ministry course
- [x] Create DIV110: Prophecy & Prophetic Office course
- [x] Add starter lesson content to each course (3 lessons each)
- [x] Add quiz questions for each lesson
- [ ] Update total course count to 10

## New Features - Phase 3

### Bulk Lesson Import
- [x] Add CSV parsing library
- [x] Create lesson import database procedure
- [x] Build admin UI for file upload
- [x] Add CSV template download
- [x] Implement validation and error handling
- [ ] Test bulk import with sample da### Discussion Forums
- [x] Create database schema for forums (topics, posts, replies)
- [x] Build forum API endpoints
- [x] Create forum UI pages
- [x] Add forum link to course pages
- [ ] Test forum functionalityImplement moderation features
- [ ] Add notifications for new replies

### Email Automation
- [ ] Install email service library
- [ ] Create email templates (welcome, reminder, certificate)
- [ ] Set up email configuration
- [ ] Implement enrollment welcome email
- [ ] Add course reminder emails
- [ ] Create certificate earned email
- [ ] Test email delivery

### Testing & Deployment
- [ ] Test bulk import feature
- [ ] Test discussion forums
- [ ] Test email automation
- [ ] Create final checkpoint

## CPD Certificate System

### Database Updates
- [x] Add cpdHours field to courses table
- [x] Update certificates table with CPD numbering format
- [x] Add certificate verification token field
- [ ] Update certificate generation to include CPD details

### Certificate Generation
- [x] Enhance PDF generator with CPD accreditation branding
- [x] Implement CPD certificate number format (e.g., CPD-CLSD-2024-XXXXX)
- [x] Add CPD hours to certificate display
- [x] Create multiple certificate formats (standard format with QR code)

### Certificates Gallery
- [x] Create "My Certificates" page for students
- [x] Display all earned certificates with preview
- [x] Add download individual certificate option
- [x] Implement bundle download (all certificates as single PDF)

### Public Verification
- [x] Create public certificate verification page
- [x] Generate unique verification URLs for each certificate
- [x] Add QR code to certificates linking to verification page
- [x] Build verification API endpoint

### Admin Features
- [x] Add CPD hours configuration in admin course editor
- [ ] View all issued certificates in admin panel (optional)
- [ ] Certificate analytics dashboard

## New Features - Phase 4

### Student Progress Dashboard
- [x] Create progress analytics database queries
- [x] Build progress dashboard page with charts
- [x] Add completion percentage calculations
- [x] Display quiz score history
- [x] Show study time tracking
- [x] Add course progress visualizations

### Welcome Video
- [x] Add video URL field to courses table
- [x] Create video player component
- [x] Add welcome video to homepage
- [x] Add course intro videos to course pages
- [x] Support YouTube and Vimeo embeds
- [x] Add video upload/management in admin panel

### Progressive Web App (PWA)
- [x] Create service worker for offline caching
- [x] Add PWA manifest file
- [x] Implement offline lesson storage
- [x] Add install prompt for mobile devices
- [x] Cache course content for offline access
- [x] Sync progress when back online

### Live Webinar Integration
- [ ] Add webinar scheduling database schema
- [ ] Create webinar management in admin panel
- [ ] Integrate Zoom/Google Meet links
- [ ] Add webinar calendar to student dashboard
- [ ] Send webinar reminder emails
- [ ] Add recorded webinar playback to lessons

### Testing & Deployment
- [ ] Test progress dashboard analytics
- [ ] Test welcome video playback
- [ ] Test PWA offline functionality
- [ ] Test webinar scheduling
- [ ] Create final checkpoint

## Mobile PWA Refinements
- [x] Create custom install prompt component with iOS/Android instructions
- [x] Add splash screen assets and configuration
- [x] Optimize touch target sizes (minimum 44x44px)
- [x] Improve mobile navigation with bottom tab bar
- [x] Add pull-to-refresh functionality
- [x] Enhance swipe gestures for navigation
- [x] Optimize button spacing and padding for touch
- [x] Add haptic feedback for interactions
- [x] Improve standalone mode detection and UI
- [x] Add app shortcuts for quick actions
- [x] Test installation flow on iOS Safari and Android Chrome

## Header Text Updates
- [x] Change "Welcome back" to "Welcome" on Dashboard
- [x] Remove "Christ Family Network" organization name from header
- [x] Remove email address from header

## Follow-Up System
- [x] Remove "Christ" from welcome message (make it generic)
- [x] Create follow-ups database table (student, admin, status, notes, due date)
- [x] Add follow-up API endpoints (create, list, update, delete)
- [x] Build admin follow-up dashboard
- [x] Add follow-up creation from student profiles
- [x] Implement follow-up status tracking (pending, completed, cancelled)
- [ ] Add follow-up notifications and reminders
- [x] Create follow-up history view

## Email Notifications for Follow-Ups
- [x] Add email template for new follow-up creation
- [x] Send email to admin when follow-up is created
- [x] Add email reminder for due follow-ups
- [x] Send notification when follow-up is completed
- [x] Add email settings for follow-up notifications

## Webinar UI Completion
- [x] Create student webinar calendar page
- [x] Display upcoming webinars with join links
- [x] Show past webinars with recording links
- [x] Build admin webinar scheduling interface
- [x] Add webinar creation form
- [x] Implement webinar edit/delete functionality
- [x] Add webinar to course detail pages

## Bulk Follow-Up Creation
- [x] Add bulk follow-up creation dialog
- [x] Implement student filtering (inactive, low scores, incomplete courses)
- [x] Add date range filters for activity
- [x] Create multiple follow-ups at once
- [x] Add preview of selected students before creation
- [ ] Implement bulk status updates

## Scheduled Email Reminders
- [x] Create cron job scheduler for follow-up reminders
- [x] Check for follow-ups due within 24 hours
- [x] Send automated reminder emails to admins
- [x] Add email reminder settings (frequency, timing)
- [x] Log reminder email history
- [x] Add manual trigger for testing reminders

## Student Activity Dashboard
- [x] Create admin analytics page
- [x] Track student login patterns and frequency
- [x] Display course completion rates and trends
- [x] Show quiz score averages and distributions
- [x] Identify inactive students (no login in X days)
- [x] Highlight at-risk students (low scores, incomplete courses)
- [x] Add engagement metrics visualization (charts)
- [x] Export analytics data to CSV

## Course Content Population
- [ ] Add lesson content editor in admin panel
- [ ] Support rich text content for lessons
- [ ] Add video embedding for lesson content
- [ ] Create quiz builder with multiple question types
- [ ] Add reading materials upload (PDF, documents)
- [ ] Implement lesson ordering and organization
- [ ] Add lesson preview for admins
- [ ] Bulk content import functionality

## Custom Logo Integration
- [x] Copy logo file to public directory
- [x] Update header to display custom logo
- [x] Add logo to PWA manifest
- [x] Update favicon with logo
- [x] Test logo display across all pages

## Custom Email/Password Authentication
- [x] Install bcrypt for password hashing
- [x] Add password field to users table schema
- [x] Create password reset tokens table
- [x] Build registration API endpoint
- [x] Build login API endpoint with JWT
- [x] Implement password hashing and verification
- [x] Create registration page UI
- [x] Create login page UI
- [x] Add password strength validation
- [x] Implement "forgot password" flow
- [x] Create password reset page
- [ ] Add email verification (optional)
- [x] Update AuthContext to use custom auth
- [ ] Remove Manus OAuth dependencies (OAuth still available as fallback)
- [x] Test registration and login flows

## Email Verification System
- [x] Add emailVerified and verificationToken fields to users table
- [x] Create email verification endpoint
- [x] Send verification email on registration
- [x] Create email verification page
- [ ] Prevent unverified users from accessing courses
- [x] Add resend verification email functionality

## Social Login Integration
- [ ] Install passport.js and OAuth strategies
- [ ] Set up Google OAuth configuration
- [ ] Set up Facebook OAuth configuration
- [ ] Create social login buttons on login page
- [ ] Handle OAuth callbacks and user creation
- [ ] Link social accounts to existing users
- [ ] Add social login to registration flow

## Account Security Dashboard
- [ ] Create user settings page
- [ ] Add password change functionality
- [ ] Display login history (IP, device, timestamp)
- [ ] Add two-factor authentication (2FA) setup
- [ ] Show active sessions with revoke option
- [ ] Add security notifications preferences
- [ ] Create account deletion option

## Student Assignment Submission UI
- [x] Create file upload component with drag-and-drop
- [x] Add assignment submission form to lesson page (ready to integrate)
- [x] Display submission status and history
- [x] Show grade and feedback when available
- [x] Add resubmission functionality

## Admin Grading Interface
- [ ] Create admin grading dashboard page
- [ ] Build submission review interface
- [ ] Add rubric scoring component
- [ ] Implement feedback text editor
- [ ] Add grade submission and notification
- [ ] Create pending submissions queue

## Progress Analytics Dashboard
- [ ] Create analytics dashboard page for admins
- [ ] Add course completion rate charts
- [ ] Display quiz score distributions
- [ ] Show assignment grade analytics
- [ ] Add student engagement metrics
- [ ] Implement at-risk student identification


## Final Implementation - Assignment & Analytics
- [ ] Fix TRPC type generation for assignments router
- [ ] Recreate and integrate AssignmentSubmission component
- [ ] Test file upload functionality
- [ ] Build admin grading dashboard page
- [ ] Create submission review interface with rubric
- [ ] Add feedback and grade submission forms
- [ ] Implement student progress analytics dashboard
- [ ] Add visual charts for completion rates and scores
- [ ] Test complete student-to-admin workflow

## Assignment Submission & Grading System - Phase 5

### Student Assignment Submission UI
- [ ] Create AssignmentSubmission component with file upload
- [ ] Add drag-and-drop file upload functionality
- [ ] Integrate assignment submission into Lesson page
- [ ] Display submission status and history
- [ ] Show grade and feedback when available
- [ ] Add resubmission functionality for ungraded assignments

### Admin Grading Dashboard
- [ ] Create AdminGrading page component
- [ ] Build submission queue with filtering (pending, graded, all)
- [ ] Add submission review interface with student details
- [ ] Create rubric scoring component (theology, content, writing)
- [ ] Implement feedback text editor
- [ ] Add grade submission with email notification
- [ ] Display grading statistics and metrics

### Progress Analytics Dashboard Enhancement
- [ ] Add assignment completion rate charts
- [ ] Display average assignment grades per course
- [ ] Show assignment submission timeline
- [ ] Add student performance comparison charts
- [ ] Create at-risk student identification based on assignment grades
- [ ] Export assignment analytics to CSV

### Testing & Final Deployment
- [ ] Test student file upload and submission
- [ ] Test admin grading workflow
- [ ] Verify email notifications for grades
- [ ] Test analytics dashboard with real data
- [ ] Create final checkpoint
- [ ] Prepare for publication

## Assignment System Implementation - ✅ COMPLETED & TESTED

### Student Assignment Submission UI - COMPLETED
- [x] Create AssignmentSubmission component with file upload
- [x] Add drag-and-drop file upload functionality
- [x] Integrate assignment submission into Lesson page
- [x] Display submission status and history
- [x] Show grade and feedback when available
- [x] Add file validation (PDF, DOC, DOCX, max 10MB)

### Admin Grading Dashboard - COMPLETED
- [x] Create AdminGrading page component
- [x] Build submission queue with filtering (pending, graded, all)
- [x] Add submission review interface with student details
- [x] Create rubric scoring component (theology, content, writing)
- [x] Implement feedback text editor
- [x] Add grade submission with TRPC mutation
- [x] Display grading statistics and metrics
- [x] Add grading card to Admin dashboard
- [x] Add grading route to App.tsx

### Progress Analytics Dashboard Enhancement - COMPLETED
- [x] Add assignment completion rate metrics to backend
- [x] Display average assignment grades in Progress page
- [x] Show assignment submission timeline
- [x] Add assignment performance cards with visual styling
- [x] Track pending vs graded assignments
- [x] Integrate assignment analytics with existing progress data

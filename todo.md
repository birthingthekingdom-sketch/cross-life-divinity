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

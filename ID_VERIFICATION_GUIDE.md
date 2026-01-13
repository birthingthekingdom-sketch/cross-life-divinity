# ID Verification System - Implementation Guide

## Overview

The ID Verification System allows students to upload government-issued IDs for verification during enrollment. Admins can review, approve, or reject submissions with automated email notifications.

## Features

### Student Features
- **Drag-and-drop file upload** - Easy file selection with visual feedback
- **Multiple file formats** - Supports JPG, PNG, and PDF
- **File validation** - Client-side validation for file type and size (max 10MB)
- **Status tracking** - Real-time status updates (pending, approved, rejected)
- **Resubmission** - Students can resubmit IDs if rejected
- **Immediate access** - Students can access courses while ID is under review

### Admin Features
- **Dashboard** - View all pending ID submissions
- **Document preview** - View uploaded ID images and PDFs
- **Approval/Rejection** - Quick actions to approve or reject submissions
- **Rejection notes** - Provide feedback to students on why IDs were rejected
- **Email notifications** - Automatic emails sent to students on approval/rejection

## Database Schema

### `id_submissions` Table

```sql
CREATE TABLE `id_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `fileUrl` VARCHAR(500) NOT NULL,
  `fileName` VARCHAR(255) NOT NULL,
  `fileSize` INT NOT NULL,
  `mimeType` VARCHAR(100) NOT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `reviewedBy` INT,
  `reviewNotes` TEXT,
  `submittedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `reviewedAt` TIMESTAMP,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

All endpoints are under the `idVerification` namespace in TRPC.

### Student Endpoints

#### `submitId` (Mutation)
Submit a government ID for verification.

**Input:**
```typescript
{
  fileUrl: string;      // S3 URL of uploaded file
  fileName: string;     // Original file name
  fileSize: number;     // File size in bytes
  mimeType: string;     // MIME type (image/jpeg, image/png, application/pdf)
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### `getMyStatus` (Query)
Get the current user's ID submission status.

**Output:**
```typescript
{
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  submission?: {
    id: number;
    status: string;
    fileName: string;
    submittedAt: Date;
    reviewedAt?: Date;
    reviewNotes?: string;
  };
}
```

### Admin Endpoints

#### `getPendingSubmissions` (Query)
Get all pending ID submissions.

**Output:**
```typescript
Array<{
  id: number;
  userId: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  submittedAt: Date;
  reviewedAt?: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
}>
```

#### `getAllSubmissions` (Query)
Get all ID submissions with optional filters.

**Input:**
```typescript
{
  status?: 'pending' | 'approved' | 'rejected';
  userId?: number;
}
```

#### `approveSubmission` (Mutation)
Approve an ID submission.

**Input:**
```typescript
{
  submissionId: number;
  notes?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### `rejectSubmission` (Mutation)
Reject an ID submission.

**Input:**
```typescript
{
  submissionId: number;
  notes: string; // Required - reason for rejection
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

#### `getSubmissionDetails` (Query)
Get detailed information about a specific submission.

**Input:**
```typescript
{
  submissionId: number;
}
```

## Components

### `IdUploadForm`
Student-facing component for uploading ID documents.

**Props:**
```typescript
{
  onSuccess?: () => void; // Callback when upload succeeds
}
```

**Features:**
- Drag-and-drop file upload
- File type and size validation
- Upload progress indication
- Status display for existing submissions

### `AdminIdReviewDashboard`
Admin-facing component for reviewing ID submissions.

**Features:**
- List of pending submissions
- Document preview (images and PDFs)
- Quick approve/reject actions
- Rejection reason input
- Real-time status updates

## Pages

### `StudentIdVerification`
Complete enrollment page for ID verification.

**Route:** `/student/id-verification`

**Features:**
- Explains why ID verification is needed
- Shows step-by-step process
- Displays current submission status
- Shows FAQ section
- Links to dashboard after approval

### `AdminIdVerification`
Admin dashboard for managing ID submissions.

**Route:** `/admin/id-verification`

**Features:**
- Overview of pending submissions
- List of all submissions
- Document preview and review
- Approve/reject actions

## Email Notifications

### ID Approval Email
Sent when an admin approves an ID submission.

**Recipient:** Student email

**Content:**
- Congratulations message
- List of available features
- Link to dashboard

### ID Rejection Email
Sent when an admin rejects an ID submission.

**Recipient:** Student email

**Content:**
- Rejection reason
- Requirements for resubmission
- Instructions for resubmitting

## Integration Steps

### 1. Add Routes to App.tsx

```typescript
import { StudentIdVerification } from '@/pages/StudentIdVerification';
import { AdminIdVerification } from '@/pages/AdminIdVerification';

// In your router setup:
{
  path: '/student/id-verification',
  component: StudentIdVerification,
},
{
  path: '/admin/id-verification',
  component: AdminIdVerification,
}
```

### 2. Add Navigation Links

**Student Dashboard:**
```typescript
<Link href="/student/id-verification">
  Complete ID Verification
</Link>
```

**Admin Dashboard:**
```typescript
<Link href="/admin/id-verification">
  ID Verification
</Link>
```

### 3. Configure Email Settings

The system uses the existing email configuration. Ensure SMTP settings are configured in your environment:

```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@crosslifedivinity.com
```

## File Upload Implementation

Currently, the system uses `URL.createObjectURL()` for local file handling. For production, integrate with S3:

### S3 Integration Steps

1. **Backend Upload Endpoint:**
```typescript
import { storagePut } from '@/server/_core/storage';

const { url } = await storagePut(
  `id-submissions/${userId}/${fileName}`,
  fileBuffer,
  mimeType
);
```

2. **Frontend Upload:**
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { url } = await response.json();
```

## Security Considerations

1. **File Validation**
   - Client-side: File type and size validation
   - Server-side: Verify MIME type and file content
   - Restrict to government ID documents only

2. **Access Control**
   - Students can only view their own submissions
   - Admins can view all submissions
   - File URLs are not publicly accessible

3. **Data Privacy**
   - ID files stored securely in S3
   - Automatic deletion after verification period (optional)
   - Audit logs for all admin actions

4. **Email Security**
   - Use authenticated SMTP
   - Encrypt sensitive information in transit
   - Verify email addresses before sending

## Testing Checklist

- [ ] Student can upload ID with drag-and-drop
- [ ] Student can upload ID by clicking browse
- [ ] File validation works (type and size)
- [ ] Upload shows progress indicator
- [ ] Student can see submission status
- [ ] Student can resubmit if rejected
- [ ] Admin can view pending submissions
- [ ] Admin can preview ID image
- [ ] Admin can preview PDF
- [ ] Admin can approve submission
- [ ] Admin can reject with reason
- [ ] Student receives approval email
- [ ] Student receives rejection email
- [ ] Email contains correct information
- [ ] Student can access dashboard after approval
- [ ] Multiple students can submit IDs
- [ ] Admin can filter submissions

## Troubleshooting

### File Upload Fails
- Check file size (max 10MB)
- Verify file format (JPG, PNG, PDF)
- Check S3 credentials and permissions

### Email Not Sending
- Verify SMTP configuration
- Check email address is valid
- Review email logs for errors

### Status Not Updating
- Refresh the page
- Check browser console for errors
- Verify database connection

## Future Enhancements

1. **Automated ID Verification**
   - OCR for document text extraction
   - Liveness detection
   - Fraud detection

2. **Advanced Features**
   - Bulk operations for admins
   - Export submissions to CSV
   - Scheduled verification reminders
   - Integration with identity verification services

3. **User Experience**
   - Mobile app support
   - Real-time notifications
   - Progress tracking
   - Video tutorials

## Support

For issues or questions about the ID verification system, contact the development team or submit a support ticket.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as db from '../db';
import { idSubmissionRouter } from '../id-submission-router';

// Mock the database functions
vi.mock('../db', async () => {
  const actual = await vi.importActual('../db');
  return {
    ...actual,
    getLatestIdSubmissionByUserId: vi.fn(),
    createIdSubmission: vi.fn(),
    getIdSubmissionById: vi.fn(),
    getIdSubmissionsByUserId: vi.fn(),
    getPendingIdSubmissions: vi.fn(),
    getAllIdSubmissions: vi.fn(),
    updateIdSubmissionStatus: vi.fn(),
    getUserById: vi.fn()
  };
});

// Mock email functions
vi.mock('../email', () => ({
  sendIdSubmissionNotification: vi.fn().mockResolvedValue(true),
  sendIdApprovalNotification: vi.fn().mockResolvedValue(true),
  sendIdRejectionNotification: vi.fn().mockResolvedValue(true),
  sendIdResubmissionRequestNotification: vi.fn().mockResolvedValue(true)
}));

describe('ID Submission Router', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user' as const
  };

  const mockAdminUser = {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const
  };

  const mockSubmission = {
    id: 1,
    userId: 1,
    idType: 'drivers_license' as const,
    documentUrl: 'https://s3.example.com/id-1.pdf',
    fileName: 'id-1.pdf',
    fileSize: 1024000,
    status: 'pending' as const,
    verificationNotes: null,
    rejectionReason: null,
    approvedAt: null,
    rejectedAt: null,
    adminId: null,
    submittedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitId', () => {
    it('should create a new ID submission', async () => {
      vi.mocked(db.getLatestIdSubmissionByUserId).mockResolvedValue(null);
      vi.mocked(db.createIdSubmission).mockResolvedValue(mockSubmission);
      vi.mocked(db.getUserById).mockResolvedValue(mockUser);

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.submitId({
        idType: 'drivers_license',
        documentUrl: 'https://s3.example.com/id-1.pdf',
        fileName: 'id-1.pdf',
        fileSize: 1024000
      });

      expect(result.success).toBe(true);
      expect(result.submission).toEqual(mockSubmission);
      expect(db.createIdSubmission).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          idType: 'drivers_license',
          status: 'pending'
        })
      );
    });

    it('should prevent duplicate pending submissions', async () => {
      vi.mocked(db.getLatestIdSubmissionByUserId).mockResolvedValue({
        ...mockSubmission,
        status: 'pending'
      });

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      await expect(
        caller.submitId({
          idType: 'drivers_license',
          documentUrl: 'https://s3.example.com/id-1.pdf',
          fileName: 'id-1.pdf',
          fileSize: 1024000
        })
      ).rejects.toThrow('You already have a pending ID submission');
    });

    it('should allow resubmission after rejection', async () => {
      const rejectedSubmission = {
        ...mockSubmission,
        status: 'rejected' as const
      };

      vi.mocked(db.getLatestIdSubmissionByUserId).mockResolvedValue(rejectedSubmission);
      vi.mocked(db.createIdSubmission).mockResolvedValue(mockSubmission);
      vi.mocked(db.getUserById).mockResolvedValue(mockUser);

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.submitId({
        idType: 'drivers_license',
        documentUrl: 'https://s3.example.com/id-1.pdf',
        fileName: 'id-1.pdf',
        fileSize: 1024000
      });

      expect(result.success).toBe(true);
    });
  });

  describe('getMyLatestSubmission', () => {
    it('should return latest submission for authenticated user', async () => {
      vi.mocked(db.getLatestIdSubmissionByUserId).mockResolvedValue(mockSubmission);

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.getMyLatestSubmission();

      expect(result).toEqual(mockSubmission);
      expect(db.getLatestIdSubmissionByUserId).toHaveBeenCalledWith(1);
    });

    it('should return null if no submission exists', async () => {
      vi.mocked(db.getLatestIdSubmissionByUserId).mockResolvedValue(null);

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.getMyLatestSubmission();

      expect(result).toBeNull();
    });
  });

  describe('getPendingSubmissions', () => {
    it('should return pending submissions for admin', async () => {
      const pendingSubmissions = [mockSubmission];
      vi.mocked(db.getPendingIdSubmissions).mockResolvedValue(pendingSubmissions);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.getPendingSubmissions();

      expect(result).toEqual(pendingSubmissions);
      expect(db.getPendingIdSubmissions).toHaveBeenCalled();
    });

    it('should deny access to non-admin users', async () => {
      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      await expect(caller.getPendingSubmissions()).rejects.toThrow('Admin access required');
    });
  });

  describe('approveSubmission', () => {
    it('should approve submission and update status', async () => {
      const approvedSubmission = {
        ...mockSubmission,
        status: 'approved' as const,
        approvedAt: new Date(),
        adminId: 2
      };

      vi.mocked(db.getIdSubmissionById).mockResolvedValue(mockSubmission);
      vi.mocked(db.updateIdSubmissionStatus).mockResolvedValue(approvedSubmission);
      vi.mocked(db.getUserById).mockResolvedValue(mockUser);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.approveSubmission({
        id: 1,
        verificationNotes: 'Document verified successfully'
      });

      expect(result.success).toBe(true);
      expect(result.submission.status).toBe('approved');
      expect(db.updateIdSubmissionStatus).toHaveBeenCalledWith(
        1,
        'approved',
        2,
        'Document verified successfully'
      );
    });

    it('should throw error if submission not found', async () => {
      vi.mocked(db.getIdSubmissionById).mockResolvedValue(null);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      await expect(
        caller.approveSubmission({
          id: 999,
          verificationNotes: 'Test'
        })
      ).rejects.toThrow('Submission not found');
    });
  });

  describe('rejectSubmission', () => {
    it('should reject submission with reason', async () => {
      const rejectedSubmission = {
        ...mockSubmission,
        status: 'rejected' as const,
        rejectionReason: 'Document is expired',
        rejectedAt: new Date()
      };

      vi.mocked(db.getIdSubmissionById).mockResolvedValue(mockSubmission);
      vi.mocked(db.updateIdSubmissionStatus).mockResolvedValue(rejectedSubmission);
      vi.mocked(db.getUserById).mockResolvedValue(mockUser);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.rejectSubmission({
        id: 1,
        rejectionReason: 'Document is expired',
        verificationNotes: 'ID expired on 12/2023'
      });

      expect(result.success).toBe(true);
      expect(result.submission.status).toBe('rejected');
      expect(db.updateIdSubmissionStatus).toHaveBeenCalledWith(
        1,
        'rejected',
        2,
        'ID expired on 12/2023',
        'Document is expired'
      );
    });
  });

  describe('requestResubmission', () => {
    it('should request resubmission with reason', async () => {
      const resubmitSubmission = {
        ...mockSubmission,
        status: 'resubmit_requested' as const,
        rejectionReason: 'Please provide clearer photo'
      };

      vi.mocked(db.getIdSubmissionById).mockResolvedValue(mockSubmission);
      vi.mocked(db.updateIdSubmissionStatus).mockResolvedValue(resubmitSubmission);
      vi.mocked(db.getUserById).mockResolvedValue(mockUser);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.requestResubmission({
        id: 1,
        rejectionReason: 'Please provide clearer photo',
        verificationNotes: 'Photo is too blurry'
      });

      expect(result.success).toBe(true);
      expect(result.submission.status).toBe('resubmit_requested');
    });
  });

  describe('getAllSubmissions', () => {
    it('should return all submissions for admin', async () => {
      const allSubmissions = [mockSubmission];
      vi.mocked(db.getAllIdSubmissions).mockResolvedValue(allSubmissions);

      const caller = idSubmissionRouter.createCaller({
        user: mockAdminUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.getAllSubmissions();

      expect(result).toEqual(allSubmissions);
      expect(db.getAllIdSubmissions).toHaveBeenCalled();
    });

    it('should deny access to non-admin users', async () => {
      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      await expect(caller.getAllSubmissions()).rejects.toThrow('Admin access required');
    });
  });

  describe('getMySubmissions', () => {
    it('should return all submissions for current user', async () => {
      const userSubmissions = [mockSubmission];
      vi.mocked(db.getIdSubmissionsByUserId).mockResolvedValue(userSubmissions);

      const caller = idSubmissionRouter.createCaller({
        user: mockUser,
        req: {} as any,
        res: {} as any
      });

      const result = await caller.getMySubmissions();

      expect(result).toEqual(userSubmissions);
      expect(db.getIdSubmissionsByUserId).toHaveBeenCalledWith(1);
    });
  });
});

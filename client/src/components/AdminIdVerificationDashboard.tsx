import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, AlertCircle, Clock, Download, Eye } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface IdSubmission {
  id: number;
  userId: number;
  idType: string;
  documentUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected' | 'resubmit_requested';
  verificationNotes: string | null;
  rejectionReason: string | null;
  submittedAt: Date;
  approvedAt: Date | null;
  rejectedAt: Date | null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export function AdminIdVerificationDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<IdSubmission | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'resubmit' | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch submissions
  const { data: submissions = [], refetch, isLoading } = trpc.idSubmission.getAllSubmissions.useQuery();
  
  // Mutations
  const approveMutation = trpc.idSubmission.approveSubmission.useMutation();
  const rejectMutation = trpc.idSubmission.rejectSubmission.useMutation();
  const resubmitMutation = trpc.idSubmission.requestResubmission.useMutation();

  const handleReview = (submission: IdSubmission, action: 'approve' | 'reject' | 'resubmit') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setVerificationNotes('');
    setRejectionReason('');
    setShowReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;

    setIsProcessing(true);
    try {
      if (reviewAction === 'approve') {
        await approveMutation.mutateAsync({
          id: selectedSubmission.id,
          verificationNotes: verificationNotes || undefined
        });
        toast.success('ID approved successfully');
      } else if (reviewAction === 'reject') {
        if (!rejectionReason.trim()) {
          toast.error('Please provide a rejection reason');
          setIsProcessing(false);
          return;
        }
        await rejectMutation.mutateAsync({
          id: selectedSubmission.id,
          rejectionReason,
          verificationNotes: verificationNotes || undefined
        });
        toast.success('ID rejected and student notified');
      } else if (reviewAction === 'resubmit') {
        if (!rejectionReason.trim()) {
          toast.error('Please provide a reason for resubmission');
          setIsProcessing(false);
          return;
        }
        await resubmitMutation.mutateAsync({
          id: selectedSubmission.id,
          rejectionReason,
          verificationNotes: verificationNotes || undefined
        });
        toast.success('Resubmission request sent to student');
      }

      setShowReviewDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process review');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'resubmit_requested':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejected</Badge>;
      case 'resubmit_requested':
        return <Badge className="bg-orange-600">Resubmit Requested</Badge>;
      default:
        return null;
    }
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected' || s.status === 'resubmit_requested');

  const SubmissionCard = ({ submission }: { submission: IdSubmission }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {getStatusIcon(submission.status)}
            <div className="flex-1">
              <p className="font-semibold text-sm">Student ID: {submission.userId}</p>
              <p className="text-sm text-gray-600">
                {submission.idType.replace(/_/g, ' ').toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          {getStatusBadge(submission.status)}
        </div>

        <div className="flex gap-2 mb-4">
          <a
            href={submission.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Eye className="w-4 h-4" />
            View Document
          </a>
          <a
            href={submission.documentUrl}
            download={submission.fileName}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>

        {submission.verificationNotes && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm">
            <p className="font-medium text-blue-900">Admin Notes:</p>
            <p className="text-blue-800 mt-1">{submission.verificationNotes}</p>
          </div>
        )}

        {submission.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm">
            <p className="font-medium text-red-900">Reason:</p>
            <p className="text-red-800 mt-1">{submission.rejectionReason}</p>
          </div>
        )}

        {submission.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleReview(submission, 'approve')}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReview(submission, 'resubmit')}
            >
              Request Resubmission
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleReview(submission, 'reject')}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Loading submissions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">ID Verification Dashboard</h2>
        <p className="text-gray-600">Review and manage student ID submissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingSubmissions.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedSubmissions.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected/Resubmit</p>
                <p className="text-3xl font-bold text-red-600">{rejectedSubmissions.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions by Status */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingSubmissions.length === 0 ? (
            <Alert>
              <AlertDescription>No pending submissions</AlertDescription>
            </Alert>
          ) : (
            <div>
              {pendingSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {approvedSubmissions.length === 0 ? (
            <Alert>
              <AlertDescription>No approved submissions</AlertDescription>
            </Alert>
          ) : (
            <div>
              {approvedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {rejectedSubmissions.length === 0 ? (
            <Alert>
              <AlertDescription>No rejected submissions</AlertDescription>
            </Alert>
          ) : (
            <div>
              {rejectedSubmissions.map(submission => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' && 'Approve ID Submission'}
              {reviewAction === 'reject' && 'Reject ID Submission'}
              {reviewAction === 'resubmit' && 'Request Resubmission'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' && 'This will approve the ID and notify the student.'}
              {reviewAction === 'reject' && 'This will reject the ID and notify the student.'}
              {reviewAction === 'resubmit' && 'This will request the student to resubmit their ID.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {(reviewAction === 'reject' || reviewAction === 'resubmit') && (
              <div>
                <label className="text-sm font-medium block mb-2">
                  {reviewAction === 'reject' ? 'Rejection Reason' : 'Reason for Resubmission'}
                </label>
                <Textarea
                  placeholder="Explain why the ID is being rejected or what needs to be corrected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-2">Admin Notes (Optional)</label>
              <Textarea
                placeholder="Add any internal notes about this submission..."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={isProcessing}
              variant={reviewAction === 'reject' ? 'destructive' : 'default'}
            >
              {isProcessing ? 'Processing...' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export function AdminIdReviewDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [isReviewingId, setIsReviewingId] = useState<number | null>(null);

  const pendingSubmissionsQuery = trpc.idVerification.getPendingSubmissions.useQuery();
  const approveSubmissionMutation = trpc.idVerification.approveSubmission.useMutation();
  const rejectSubmissionMutation = trpc.idVerification.rejectSubmission.useMutation();

  const handleViewDetails = async (submissionId: number) => {
    try {
      // Find the submission from the list
      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        setSelectedSubmission(submission);
      }
    } catch (error) {
      toast.error('Failed to load submission details');
    }
  };

  const handleApprove = async (submissionId: number) => {
    try {
      await approveSubmissionMutation.mutateAsync({
        submissionId,
        notes: 'ID approved by admin',
      });
      toast.success('ID approved successfully');
      pendingSubmissionsQuery.refetch();
      setSelectedSubmission(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve ID';
      toast.error(message);
    }
  };

  const handleReject = async (submissionId: number) => {
    if (!rejectionNotes.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectSubmissionMutation.mutateAsync({
        submissionId,
        notes: rejectionNotes,
      });
      toast.success('ID rejected and student notified');
      setRejectionNotes('');
      pendingSubmissionsQuery.refetch();
      setSelectedSubmission(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reject ID';
      toast.error(message);
    }
  };

  const submissions = pendingSubmissionsQuery.data || [];
  const isLoading = pendingSubmissionsQuery.isLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ID Verification Dashboard</CardTitle>
          <CardDescription>
            Review and approve student ID submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{submissions.length}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {submissions.length === 0 && !isLoading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No pending ID submissions to review.
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          )}

          {submissions.length > 0 && (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">
                            {submission.user?.name || 'Unknown Student'}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Email: {submission.user?.email}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          File: {submission.fileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmission(submission);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>ID Submission Details</DialogTitle>
                              <DialogDescription>
                                {selectedSubmission?.user?.name} - {selectedSubmission?.user?.email}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedSubmission && (
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700 mb-2">
                                    Document Preview
                                  </p>
                                  {selectedSubmission.mimeType === 'application/pdf' ? (
                                    <div className="bg-gray-100 rounded p-4 text-center">
                                      <p className="text-gray-600">PDF Document</p>
                                      <a
                                        href={selectedSubmission.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                                      >
                                        Open PDF
                                      </a>
                                    </div>
                                  ) : (
                                    <img
                                      src={selectedSubmission.fileUrl}
                                      alt="ID Document"
                                      className="w-full max-h-96 object-contain rounded border"
                                    />
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-semibold text-gray-700">File Name</p>
                                    <p className="text-gray-600">{selectedSubmission.fileName}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-700">File Size</p>
                                    <p className="text-gray-600">
                                      {(selectedSubmission.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-700">Submitted</p>
                                    <p className="text-gray-600">
                                      {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-700">Status</p>
                                    <Badge variant="outline">{selectedSubmission.status}</Badge>
                                  </div>
                                </div>

                                {selectedSubmission.status === 'pending' && (
                                  <div className="space-y-3 border-t pt-4">
                                    <div>
                                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        Rejection Reason (if rejecting)
                                      </label>
                                      <Textarea
                                        placeholder="Explain why the ID is being rejected..."
                                        value={rejectionNotes}
                                        onChange={(e) => setRejectionNotes(e.target.value)}
                                        className="text-sm"
                                      />
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleReject(selectedSubmission.id)}
                                        disabled={rejectSubmissionMutation.isPending}
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Reject
                                      </Button>
                                      <Button
                                        onClick={() => handleApprove(selectedSubmission.id)}
                                        disabled={approveSubmissionMutation.isPending}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

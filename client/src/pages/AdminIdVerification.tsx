import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IdSubmission {
  id: number;
  userId: number;
  name: string;
  email: string;
  fileUrl: string;
  idType: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function AdminIdVerification() {
  const [submissions, setSubmissions] = useState<IdSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<IdSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/trpc/idVerification.getPendingSubmissions");
      if (!response.ok) throw new Error("Failed to fetch submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (submissionId: number) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/trpc/idVerification.approveSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to approve");

      toast.success("ID approved and email sent to student");
      setSelectedSubmission(null);
      setNotes("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to approve submission");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (submissionId: number) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/trpc/idVerification.rejectSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          rejectionReason,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) throw new Error("Failed to reject");

      toast.success("ID rejected and email sent to student");
      setSelectedSubmission(null);
      setRejectionReason("");
      setNotes("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reject submission");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ID Verification Management</h1>
          <p className="text-slate-300">Review and approve student ID submissions</p>
        </div>

        {isLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <p className="text-slate-300">Loading submissions...</p>
            </CardContent>
          </Card>
        ) : submissions.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-300">All submissions have been reviewed!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">{submission.name}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-slate-400 mb-1">{submission.email}</p>
                      <p className="text-sm text-slate-400">
                        <strong>ID Type:</strong> {submission.idType.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm text-slate-400">
                        <strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <Dialog open={selectedSubmission?.id === submission.id} onOpenChange={(open) => {
                      if (!open) setSelectedSubmission(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedSubmission(submission)}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Review ID Submission</DialogTitle>
                          <DialogDescription className="text-slate-300">
                            {submission.name} • {submission.email}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* ID Image Preview */}
                          <div>
                            <Label className="text-white mb-3 block">ID Image</Label>
                            <img
                              src={submission.fileUrl}
                              alt="ID"
                              className="w-full max-h-96 object-contain rounded-lg border border-slate-600"
                            />
                          </div>

                          {/* Rejection Reason (only for rejection) */}
                          <div className="hidden" id="rejection-section">
                            <Label className="text-white mb-2 block">Rejection Reason</Label>
                            <select
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                            >
                              <option value="">Select a reason...</option>
                              <option value="ID is not clear or readable">ID is not clear or readable</option>
                              <option value="ID is expired">ID is expired</option>
                              <option value="Name does not match registration">Name does not match registration</option>
                              <option value="ID type not accepted">ID type not accepted</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* Admin Notes */}
                          <div>
                            <Label className="text-white mb-2 block">Admin Notes (optional)</Label>
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add any notes about this submission..."
                              className="bg-slate-700 border-slate-600 text-white"
                              rows={3}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApprove(submission.id)}
                              disabled={isProcessing}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(submission.id)}
                              disabled={isProcessing}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

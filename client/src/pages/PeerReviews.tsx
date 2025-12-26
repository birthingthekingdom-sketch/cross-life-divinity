import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, Star } from "lucide-react";

export default function PeerReviews() {
  const { user } = useAuth();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    strengthsComment: "",
    improvementComment: "",
    theologicalDepthRating: 3,
    contentQualityRating: 3,
    writingQualityRating: 3,
    overallComment: "",
  });

  const utils = trpc.useUtils();
  const { data: peerReviews, isLoading } = trpc.assignments.getMyPeerReviews.useQuery();

  const submitReviewMutation = trpc.assignments.submitPeerReview.useMutation({
    onSuccess: () => {
      toast.success("Peer review submitted successfully!");
      setReviewDialogOpen(false);
      setSelectedReview(null);
      setFormData({
        strengthsComment: "",
        improvementComment: "",
        theologicalDepthRating: 3,
        contentQualityRating: 3,
        writingQualityRating: 3,
        overallComment: "",
      });
      utils.assignments.getMyPeerReviews.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });

  const handleOpenReviewDialog = (review: any) => {
    setSelectedReview(review);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedReview) return;

    // Validate comments
    if (formData.strengthsComment.length < 50) {
      toast.error("Strengths comment must be at least 50 characters");
      return;
    }

    if (formData.improvementComment.length < 50) {
      toast.error("Improvement suggestions must be at least 50 characters");
      return;
    }

    submitReviewMutation.mutate({
      peerReviewId: selectedReview.review.id,
      ...formData,
    });
  };

  const RatingSelector = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-2 rounded transition-colors ${
              value >= rating
                ? "text-yellow-500"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          >
            <Star className="h-6 w-6" fill={value >= rating ? "currentColor" : "none"} />
          </button>
        ))}
        <span className="ml-2 self-center text-sm text-muted-foreground">
          {value}/5
        </span>
      </div>
    </div>
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Please Log In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">You need to be logged in to view peer reviews.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading peer reviews...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingReviews = peerReviews?.filter(r => r.review.status === "pending") || [];
  const completedReviews = peerReviews?.filter(r => r.review.status === "completed") || [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Peer Reviews</h1>
          <p className="text-muted-foreground">
            Review your classmates' assignments and provide constructive feedback
          </p>
        </div>

        {/* Pending Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Reviews ({pendingReviews.length})</h2>
          
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending peer reviews</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <Card key={review.review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {review.course?.title} - {review.lesson?.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Assigned: {new Date(review.review.assignedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-0">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Assignment File:</p>
                    <a
                      href={review.submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {review.submission.fileName}
                    </a>
                  </div>

                  <Button onClick={() => handleOpenReviewDialog(review)} className="w-full">
                    Complete Peer Review
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Completed Reviews */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Completed Reviews ({completedReviews.length})</h2>
          
          {completedReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            completedReviews.map((review) => (
              <Card key={review.review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {review.course?.title} - {review.lesson?.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Completed: {review.review.completedAt ? new Date(review.review.completedAt).toLocaleDateString() : "N/A"}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-50 text-green-600 border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                {review.feedback && (
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Theological Depth</p>
                        <p className="font-semibold">{review.feedback.theologicalDepthRating}/5</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Content Quality</p>
                        <p className="font-semibold">{review.feedback.contentQualityRating}/5</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Writing Quality</p>
                        <p className="font-semibold">{review.feedback.writingQualityRating}/5</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Peer Review</DialogTitle>
              <DialogDescription>
                {selectedReview && (
                  <>
                    {selectedReview.course?.title} - {selectedReview.lesson?.title}
                    <br />
                    Provide constructive feedback to help your classmate improve
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Assignment File */}
              {selectedReview && (
                <div>
                  <Label>Assignment to Review</Label>
                  <a
                    href={selectedReview.submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline mt-1"
                  >
                    <FileText className="w-4 h-4" />
                    {selectedReview.submission.fileName}
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Open this file in a new tab to review the assignment
                  </p>
                </div>
              )}

              {/* Ratings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Rate the Assignment</h3>
                
                <RatingSelector
                  label="Theological Depth & Accuracy"
                  value={formData.theologicalDepthRating}
                  onChange={(val) => setFormData({ ...formData, theologicalDepthRating: val })}
                />

                <RatingSelector
                  label="Content Quality & Argumentation"
                  value={formData.contentQualityRating}
                  onChange={(val) => setFormData({ ...formData, contentQualityRating: val })}
                />

                <RatingSelector
                  label="Writing Quality & Formatting"
                  value={formData.writingQualityRating}
                  onChange={(val) => setFormData({ ...formData, writingQualityRating: val })}
                />
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="strengths">
                    Strengths (minimum 50 characters) *
                  </Label>
                  <Textarea
                    id="strengths"
                    value={formData.strengthsComment}
                    onChange={(e) => setFormData({ ...formData, strengthsComment: e.target.value })}
                    placeholder="What did the author do well? What aspects of their work were particularly strong?"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.strengthsComment.length}/50 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="improvements">
                    Areas for Improvement (minimum 50 characters) *
                  </Label>
                  <Textarea
                    id="improvements"
                    value={formData.improvementComment}
                    onChange={(e) => setFormData({ ...formData, improvementComment: e.target.value })}
                    placeholder="What could be improved? Provide specific, constructive suggestions."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.improvementComment.length}/50 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="overall">Overall Comments (optional)</Label>
                  <Textarea
                    id="overall"
                    value={formData.overallComment}
                    onChange={(e) => setFormData({ ...formData, overallComment: e.target.value })}
                    placeholder="Any additional feedback or encouragement..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={submitReviewMutation.isPending}>
                {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

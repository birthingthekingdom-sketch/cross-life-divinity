import { AdminRoute } from "@/components/AdminRoute";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Clock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

function AdminGradingContent() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rubricScores, setRubricScores] = useState({
    theology: "",
    content: "",
    writing: "",
  });

  const utils = trpc.useUtils();

  // Query all submissions
  const { data: allSubmissions, isLoading } = trpc.assignments.getAllSubmissions.useQuery({});

  // Filter submissions by status
  const pendingSubmissions = allSubmissions?.filter(s => s.submission.status === "submitted") || [];
  const gradedSubmissions = allSubmissions?.filter(s => s.submission.status === "graded") || [];

  // Grade submission mutation
  const gradeMutation = trpc.assignments.grade.useMutation({
    onSuccess: () => {
      toast.success("Assignment graded successfully!");
      setGradeDialogOpen(false);
      setSelectedSubmission(null);
      setGrade("");
      setFeedback("");
      setRubricScores({ theology: "", content: "", writing: "" });
      utils.assignments.getAllSubmissions.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Failed to grade assignment: ${error.message}`);
    },
  });

  const handleOpenGradeDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setGradeDialogOpen(true);
  };

  const handleSubmitGrade = () => {
    if (!selectedSubmission) return;

    // Validate inputs
    if (!grade || isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 100) {
      toast.error("Please enter a valid grade between 0 and 100");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }

    // Validate rubric scores
    const theologyScore = Number(rubricScores.theology);
    const contentScore = Number(rubricScores.content);
    const writingScore = Number(rubricScores.writing);

    if (
      isNaN(theologyScore) || theologyScore < 0 || theologyScore > 40 ||
      isNaN(contentScore) || contentScore < 0 || contentScore > 40 ||
      isNaN(writingScore) || writingScore < 0 || writingScore > 20
    ) {
      toast.error("Please enter valid rubric scores (Theology: 0-40, Content: 0-40, Writing: 0-20)");
      return;
    }

    gradeMutation.mutate({
      submissionId: selectedSubmission.submission.id,
      grade: Number(grade),
      feedback: feedback.trim(),
      rubricScores: {
        theology: theologyScore,
        content: contentScore,
        writing: writingScore,
      },
    });
  };

  const SubmissionCard = ({ submission }: { submission: any }) => {
    const statusConfig = {
      submitted: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Pending" },
      graded: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Graded" },
      returned: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50", label: "Returned" },
    };

    const config = statusConfig[submission.submission.status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">
                {submission.course?.title || "Unknown Course"} - {submission.lesson?.title || "Unknown Lesson"}
              </CardTitle>
              <CardDescription className="mt-1">
                Student: {submission.user?.name || "Unknown"} ({submission.user?.email || "N/A"})
              </CardDescription>
            </div>
            <Badge className={`${config.bg} ${config.color} border-0`}>
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{new Date(submission.submission.submittedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">File</p>
              <a
                href={submission.submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center gap-1"
              >
                {submission.submission.fileName}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {submission.submission.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Student Notes</p>
              <p className="text-sm mt-1">{submission.submission.notes}</p>
            </div>
          )}

          {submission.grade && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-green-600 mb-2">Grade: {submission.grade.grade}/100</p>
              <p className="text-sm text-muted-foreground mb-1">Feedback:</p>
              <p className="text-sm whitespace-pre-wrap">{submission.grade.feedback}</p>
              {submission.grade.rubricScores && (
                <div className="mt-2 text-sm">
                  <p className="font-semibold">Rubric Scores:</p>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {Object.entries(JSON.parse(submission.grade.rubricScores)).map(([key, value]) => (
                      <div key={key}>
                        <span className="capitalize">{key}:</span> <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Graded: {new Date(submission.grade.gradedAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {submission.submission.status === "submitted" && (
            <Button onClick={() => handleOpenGradeDialog(submission)} className="w-full">
              Grade Assignment
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assignment Grading</h1>
        <p className="text-muted-foreground">Review and grade student assignment submissions</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="graded">
            Graded ({gradedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allSubmissions?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending submissions</p>
              </CardContent>
            </Card>
          ) : (
            pendingSubmissions.map((submission) => (
              <SubmissionCard key={submission.submission.id} submission={submission} />
            ))
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {gradedSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No graded submissions</p>
              </CardContent>
            </Card>
          ) : (
            gradedSubmissions.map((submission) => (
              <SubmissionCard key={submission.submission.id} submission={submission} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {!allSubmissions || allSubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No submissions yet</p>
              </CardContent>
            </Card>
          ) : (
            allSubmissions.map((submission) => (
              <SubmissionCard key={submission.submission.id} submission={submission} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Grade Dialog */}
      <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grade Assignment</DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  {selectedSubmission.course?.title} - {selectedSubmission.lesson?.title}
                  <br />
                  Student: {selectedSubmission.user?.name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* File Link */}
            {selectedSubmission && (
              <div>
                <Label>Assignment File</Label>
                <a
                  href={selectedSubmission.submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline mt-1"
                >
                  <FileText className="w-4 h-4" />
                  {selectedSubmission.submission.fileName}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Rubric Scores */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Rubric Scores</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="theology">Theology (0-40)</Label>
                  <Input
                    id="theology"
                    type="number"
                    min="0"
                    max="40"
                    value={rubricScores.theology}
                    onChange={(e) => setRubricScores({ ...rubricScores, theology: e.target.value })}
                    placeholder="0-40"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content (0-40)</Label>
                  <Input
                    id="content"
                    type="number"
                    min="0"
                    max="40"
                    value={rubricScores.content}
                    onChange={(e) => setRubricScores({ ...rubricScores, content: e.target.value })}
                    placeholder="0-40"
                  />
                </div>
                <div>
                  <Label htmlFor="writing">Writing (0-20)</Label>
                  <Input
                    id="writing"
                    type="number"
                    min="0"
                    max="20"
                    value={rubricScores.writing}
                    onChange={(e) => setRubricScores({ ...rubricScores, writing: e.target.value })}
                    placeholder="0-20"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: {(Number(rubricScores.theology) || 0) + (Number(rubricScores.content) || 0) + (Number(rubricScores.writing) || 0)}/100
              </p>
            </div>

            {/* Overall Grade */}
            <div>
              <Label htmlFor="grade">Overall Grade (0-100)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
              />
            </div>

            {/* Feedback */}
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback on the assignment..."
                rows={8}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitGrade} disabled={gradeMutation.isPending}>
              {gradeMutation.isPending ? "Submitting..." : "Submit Grade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminGrading() {
  return (
    <AdminRoute>
      <AdminGradingContent />
    </AdminRoute>
  );
}

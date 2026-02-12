import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AssignmentGuidelines } from "./AssignmentGuidelines";
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { storagePut } from "../../../server/storage";

interface AssignmentSubmissionProps {
  lessonId: number;
  lessonTitle: string;
  assignmentPrompt: string;
}

export function AssignmentSubmission({ lessonId, lessonTitle, assignmentPrompt }: AssignmentSubmissionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const utils = trpc.useUtils();

  // Query existing submissions for this lesson
  const { data: submissions, isLoading } = trpc.assignments.getMySubmissions.useQuery({
    lessonId,
  });

  // Mutation to submit assignment
  const submitMutation = trpc.assignments.submit.useMutation({
    onSuccess: () => {
      toast.success("Assignment submitted successfully!");
      setSelectedFile(null);
      setNotes("");
      utils.assignments.getMySubmissions.invalidate({ lessonId });
    },
    onError: (error: any) => {
      toast.error(`Failed to submit assignment: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type (PDF or Word documents)
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to S3
      const fileBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      
      // Create unique file key
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileExtension = selectedFile.name.split('.').pop();
      const fileKey = `assignments/${lessonId}/${timestamp}-${randomSuffix}.${fileExtension}`;

      // Note: storagePut is a server-side function, so we need to send the file data to the server
      // For now, we'll use a data URL as a placeholder - in production, you'd upload to S3 via an API endpoint
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileUrl = e.target?.result as string;

        // Submit assignment with file URL
        submitMutation.mutate({
          lessonId,
          fileUrl, // In production, this would be the S3 URL
          fileName: selectedFile.name,
          notes: notes || undefined,
        });
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setIsUploading(false);
    }
  };

  const latestSubmission = submissions?.[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Guidelines Section */}
        <AssignmentGuidelines assignmentPrompt={assignmentPrompt} />
        
        {/* Submission Section */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Submission</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guidelines Section */}
      <AssignmentGuidelines assignmentPrompt={assignmentPrompt} />
      
      {/* Submission Section */}
      <Card>
        <CardHeader>
          <CardTitle>Written Assignment</CardTitle>
          <CardDescription>{assignmentPrompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Submission Status */}
          {latestSubmission && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                {latestSubmission.submission.status === "graded" ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : latestSubmission.submission.status === "submitted" ? (
                  <Clock className="w-5 h-5 text-blue-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                )}
                <h3 className="font-semibold">
                  {latestSubmission.submission.status === "graded"
                    ? "Assignment Graded"
                    : latestSubmission.submission.status === "submitted"
                    ? "Assignment Submitted"
                    : "Assignment Returned"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Submitted: {new Date(latestSubmission.submission.submittedAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>File:</strong> {latestSubmission.submission.fileName}
              </p>
              {latestSubmission.submission.notes && (
                <p className="text-sm mt-2">
                  <strong>Notes:</strong> {latestSubmission.submission.notes}
                </p>
              )}
              
              {/* Show grade if graded */}
              {latestSubmission.submission.status === "graded" && latestSubmission.grade && (
                <div className="mt-4 p-3 bg-background rounded border">
                  <p className="text-lg font-semibold text-green-600">
                    Grade: {latestSubmission.grade.grade}/100
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Feedback:</strong>
                  </p>
                  <p className="text-sm whitespace-pre-wrap mt-1">{latestSubmission.grade.feedback}</p>
                  {latestSubmission.grade.rubricScores && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold">Rubric Scores:</p>
                      <pre className="text-xs mt-1 p-2 bg-muted rounded">
                        {JSON.stringify(JSON.parse(latestSubmission.grade.rubricScores), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* File Upload Area */}
          {(!latestSubmission || latestSubmission.submission.status === "returned") && (
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 mx-auto text-primary" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">Drop your assignment here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accepted formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes or comments about your submission..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? "Uploading..." : "Submit Assignment"}
              </Button>
            </>
          )}

          {/* Resubmission Info */}
          {latestSubmission && latestSubmission.submission.status === "submitted" && (
            <p className="text-sm text-muted-foreground text-center">
              Your assignment has been submitted and is awaiting grading.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

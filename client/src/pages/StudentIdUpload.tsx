import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, CheckCircle, Clock, AlertCircle, FileUp } from "lucide-react";
import { toast } from "sonner";

export default function StudentIdUpload() {
  const [, setLocation] = useLocation();
  const [idType, setIdType] = useState<"driver_license" | "state_id" | "passport">("driver_license");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please upload a valid image or PDF file");
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to S3
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed");
      }

      const { fileUrl, fileKey } = await uploadResponse.json();

      // Submit ID verification
      const submitResponse = await fetch("/api/trpc/idVerification.submitId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          fileKey,
          idType,
        }),
      });

      if (!submitResponse.ok) {
        throw new Error("Failed to submit ID");
      }

      toast.success("ID submitted successfully! Our team will review it shortly.");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit ID. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload ID</TabsTrigger>
            <TabsTrigger value="status">Verification Status</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">ID Verification</CardTitle>
                <CardDescription className="text-slate-300">
                  Upload a valid government-issued ID to complete your enrollment verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* ID Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-white">ID Type</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "driver_license", label: "Driver's License" },
                        { value: "state_id", label: "State ID" },
                        { value: "passport", label: "Passport" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setIdType(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            idType === option.value
                              ? "border-blue-500 bg-blue-500/20 text-white"
                              : "border-slate-600 bg-slate-700/30 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label className="text-white">Upload ID Image</Label>
                    <div
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-white font-semibold mb-1">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-sm text-slate-400">
                        PNG, JPG, WebP or PDF (max 5MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <Alert className="bg-blue-900/20 border-blue-700">
                    <AlertCircle className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-slate-300 ml-2">
                      <strong>Requirements:</strong> ID must be clear, readable, and show your full name and date of birth
                    </AlertDescription>
                  </Alert>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!file || isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Submit ID for Verification
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Verification Status</CardTitle>
                <CardDescription className="text-slate-300">
                  Check the status of your ID verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {submissionStatus === "pending" && (
                  <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-yellow-400" />
                      <div>
                        <h3 className="text-white font-semibold">Under Review</h3>
                        <p className="text-slate-300 text-sm">
                          Your ID is being reviewed by our team. This usually takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {submissionStatus === "approved" && (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                      <div>
                        <h3 className="text-white font-semibold">Verified ✓</h3>
                        <p className="text-slate-300 text-sm">
                          Your ID has been verified! You can now access all course materials.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setLocation("/dashboard")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}

                {submissionStatus === "rejected" && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                      <div>
                        <h3 className="text-white font-semibold">Resubmission Required</h3>
                        <p className="text-slate-300 text-sm">
                          {rejectionReason || "Your ID could not be verified. Please resubmit."}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSubmissionStatus(null);
                        setFile(null);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    >
                      Upload New ID
                    </Button>
                  </div>
                )}

                {!submissionStatus && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No submission found. Upload your ID above to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

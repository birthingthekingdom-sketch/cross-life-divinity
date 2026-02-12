import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface IdUploadFormProps {
  onSuccess?: () => void;
}

export function IdUploadForm({ onSuccess }: IdUploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitIdMutation = trpc.idVerification.submitId.useMutation();
  const statusQuery = trpc.idVerification.getMyStatus.useQuery();

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a JPG, PNG, or PDF file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    try {
      // Upload file to S3 using manus-upload-file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // For now, we'll use a placeholder URL - in production, this would be your S3 upload endpoint
      // The file would be uploaded to S3 and we'd get back a URL
      const fileUrl = URL.createObjectURL(selectedFile);

      // Submit ID to backend
      await submitIdMutation.mutateAsync({
        fileUrl,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
      });

      toast.success('ID submitted successfully! Our team will review it shortly.');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      statusQuery.refetch();
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit ID';
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const currentStatus = statusQuery.data?.status;
  const submission = statusQuery.data?.submission;

  // Show status if already submitted
  if (currentStatus === 'pending' || currentStatus === 'approved' || currentStatus === 'rejected') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ID Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStatus === 'pending' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Your ID is under review. We'll notify you once the verification is complete.
              </AlertDescription>
            </Alert>
          )}

          {currentStatus === 'approved' && (
            <Alert className="border-green-200 bg-green-50">
              <FileCheck className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your ID has been approved! You can now access all course materials and features.
              </AlertDescription>
            </Alert>
          )}

          {currentStatus === 'rejected' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <p className="font-semibold mb-2">ID Verification Rejected</p>
                <p className="mb-3">{submission?.reviewNotes}</p>
                <Button
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    statusQuery.refetch();
                  }}
                  variant="outline"
                  size="sm"
                >
                  Submit New ID
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {submission && (
            <div className="text-sm text-gray-600">
              <p><strong>File:</strong> {submission.fileName}</p>
              <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
              {submission.reviewedAt && (
                <p><strong>Reviewed:</strong> {new Date(submission.reviewedAt).toLocaleDateString()}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Government ID</CardTitle>
        <CardDescription>
          Upload a clear photo of your government-issued ID (driver's license, passport, or state ID)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-2">
              <FileCheck className="h-12 w-12 mx-auto text-green-600" />
              <p className="font-semibold text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Choose Different File
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="font-semibold text-gray-900">Drag and drop your ID here</p>
              <p className="text-sm text-gray-600">or</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, or PDF • Max 10MB
              </p>
            </div>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Requirements:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Clear, legible photo of your government-issued ID</li>
              <li>Entire ID must be visible in the image</li>
              <li>File format: JPG, PNG, or PDF</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Submit ID
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

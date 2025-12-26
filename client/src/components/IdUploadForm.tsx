import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface IdUploadFormProps {
  onSubmitSuccess?: () => void;
}

export function IdUploadForm({ onSubmitSuccess }: IdUploadFormProps) {
  const [idType, setIdType] = useState<'drivers_license' | 'state_id' | 'passport' | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch latest submission
  const { data: latestSubmission, refetch } = trpc.idSubmission.getMyLatestSubmission.useQuery();
  
  // Submit mutation
  const submitMutation = trpc.idSubmission.submitId.useMutation({
    onSuccess: () => {
      toast.success('ID submitted successfully! Admin will review it shortly.');
      setFile(null);
      setIdType('');
      refetch();
      onSubmitSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit ID');
    }
  });

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
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idType) {
      toast.error('Please select an ID type');
      return;
    }

    if (!file) {
      toast.error('Please select a file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPEG, PNG, and WebP files are allowed');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to S3 using manus-upload-file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const { url } = await response.json();

      // Submit ID with S3 URL
      await submitMutation.mutateAsync({
        idType: idType as 'drivers_license' | 'state_id' | 'passport',
        documentUrl: url,
        fileName: file.name,
        fileSize: file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusDisplay = () => {
    if (!latestSubmission) return null;

    const statusConfig = {
      pending: {
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
        title: 'Pending Review',
        description: 'Your ID is being reviewed by our admin team. This typically takes 2-3 business days.',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      approved: {
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        title: 'Verified',
        description: 'Your ID has been successfully verified. You can now access all course materials.',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      rejected: {
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        title: 'Rejected',
        description: latestSubmission.rejectionReason || 'Your ID was rejected. Please resubmit.',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      resubmit_requested: {
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        title: 'Resubmission Requested',
        description: latestSubmission.rejectionReason || 'Please resubmit your ID with corrections.',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    };

    const config = statusConfig[latestSubmission.status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Alert className={`${config.bgColor} border-2 ${config.borderColor} mb-6`}>
        <div className="flex items-start gap-3">
          {config.icon}
          <div>
            <h3 className="font-semibold text-sm">{config.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{config.description}</p>
            {latestSubmission.verificationNotes && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Admin Notes:</strong> {latestSubmission.verificationNotes}
              </p>
            )}
          </div>
        </div>
      </Alert>
    );
  };

  // Don't show form if already approved
  if (latestSubmission?.status === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ID Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {getStatusDisplay()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification</CardTitle>
        <CardDescription>
          Submit a government-issued ID for verification to complete your enrollment
        </CardDescription>
      </CardHeader>
      <CardContent>
        {getStatusDisplay()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">ID Type</label>
            <Select value={idType} onValueChange={(value: any) => setIdType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drivers_license">Driver's License</SelectItem>
                <SelectItem value="state_id">State ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="text-sm font-medium mb-2 block">Upload Document</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">
                {file ? file.name : 'Drag and drop your ID here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                or
              </p>
              <label className="inline-block mt-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
                <span className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium">
                  browse files
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-3">
                PDF, JPEG, PNG, or WebP • Max 10MB
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Document Requirements:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Document must be clear and legible</li>
              <li>Must not be expired</li>
              <li>Must be a government-issued ID</li>
              <li>No glares, shadows, or obstructions</li>
            </ul>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!idType || !file || isUploading || submitMutation.isPending}
            className="w-full"
          >
            {isUploading || submitMutation.isPending ? 'Uploading...' : 'Submit ID for Verification'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

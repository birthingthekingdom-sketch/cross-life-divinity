import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileCheck } from "lucide-react";

interface Enrollment {
  enrollmentId: number;
  courseId: number;
  enrolledAt: Date;
  isVerified: boolean;
  verificationStatus: 'approved' | 'pending';
}

interface IdVerificationDeadlineAlertProps {
  enrollments: Enrollment[];
}

export function IdVerificationDeadlineAlert({
  enrollments,
}: IdVerificationDeadlineAlertProps) {
  const [, navigate] = useLocation();

  const unverifiedEnrollments = enrollments.filter((e) => !e.isVerified);

  if (unverifiedEnrollments.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 space-y-3">
      {unverifiedEnrollments.map((enrollment) => (
        <Alert
          key={enrollment.enrollmentId}
          className="border-blue-200 bg-blue-50"
        >
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <p className="font-semibold mb-1">ID Verification Pending</p>
            <p className="text-sm mb-3">
              Your ID verification is being reviewed by our admin team. You have full access to all your courses while we complete the review (typically within 72 hours).
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/student/id-upload")}
              className="border-blue-600 text-blue-600 hover:bg-blue-100"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              View Verification Status
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

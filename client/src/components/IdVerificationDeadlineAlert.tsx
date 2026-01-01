import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, FileCheck } from "lucide-react";

interface Enrollment {
  enrollmentId: number;
  courseId: number;
  enrolledAt: Date;
  deadlineAt: Date;
  isPastDeadline: boolean;
  isVerified: boolean;
  isAccessSuspended: boolean;
  daysRemaining: number;
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
      {unverifiedEnrollments.map((enrollment) => {
        if (enrollment.isAccessSuspended) {
          return (
            <Alert
              key={enrollment.enrollmentId}
              className="border-red-200 bg-red-50"
            >
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <p className="font-semibold mb-2">
                  Access Suspended - ID Verification Required
                </p>
                <p className="text-sm mb-3">
                  Your course access has been suspended because your 7-day grace
                  period ended without ID verification. Complete ID verification
                  now to regain access.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/student/id-upload")}
                  className="border-red-600 text-red-600 hover:bg-red-100"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Complete ID Verification
                </Button>
              </AlertDescription>
            </Alert>
          );
        }

        if (enrollment.isPastDeadline) {
          return (
            <Alert
              key={enrollment.enrollmentId}
              className="border-orange-200 bg-orange-50"
            >
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <p className="font-semibold mb-2">
                  ID Verification Deadline Passed
                </p>
                <p className="text-sm mb-3">
                  Your 7-day grace period has ended. You must complete ID
                  verification to continue accessing course materials.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/student/id-upload")}
                  className="border-orange-600 text-orange-600 hover:bg-orange-100"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Verify ID Now
                </Button>
              </AlertDescription>
            </Alert>
          );
        }

        return (
          <Alert
            key={enrollment.enrollmentId}
            className="border-amber-200 bg-amber-50"
          >
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <p className="font-semibold mb-1">ID Verification Required</p>
              <p className="text-sm mb-3">
                {enrollment.daysRemaining} days remaining to complete ID
                verification. After 7 days, course access will be suspended.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/student/id-upload")}
                className="border-amber-600 text-amber-600 hover:bg-amber-100"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Upload ID
              </Button>
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}

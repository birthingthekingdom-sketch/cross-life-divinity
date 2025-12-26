import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, FileCheck, Award, Users } from "lucide-react";

interface EnrollmentStatus {
  idVerification: "pending" | "verified" | "rejected";
  backgroundCheck: "pending" | "approved" | "rejected";
  certificateEligibility: "eligible" | "not-eligible" | "completed";
  enrollmentDate: string;
  verificationDate?: string;
  backgroundCheckDate?: string;
  programType: "regular" | "chaplaincy";
  referenceVerification?: "pending" | "approved" | "rejected";
  credentialVerification?: "pending" | "approved" | "rejected";
}

interface EnrollmentStatusDashboardProps {
  status?: EnrollmentStatus;
  isAdminView?: boolean;
}

export function EnrollmentStatusDashboard({ status, isAdminView = false }: EnrollmentStatusDashboardProps) {
  // Default mock data for demonstration
  const enrollmentStatus: EnrollmentStatus = status || {
    idVerification: "verified",
    backgroundCheck: "pending",
    certificateEligibility: "not-eligible",
    programType: "regular",
    enrollmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    verificationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "eligible":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
      case "not-eligible":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
      case "eligible":
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
      case "not-eligible":
        return <Badge className="bg-red-100 text-red-800">Action Needed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusDescription = (type: string, status: string) => {
    switch (type) {
      case "idVerification":
        if (status === "verified") return "Your ID has been verified. You can access all courses.";
        if (status === "pending") return "Your ID is being verified. This typically takes 1-2 business days.";
        if (status === "rejected") return "Your ID could not be verified. Please upload a clearer photo or try a different ID.";
        break;
      case "backgroundCheck":
        if (status === "approved") return "Your background check is complete. You're approved for all programs.";
        if (status === "pending") return "Your background check is in progress. This typically takes 2-3 weeks.";
        if (status === "rejected") return "Your background check could not be completed. Contact support for assistance.";
        break;
      case "certificateEligibility":
        if (status === "eligible") return "You're eligible to receive certificates upon course completion.";
        if (status === "completed") return "You've completed the requirements. Your certificate is ready to download.";
        if (status === "not-eligible") return "Complete ID verification to become eligible for certificates.";
        break;
      default:
        return "";
    }
  };

  if (isAdminView) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Enrollment Management</h2>
          <p className="text-muted-foreground">Manage and update student enrollment statuses</p>
        </div>

        {/* Admin Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Enrollment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Info */}
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Student Name</label>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="font-medium">john@example.com</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Program</label>
                  <p className="font-medium capitalize">{enrollmentStatus.programType} Training</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Enrollment Date</label>
                  <p className="font-medium">{enrollmentStatus.enrollmentDate}</p>
                </div>
              </div>
            </div>

            {/* ID Verification Management */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">ID Verification</h3>
                {getStatusIcon(enrollmentStatus.idVerification)}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Current Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(enrollmentStatus.idVerification)}
                    <span className="text-sm">{enrollmentStatus.verificationDate || "Pending"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View ID Photo</Button>
                  <Button size="sm" variant="outline">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm" variant="outline">Request Resubmission</Button>
                </div>
              </div>
            </div>

            {/* Background Check Management */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Background Check</h3>
                {getStatusIcon(enrollmentStatus.backgroundCheck)}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Current Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(enrollmentStatus.backgroundCheck)}
                    <span className="text-sm">{enrollmentStatus.backgroundCheckDate || "In Progress"}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Report</Button>
                  <Button size="sm" variant="outline">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm" variant="outline">Mark as Pending</Button>
                </div>
              </div>
            </div>

            {/* Chaplaincy-Specific Management */}
            {enrollmentStatus.programType === "chaplaincy" && (
              <>
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Reference Verification</h3>
                    {getStatusIcon(enrollmentStatus.referenceVerification || "pending")}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(enrollmentStatus.referenceVerification || "pending")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View References</Button>
                      <Button size="sm" variant="outline">Approve</Button>
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm" variant="outline">Request New References</Button>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Credential Verification</h3>
                    {getStatusIcon(enrollmentStatus.credentialVerification || "pending")}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(enrollmentStatus.credentialVerification || "pending")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View Credentials</Button>
                      <Button size="sm" variant="outline">Approve</Button>
                      <Button size="sm" variant="outline">Reject</Button>
                      <Button size="sm" variant="outline">Request Documentation</Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Certificate Eligibility */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Certificate Eligibility</h3>
                {getStatusIcon(enrollmentStatus.certificateEligibility)}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(enrollmentStatus.certificateEligibility)}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                  <p className="text-muted-foreground">
                    Certificate eligibility is automatically determined based on ID verification and background check status.
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Admin Actions</h3>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline">Send Status Update Email</Button>
                <Button variant="outline">Send Reminder</Button>
                <Button variant="outline">Add Note</Button>
                <Button variant="destructive" size="sm">Deny Enrollment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Student View
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Enrollment Status</h2>
        <p className="text-muted-foreground">Track your verification progress and certificate eligibility</p>
      </div>

      {/* Enrollment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Enrollment Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                <div className="w-0.5 h-12 bg-green-200"></div>
              </div>
              <div className="pb-8">
                <p className="font-semibold">Enrolled</p>
                <p className="text-sm text-muted-foreground">{enrollmentStatus.enrollmentDate}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(enrollmentStatus.idVerification)}
                <div className={`w-0.5 h-12 ${enrollmentStatus.backgroundCheck !== "pending" ? "bg-green-200" : "bg-gray-200"}`}></div>
              </div>
              <div className="pb-8">
                <p className="font-semibold">ID Verification</p>
                <p className="text-sm text-muted-foreground">
                  {enrollmentStatus.verificationDate || "Pending..."}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(enrollmentStatus.backgroundCheck)}
              </div>
              <div>
                <p className="font-semibold">Background Check</p>
                <p className="text-sm text-muted-foreground">
                  {enrollmentStatus.backgroundCheckDate || "In progress..."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* ID Verification Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>ID Verification</span>
              {getStatusIcon(enrollmentStatus.idVerification)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              {getStatusBadge(enrollmentStatus.idVerification)}
            </div>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription("idVerification", enrollmentStatus.idVerification)}
            </p>
            {enrollmentStatus.idVerification === "rejected" && (
              <button className="text-sm text-primary hover:underline">
                Upload new ID →
              </button>
            )}
          </CardContent>
        </Card>

        {/* Background Check Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Background Check</span>
              {getStatusIcon(enrollmentStatus.backgroundCheck)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              {getStatusBadge(enrollmentStatus.backgroundCheck)}
            </div>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription("backgroundCheck", enrollmentStatus.backgroundCheck)}
            </p>
            {enrollmentStatus.backgroundCheck === "pending" && (
              <p className="text-xs text-muted-foreground">
                Typically completes within 2-3 weeks
              </p>
            )}
          </CardContent>
        </Card>

        {/* Certificate Eligibility Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Certificates</span>
              {getStatusIcon(enrollmentStatus.certificateEligibility)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              {getStatusBadge(enrollmentStatus.certificateEligibility)}
            </div>
            <p className="text-sm text-muted-foreground">
              {getStatusDescription("certificateEligibility", enrollmentStatus.certificateEligibility)}
            </p>
            {enrollmentStatus.certificateEligibility === "completed" && (
              <button className="text-sm text-primary hover:underline">
                Download certificate →
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chaplaincy-Specific Requirements */}
      {enrollmentStatus.programType === "chaplaincy" && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base">Chaplaincy Training Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Reference Verification</span>
                  {getStatusIcon(enrollmentStatus.referenceVerification || "pending")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {enrollmentStatus.referenceVerification === "approved"
                    ? "✓ References verified"
                    : enrollmentStatus.referenceVerification === "pending"
                    ? "Pending - We're contacting your references"
                    : "Action needed - Please provide new references"}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">Credential Verification</span>
                  {getStatusIcon(enrollmentStatus.credentialVerification || "pending")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {enrollmentStatus.credentialVerification === "approved"
                    ? "✓ Credentials verified"
                    : enrollmentStatus.credentialVerification === "pending"
                    ? "Pending - We're reviewing your credentials"
                    : "Action needed - Please provide additional documentation"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {enrollmentStatus.idVerification === "verified" && (
              <li className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>✓ ID verified - You can start courses immediately</span>
              </li>
            )}
            {enrollmentStatus.backgroundCheck === "pending" && (
              <li className="flex gap-2">
                <Clock className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>Background check in progress (2-3 weeks)</span>
              </li>
            )}
            {enrollmentStatus.backgroundCheck === "approved" && (
              <li className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>✓ Background check complete - Full enrollment approved</span>
              </li>
            )}
            {enrollmentStatus.certificateEligibility === "not-eligible" && (
              <li className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>Complete ID verification to earn certificates</span>
              </li>
            )}
            {enrollmentStatus.certificateEligibility === "eligible" && (
              <li className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>✓ You're eligible to earn CLAC certificates</span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions about your status?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Check our Knowledge Base or contact our support team for assistance.
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              View Knowledge Base →
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-sm text-primary hover:underline">
              Contact Support →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

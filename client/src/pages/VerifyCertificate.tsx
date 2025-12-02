import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, XCircle, Loader2, Calendar, User, BookOpen } from "lucide-react";
import { Link, useParams } from "wouter";

export default function VerifyCertificate() {
  const { token } = useParams();
  const { data: verification, isLoading, error } = trpc.certificates.verify.useQuery(
    { verificationToken: token || "" },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-12 pb-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying certificate...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isValid = verification && !error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Certificate Verification</h1>
          <p className="text-slate-600">Cross Life School of Divinity</p>
        </div>

        {/* Verification Result */}
        <Card className={`border-2 ${isValid ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
          <CardHeader className="text-center pb-4">
            {isValid ? (
              <>
                <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-900">Certificate Verified</CardTitle>
                <CardDescription className="text-green-700">
                  This is an authentic CPD-accredited certificate issued by Cross Life School of Divinity
                </CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-900">Certificate Not Found</CardTitle>
                <CardDescription className="text-red-700">
                  This certificate could not be verified. Please check the verification code and try again.
                </CardDescription>
              </>
            )}
          </CardHeader>

          {isValid && verification && (
            <CardContent className="space-y-6">
              {/* Certificate Details */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Certificate Number</p>
                    <p className="font-mono text-lg font-semibold text-slate-900">
                      {verification.certificateNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Recipient</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {verification.studentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Course</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {verification.courseTitle}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Course Code: {verification.courseCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">Issued Date</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(verification.issuedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* CPD Hours Badge */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-blue-700" />
                    <span className="text-2xl font-bold text-blue-900">
                      {verification.cpdHours} CPD Hours
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">CPD Accredited Standards</p>
                </div>
              </div>

              {/* Verification Info */}
              <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900 mb-2">About This Certificate</p>
                <p>
                  This certificate confirms that the recipient has successfully completed all requirements
                  for the specified course at Cross Life School of Divinity. The certificate meets CPD
                  Accredited Standards for continuing professional development.
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 text-center space-y-4">
          <Link href="/">
            <Button variant="outline" size="lg">
              Return to Home
            </Button>
          </Link>
          <p className="text-sm text-slate-500">
            For questions about this certificate, please contact Cross Life School of Divinity
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IdUploadForm } from '@/components/IdUploadForm';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';

export function StudentIdVerification() {
  const [, navigate] = useLocation();
  const statusQuery = trpc.idVerification.getMyStatus.useQuery();

  const currentStatus = statusQuery.data?.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ID Verification
          </h1>
          <p className="text-lg text-gray-600">
            Complete your enrollment by verifying your identity
          </p>
        </div>

        {/* Status Overview */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Why do we need your ID?
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  We verify student identities to maintain the integrity of our certificates and ensure compliance with educational standards. Your information is kept strictly confidential.
                </p>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Verify your identity for certificate issuance</li>
                  <li>Comply with educational regulations</li>
                  <li>Protect your account and prevent fraud</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {currentStatus === 'not_submitted' && (
          <div className="space-y-6">
            <IdUploadForm
              onSuccess={() => {
                statusQuery.refetch();
              }}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Submit Your ID</p>
                    <p className="text-sm text-gray-600">
                      Upload a clear photo of your government-issued ID
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">We Review Your ID</p>
                    <p className="text-sm text-gray-600">
                      Our team will verify your ID within 24-48 hours
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Start Learning</p>
                    <p className="text-sm text-gray-600">
                      Once approved, you can access all your courses and materials
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-semibold text-gray-900 mb-1">
                  Can I start learning before verification?
                </p>
                <p className="text-sm text-gray-700">
                  Yes! You can access course materials immediately after enrollment. Your certificate will be issued after ID verification is complete.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {currentStatus === 'pending' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your ID is Under Review
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Thank you for submitting your ID! Our team is reviewing it and will notify you of the result within 24-48 hours.
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    In the meantime, you can start exploring your courses and accessing course materials.
                  </p>
                  <Button onClick={() => navigate('/student/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStatus === 'approved' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ID Verification Approved!
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Congratulations! Your ID has been verified and approved. You now have full access to all courses and features.
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    You can now:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside mb-4">
                    <li>Access all enrolled courses</li>
                    <li>Download course materials</li>
                    <li>Submit assignments and take quizzes</li>
                    <li>Earn your CLAC certificate upon completion</li>
                  </ul>
                  <Button onClick={() => navigate('/student/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStatus === 'rejected' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ID Verification Rejected
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Unfortunately, we were unable to verify your ID at this time. Please review the feedback below and resubmit a new ID.
                  </p>
                  {statusQuery.data?.submission?.reviewNotes && (
                    <div className="bg-white rounded p-3 mb-4 border border-red-200">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Reason:
                      </p>
                      <p className="text-sm text-gray-700">
                        {statusQuery.data.submission.reviewNotes}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-700 mb-4">
                    Please ensure:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside mb-4">
                    <li>The entire ID is visible in the image</li>
                    <li>All text is clear and readable</li>
                    <li>The file format is JPG, PNG, or PDF</li>
                    <li>The file size is under 10MB</li>
                  </ul>
                  <div className="bg-white rounded p-4 border border-red-200">
                    <IdUploadForm
                      onSuccess={() => {
                        statusQuery.refetch();
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 mb-1">
                What IDs are accepted?
              </p>
              <p className="text-sm text-gray-700">
                We accept government-issued IDs including driver's licenses, passports, state IDs, and national ID cards.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                How long does verification take?
              </p>
              <p className="text-sm text-gray-700">
                Verification typically takes 24-48 hours. You'll receive an email notification once your ID has been reviewed.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                Is my ID information secure?
              </p>
              <p className="text-sm text-gray-700">
                Yes! All ID information is handled with strict confidentiality and stored securely. We comply with all privacy regulations and only use this information for enrollment verification.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                What if my ID is rejected?
              </p>
              <p className="text-sm text-gray-700">
                If your ID is rejected, we'll provide feedback on why. You can resubmit a new ID anytime. Our team will work with you to resolve any issues.
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">
                What if I can't complete verification?
              </p>
              <p className="text-sm text-gray-700">
                If enrollment cannot be completed due to ID verification failure after reasonable attempts, you'll receive a full refund with no questions asked.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

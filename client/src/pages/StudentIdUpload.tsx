import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IdUploadForm } from '@/components/IdUploadForm';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export function StudentIdUpload() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ID Verification
          </h1>
          <p className="text-gray-600">
            Complete your enrollment by submitting a government-issued ID
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            ID verification is required to complete your enrollment and access all course materials. 
            The verification process typically takes 2-3 business days.
          </AlertDescription>
        </Alert>

        {/* Main Form */}
        <IdUploadForm onSubmitSuccess={() => {
          // Navigation handled by component
        }} />

        {/* Process Timeline */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Verification Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-gray-900">Submit ID</h3>
                  <p className="text-sm text-gray-600">Upload your government-issued ID document</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-gray-900">Admin Review</h3>
                  <p className="text-sm text-gray-600">Our admin team verifies your document (2-3 business days)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verification Complete</h3>
                  <p className="text-sm text-gray-600">Access all courses and materials once approved</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">What ID types are accepted?</h4>
              <p className="text-sm text-gray-600">
                We accept Driver's License, State ID, and Passport. The ID must be current and not expired.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">How long does verification take?</h4>
              <p className="text-sm text-gray-600">
                Typically 2-3 business days. You'll receive an email notification once your ID is verified.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">What if my ID is rejected?</h4>
              <p className="text-sm text-gray-600">
                If your ID doesn't meet the requirements, we'll send you a notification with the reason. 
                You can resubmit a corrected version.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Is my information secure?</h4>
              <p className="text-sm text-gray-600">
                Yes. Your documents are securely stored and only accessed by our admin team for verification purposes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Can I access courses before verification?</h4>
              <p className="text-sm text-gray-600">
                You have limited access to course materials. Full access is granted once your ID is verified.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Having trouble? Contact our support team
          </p>
          <a
            href="mailto:support@crosslifeschoolofdivinity.org"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            support@crosslifeschoolofdivinity.org
          </a>
        </div>
      </div>
    </div>
  );
}

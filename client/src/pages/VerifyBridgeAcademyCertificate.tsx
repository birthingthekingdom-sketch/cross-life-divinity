import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VerificationResult {
  type?: 'diploma' | 'subject';
  valid: boolean;
  studentName?: string;
  certificateNumber?: string;
  completionDate?: string;
  averageScore?: number;
  courseCode?: string;
  courseName?: string;
  score?: number;
  issuedAt?: string;
  error?: string;
}

export function VerifyBridgeAcademyCertificate() {
  const [token, setToken] = useState('');
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  // Extract token from URL if present
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/verify-bridge-academy\/(.+)$/);
    if (match) {
      const urlToken = match[1];
      setToken(urlToken);
      verifyToken(urlToken);
    }
  }, []);

  const verifyToken = async (verifyToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/bridge-academy/verify/${verifyToken}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Certificate not found. Please check the verification code.');
          setVerification({ valid: false, error: 'Certificate not found' });
        } else {
          throw new Error('Failed to verify certificate');
        }
        return;
      }

      const data = await response.json();
      setVerification(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setVerification({ valid: false, error: message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      verifyToken(token.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Verify Bridge Academy Certificate</h1>
          <p className="text-lg text-foreground/70">
            Verify the authenticity of Bridge Academy GED Preparation certificates
          </p>
        </div>

        {/* Verification Form */}
        {!verification && (
          <Card className="p-8 mb-8">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium mb-2">
                  Verification Code or Token
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste the verification code from the certificate"
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-sm text-foreground/60 mt-2">
                  You can find this code on the Bridge Academy certificate or by scanning the QR code.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Certificate'
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Verification Results */}
        {verification && (
          <div className="space-y-6">
            {verification.valid ? (
              <>
                {/* Success Message */}
                <Card className="p-8 border-2 border-green-200 bg-green-50">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-2xl font-bold text-green-900 mb-2">Certificate Verified</h2>
                      <p className="text-green-800">
                        This is a valid Bridge Academy certificate issued by Cross Life School of Divinity.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Certificate Details */}
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6">Certificate Details</h3>

                  {verification.type === 'diploma' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-foreground/60">Student Name</p>
                          <p className="font-semibold text-lg">{verification.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Certificate Number</p>
                          <p className="font-mono text-lg">{verification.certificateNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Overall Score</p>
                          <p className="font-semibold text-lg text-primary">{verification.averageScore}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Completion Date</p>
                          <p className="font-semibold text-lg">
                            {verification.completionDate ? new Date(verification.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>What this means:</strong> This student has successfully completed all four GED preparation courses (Reasoning Through Language Arts, Mathematical Reasoning, Science, and Social Studies) and is prepared for GED examination.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-foreground/60">Student Name</p>
                          <p className="font-semibold text-lg">{verification.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Certificate Number</p>
                          <p className="font-mono text-lg">{verification.certificateNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Subject</p>
                          <p className="font-semibold text-lg">{verification.courseName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Score</p>
                          <p className="font-semibold text-lg text-primary">{verification.score}%</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-foreground/60">Completion Date</p>
                          <p className="font-semibold text-lg">
                            {verification.completionDate ? new Date(verification.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <strong>What this means:</strong> This student has successfully completed the {verification.courseName} ({verification.courseCode}) course with a score of {verification.score}%.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Verification Info */}
                <Card className="p-6 bg-slate-50">
                  <h4 className="font-bold mb-3">Verification Information</h4>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Issued by: Cross Life School of Divinity</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Issued on: {verification.issuedAt ? new Date(verification.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Program: Bridge Academy - GED Preparation</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Verification Token: <span className="font-mono text-xs">{token}</span></span>
                    </li>
                  </ul>
                </Card>

                <Button onClick={() => setVerification(null)} variant="outline" className="w-full">
                  Verify Another Certificate
                </Button>
              </>
            ) : (
              <>
                {/* Invalid Certificate */}
                <Card className="p-8 border-2 border-red-200 bg-red-50">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-2xl font-bold text-red-900 mb-2">Certificate Not Found</h2>
                      <p className="text-red-800">
                        {error || 'The verification code you entered does not match any valid Bridge Academy certificate.'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold mb-3">Troubleshooting</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Check that you've entered the complete verification code correctly</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Make sure there are no extra spaces before or after the code</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>If scanning a QR code, ensure the camera is focused and the code is fully visible</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">•</span>
                      <span>Contact Cross Life School of Divinity if you believe this is an error</span>
                    </li>
                  </ul>
                </Card>

                <Button onClick={() => setVerification(null)} className="w-full">
                  Try Again
                </Button>
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        {!verification && (
          <Card className="mt-8 p-6 bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">About Bridge Academy Certificates</h3>
            <p className="text-sm text-blue-800 mb-3">
              Bridge Academy certificates are professional credentials that demonstrate completion of GED preparation coursework. Each certificate includes:
            </p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Unique certificate number for identification</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Student name and completion date</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Verification QR code for quick authentication</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Official seal from Cross Life School of Divinity</span>
              </li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

export default VerifyBridgeAcademyCertificate;

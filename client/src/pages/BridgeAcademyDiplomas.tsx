import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';

interface Diploma {
  id: number;
  certificateNumber: string;
  verificationToken: string;
  completionDate: Date;
  averageScore: number;
  issuedAt: Date;
}

interface SubjectCertificate {
  id: number;
  courseCode: string;
  courseName: string;
  certificateNumber: string;
  score: number;
  completionDate: Date;
  issuedAt: Date;
}

export function BridgeAcademyDiplomas() {
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [subjectCertificates, setSubjectCertificates] = useState<SubjectCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchDiplomas();
  }, [user, navigate]);

  const fetchDiplomas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bridge-academy/my-diplomas', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch diplomas');
      }

      const data = await response.json();
      setDiplomas(data.diplomas || []);
      setSubjectCertificates(data.subjectCertificates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadDiploma = (diplomaId: number) => {
    window.location.href = `/api/bridge-academy/diploma/${diplomaId}`;
  };

  const downloadTranscript = (diplomaId: number) => {
    window.location.href = `/api/bridge-academy/transcript/${diplomaId}`;
  };

  const downloadSubjectCertificate = (certificateId: number) => {
    window.location.href = `/api/bridge-academy/subject-certificate/${certificateId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-foreground/70">Loading your diplomas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Your Bridge Academy Diplomas</h1>
          <p className="text-lg text-foreground/70">
            Download your professional diplomas and transcripts for employers
          </p>
        </div>

        {error && (
          <Card className="mb-8 p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </Card>
        )}

        {/* Completion Diplomas */}
        {diplomas.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Bridge Academy Completion Diplomas
            </h2>
            <div className="grid gap-6">
              {diplomas.map((diploma) => (
                <Card key={diploma.id} className="p-6 border-2 border-primary/20 hover:border-primary/40 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        GED Preparation Completion Diploma
                      </h3>
                      <div className="space-y-1 text-sm text-foreground/70">
                        <p>Certificate #: <span className="font-mono font-semibold text-foreground">{diploma.certificateNumber}</span></p>
                        <p>Completion Date: {new Date(diploma.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p>Overall Score: <span className="font-bold text-primary">{diploma.averageScore}%</span></p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => downloadDiploma(diploma.id)}
                        className="w-full sm:w-auto"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Diploma
                      </Button>
                      <Button
                        onClick={() => downloadTranscript(diploma.id)}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download Transcript
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Subject Certificates */}
        {subjectCertificates.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Subject Completion Certificates
            </h2>
            <div className="grid gap-4">
              {subjectCertificates.map((cert) => (
                <Card key={cert.id} className="p-4 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{cert.courseName}</h3>
                      <div className="space-y-1 text-sm text-foreground/70">
                        <p>Code: {cert.courseCode} • Score: <span className="font-semibold text-primary">{cert.score}%</span></p>
                        <p>Completed: {new Date(cert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadSubjectCertificate(cert.id)}
                      size="sm"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {diplomas.length === 0 && subjectCertificates.length === 0 && (
          <Card className="p-12 text-center">
            <Award className="h-16 w-16 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Diplomas Yet</h3>
            <p className="text-foreground/70 mb-6">
              Complete Bridge Academy courses to earn your professional diplomas and transcripts.
            </p>
            <Button onClick={() => navigate('/bridge-academy')}>
              Explore Bridge Academy
            </Button>
          </Card>
        )}

        {/* Info Section */}
        <section className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">About Your Diplomas</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>Diploma:</strong> Professional completion certificate showing all 4 GED subjects completed with your overall score</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>Transcript:</strong> Detailed academic record with individual subject scores and completion dates</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>Subject Certificates:</strong> Individual certificates for each GED subject you complete</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span><strong>Verification:</strong> All documents include QR codes that employers can scan to verify authenticity</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default BridgeAcademyDiplomas;

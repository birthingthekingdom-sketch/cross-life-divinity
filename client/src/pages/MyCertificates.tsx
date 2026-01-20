import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function MyCertificates() {
  const { user } = useAuth();
  const { data: certificates, isLoading } = trpc.certificates.getMyCertificates.useQuery();

  const handleDownload = (certificateNumber: string) => {
    window.open(`/api/certificate/${certificateNumber}`, '_blank');
  };

  const handleDownloadAll = async () => {
    if (!certificates || certificates.length === 0) {
      toast.error("No certificates to download");
      return;
    }

    toast.info("Downloading all certificates...");
    
    // Download each certificate
    for (const cert of certificates) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
      window.open(`/api/certificate/${cert.certificateNumber}`, '_blank');
    }
    
    toast.success(`Downloaded ${certificates.length} certificate(s)`);
  };

  const handleVerify = (verificationToken: string) => {
    window.open(`/verify/${verificationToken}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif">My Certificates</h1>
              <p className="text-blue-100 mt-1">View and download your CPD-accredited certificates</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Summary Card */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Certificate Portfolio</CardTitle>
                <CardDescription>
                  You have earned {certificates?.length || 0} CPD-accredited certificate(s)
                </CardDescription>
              </div>
              {certificates && certificates.length > 0 && (
                <Button onClick={handleDownloadAll} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
              )}
            </div>
          </CardHeader>
          {certificates && certificates.length > 0 && (
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Total CPD Hours: {certificates.reduce((sum, cert) => sum + (cert.cpdHours || 0), 0)}</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Certificates Grid */}
        {!certificates || certificates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete courses to earn CPD-accredited certificates
              </p>
              <Link href="/dashboard">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow border-blue-100">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-start justify-between">
                    <Award className="w-10 h-10 text-amber-600" />
                    <div className="text-xs bg-blue-900 text-white px-2 py-1 rounded">
                      {cert.cpdHours} CPD Hours
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-4">{cert.courseTitle || 'Course Certificate'}</CardTitle>
                  <CardDescription>
                    {cert.courseCode || `Course ID: ${cert.courseId}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Certificate No:</span>
                      <p className="font-mono text-xs mt-1 text-blue-900">{cert.certificateNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Issued:</span>
                      <p className="mt-1">
                        {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={() => handleDownload(cert.certificateNumber)}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleVerify(cert.verificationToken)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

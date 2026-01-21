import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Share2, Eye, CheckCircle2, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";

interface Certificate {
  id: number;
  certificateNumber: string;
  verificationCode: string;
  courseTitle: string;
  issuedAt: string;
}

export function CertificateDownload() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: certificates, isLoading } = trpc.gedFeatures.getUserCertificates.useQuery();
  const downloadMutation = trpc.gedFeatures.downloadCertificatePdf.useMutation();

  const handleDownload = async (certificateId: number) => {
    try {
      const result = await downloadMutation.mutateAsync({ certificateId });
      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download certificate:", error);
    }
  };

  const handleShare = (certificate: Certificate) => {
    const verificationUrl = `${window.location.origin}/verify-certificate/${certificate.verificationCode}`;
    const text = `I just earned my GED ${certificate.courseTitle} certificate! Verify it here: ${verificationUrl}`;

    if (navigator.share) {
      navigator.share({
        title: "GED Certificate",
        text,
        url: verificationUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(verificationUrl);
      alert("Verification link copied to clipboard!");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading certificates...</div>;
  }

  if (!certificates || certificates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your GED Certificates</CardTitle>
          <CardDescription>Certificates you've earned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No certificates earned yet. Complete all lessons and pass the final exam to earn your certificate!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Your GED Certificates
        </h2>

        <div className="grid gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-green-900">{cert.courseTitle}</CardTitle>
                      <CardDescription>
                        Issued {format(new Date(cert.issuedAt), "MMMM d, yyyy")}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600 mb-1">Certificate Number</p>
                  <p className="font-mono font-semibold text-gray-900">{cert.certificateNumber}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => {
                      setSelectedCertificate(cert);
                      setShowPreview(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    onClick={() => handleDownload(cert.id)}
                    disabled={downloadMutation.isPending}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadMutation.isPending ? "Downloading..." : "Download PDF"}
                  </Button>
                  <Button
                    onClick={() => handleShare(cert)}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.courseTitle} - {selectedCertificate?.certificateNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedCertificate && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-4 border-gold-400 text-center space-y-4">
              <div className="text-sm text-gray-600 uppercase tracking-widest">Certificate of Achievement</div>

              <h2 className="text-3xl font-bold text-blue-900">GED Certificate</h2>

              <div className="py-4">
                <p className="text-gray-600 mb-2">This certifies that</p>
                <p className="text-2xl font-semibold text-blue-900 mb-4">
                  [Student Name]
                </p>
                <p className="text-gray-600">has successfully completed</p>
              </div>

              <div className="py-4 border-t-2 border-b-2 border-gray-400">
                <p className="text-xl font-semibold text-blue-900">
                  {selectedCertificate.courseTitle}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>Certificate Number: {selectedCertificate.certificateNumber}</p>
                <p>Issued: {format(new Date(selectedCertificate.issuedAt), "MMMM d, yyyy")}</p>
              </div>

              <div className="pt-4 text-xs text-gray-500">
                <p>Verification Code: {selectedCertificate.verificationCode}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

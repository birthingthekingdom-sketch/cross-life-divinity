import { useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, Share2, Award } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PathCertificate() {
  const [, params] = useRoute("/path-certificate/:pathId");
  const pathId = params?.pathId ? parseInt(params.pathId) : 0;
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const { data: eligibility, isLoading } = trpc.bundles.checkPathCertificateEligibility.useQuery(
    { learningPathId: pathId },
    { enabled: pathId > 0 }
  );

  const { data: path } = trpc.bundles.getLearningPathById.useQuery(
    { id: pathId },
    { enabled: pathId > 0 }
  );

  const generateMutation = trpc.bundles.generatePathCertificate.useMutation();

  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync({ learningPathId: pathId });
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to generate certificate");
    }
  };

  const handleDownload = () => {
    if (!certificateRef.current) return;
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Learning Path Certificate - ${path?.name}`,
        text: `I completed the ${path?.name} learning path at Cross Life School of Divinity!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Certificate link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!eligibility?.eligible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Certificate Not Available</h2>
            <p className="text-muted-foreground mb-4">
              Complete all required courses in this learning path to earn your certificate.
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const certificate = eligibility.certificate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container max-w-4xl">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Back
          </Button>
          <div className="flex gap-2">
            {certificate ? (
              <>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </>
            ) : (
              <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
                {generateMutation.isPending ? "Generating..." : "Generate Certificate"}
              </Button>
            )}
          </div>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white p-12 shadow-2xl border-8 border-primary/20 rounded-lg print:border-4"
          style={{ aspectRatio: "1.414" }}
        >
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-primary">Certificate of Completion</h1>
              <p className="text-lg text-muted-foreground">Learning Path Achievement</p>
            </div>

            {/* Divider */}
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent"></div>

            {/* Content */}
            <div className="space-y-4 max-w-2xl">
              <p className="text-lg">This certifies that</p>
              <p className="text-3xl font-bold text-foreground">{user?.name || user?.email}</p>
              <p className="text-lg">has successfully completed the</p>
              <p className="text-2xl font-bold text-primary">{path?.name}</p>
              <p className="text-base text-muted-foreground italic max-w-lg mx-auto">
                {path?.description}
              </p>
            </div>

            {/* Certificate Details */}
            {certificate && (
              <div className="space-y-2 pt-6">
                <p className="text-sm text-muted-foreground">
                  Certificate Number: <span className="font-mono font-semibold">{certificate.certificateNumber}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-8 space-y-2">
              <div className="w-48 h-px bg-foreground/20 mx-auto"></div>
              <p className="text-sm font-semibold">Cross Life School of Divinity</p>
              <p className="text-xs text-muted-foreground">CPD-Accredited Theological Education</p>
            </div>
          </div>
        </div>

        {/* Verification Info */}
        {certificate && (
          <div className="mt-6 text-center text-sm text-muted-foreground print:hidden">
            <p>
              Verify this certificate at:{" "}
              <a
                href={`/verify/${certificate.verificationToken}`}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {window.location.origin}/verify/{certificate.verificationToken}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

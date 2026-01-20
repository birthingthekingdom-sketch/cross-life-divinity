import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, EyeOff, Share2 } from "lucide-react";

interface CertificatePreviewProps {
  studentName?: string;
  courseName: string;
  courseCode: string;
  completionDate?: string;
  certificateNumber?: string;
  verificationUrl?: string;
  isCompleted?: boolean;
  showPreview?: boolean;
}

export function CertificatePreview({
  studentName = "John Smith",
  courseName,
  courseCode,
  completionDate = new Date().toLocaleDateString(),
  certificateNumber = "CLAC-2025-" + courseCode + "-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  verificationUrl = `https://cross-life-divinity.com/verify/${Math.random().toString(36).substr(2, 9)}`,
  isCompleted = false,
  showPreview = true,
}: CertificatePreviewProps) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a simple QR code representation (in production, use qrcode library)
  const generateQRCode = () => {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23fff' width='200' height='200'/%3E%3Cpath fill='%23000' d='M20,20h60v60H20V20M40,40h20v20H40V40M100,20h60v60h-60V20M120,40h20v20h-20V40M20,100h60v60H20v-60M40,120h20v20H40v-20M100,100h20v20h-20v-20M140,100h20v20h-20v-20M100,140h20v20h-20v-20M140,140h20v20h-20v-20'/%3E%3C/svg%3E";
  };

  return (
    <div className="space-y-4">
      {/* Certificate Card */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              ✓
            </div>
            <CardTitle className="text-2xl text-amber-900">CLSOD Certificate</CardTitle>
          </div>
          <CardDescription className="text-amber-800">
            Certified Chaplain Assistant (CLAC)
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Certificate Display */}
          <div className="bg-white border-4 border-amber-800 p-8 rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center mb-8 border-b-2 border-amber-800 pb-4">
              <div className="text-sm font-semibold text-amber-900 tracking-widest">
                CROSS LIFE SCHOOL OF DIVINITY
              </div>
              <h2 className="text-3xl font-serif text-amber-900 my-2">Certificate of Achievement</h2>
              <p className="text-sm text-amber-800">Accredited by Cross Life Accreditation Counsel (CLAC)</p>
            </div>

            {/* Body */}
            <div className="text-center space-y-4 mb-8">
              <p className="text-amber-800">This is to certify that</p>
              <p className="text-2xl font-bold text-amber-900 border-b-2 border-amber-800 pb-2">
                {studentName}
              </p>
              <p className="text-amber-800">has successfully completed the course</p>
              <p className="text-xl font-semibold text-amber-900">
                {courseName}
              </p>
              <p className="text-sm text-amber-800">
                Course Code: <span className="font-semibold">{courseCode}</span>
              </p>
            </div>

            {/* Certificate Details */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="text-center">
                <p className="text-amber-800 text-xs">Certificate Number</p>
                <p className="font-mono text-amber-900 font-semibold">{certificateNumber}</p>
              </div>
              <div className="text-center">
                <p className="text-amber-800 text-xs">Date Issued</p>
                <p className="font-semibold text-amber-900">{completionDate}</p>
              </div>
            </div>

            {/* Signature Line */}
            <div className="border-t-2 border-amber-800 pt-4 text-center">
              <p className="text-xs text-amber-800 mb-2">Authorized by Cross Life School of Divinity</p>
              <p className="text-sm font-semibold text-amber-900">Executive Director</p>
            </div>
          </div>

          {/* QR Code and Verification */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-2">Verification</p>
                <p className="text-xs text-blue-800 mb-3">
                  Scan the QR code or visit the verification URL to confirm this certificate's authenticity.
                </p>
                <div className="bg-white p-2 rounded border border-blue-200 mb-3">
                  <p className="text-xs text-blue-900 font-mono break-all">{verificationUrl}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="text-xs"
                >
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowQR(!showQR)}
                  className="p-0 h-auto"
                >
                  {showQR ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                {showQR && (
                  <img
                    src={generateQRCode()}
                    alt="Certificate QR Code"
                    className="w-24 h-24 border border-blue-300 rounded"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <>
                  <Badge className="bg-green-600">Certificate Earned</Badge>
                  <p className="text-sm text-green-700">
                    Congratulations! Your certificate is ready to download and share.
                  </p>
                </>
              ) : (
                <>
                  <Badge className="bg-blue-600">Certificate Preview</Badge>
                  <p className="text-sm text-blue-700">
                    Complete the course to earn your certificate.
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-2">
              {isCompleted && (
                <>
                  <Button size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function QrCodeScanner() {
  const [qrCode, setQrCode] = useState("");
  const [scannedData, setScannedData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const scanQrMutation = trpc.advancedAnalytics.scanQrCode.useMutation();

  const handleScanQrCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCode.trim()) {
      toast.error("Please enter or scan a QR code");
      return;
    }

    setIsScanning(true);
    try {
      const result = await scanQrMutation.mutateAsync({ qrCode });
      setScannedData(result);
      setQrCode("");
      toast.success(result.message);

      // Clear success message after 5 seconds
      setTimeout(() => setScannedData(null), 5000);
    } catch (error: any) {
      toast.error(error.message || "Failed to scan QR code");
      setScannedData(null);
    } finally {
      setIsScanning(false);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Attendance QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Input */}
          <form onSubmit={handleScanQrCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Scan or Enter QR Code
              </label>
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Point camera at QR code or paste code here..."
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="flex-1"
                  disabled={isScanning}
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isScanning || !qrCode.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? "Scanning..." : "Scan"}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Use your device camera or mobile QR scanner app to scan the code
              </p>
            </div>
          </form>

          {/* Success Message */}
          {scannedData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">
                    {scannedData.message}
                  </h3>
                  <div className="mt-2 text-sm text-green-800 space-y-1">
                    <p>
                      <strong>Course ID:</strong> {scannedData.courseId}
                    </p>
                    {scannedData.lessonId && (
                      <p>
                        <strong>Lesson ID:</strong> {scannedData.lessonId}
                      </p>
                    )}
                    <p>
                      <strong>Scanned At:</strong>{" "}
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">How to Use</h3>
                <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>
                    Allow camera access when prompted by your browser
                  </li>
                  <li>
                    Point your device camera at the QR code
                  </li>
                  <li>
                    The code will be automatically detected and submitted
                  </li>
                  <li>
                    Your attendance will be recorded immediately
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alternative Input */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Manual Entry (if camera not available)
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              If you cannot use your camera, you can manually enter the QR code
              value in the field above. The code is usually printed on the
              attendance sheet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

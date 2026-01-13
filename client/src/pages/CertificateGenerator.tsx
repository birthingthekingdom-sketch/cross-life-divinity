import { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  userName: string;
  courseName: string;
  certificateCode: string;
  issueDate: string;
  score: number;
}

export default function CertificateGenerator({
  userName,
  courseName,
  certificateCode,
  issueDate,
  score
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`${userName}-${courseName}-Certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white p-12 rounded-lg shadow-2xl mb-8"
          style={{
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            border: '8px solid #1e40af'
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-5xl font-bold text-blue-900 mb-2">Certificate of Achievement</h1>
            <p className="text-xl text-blue-700">Cross Life School of Divinity - Bridge Academy</p>
          </div>

          {/* Body */}
          <div className="mb-8">
            <p className="text-lg text-slate-700 mb-4">This is to certify that</p>
            <h2 className="text-4xl font-bold text-blue-900 mb-4 border-b-4 border-blue-900 pb-2">
              {userName}
            </h2>
            <p className="text-lg text-slate-700 mb-2">has successfully completed the</p>
            <h3 className="text-3xl font-semibold text-blue-900 mb-4">{courseName}</h3>
            <p className="text-lg text-slate-700">
              with a score of <span className="font-bold text-blue-900">{score}%</span>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 w-full flex justify-between items-end px-8">
            <div>
              <p className="text-sm text-slate-700 mb-2">Certificate Code:</p>
              <p className="font-mono text-lg font-bold text-blue-900">{certificateCode}</p>
            </div>
            <div>
              <p className="text-sm text-slate-700 mb-2">Date Issued:</p>
              <p className="text-lg font-semibold text-blue-900">
                {new Date(issueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={downloadCertificate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Download Certificate as PDF
          </button>
        </div>
      </div>
    </div>
  );
}

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Response } from 'express';

interface CertificateData {
  studentName: string;
  courseName: string;
  courseCode: string;
  completionDate: Date;
  certificateNumber: string;
  verificationToken: string;
  cpdHours: number;
}

export async function generateCertificate(data: CertificateData, res: Response) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 72, right: 72 }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificate-${data.certificateNumber}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill('#f8f9fa');

  // Decorative border
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
     .lineWidth(3)
     .stroke('#1a365d');

  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
     .lineWidth(1)
     .stroke('#d4af37');

  // CPD Accreditation Badge (top right)
  const badgeX = doc.page.width - 150;
  const badgeY = 60;
  
  doc.circle(badgeX, badgeY, 35)
     .lineWidth(2)
     .stroke('#1a365d');
  
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('CPD', badgeX - 15, badgeY - 20, { width: 30, align: 'center' });
  
  doc.fontSize(8)
     .fillColor('#666')
     .font('Helvetica')
     .text('ACCREDITED', badgeX - 25, badgeY - 5, { width: 50, align: 'center' });
  
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('STANDARDS', badgeX - 25, badgeY + 8, { width: 50, align: 'center' });

  // Header - Cross Life School of Divinity
  doc.fontSize(32)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Cross Life School of Divinity', 0, 80, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(14)
     .fillColor('#666')
     .font('Helvetica')
     .text('Online Learning Platform', 0, 120, {
       align: 'center',
       width: doc.page.width
     });

  // Certificate of Completion
  doc.fontSize(24)
     .fillColor('#d4af37')
     .font('Helvetica-Bold')
     .text('Certificate of Completion', 0, 160, {
       align: 'center',
       width: doc.page.width
     });
  
  // CPD Hours Badge
  doc.fontSize(12)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text(`${data.cpdHours} CPD Hours`, 0, 190, {
       align: 'center',
       width: doc.page.width
     });

  // Decorative line
  doc.moveTo(doc.page.width / 2 - 100, 220)
     .lineTo(doc.page.width / 2 + 100, 220)
     .lineWidth(2)
     .stroke('#d4af37');

  // This certifies that
  doc.fontSize(14)
     .fillColor('#333')
     .font('Helvetica')
     .text('This certifies that', 0, 245, {
       align: 'center',
       width: doc.page.width
     });

  // Student Name
  doc.fontSize(28)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text(data.studentName, 0, 270, {
       align: 'center',
       width: doc.page.width
     });

  // Has successfully completed
  doc.fontSize(14)
     .fillColor('#333')
     .font('Helvetica')
     .text('has successfully completed', 0, 305, {
       align: 'center',
       width: doc.page.width
     });

  // Course Name
  doc.fontSize(20)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text(data.courseName, 0, 330, {
       align: 'center',
       width: doc.page.width
     });

  // Course Code
  doc.fontSize(12)
     .fillColor('#666')
     .font('Helvetica')
     .text(`Course Code: ${data.courseCode}`, 0, 360, {
       align: 'center',
       width: doc.page.width
     });

  // Completion Date
  const formattedDate = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.fontSize(12)
     .fillColor('#333')
     .text(`Completed on ${formattedDate}`, 0, 400, {
       align: 'center',
       width: doc.page.width
     });

  // Signature line
  const signatureY = 450;
  const signatureWidth = 200;
  const leftSignatureX = doc.page.width / 2 - signatureWidth - 40;

  doc.moveTo(leftSignatureX, signatureY)
     .lineTo(leftSignatureX + signatureWidth, signatureY)
     .stroke('#333');

  doc.fontSize(10)
     .fillColor('#666')
     .text('Director, Cross Life School of Divinity', leftSignatureX, signatureY + 10, {
       width: signatureWidth,
       align: 'center'
     });

  // Generate QR Code for verification
  const verificationUrl = `https://cross-life-divinity.manus.space/verify/${data.verificationToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 80,
    margin: 1,
    color: {
      dark: '#1a365d',
      light: '#f8f9fa'
    }
  });

  // Add QR Code (bottom left)
  const qrX = 80;
  const qrY = doc.page.height - 130;
  doc.image(qrCodeDataUrl, qrX, qrY, { width: 70, height: 70 });

  doc.fontSize(8)
     .fillColor('#666')
     .text('Scan to verify', qrX - 5, qrY + 75, {
       width: 80,
       align: 'center'
     });

  // Certificate Number and CPD Info (bottom center/right)
  doc.fontSize(8)
     .fillColor('#999')
     .text(`Certificate No: ${data.certificateNumber}`, 0, doc.page.height - 90, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(8)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text(`CPD Hours: ${data.cpdHours} | Self-Paced Learning`, 0, doc.page.height - 75, {
       align: 'center',
       width: doc.page.width
     });

  // Footer
  doc.fontSize(8)
     .fillColor('#999')
     .font('Helvetica')
     .text('This certificate verifies completion of all course requirements and meets CPD Accredited Standards', 0, doc.page.height - 55, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(7)
     .fillColor('#999')
     .text(`Verify at: ${verificationUrl}`, 0, doc.page.height - 40, {
       align: 'center',
       width: doc.page.width
     });

  // Finalize the PDF
  doc.end();
}

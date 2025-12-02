import PDFDocument from 'pdfkit';
import type { Response } from 'express';

interface CertificateData {
  studentName: string;
  courseName: string;
  courseCode: string;
  completionDate: Date;
  certificateNumber: string;
}

export function generateCertificate(data: CertificateData, res: Response) {
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
     .text('Certificate of Completion', 0, 170, {
       align: 'center',
       width: doc.page.width
     });

  // Decorative line
  doc.moveTo(doc.page.width / 2 - 100, 210)
     .lineTo(doc.page.width / 2 + 100, 210)
     .lineWidth(2)
     .stroke('#d4af37');

  // This certifies that
  doc.fontSize(14)
     .fillColor('#333')
     .font('Helvetica')
     .text('This certifies that', 0, 240, {
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
     .text('has successfully completed', 0, 310, {
       align: 'center',
       width: doc.page.width
     });

  // Course Name
  doc.fontSize(20)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text(data.courseName, 0, 340, {
       align: 'center',
       width: doc.page.width
     });

  // Course Code
  doc.fontSize(12)
     .fillColor('#666')
     .font('Helvetica')
     .text(`Course Code: ${data.courseCode}`, 0, 370, {
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
     .text(`Completed on ${formattedDate}`, 0, 420, {
       align: 'center',
       width: doc.page.width
     });

  // Signature line
  const signatureY = 470;
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

  // Certificate Number
  doc.fontSize(8)
     .fillColor('#999')
     .text(`Certificate No: ${data.certificateNumber}`, 0, doc.page.height - 70, {
       align: 'center',
       width: doc.page.width
     });

  // Footer
  doc.fontSize(8)
     .fillColor('#999')
     .text('This certificate verifies completion of all course requirements', 0, doc.page.height - 50, {
       align: 'center',
       width: doc.page.width
     });

  // Finalize the PDF
  doc.end();
}

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

  // Cream/ivory parchment background (exact GCU color)
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill('#f5f1e8');

  // Simple single navy border (GCU style - clean and minimal)
  const borderMargin = 50;
  doc.rect(borderMargin, borderMargin, doc.page.width - (borderMargin * 2), doc.page.height - (borderMargin * 2))
     .lineWidth(3)
     .stroke('#1a365d');

  // Header - VERY BOLD like GCU (Times-Bold at large size)
  doc.fontSize(48)
     .fillColor('#1a365d')
     .font('Times-Bold')
     .text('Cross Life School of Divinity', 0, 100, {
       align: 'center',
       width: doc.page.width
     });

  // Location - smaller, simple
  doc.fontSize(14)
     .fillColor('#666')
     .font('Times-Roman')
     .text('Chicago, Illinois', 0, 155, {
       align: 'center',
       width: doc.page.width
     });

  // Simple decorative line (very minimal like GCU)
  doc.moveTo(doc.page.width / 2 - 100, 185)
     .lineTo(doc.page.width / 2 + 100, 185)
     .lineWidth(0.5)
     .stroke('#d4af37');

  // Formal certificate text
  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Roman')
     .text('This is to certify that', 0, 210, {
       align: 'center',
       width: doc.page.width
     });

  // Student Name (large, prominent, italic)
  doc.fontSize(36)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.studentName, 0, 240, {
       align: 'center',
       width: doc.page.width
     });

  // Underline for name
  doc.moveTo(doc.page.width / 2 - 220, 280)
     .lineTo(doc.page.width / 2 + 220, 280)
     .lineWidth(0.5)
     .stroke('#333');

  // Completion text
  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('having successfully completed all requirements and demonstrated', 0, 295, {
       align: 'center',
       width: doc.page.width
     });

  doc.text('proficiency in the prescribed course of study', 0, 313, {
    align: 'center',
    width: doc.page.width
  });

  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Bold')
     .text('is hereby awarded this', 0, 340, {
       align: 'center',
       width: doc.page.width
     });

  // Certificate title (gold, bold)
  doc.fontSize(24)
     .fillColor('#d4af37')
     .font('Times-Bold')
     .text('Certificate of Completion', 0, 368, {
       align: 'center',
       width: doc.page.width
     });

  // Course Name (navy, bold italic)
  doc.fontSize(20)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.courseName, 0, 400, {
       align: 'center',
       width: doc.page.width
     });

  // Course Code and CLAC Hours
  doc.fontSize(11)
     .fillColor('#666')
     .font('Times-Roman')
     .text(`${data.courseCode} • ${data.cpdHours} CLAC Hours`, 0, 428, {
       align: 'center',
       width: doc.page.width
     });

  // Rights and privileges statement
  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text('with all the rights, honors, and privileges thereunto appertaining.', 0, 450, {
       align: 'center',
       width: doc.page.width
     });

  // Date statement
  const dateParts = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).split(' ');
  const month = dateParts[0];
  const day = dateParts[1].replace(',', '');
  const year = dateParts[2];

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text(`Given at Chicago, Illinois, on the ${day} day of ${month}, ${year}.`, 0, 472, {
       align: 'center',
       width: doc.page.width
     });

  // CLAC Accreditation statement (centered, above signatures)
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Accredited by the Cross Life Accreditation Council (CLAC)', 0, 500, {
       align: 'center',
       width: doc.page.width
     });

  // Signature lines (GCU style - clean and simple)
  const signatureY = 530;
  const signatureWidth = 200;
  const leftSignatureX = doc.page.width / 2 - signatureWidth - 40;
  const rightSignatureX = doc.page.width / 2 + 40;

  // Left signature line (Director)
  doc.moveTo(leftSignatureX, signatureY)
     .lineTo(leftSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Director', leftSignatureX, signatureY + 10, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(9)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', leftSignatureX, signatureY + 26, {
       width: signatureWidth,
       align: 'center'
     });

  // Right signature line (Academic Dean)
  doc.moveTo(rightSignatureX, signatureY)
     .lineTo(rightSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Academic Dean', rightSignatureX, signatureY + 10, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(9)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', rightSignatureX, signatureY + 26, {
       width: signatureWidth,
       align: 'center'
     });

  // CLSD Seal at bottom center (ONLY seal on page - like GCU)
  const bottomSealY = doc.page.height - 80;
  const bottomSealX = doc.page.width / 2;
  
  // Outer circle - navy (thicker like GCU)
  doc.circle(bottomSealX, bottomSealY, 32)
     .lineWidth(3)
     .stroke('#1a365d');
  
  // Inner circle - gold
  doc.circle(bottomSealX, bottomSealY, 27)
     .lineWidth(1.5)
     .stroke('#d4af37');
  
  // CLSD text in seal
  doc.fontSize(12)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('CLSD', bottomSealX - 20, bottomSealY - 16, { width: 40, align: 'center' });
  
  doc.fontSize(7)
     .fillColor('#666')
     .font('Helvetica')
     .text('EST. 1994', bottomSealX - 20, bottomSealY, { width: 40, align: 'center' });
  
  doc.fontSize(6)
     .fillColor('#d4af37')
     .font('Helvetica-Bold')
     .text('CHICAGO', bottomSealX - 20, bottomSealY + 14, { width: 40, align: 'center' });

  // Generate QR Code for verification
  const verificationUrl = `https://crosslifeschoolofdivinity.org/verify/${data.verificationToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 50,
    margin: 0,
    color: {
      dark: '#1a365d',
      light: '#f5f1e8'
    }
  });

  // Add QR Code (bottom right corner - small and unobtrusive)
  const qrX = doc.page.width - 90;
  const qrY = doc.page.height - 75;
  doc.image(qrCodeDataUrl, qrX, qrY, { width: 40, height: 40 });

  doc.fontSize(6)
     .fillColor('#999')
     .font('Helvetica')
     .text('Scan to verify', qrX - 5, qrY + 42, {
       width: 50,
       align: 'center'
     });

  // Certificate Number (bottom left - small and subtle)
  doc.fontSize(7)
     .fillColor('#999')
     .font('Helvetica')
     .text(`Certificate No: ${data.certificateNumber}`, 60, doc.page.height - 65, {
       width: 200,
       align: 'left'
     });

  doc.fontSize(6)
     .fillColor('#999')
     .text(`Verify at: crosslifeschoolofdivinity.org/verify`, 60, doc.page.height - 52, {
       width: 250,
       align: 'left'
     });

  // Finalize the PDF
  doc.end();
}

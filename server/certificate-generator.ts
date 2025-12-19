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

  // Cream/ivory parchment background
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill('#faf8f3');

  // Outer gold border (double-line style)
  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
     .lineWidth(3)
     .stroke('#d4af37');

  doc.rect(48, 48, doc.page.width - 96, doc.page.height - 96)
     .lineWidth(1)
     .stroke('#d4af37');

  // Inner navy border
  doc.rect(56, 56, doc.page.width - 112, doc.page.height - 112)
     .lineWidth(1)
     .stroke('#1a365d');

  // Decorative corner elements (optional - simple gold squares)
  const cornerSize = 15;
  const cornerOffset = 44;
  
  // Top-left corner
  doc.rect(cornerOffset, cornerOffset, cornerSize, cornerSize)
     .fill('#d4af37');
  
  // Top-right corner
  doc.rect(doc.page.width - cornerOffset - cornerSize, cornerOffset, cornerSize, cornerSize)
     .fill('#d4af37');
  
  // Bottom-left corner
  doc.rect(cornerOffset, doc.page.height - cornerOffset - cornerSize, cornerSize, cornerSize)
     .fill('#d4af37');
  
  // Bottom-right corner
  doc.rect(doc.page.width - cornerOffset - cornerSize, doc.page.height - cornerOffset - cornerSize, cornerSize, cornerSize)
     .fill('#d4af37');

  // CLSD Logo/Seal placeholder at top center
  const sealX = doc.page.width / 2;
  const sealY = 90;
  
  // Outer circle
  doc.circle(sealX, sealY, 40)
     .lineWidth(2)
     .stroke('#1a365d');
  
  // Inner circle
  doc.circle(sealX, sealY, 35)
     .lineWidth(1)
     .stroke('#d4af37');
  
  // CLSD text in seal
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('CLSD', sealX - 20, sealY - 18, { width: 40, align: 'center' });
  
  doc.fontSize(7)
     .fillColor('#1a365d')
     .font('Helvetica')
     .text('EST. 1994', sealX - 20, sealY - 2, { width: 40, align: 'center' });
  
  doc.fontSize(6)
     .fillColor('#d4af37')
     .font('Helvetica-Bold')
     .text('CHICAGO', sealX - 20, sealY + 10, { width: 40, align: 'center' });

  // Header - Cross Life School of Divinity (Old English style - simulated with bold)
  doc.fontSize(36)
     .fillColor('#1a365d')
     .font('Times-Bold')
     .text('Cross Life School of Divinity', 0, 150, {
       align: 'center',
       width: doc.page.width
     });

  // Location
  doc.fontSize(12)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Chicago, Illinois', 0, 190, {
       align: 'center',
       width: doc.page.width
     });

  // Decorative line
  doc.moveTo(doc.page.width / 2 - 150, 215)
     .lineTo(doc.page.width / 2 + 150, 215)
     .lineWidth(1)
     .stroke('#d4af37');

  // Formal certificate text
  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('This is to certify that', 0, 235, {
       align: 'center',
       width: doc.page.width
     });

  // Student Name (larger, prominent)
  doc.fontSize(32)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.studentName, 0, 260, {
       align: 'center',
       width: doc.page.width
     });

  // Underline for name
  doc.moveTo(doc.page.width / 2 - 200, 295)
     .lineTo(doc.page.width / 2 + 200, 295)
     .lineWidth(0.5)
     .stroke('#333');

  // Completion text
  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('having successfully completed all requirements and demonstrated', 0, 310, {
       align: 'center',
       width: doc.page.width
     });

  doc.text('proficiency in the prescribed course of study', 0, 328, {
    align: 'center',
    width: doc.page.width
  });

  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Bold')
     .text('is hereby awarded this', 0, 355, {
       align: 'center',
       width: doc.page.width
     });

  // Certificate title
  doc.fontSize(22)
     .fillColor('#d4af37')
     .font('Times-Bold')
     .text('Certificate of Completion', 0, 380, {
       align: 'center',
       width: doc.page.width
     });

  // Course Name
  doc.fontSize(18)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.courseName, 0, 410, {
       align: 'center',
       width: doc.page.width
     });

  // Course Code and CLAC Hours
  doc.fontSize(11)
     .fillColor('#666')
     .font('Times-Roman')
     .text(`${data.courseCode} • ${data.cpdHours} CLAC Hours`, 0, 438, {
       align: 'center',
       width: doc.page.width
     });

  // Rights and privileges statement
  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text('with all the rights, honors, and privileges thereunto appertaining.', 0, 460, {
       align: 'center',
       width: doc.page.width
     });

  // Date statement
  const formattedDate = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text(`Given at Chicago, Illinois, on the ${formattedDate.split(',')[1].trim()} day of ${formattedDate.split(' ')[0]}, ${data.completionDate.getFullYear()}.`, 0, 485, {
       align: 'center',
       width: doc.page.width
     });

  // Signature section
  const signatureY = 520;
  const signatureWidth = 180;
  const leftSignatureX = doc.page.width / 2 - signatureWidth - 50;
  const rightSignatureX = doc.page.width / 2 + 50;

  // Left signature line (Director)
  doc.moveTo(leftSignatureX, signatureY)
     .lineTo(leftSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(9)
     .fillColor('#333')
     .font('Times-Roman')
     .text('Director', leftSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(8)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', leftSignatureX, signatureY + 22, {
       width: signatureWidth,
       align: 'center'
     });

  // Right signature line (Academic Dean)
  doc.moveTo(rightSignatureX, signatureY)
     .lineTo(rightSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(9)
     .fillColor('#333')
     .font('Times-Roman')
     .text('Academic Dean', rightSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(8)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', rightSignatureX, signatureY + 22, {
       width: signatureWidth,
       align: 'center'
     });

  // CLAC Accreditation statement at bottom
  doc.fontSize(9)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Accredited by the Cross Life Accreditation Council (CLAC)', 0, doc.page.height - 100, {
       align: 'center',
       width: doc.page.width
     });

  // Generate QR Code for verification
  const verificationUrl = `https://cross-life-divinity.manus.space/verify/${data.verificationToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 60,
    margin: 0,
    color: {
      dark: '#1a365d',
      light: '#faf8f3'
    }
  });

  // Add QR Code (bottom right)
  const qrX = doc.page.width - 120;
  const qrY = doc.page.height - 100;
  doc.image(qrCodeDataUrl, qrX, qrY, { width: 50, height: 50 });

  doc.fontSize(7)
     .fillColor('#666')
     .font('Helvetica')
     .text('Scan to verify', qrX - 5, qrY + 55, {
       width: 60,
       align: 'center'
     });

  // Certificate Number (bottom left)
  doc.fontSize(8)
     .fillColor('#999')
     .font('Helvetica')
     .text(`Certificate No: ${data.certificateNumber}`, 80, doc.page.height - 80, {
       width: 200,
       align: 'left'
     });

  doc.fontSize(7)
     .fillColor('#999')
     .text(`Verify at: crosslifeschoolofdivinity.org/verify`, 80, doc.page.height - 65, {
       width: 250,
       align: 'left'
     });

  // Finalize the PDF
  doc.end();
}

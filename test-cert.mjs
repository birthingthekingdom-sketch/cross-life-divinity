import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateCertificate(data, outputPath) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 72, right: 72 }
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Page dimensions
  const pageWidth = doc.page.width;  // 792
  const pageHeight = doc.page.height; // 612
  const centerX = pageWidth / 2;

  // Cream/ivory parchment background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#f5f1e8');

  // Simple single navy border
  const borderMargin = 50;
  doc.rect(borderMargin, borderMargin, pageWidth - (borderMargin * 2), pageHeight - (borderMargin * 2))
     .lineWidth(3)
     .stroke('#1a365d');

  // CAREFULLY CALCULATED VERTICAL LAYOUT - No overlapping!
  
  // Institution name - Elegant with letter spacing (52pt + spacing = ~60px height)
  doc.fontSize(52)
     .fillColor('#1a365d')
     .font('Times-Bold')
     .text('Cross Life School of Divinity', 0, 90, {
       align: 'center',
       width: pageWidth,
       characterSpacing: 1.5
     });

  // Location (14pt = ~17px height)
  doc.fontSize(14)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Chicago, Illinois', 0, 160, {
       align: 'center',
       width: pageWidth
     });

  // Decorative line
  doc.moveTo(centerX - 100, 185)
     .lineTo(centerX + 100, 185)
     .lineWidth(0.5)
     .stroke('#d4af37');

  // "This is to certify that" (14pt)
  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Roman')
     .text('This is to certify that', 0, 200, {
       align: 'center',
       width: pageWidth
     });

  // Student Name (38pt = ~45px height)
  doc.fontSize(38)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.studentName, 0, 225, {
       align: 'center',
       width: pageWidth
     });

  // Underline for name
  doc.moveTo(centerX - 240, 275)
     .lineTo(centerX + 240, 275)
     .lineWidth(0.5)
     .stroke('#333');

  // Completion text (13pt, 2 lines = ~32px)
  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('having successfully completed all requirements and demonstrated', 0, 285, {
       align: 'center',
       width: pageWidth
     });

  doc.text('proficiency in the prescribed course of study', 0, 303, {
    align: 'center',
    width: pageWidth
  });

  // "is hereby awarded this" (14pt)
  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Bold')
     .text('is hereby awarded this', 0, 328, {
       align: 'center',
       width: pageWidth
     });

  // Certificate title (26pt)
  doc.fontSize(26)
     .fillColor('#d4af37')
     .font('Times-Bold')
     .text('Certificate of Completion', 0, 353, {
       align: 'center',
       width: pageWidth,
       characterSpacing: 0.5
     });

  // Course Name (21pt)
  doc.fontSize(21)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.courseName, 0, 385, {
       align: 'center',
       width: pageWidth
     });

  // Course Code and CLAC Hours (11pt)
  doc.fontSize(11)
     .fillColor('#666')
     .font('Times-Roman')
     .text(`${data.courseCode} • ${data.cpdHours} CLAC Hours`, 0, 413, {
       align: 'center',
       width: pageWidth
     });

  // Rights and privileges (11pt)
  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text('with all the rights, honors, and privileges thereunto appertaining.', 0, 433, {
       align: 'center',
       width: pageWidth
     });

  // Date (11pt)
  const month = 'December';
  const day = '15th';
  const year = '2024';

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text(`Given at Chicago, Illinois, on the ${day} day of ${month}, ${year}.`, 0, 453, {
       align: 'center',
       width: pageWidth
     });

  // CLAC Accreditation (10pt)
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Accredited by the Cross Life Accreditation Council (CLAC)', 0, 475, {
       align: 'center',
       width: pageWidth
     });

  // Signatures - positioned to leave room for seal below
  const signatureY = 500;
  const signatureWidth = 200;
  const leftSignatureX = centerX - signatureWidth - 40;
  const rightSignatureX = centerX + 40;

  // Left signature (Director)
  doc.moveTo(leftSignatureX, signatureY)
     .lineTo(leftSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Director', leftSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(9)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', leftSignatureX, signatureY + 24, {
       width: signatureWidth,
       align: 'center'
     });

  // Right signature (Academic Dean)
  doc.moveTo(rightSignatureX, signatureY)
     .lineTo(rightSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Academic Dean', rightSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(9)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', rightSignatureX, signatureY + 24, {
       width: signatureWidth,
       align: 'center'
     });

  // Seal at bottom center - BELOW signatures, not overlapping
  // Page height is 612, border is at 562, seal needs to be inside
  const bottomSealY = 555;
  
  doc.circle(centerX, bottomSealY, 30)
     .lineWidth(3)
     .stroke('#1a365d');
  
  doc.circle(centerX, bottomSealY, 25)
     .lineWidth(1.5)
     .stroke('#d4af37');
  
  doc.fontSize(11)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('CLSD', centerX - 18, bottomSealY - 14, { width: 36, align: 'center' });
  
  doc.fontSize(6)
     .fillColor('#666')
     .font('Helvetica')
     .text('EST. 1994', centerX - 18, bottomSealY + 1, { width: 36, align: 'center' });
  
  doc.fontSize(6)
     .fillColor('#d4af37')
     .font('Helvetica-Bold')
     .text('CHICAGO', centerX - 18, bottomSealY + 12, { width: 36, align: 'center' });

  // QR Code (bottom right)
  const qrCodeDataUrl = await QRCode.toDataURL('https://crosslifeschoolofdivinity.org/verify/abc123', {
    width: 50, margin: 0, color: { dark: '#1a365d', light: '#f5f1e8' }
  });

  const qrX = pageWidth - 85;
  const qrY = pageHeight - 65;
  doc.image(qrCodeDataUrl, qrX, qrY, { width: 35, height: 35 });

  doc.fontSize(5)
     .fillColor('#999')
     .font('Helvetica')
     .text('Scan to verify', qrX - 3, qrY + 37, {
       width: 41,
       align: 'center'
     });

  // Certificate Number (bottom left)
  doc.fontSize(7)
     .fillColor('#999')
     .font('Helvetica')
     .text(`Certificate No: ${data.certificateNumber}`, 60, pageHeight - 55, {
       width: 200,
       align: 'left'
     });

  doc.fontSize(6)
     .fillColor('#999')
     .text(`Verify at: crosslifeschoolofdivinity.org/verify`, 60, pageHeight - 42, {
       width: 250,
       align: 'left'
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

const sampleData = {
  studentName: 'John David Anderson',
  courseName: 'Introduction to Theology',
  courseCode: 'DIV101',
  completionDate: new Date('2024-12-15'),
  certificateNumber: 'CLAC-CLSD-2024-00123',
  verificationToken: 'abc123xyz',
  cpdHours: 20
};

const outputPath = '/home/ubuntu/sample-certificate-final.pdf';

generateCertificate(sampleData, outputPath)
  .then(() => console.log('Final certificate generated:', outputPath))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

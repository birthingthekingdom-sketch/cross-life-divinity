import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateAwardOfMerit(data, outputPath) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 72, right: 72 }
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Page dimensions
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const centerX = pageWidth / 2;

  // Cream/ivory parchment background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#f5f1e8');

  // Simple single navy border
  const borderMargin = 50;
  doc.rect(borderMargin, borderMargin, pageWidth - (borderMargin * 2), pageHeight - (borderMargin * 2))
     .lineWidth(3)
     .stroke('#1a365d');

  // Institution name - Elegant with letter spacing
  doc.fontSize(52)
     .fillColor('#1a365d')
     .font('Times-Bold')
     .text('Cross Life School of Divinity', 0, 90, {
       align: 'center',
       width: pageWidth,
       characterSpacing: 1.5
     });

  // Location
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

  // Award title - prominent and elegant
  doc.fontSize(32)
     .fillColor('#d4af37')
     .font('Times-Bold')
     .text('Award of Merit', 0, 205, {
       align: 'center',
       width: pageWidth,
       characterSpacing: 1
     });

  // "Presented to"
  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Roman')
     .text('Presented to', 0, 250, {
       align: 'center',
       width: pageWidth
     });

  // Recipient Name
  doc.fontSize(38)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.recipientName, 0, 275, {
       align: 'center',
       width: pageWidth
     });

  // Underline for name
  doc.moveTo(centerX - 240, 325)
     .lineTo(centerX + 240, 325)
     .lineWidth(0.5)
     .stroke('#333');

  // Recognition text
  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('in recognition of outstanding achievement and exemplary dedication', 0, 340, {
       align: 'center',
       width: pageWidth
     });

  doc.text('in the field of theological studies and ministry', 0, 358, {
    align: 'center',
    width: pageWidth
  });

  // Achievement description
  doc.fontSize(18)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.achievementDescription, 0, 390, {
       align: 'center',
       width: pageWidth
     });

  // Additional recognition
  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text('This award acknowledges exceptional performance, leadership,', 0, 425, {
       align: 'center',
       width: pageWidth
     });

  doc.text('and commitment to excellence in theological education.', 0, 443, {
    align: 'center',
    width: pageWidth
  });

  // Date
  const month = 'December';
  const day = '19th';
  const year = '2024';

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text(`Awarded at Chicago, Illinois, on the ${day} day of ${month}, ${year}.`, 0, 468, {
       align: 'center',
       width: pageWidth
     });

  // CLAC Accreditation
  doc.fontSize(10)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Cross Life School of Divinity', 0, 493, {
       align: 'center',
       width: pageWidth
     });

  // Signatures
  const signatureY = 520;
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

  // Seal at bottom center
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

  // QR Code
  const qrCodeDataUrl = await QRCode.toDataURL(`https://crosslifeschoolofdivinity.org/verify/${data.awardId}`, {
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

  // Award Number
  doc.fontSize(7)
     .fillColor('#999')
     .font('Helvetica')
     .text(`Award No: ${data.awardId}`, 60, pageHeight - 55, {
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
  recipientName: 'Sarah Elizabeth Thompson',
  achievementDescription: 'Excellence in Biblical Studies and Pastoral Leadership',
  awardId: 'CLAC-MERIT-2024-00456'
};

const outputPath = '/home/ubuntu/sample-award-of-merit.pdf';

generateAwardOfMerit(sampleData, outputPath)
  .then(() => console.log('Award of Merit generated:', outputPath))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });

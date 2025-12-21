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

  // Cream/ivory parchment background (matching GCU)
  doc.rect(0, 0, doc.page.width, doc.page.height)
     .fill('#f5f1e8');

  // Simple navy border (GCU-style - single clean border)
  const borderMargin = 45;
  doc.rect(borderMargin, borderMargin, doc.page.width - (borderMargin * 2), doc.page.height - (borderMargin * 2))
     .lineWidth(2)
     .stroke('#1a365d');

  // Inner thin gold line
  const innerBorder = borderMargin + 8;
  doc.rect(innerBorder, innerBorder, doc.page.width - (innerBorder * 2), doc.page.height - (innerBorder * 2))
     .lineWidth(0.5)
     .stroke('#d4af37');

  // Try to add logo, fallback to seal
  const logoPath = path.join(__dirname, 'client', 'public', 'clsd-logo.png');
  try {
    if (fs.existsSync(logoPath)) {
      const logoSize = 60;
      const logoX = (doc.page.width / 2) - (logoSize / 2);
      const logoY = 75;
      doc.image(logoPath, logoX, logoY, { 
        width: logoSize, 
        height: logoSize,
        fit: [logoSize, logoSize],
        align: 'center'
      });
    } else {
      throw new Error('Logo not found');
    }
  } catch (error) {
    // Draw simple seal
    const sealX = doc.page.width / 2;
    const sealY = 105;
    
    doc.circle(sealX, sealY, 30)
       .lineWidth(2)
       .stroke('#1a365d');
    
    doc.circle(sealX, sealY, 26)
       .lineWidth(1)
       .stroke('#d4af37');
    
    doc.fontSize(9)
       .fillColor('#1a365d')
       .font('Helvetica-Bold')
       .text('CLSD', sealX - 15, sealY - 12, { width: 30, align: 'center' });
    
    doc.fontSize(6)
       .fillColor('#666')
       .font('Helvetica')
       .text('EST. 1994', sealX - 15, sealY + 2, { width: 30, align: 'center' });
  }

  // Header - BOLD like GCU
  doc.fontSize(42)
     .fillColor('#1a365d')
     .font('Times-Bold')
     .text('Cross Life School of Divinity', 0, 155, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(13)
     .fillColor('#666')
     .font('Times-Roman')
     .text('Chicago, Illinois', 0, 202, {
       align: 'center',
       width: doc.page.width
     });

  doc.moveTo(doc.page.width / 2 - 120, 230)
     .lineTo(doc.page.width / 2 + 120, 230)
     .lineWidth(0.5)
     .stroke('#d4af37');

  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('This is to certify that', 0, 250, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(34)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.studentName, 0, 275, {
       align: 'center',
       width: doc.page.width
     });

  doc.moveTo(doc.page.width / 2 - 200, 312)
     .lineTo(doc.page.width / 2 + 200, 312)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(13)
     .fillColor('#333')
     .font('Times-Roman')
     .text('having successfully completed all requirements and demonstrated', 0, 328, {
       align: 'center',
       width: doc.page.width
     });

  doc.text('proficiency in the prescribed course of study', 0, 346, {
    align: 'center',
    width: doc.page.width
  });

  doc.fontSize(14)
     .fillColor('#333')
     .font('Times-Bold')
     .text('is hereby awarded this', 0, 373, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(22)
     .fillColor('#d4af37')
     .font('Times-Bold')
     .text('Certificate of Completion', 0, 398, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(18)
     .fillColor('#1a365d')
     .font('Times-BoldItalic')
     .text(data.courseName, 0, 428, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(11)
     .fillColor('#666')
     .font('Times-Roman')
     .text(`${data.courseCode} • ${data.cpdHours} CLAC Hours`, 0, 456, {
       align: 'center',
       width: doc.page.width
     });

  doc.fontSize(11)
     .fillColor('#333')
     .font('Times-Italic')
     .text('with all the rights, honors, and privileges thereunto appertaining.', 0, 478, {
       align: 'center',
       width: doc.page.width
     });

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
     .text(`Given at Chicago, Illinois, on the ${day} day of ${month}, ${year}.`, 0, 503, {
       align: 'center',
       width: doc.page.width
     });

  // Seal at bottom center (GCU style)
  const bottomSealY = doc.page.height - 130;
  const bottomSealX = doc.page.width / 2;
  
  doc.circle(bottomSealX, bottomSealY, 35)
     .lineWidth(2.5)
     .stroke('#1a365d');
  
  doc.circle(bottomSealX, bottomSealY, 30)
     .lineWidth(1.5)
     .stroke('#d4af37');
  
  doc.fontSize(11)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('CLSD', bottomSealX - 20, bottomSealY - 18, { width: 40, align: 'center' });
  
  doc.fontSize(7)
     .fillColor('#666')
     .font('Helvetica')
     .text('EST. 1994', bottomSealX - 20, bottomSealY - 2, { width: 40, align: 'center' });
  
  doc.fontSize(6)
     .fillColor('#d4af37')
     .font('Helvetica-Bold')
     .text('CHICAGO', bottomSealX - 20, bottomSealY + 12, { width: 40, align: 'center' });

  // Signatures
  const signatureY = doc.page.height - 210;
  const signatureWidth = 180;
  const leftSignatureX = doc.page.width / 2 - signatureWidth - 60;
  const rightSignatureX = doc.page.width / 2 + 60;

  doc.fontSize(9)
     .fillColor('#1a365d')
     .font('Helvetica-Bold')
     .text('Accredited by the Cross Life Accreditation Council (CLAC)', 0, signatureY - 25, {
       align: 'center',
       width: doc.page.width
     });

  doc.moveTo(leftSignatureX, signatureY)
     .lineTo(leftSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(10)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Director', leftSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(8)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', leftSignatureX, signatureY + 24, {
       width: signatureWidth,
       align: 'center'
     });

  doc.moveTo(rightSignatureX, signatureY)
     .lineTo(rightSignatureX + signatureWidth, signatureY)
     .lineWidth(0.5)
     .stroke('#333');

  doc.fontSize(10)
     .fillColor('#333')
     .font('Times-Bold')
     .text('Academic Dean', rightSignatureX, signatureY + 8, {
       width: signatureWidth,
       align: 'center'
     });

  doc.fontSize(8)
     .fillColor('#666')
     .font('Times-Italic')
     .text('Cross Life School of Divinity', rightSignatureX, signatureY + 24, {
       width: signatureWidth,
       align: 'center'
     });

  // QR Code
  const verificationUrl = `https://crosslifeschoolofdivinity.org/verify/${data.verificationToken}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 60,
    margin: 0,
    color: {
      dark: '#1a365d',
      light: '#f5f1e8'
    }
  });

  const qrX = doc.page.width - 100;
  const qrY = doc.page.height - 90;
  doc.image(qrCodeDataUrl, qrX, qrY, { width: 45, height: 45 });

  doc.fontSize(6)
     .fillColor('#666')
     .font('Helvetica')
     .text('Scan to verify', qrX - 8, qrY + 48, {
       width: 60,
       align: 'center'
     });

  doc.fontSize(7)
     .fillColor('#999')
     .font('Helvetica')
     .text(`Certificate No: ${data.certificateNumber}`, 65, doc.page.height - 75, {
       width: 200,
       align: 'left'
     });

  doc.fontSize(6)
     .fillColor('#999')
     .text(`Verify at: crosslifeschoolofdivinity.org/verify`, 65, doc.page.height - 62, {
       width: 250,
       align: 'left'
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

// Generate sample certificate
const sampleData = {
  studentName: 'John David Anderson',
  courseName: 'Introduction to Theology',
  courseCode: 'DIV101',
  completionDate: new Date('2024-12-15'),
  certificateNumber: 'CLAC-CLSD-2024-00123',
  verificationToken: 'abc123xyz',
  cpdHours: 20
};

const outputPath = '/home/ubuntu/sample-certificate-gcu-style.pdf';

generateCertificate(sampleData, outputPath)
  .then(() => {
    console.log('Certificate generated successfully:', outputPath);
  })
  .catch(error => {
    console.error('Error generating certificate:', error);
    process.exit(1);
  });

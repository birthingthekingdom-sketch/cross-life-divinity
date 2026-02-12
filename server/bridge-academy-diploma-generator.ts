import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Response } from 'express';

interface SubjectScore {
  courseCode: string;
  courseName: string;
  score: number;
  completionDate: Date;
  topicsCompleted: number;
  totalTopics: number;
}

interface DiplomaData {
  studentName: string;
  certificateNumber: string;
  verificationToken: string;
  completionDate: Date;
  averageScore: number;
  subjects: SubjectScore[];
  schoolName?: string;
  schoolLogo?: string;
}

interface TranscriptData {
  studentName: string;
  certificateNumber: string;
  completionDate: Date;
  averageScore: number;
  subjects: SubjectScore[];
  schoolName?: string;
}

export async function generateBridgeAcademyDiploma(data: DiplomaData, res: Response) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 72, right: 72 }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=bridge-academy-diploma-${data.certificateNumber}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height)
    .fill('#f5f5f5');

  // Decorative border - Gold and Navy
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
    .lineWidth(4)
    .stroke('#1a365d'); // Navy

  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
    .lineWidth(2)
    .stroke('#d4af37'); // Gold

  // GED Preparation Badge (top right)
  const badgeX = doc.page.width - 140;
  const badgeY = 70;
  
  doc.circle(badgeX, badgeY, 40)
    .lineWidth(2)
    .stroke('#d4af37');
  
  doc.fontSize(11)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('GED PREP', badgeX - 20, badgeY - 25, { width: 40, align: 'center' });
  
  doc.fontSize(9)
    .fillColor('#666')
    .font('Helvetica')
    .text('COMPLETION', badgeX - 25, badgeY + 5, { width: 50, align: 'center' });

  // Header - School Name
  doc.fontSize(36)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.schoolName || 'Cross Life School of Divinity', 0, 85, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(16)
    .fillColor('#666')
    .font('Helvetica-Italic')
    .text('Bridge Academy - GED Preparation Program', 0, 130, {
      align: 'center',
      width: doc.page.width
    });

  // Main Title
  doc.fontSize(28)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Diploma of Completion', 0, 170, {
      align: 'center',
      width: doc.page.width
    });

  // Decorative line
  doc.moveTo(150, 210)
    .lineTo(doc.page.width - 150, 210)
    .stroke('#d4af37');

  // Student Name
  doc.fontSize(24)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.studentName, 0, 230, {
      align: 'center',
      width: doc.page.width
    });

  // Completion Statement
  doc.fontSize(12)
    .fillColor('#333')
    .font('Helvetica')
    .text('Has successfully completed the Bridge Academy GED Preparation Program', 0, 270, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(12)
    .fillColor('#333')
    .font('Helvetica')
    .text('and demonstrated proficiency in all four GED subject areas:', 0, 290, {
      align: 'center',
      width: doc.page.width
    });

  // Subject Boxes
  const boxWidth = (doc.page.width - 144) / 2;
  const boxHeight = 50;
  let boxX = 72;
  let boxY = 320;

  data.subjects.forEach((subject, index) => {
    if (index === 2) {
      boxX = 72;
      boxY += boxHeight + 20;
    } else if (index === 1) {
      boxX = 72 + boxWidth + 20;
    }

    // Subject box
    doc.rect(boxX, boxY, boxWidth, boxHeight)
      .lineWidth(1)
      .stroke('#d4af37');

    doc.fontSize(11)
      .fillColor('#1a365d')
      .font('Helvetica-Bold')
      .text(subject.courseName, boxX + 10, boxY + 8, { width: boxWidth - 20 });

    doc.fontSize(10)
      .fillColor('#666')
      .font('Helvetica')
      .text(`Score: ${subject.score}%`, boxX + 10, boxY + 28, { width: boxWidth - 20 });
  });

  // Average Score Section
  const scoreBoxY = boxY + boxHeight + 30;
  doc.fontSize(12)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Overall Achievement:', 72, scoreBoxY);

  doc.fontSize(14)
    .fillColor('#d4af37')
    .font('Helvetica-Bold')
    .text(`Average Score: ${data.averageScore}%`, 72, scoreBoxY + 20);

  // Completion Date
  doc.fontSize(11)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Completion Date: ${data.completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 72, scoreBoxY + 50);

  // Certificate Number
  doc.fontSize(10)
    .fillColor('#666')
    .font('Helvetica')
    .text(`Certificate #: ${data.certificateNumber}`, 72, scoreBoxY + 70);

  // QR Code for verification
  const qrCodeUrl = `${process.env.VITE_APP_URL || 'https://example.com'}/verify-bridge-academy/${data.verificationToken}`;
  const qrImage = await QRCode.toDataURL(qrCodeUrl);
  
  const qrX = doc.page.width - 120;
  const qrY = scoreBoxY;
  doc.image(qrImage, qrX, qrY, { width: 80, height: 80 });

  doc.fontSize(8)
    .fillColor('#666')
    .font('Helvetica')
    .text('Scan to verify', qrX, qrY + 85, { width: 80, align: 'center' });

  // Footer
  doc.fontSize(10)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('This diploma certifies that the bearer has completed comprehensive GED preparation coursework', 0, doc.page.height - 60, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(9)
    .fillColor('#666')
    .font('Helvetica')
    .text('and is prepared for GED examination in all subject areas.', 0, doc.page.height - 40, {
      align: 'center',
      width: doc.page.width
    });

  doc.end();
}

export async function generateBridgeAcademyTranscript(data: TranscriptData, res: Response) {
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 40, bottom: 40, left: 50, right: 50 }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=bridge-academy-transcript-${data.certificateNumber}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Header
  doc.fontSize(24)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.schoolName || 'Cross Life School of Divinity', 0, 40, {
      align: 'center',
      width: doc.page.width - 100
    });

  doc.fontSize(14)
    .fillColor('#666')
    .font('Helvetica')
    .text('Bridge Academy - GED Preparation Program', 0, 70, {
      align: 'center',
      width: doc.page.width - 100
    });

  doc.fontSize(14)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Official Transcript', 0, 100, {
      align: 'center',
      width: doc.page.width - 100
    });

  // Student Information Section
  doc.fontSize(11)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Student Information', 50, 140);

  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Name: ${data.studentName}`, 50, 160);

  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Certificate Number: ${data.certificateNumber}`, 50, 180);

  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Completion Date: ${data.completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 200);

  // Course Records Table
  doc.fontSize(11)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Course Records', 50, 240);

  // Table headers
  const tableTop = 270;
  const col1X = 50;
  const col2X = 200;
  const col3X = 320;
  const col4X = 420;
  const col5X = 520;

  doc.rect(col1X - 5, tableTop - 5, doc.page.width - 100, 25)
    .fill('#1a365d');

  doc.fontSize(10)
    .fillColor('#fff')
    .font('Helvetica-Bold')
    .text('Course Code', col1X, tableTop + 5)
    .text('Course Name', col2X, tableTop + 5)
    .text('Score', col3X, tableTop + 5)
    .text('Topics', col4X, tableTop + 5)
    .text('Status', col5X, tableTop + 5);

  // Table rows
  let rowY = tableTop + 35;
  data.subjects.forEach((subject, index) => {
    const bgColor = index % 2 === 0 ? '#f9f9f9' : '#fff';
    doc.rect(col1X - 5, rowY - 5, doc.page.width - 100, 25)
      .fill(bgColor);

    doc.fontSize(9)
      .fillColor('#333')
      .font('Helvetica')
      .text(subject.courseCode, col1X, rowY + 5)
      .text(subject.courseName.substring(0, 30), col2X, rowY + 5)
      .text(`${subject.score}%`, col3X, rowY + 5)
      .text(`${subject.topicsCompleted}/${subject.totalTopics}`, col4X, rowY + 5)
      .text('Completed', col5X, rowY + 5);

    rowY += 30;
  });

  // Summary Section
  const summaryY = rowY + 30;
  doc.fontSize(11)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Summary', 50, summaryY);

  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Overall Average Score: ${data.averageScore}%`, 50, summaryY + 25);

  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Total Courses Completed: ${data.subjects.length}`, 50, summaryY + 45);

  const totalTopics = data.subjects.reduce((sum, s) => sum + s.totalTopics, 0);
  doc.fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Total Topics Completed: ${totalTopics}`, 50, summaryY + 65);

  // Footer
  doc.fontSize(9)
    .fillColor('#666')
    .font('Helvetica-Italic')
    .text('This transcript is an official record of the student\'s completion of Bridge Academy GED Preparation coursework.', 50, doc.page.height - 60, {
      width: doc.page.width - 100,
      align: 'center'
    });

  doc.fontSize(8)
    .fillColor('#999')
    .font('Helvetica')
    .text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, doc.page.height - 30, {
      width: doc.page.width - 100,
      align: 'center'
    });

  doc.end();
}

export async function generateSubjectCertificate(data: {
  studentName: string;
  courseCode: string;
  courseName: string;
  score: number;
  certificateNumber: string;
  verificationToken: string;
  completionDate: Date;
  schoolName?: string;
}, res: Response) {
  const doc = new PDFDocument({
    size: 'LETTER',
    layout: 'landscape',
    margins: { top: 50, bottom: 50, left: 72, right: 72 }
  });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=subject-certificate-${data.certificateNumber}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Background color
  doc.rect(0, 0, doc.page.width, doc.page.height)
    .fill('#f5f5f5');

  // Decorative border
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
    .lineWidth(3)
    .stroke('#1a365d');

  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
    .lineWidth(1)
    .stroke('#d4af37');

  // Subject Badge (top right)
  const badgeX = doc.page.width - 140;
  const badgeY = 70;
  
  doc.circle(badgeX, badgeY, 35)
    .lineWidth(2)
    .stroke('#d4af37');
  
  doc.fontSize(9)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('SUBJECT', badgeX - 18, badgeY - 18, { width: 36, align: 'center' });
  
  doc.fontSize(9)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('MASTERY', badgeX - 18, badgeY + 5, { width: 36, align: 'center' });

  // Header
  doc.fontSize(32)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.schoolName || 'Cross Life School of Divinity', 0, 85, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(14)
    .fillColor('#666')
    .font('Helvetica')
    .text('Bridge Academy - GED Preparation', 0, 125, {
      align: 'center',
      width: doc.page.width
    });

  // Main Title
  doc.fontSize(26)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Certificate of Completion', 0, 160, {
      align: 'center',
      width: doc.page.width
    });

  // Decorative line
  doc.moveTo(150, 200)
    .lineTo(doc.page.width - 150, 200)
    .stroke('#d4af37');

  // Student Name
  doc.fontSize(22)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.studentName, 0, 220, {
      align: 'center',
      width: doc.page.width
    });

  // Completion Statement
  doc.fontSize(12)
    .fillColor('#333')
    .font('Helvetica')
    .text('Has successfully completed the', 0, 260, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(16)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text(data.courseName, 0, 280, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(12)
    .fillColor('#333')
    .font('Helvetica')
    .text('course with a score of', 0, 310, {
      align: 'center',
      width: doc.page.width
    });

  // Score Box
  doc.rect(doc.page.width / 2 - 60, 330, 120, 50)
    .lineWidth(2)
    .stroke('#d4af37');

  doc.fontSize(28)
    .fillColor('#d4af37')
    .font('Helvetica-Bold')
    .text(`${data.score}%`, doc.page.width / 2 - 60, 345, { width: 120, align: 'center' });

  // Details
  doc.fontSize(11)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Course Code: ${data.courseCode}`, 0, 410, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(11)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Completion Date: ${data.completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 0, 430, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(10)
    .fillColor('#666')
    .font('Helvetica')
    .text(`Certificate #: ${data.certificateNumber}`, 0, 450, {
      align: 'center',
      width: doc.page.width
    });

  // QR Code
  const qrCodeUrl = `${process.env.VITE_APP_URL || 'https://example.com'}/verify-bridge-academy/${data.verificationToken}`;
  const qrImage = await QRCode.toDataURL(qrCodeUrl);
  
  const qrX = doc.page.width - 110;
  const qrY = 330;
  doc.image(qrImage, qrX, qrY, { width: 70, height: 70 });

  doc.fontSize(8)
    .fillColor('#666')
    .font('Helvetica')
    .text('Verify', qrX, qrY + 75, { width: 70, align: 'center' });

  // Footer
  doc.fontSize(9)
    .fillColor('#1a365d')
    .font('Helvetica-Bold')
    .text('Authorized by Cross Life School of Divinity', 0, doc.page.height - 50, {
      align: 'center',
      width: doc.page.width
    });

  doc.fontSize(8)
    .fillColor('#666')
    .font('Helvetica')
    .text('This certificate recognizes successful completion of GED preparation coursework', 0, doc.page.height - 30, {
      align: 'center',
      width: doc.page.width
    });

  doc.end();
}

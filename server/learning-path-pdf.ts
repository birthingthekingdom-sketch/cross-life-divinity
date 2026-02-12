import PDFDocument from 'pdfkit';
import * as db from './db';
import { sql } from 'drizzle-orm';

interface LearningPathData {
  id: number;
  name: string;
  description: string;
  level: string;
  estimatedDuration: string;
  courses: Array<{
    title: string;
    description: string;
    orderIndex: number;
  }>;
}

/**
 * Generate a PDF roadmap for a learning path
 */
export async function generateLearningPathPDF(pathId: number): Promise<Buffer> {
  const dbConn = await db.getDb();
  if (!dbConn) {
    throw new Error('Database not available');
  }

  // Get learning path details
  const pathResult: any = await dbConn.execute(
    sql`SELECT * FROM learning_paths WHERE id = ${pathId}`
  );
  const path = Array.isArray(pathResult) ? pathResult[0] : pathResult.rows?.[0];
  
  if (!path) {
    throw new Error('Learning path not found');
  }

  // Get courses in the path
  const coursesResult: any = await dbConn.execute(
    sql`SELECT c.title, c.description, lpc.orderIndex
        FROM learning_path_courses lpc
        JOIN courses c ON lpc.courseId = c.id
        WHERE lpc.pathId = ${pathId}
        ORDER BY lpc.orderIndex`
  );
  const courses = Array.isArray(coursesResult) ? coursesResult : coursesResult.rows || [];

  // Create PDF
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Cross Life School of Divinity', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(20)
      .fillColor('#2563eb')
      .text(path.name, { align: 'center' })
      .fillColor('#000000')
      .moveDown(0.3);

    doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666666')
      .text(`Level: ${path.level} | Duration: ${path.estimatedDuration}`, { align: 'center' })
      .fillColor('#000000')
      .moveDown(1);

    // Description
    doc
      .fontSize(11)
      .text(path.description || '', { align: 'justify' })
      .moveDown(1.5);

    // Course Roadmap
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Learning Roadmap')
      .moveDown(0.5);

    // Draw courses
    courses.forEach((course: any, index: number) => {
      const yPos = doc.y;
      
      // Course number circle
      doc
        .circle(70, yPos + 10, 15)
        .fillAndStroke('#2563eb', '#2563eb')
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(String(index + 1), 55, yPos + 4, { width: 30, align: 'center' })
        .fillColor('#000000');

      // Course title and description
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .text(course.title, 100, yPos, { width: 450 })
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#666666')
        .text(course.description || 'Comprehensive study of this topic', 100, doc.y + 3, { width: 450 })
        .fillColor('#000000')
        .moveDown(0.5);

      // Connection line to next course
      if (index < courses.length - 1) {
        const lineY = doc.y;
        doc
          .moveTo(70, lineY)
          .lineTo(70, lineY + 20)
          .stroke('#cccccc')
          .moveDown(0.5);
      }

      doc.moveDown(0.5);
    });

    // Footer
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor('#666666')
      .text('For more information, visit www.crosslifeschoolofdivinity.com', { align: 'center' })
      .text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });

    doc.end();
  });
}

import { describe, it, expect, beforeAll } from 'vitest';
import * as csvExport from '../csv-export';
import * as db from '../db';

describe('CSV Export', () => {
  let testUserId: number;
  let testCourseId: number;

  beforeAll(async () => {
    // Create test data
    const dbInstance = await db.getDb();
    if (!dbInstance) throw new Error('Database not available');

    const { users, courses } = await import('../../drizzle/schema');
    
    // Create test student
    const studentResult = await dbInstance.insert(users).values({
      openId: `test-csv-student-${Date.now()}`,
      email: `csv-student-${Date.now()}@test.com`,
      name: 'CSV Test Student',
      role: 'user',
    });
    testUserId = Number(studentResult[0].insertId);

    // Create test course
    const courseResult = await dbInstance.insert(courses).values({
      code: `CSV${Date.now()}`,
      title: 'CSV Test Course',
      colorTheme: '#3B82F6',
      totalLessons: 5,
      displayOrder: 1,
    });
    testCourseId = Number(courseResult[0].insertId);
  });

  describe('Student Engagement CSV Export', () => {
    it('should export student engagement data as CSV', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      
      expect(csv).toBeDefined();
      expect(typeof csv).toBe('string');
      expect(csv.length).toBeGreaterThan(0);
    });

    it('should include proper CSV headers', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      const lines = csv.split('\n');
      const headers = lines[0];
      
      expect(headers).toContain('User ID');
      expect(headers).toContain('Name');
      expect(headers).toContain('Email');
      expect(headers).toContain('Last Login');
      expect(headers).toContain('Completion Rate');
      expect(headers).toContain('Average Quiz Score');
      expect(headers).toContain('At Risk');
      expect(headers).toContain('Inactive');
    });

    it('should format data rows correctly', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      const lines = csv.split('\n').filter(line => line.trim());
      
      // Should have at least headers
      expect(lines.length).toBeGreaterThanOrEqual(1);
      
      if (lines.length > 1) {
        const dataRow = lines[1];
        const fields = dataRow.split(',');
        
        // Should have correct number of fields
        expect(fields.length).toBeGreaterThanOrEqual(10);
      }
    });

    it('should escape CSV special characters', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      
      // Check that commas in values are properly escaped with quotes
      const lines = csv.split('\n');
      for (const line of lines) {
        // Count quotes - should be even (properly escaped)
        const quoteCount = (line.match(/"/g) || []).length;
        expect(quoteCount % 2).toBe(0);
      }
    });
  });

  describe('Course Completion CSV Export', () => {
    it('should export course completion data as CSV', async () => {
      const csv = await csvExport.exportCourseCompletionCSV();
      
      expect(csv).toBeDefined();
      expect(typeof csv).toBe('string');
      expect(csv.length).toBeGreaterThan(0);
    });

    it('should include proper CSV headers', async () => {
      const csv = await csvExport.exportCourseCompletionCSV();
      const lines = csv.split('\n');
      const headers = lines[0];
      
      expect(headers).toContain('Course ID');
      expect(headers).toContain('Course Code');
      expect(headers).toContain('Course Title');
      expect(headers).toContain('Total Enrolled');
      expect(headers).toContain('Total Completed');
      expect(headers).toContain('Completion Rate');
    });

    it('should format completion rates as percentages', async () => {
      const csv = await csvExport.exportCourseCompletionCSV();
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length > 1) {
        const dataRow = lines[1];
        const fields = dataRow.split(',');
        
        // Completion rate should be a number (percentage)
        const completionRateIndex = 5; // Based on header order
        if (fields[completionRateIndex]) {
          const rate = parseFloat(fields[completionRateIndex]);
          expect(rate).toBeGreaterThanOrEqual(0);
          expect(rate).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe('Activity Metrics CSV Export', () => {
    it('should export activity metrics as CSV', async () => {
      const csv = await csvExport.exportActivityMetricsCSV();
      
      expect(csv).toBeDefined();
      expect(typeof csv).toBe('string');
      expect(csv.length).toBeGreaterThan(0);
    });

    it('should include key metrics', async () => {
      const csv = await csvExport.exportActivityMetricsCSV();
      
      expect(csv).toContain('Total Students');
      expect(csv).toContain('Active Students');
      expect(csv).toContain('Inactive Students');
      expect(csv).toContain('At-Risk Students');
      expect(csv).toContain('Average Course Completion Rate');
      expect(csv).toContain('Average Quiz Score');
    });

    it('should format metrics as key-value pairs', async () => {
      const csv = await csvExport.exportActivityMetricsCSV();
      const lines = csv.split('\n').filter(line => line.trim());
      
      // Should have header + at least 6 metric rows
      expect(lines.length).toBeGreaterThanOrEqual(7);
      
      // Each data row should have exactly 2 fields (metric, value)
      for (let i = 1; i < lines.length; i++) {
        const fields = lines[i].split(',');
        expect(fields.length).toBe(2);
      }
    });
  });

  describe('Comprehensive Analytics CSV Export', () => {
    it('should export all analytics data combined', async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      
      expect(csv).toBeDefined();
      expect(typeof csv).toBe('string');
      expect(csv.length).toBeGreaterThan(0);
    });

    it('should include all three sections', async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      
      expect(csv).toContain('ACTIVITY METRICS');
      expect(csv).toContain('STUDENT ENGAGEMENT');
      expect(csv).toContain('COURSE COMPLETION TRENDS');
    });

    it('should separate sections with blank lines', async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      const lines = csv.split('\n');
      
      // Should have blank lines between sections
      const blankLines = lines.filter(line => line.trim() === '');
      expect(blankLines.length).toBeGreaterThanOrEqual(2);
    });

    it('should be parseable as valid CSV', async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      
      // Basic CSV validation - should not have unmatched quotes
      const quoteCount = (csv.match(/"/g) || []).length;
      expect(quoteCount % 2).toBe(0);
      
      // Should have consistent line endings
      const lines = csv.split('\n');
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe('CSV Formatting', () => {
    it('should handle null values gracefully', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      
      // CSV should contain 'N/A' for null values
      expect(csv).toMatch(/N\/A/);
    });

    it('should handle empty strings', async () => {
      const csv = await csvExport.exportStudentEngagementCSV();
      const lines = csv.split('\n');
      
      // No line should have consecutive commas (empty fields should be handled)
      for (const line of lines) {
        expect(line).not.toMatch(/,,/);
      }
    });

    it('should produce downloadable CSV format', async () => {
      const csv = await csvExport.exportComprehensiveAnalyticsCSV();
      
      // Should be valid UTF-8
      expect(Buffer.from(csv, 'utf-8').toString('utf-8')).toBe(csv);
      
      // Should have proper line endings
      expect(csv).toMatch(/\n/);
    });
  });
});

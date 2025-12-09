-- Insert Chaplain's Training course
INSERT INTO courses (
  code, 
  title, 
  description, 
  totalLessons, 
  cpdHours,
  introVideoUrl,
  createdAt, 
  updatedAt
) VALUES (
  'CHAP101',
  'Chaplain''s Training',
  'This comprehensive course prepares students for effective chaplaincy ministry across various settings including hospitals, military, prisons, and corporate environments. Students will develop essential skills in pastoral care, crisis intervention, ethical decision-making, and spiritual counseling while learning to minister to diverse populations in institutional contexts. The curriculum covers theological foundations of chaplaincy, professional boundaries, trauma-informed care, and interfaith sensitivity. Through case studies and practical applications, students will gain competency in providing compassionate spiritual support during life transitions, grief, illness, and crisis situations.',
  10,
  30,
  'https://www.youtube.com/watch?v=8ZfYJXrJGYc',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

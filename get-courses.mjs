import db from './server/db.ts';

const courses = await db.query.courses.findMany({
  columns: {
    id: true,
    code: true,
    title: true,
    description: true,
    price: true,
    courseType: true,
  },
  orderBy: (courses, { asc }) => [asc(courses.code)],
});

console.log(JSON.stringify(courses, null, 2));

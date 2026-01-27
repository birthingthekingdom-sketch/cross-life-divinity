import { drizzle } from "drizzle-orm/mysql2";
import { accessCodes, accessCodeCourses, courses } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function migrateAccessCodes() {
  console.log("Migrating access codes to course-specific enrollment...");
  
  // Get all access codes
  const allAccessCodes = await db.select().from(accessCodes);
  console.log(`Found ${allAccessCodes.length} access codes`);
  
  // Get all courses
  const allCourses = await db.select().from(courses);
  console.log(`Found ${allCourses.length} courses`);
  
  // Assign all courses to each existing access code (full suite)
  for (const accessCode of allAccessCodes) {
    console.log(`\nAssigning all courses to access code: ${accessCode.code}`);
    
    for (const course of allCourses) {
      try {
        await db.insert(accessCodeCourses).values({
          accessCodeId: accessCode.id,
          courseId: course.id
        });
        console.log(`  ✓ Assigned ${course.code} - ${course.title}`);
      } catch (error) {
        // Ignore duplicate key errors
        if (!error.message.includes('Duplicate entry')) {
          console.error(`  ✗ Error assigning ${course.code}:`, error.message);
        }
      }
    }
  }
  
  console.log("\n✅ Migration complete!");
  console.log("All existing access codes now grant access to the full suite of courses.");
  process.exit(0);
}

migrateAccessCodes().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

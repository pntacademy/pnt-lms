import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STUDENTS = [
  { name: "Aarav Shah", className: "Grade 10", instituteName: "PNT Public School" },
  { name: "Priya Mehta", className: "Grade 11", instituteName: "PNT Public School" },
  { name: "Rohan Verma", className: "Grade 10", instituteName: "Delhi High School" },
  { name: "Ananya Joshi", className: "Grade 12", instituteName: "Delhi High School" },
  { name: "Vikram Patel", className: "Grade 11", instituteName: "PNT Public School" },
  { name: "Sneha Reddy", className: "Grade 10", instituteName: "Sunrise Academy" },
  { name: "Arjun Nair", className: "Grade 12", instituteName: "Sunrise Academy" },
  { name: "Divya Sharma", className: "Grade 11", instituteName: "PNT Public School" },
  { name: "Karan Gupta", className: "Grade 10", instituteName: "Delhi High School" },
  { name: "Meera Iyer", className: "Grade 11", instituteName: "Sunrise Academy" },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Upsert a test course
  const course = await prisma.course.upsert({
    where: { id: "seed-course-robotics-001" },
    update: {},
    create: {
      id: "seed-course-robotics-001",
      title: "Introduction to Robotics",
      description: "Hands-on robotics for the Junior Innovators Program.",
    },
  });
  console.log(`✅ Course: "${course.title}"`);

  // Create students and enroll them
  for (let i = 0; i < STUDENTS.length; i++) {
    const data = STUDENTS[i];
    const studentId = `PNT-2026-${String(i + 1).padStart(3, "0")}`;

    const user = await prisma.user.upsert({
      where: { studentId },
      update: {},
      create: {
        studentId,
        name: data.name,
        role: "STUDENT",
        className: data.className,
        instituteName: data.instituteName,
        age: 15 + (i % 3),
        contactNumber: `+91 98765 4${String(i).padStart(4, "0")}`,
      },
    });

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: user.id, courseId: course.id },
      },
      update: {},
      create: {
        userId: user.id,
        courseId: course.id,
      },
    });

    console.log(`  👤 ${user.name} (${studentId}) → enrolled`);
  }

  console.log("\n🎉 Seed complete! 10 students created and enrolled.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

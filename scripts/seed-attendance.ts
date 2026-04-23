import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding users, courses, and attendance...`);

  // Create a Course
  const course = await prisma.course.upsert({
    where: { id: "course-1" },
    update: {},
    create: {
      id: "course-1",
      title: "Robotics 15-Hour Program",
      description: "Basic to Intermediate Robotics",
    }
  });
  console.log(`Course created/exists: ${course.title}`);

  // Create an Admin/Teacher
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const teacher = await prisma.user.upsert({
    where: { email: "admin@pntacademy.com" },
    update: {},
    create: {
      email: "admin@pntacademy.com",
      studentId: "ADMIN-001",
      name: "Pratik (Teacher)",
      role: "ADMIN",
      passwordHash,
    }
  });
  console.log(`Teacher created/exists: ${teacher.name}`);

  // Create a Student
  const student = await prisma.user.upsert({
    where: { studentId: "PNT-2026-001" },
    update: {},
    create: {
      email: "student@pntacademy.com",
      studentId: "PNT-2026-001",
      name: "Alex Innovator",
      role: "STUDENT",
      passwordHash,
    }
  });
  console.log(`Student created/exists: ${student.name}`);

  // Enroll student
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      progress: 25
    }
  });

  // Create dummy attendance
  const dummyDates = [
    new Date("2026-04-20T10:00:00Z"),
    new Date("2026-04-18T10:00:00Z"),
    new Date("2026-04-15T10:00:00Z"),
    new Date("2026-04-12T10:00:00Z"),
  ];

  const statuses: ("PRESENT" | "ABSENT" | "LATE")[] = ["PRESENT", "PRESENT", "ABSENT", "LATE"];

  for (let i = 0; i < dummyDates.length; i++) {
    const d = dummyDates[i];
    await prisma.attendance.upsert({
      where: {
        userId_courseId_date: {
          userId: student.id,
          courseId: course.id,
          date: d,
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        date: d,
        status: statuses[i],
        markedBy: teacher.id
      }
    });
  }
  
  console.log(`Attendance records seeded.`);
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

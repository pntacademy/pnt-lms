const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Check if course exists
  let course = await prisma.course.findFirst();
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: "Introduction to Robotics",
        description: "A foundational course for the Junior Innovators Program.",
      }
    });
    console.log("Created dummy course:", course.title);
  }

  // Create 10 students
  console.log("Creating 10 test students...");
  for (let i = 1; i <= 10; i++) {
    const studentId = `PNT-2026-${String(i).padStart(3, '0')}`;
    
    // Check if exists
    let user = await prisma.user.findUnique({
      where: { studentId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          studentId,
          name: `Test Student ${i}`,
          role: "STUDENT",
          className: "Grade 10",
          instituteName: "PNT Test School",
        }
      });
    }

    // Enroll in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        }
      }
    });

    if (!enrollment) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        }
      });
    }
  }

  console.log("Successfully seeded 10 students and enrolled them in", course.title);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

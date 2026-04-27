import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let course = await prisma.course.findFirst();
    if (!course) {
      course = await prisma.course.create({
        data: {
          title: "Introduction to Robotics",
          description: "A foundational course for the Junior Innovators Program.",
        }
      });
    }

    let createdCount = 0;
    for (let i = 1; i <= 10; i++) {
      const studentId = `PNT-2026-${String(i).padStart(3, '0')}`;
      
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
        createdCount++;
      }

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

    return NextResponse.json({ message: `Seeded ${createdCount} new students successfully and enrolled in ${course.title}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getStudentAssignments() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get student's enrollments and grade
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true }
    });
    const courseIds = enrollments.map(e => e.courseId);
    const schoolGradeId = (session.user as any).schoolGradeId;

    const assignments = await prisma.assignment.findMany({
      where: {
        AND: [
          {
            OR: [
              { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
              { schoolGradeId: null }
            ]
          },
          {
            OR: [
              { courseId: { in: courseIds } },
              { courseId: null }
            ]
          }
        ]
      },
      include: {
        project: true,
        courseTopic: {
          select: { title: true, course: { select: { title: true } } }
        },
        submissions: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, assignments };
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return { error: "Failed to fetch assignments" };
  }
}

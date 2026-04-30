"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getStudentAssignments() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get student's enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      select: { courseId: true }
    });
    const courseIds = enrollments.map(e => e.courseId);

    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          { courseId: { in: courseIds } },
          { courseId: null } // Include legacy project-based assignments
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

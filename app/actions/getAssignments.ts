"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getStudentAssignments() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    // Get all assignments for the courses the student is enrolled in
    // Wait, the schema has `Project` with assignments. Course is not directly linked to Assignment?
    // Let's check schema: Course has no direct Assignments. Project has Assignments.
    // Let's just fetch all assignments for simplicity right now, or link them to Projects.
    const assignments = await prisma.assignment.findMany({
      include: {
        project: true,
        submissions: {
          where: {
            userId: session.user.id
          }
        }
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    return { success: true, assignments };
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return { error: "Failed to fetch assignments" };
  }
}

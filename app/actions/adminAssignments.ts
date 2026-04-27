"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllSubmissions() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) {
    return { error: "Unauthorized" };
  }

  try {
    const submissions = await prisma.assignmentSubmission.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            studentId: true,
            className: true,
          }
        },
        assignment: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    return { success: true, submissions };
  } catch (error) {
    console.error("Error fetching all submissions:", error);
    return { error: "Failed to fetch submissions" };
  }
}

export async function gradeSubmission(submissionId: string, score: number, feedback?: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) {
    return { error: "Unauthorized" };
  }

  try {
    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback: feedback || null,
        status: "GRADED",
      }
    });

    revalidatePath("/dashboard/admin/assignments");
    revalidatePath("/dashboard/assignments"); // So the student sees it
    
    return { success: true, submission: updated };
  } catch (error) {
    console.error("Error grading submission:", error);
    return { error: "Failed to update grade" };
  }
}

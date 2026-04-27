"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAssignment(assignmentId: string, objectKey: string, studentNotes?: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        userId_assignmentId: {
          userId: userId,
          assignmentId: assignmentId,
        }
      },
      update: {
        fileUrl: objectKey, // Storing the objectKey from R2
        studentNotes: studentNotes || null,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      create: {
        userId: userId,
        assignmentId: assignmentId,
        fileUrl: objectKey,
        studentNotes: studentNotes || null,
        status: "SUBMITTED",
      }
    });

    // Revalidate the path so the UI updates
    revalidatePath("/dashboard/assignments");
    
    return { success: true, submission };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return { error: "Failed to save submission to database" };
  }
}

"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── ASSIGNMENTS CRUD ────────────────────────────────────────────────

export async function getAllAssignments() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) return { error: "Unauthorized" };

  try {
    let whereClause = {};
    if (role === "TEACHER") {
      const teacherCourses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        select: { id: true },
      });
      whereClause = { courseId: { in: teacherCourses.map(c => c.id) } };
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, title: true } },
        courseTopic: {
          select: {
            id: true,
            title: true,
            course: { select: { id: true, title: true } },
          },
        },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, assignments };
  } catch (error) {
    return { error: "Failed to fetch assignments" };
  }
}

export async function getCoursesWithTopics() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const role = (session?.user as any)?.role;
  try {
    const courses = await prisma.course.findMany({
      where: role === "TEACHER" ? { teacherId: session.user.id } : undefined,
      select: {
        id: true,
        title: true,
        topics: {
          select: { id: true, title: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, courses };
  } catch (error) {
    return { error: "Failed to fetch courses" };
  }
}

export async function createAssignment(formData: FormData) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const courseTopicId = (formData.get("courseTopicId") as string) || null;
  const courseId = (formData.get("courseId") as string) || null;
  const dueDateStr = formData.get("dueDate") as string;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;

  if (!title) return { error: "Title is required" };
  if (!courseTopicId) return { error: "Please select a topic" };
  if (!courseId) return { error: "Please select a course" };

  try {
    const assignment = await prisma.assignment.create({
      data: { title, description, courseTopicId, courseId, dueDate },
    });
    revalidatePath("/dashboard/admin/assignments");
    revalidatePath("/dashboard/assignments");
    return { success: true, assignment };
  } catch (error) {
    return { error: "Failed to create assignment" };
  }
}

export async function deleteAssignment(assignmentId: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) return { error: "Unauthorized" };

  try {
    await prisma.assignment.delete({ where: { id: assignmentId } });
    revalidatePath("/dashboard/admin/assignments");
    revalidatePath("/dashboard/assignments");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete assignment" };
  }
}

// ─── SUBMISSIONS ────────────────────────────────────────────────────

export async function getAllSubmissions() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || (role !== "ADMIN" && role !== "TEACHER")) {
    return { error: "Unauthorized" };
  }

  try {
    let whereClause = {};
    if (role === "TEACHER") {
      const teacherCourses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        select: { id: true },
      });
      whereClause = { assignment: { courseId: { in: teacherCourses.map(c => c.id) } } };
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: whereClause,
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
            },
            courseTopic: {
              select: {
                id: true,
                title: true,
                course: { select: { id: true, title: true } }
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
    revalidatePath("/dashboard/assignments");
    
    return { success: true, submission: updated };
  } catch (error) {
    console.error("Error grading submission:", error);
    return { error: "Failed to update grade" };
  }
}

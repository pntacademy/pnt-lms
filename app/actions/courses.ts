"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Fetch all courses with enrollment + attendance counts
export async function getAllCourses() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true, attendances: true },
      },
      enrollments: {
        include: {
          user: { select: { id: true, name: true, studentId: true } },
        },
      },
    },
  });

  return courses;
}

// Create a new course
export async function createCourse(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isInternship = formData.get("isInternship") === "true";
  const driveLink = (formData.get("driveLink") as string)?.trim() || null;

  if (!title) throw new Error("Course title is required");

  const course = await prisma.course.create({
    data: { title, description, isInternship, driveLink },
  });

  revalidatePath("/dashboard/admin/courses");
  return course;
}

// Delete a course
export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath("/dashboard/admin/courses");
}

// Enroll a student into a course
export async function enrollStudent(courseId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId },
  });

  revalidatePath("/dashboard/admin/courses");
}

// Remove a student from a course
export async function unenrollStudent(courseId: string, userId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.enrollment.deleteMany({ where: { userId, courseId } });
  revalidatePath("/dashboard/admin/courses");
}

// Get all students (for enrollment dropdown)
export async function getAllStudentsForEnroll() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true, studentId: true },
    orderBy: { name: "asc" },
  });
}

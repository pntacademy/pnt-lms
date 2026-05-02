"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Fetch all courses with enrollment + attendance + topic counts
export async function getAllCourses() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const role = (session?.user as any)?.role;

  const courses = await prisma.course.findMany({
    where: role === "TEACHER" ? { teacherId: session.user.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true, attendances: true, topics: true },
      },
      enrollments: {
        include: {
          user: { select: { id: true, name: true, studentId: true } },
        },
      },
      topics: { orderBy: { order: "asc" } },
      teacher: { select: { id: true, name: true, email: true } },
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
  const teacherId = (formData.get("teacherId") as string)?.trim() || null;

  if (!title) throw new Error("Course title is required");

  const course = await prisma.course.create({
    data: { title, description, isInternship, driveLink, teacherId },
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

// Get all teachers (for course assignment)
export async function getAllTeachers() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

// Add a topic to a course
export async function addCourseTopic(courseId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const videoUrl = (formData.get("videoUrl") as string)?.trim() || null;
  const duration = (formData.get("duration") as string)?.trim() || null;

  if (!title) throw new Error("Topic title is required");

  // Get the current max order to append at end
  const lastTopic = await prisma.courseTopic.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });
  const order = (lastTopic?.order ?? -1) + 1;

  await prisma.courseTopic.create({
    data: { courseId, title, description, videoUrl, duration, order },
  });

  revalidatePath("/dashboard/admin/courses");
}

// Delete a topic
export async function deleteCourseTopic(topicId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.courseTopic.delete({ where: { id: topicId } });
  revalidatePath("/dashboard/admin/courses");
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAllStudents() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: { include: { course: { select: { title: true } } } },
      attendances: { select: { status: true } },
      submissions: { select: { score: true, status: true } },
    },
  });

  return students.map((s) => {
    const total = s.attendances.length;
    const present = s.attendances.filter((a) => a.status === "PRESENT").length;
    const attendancePct = total > 0 ? Math.round((present / total) * 100) : null;
    const graded = s.submissions.filter((sub) => sub.score !== null);
    const avgScore =
      graded.length > 0
        ? Math.round(graded.reduce((acc, sub) => acc + (sub.score ?? 0), 0) / graded.length)
        : null;
    return {
      id: s.id,
      studentId: s.studentId,
      name: s.name,
      className: s.className,
      instituteName: s.instituteName,
      contactNumber: s.contactNumber,
      age: s.age,
      createdAt: s.createdAt,
      enrolledCourses: s.enrollments.map((e) => e.course.title),
      attendancePct,
      avgScore,
      totalAttendance: total,
      totalSubmissions: s.submissions.length,
    };
  });
}

export async function registerStudent(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const className = formData.get("className") as string;
  const instituteName = formData.get("instituteName") as string;
  const age = formData.get("age") as string;
  const contactNumber = formData.get("contactNumber") as string;
  const courseId = formData.get("courseId") as string;

  if (!name || !className) throw new Error("Name and Class are required");

  // Auto-generate next student ID
  const lastStudent = await prisma.user.findFirst({
    where: { role: "STUDENT", studentId: { not: null } },
    orderBy: { createdAt: "desc" },
  });

  let nextNum = 1;
  if (lastStudent?.studentId) {
    const parts = lastStudent.studentId.split("-");
    const lastNum = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastNum)) nextNum = lastNum + 1;
  }

  const year = new Date().getFullYear();
  const studentId = `PNT-${year}-${String(nextNum).padStart(3, "0")}`;

  const student = await prisma.user.create({
    data: {
      studentId,
      name,
      role: "STUDENT",
      className,
      instituteName: instituteName || null,
      age: age ? parseInt(age) : null,
      contactNumber: contactNumber || null,
    },
  });

  // Auto-enroll in course if provided
  if (courseId) {
    await prisma.enrollment.create({
      data: { userId: student.id, courseId },
    });
  }

  revalidatePath("/dashboard/admin/students");
  return { studentId };
}

export async function deleteStudent(studentDbId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.user.delete({ where: { id: studentDbId } });
  revalidatePath("/dashboard/admin/students");
}

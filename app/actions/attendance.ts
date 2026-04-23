"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAttendance(formData: FormData) {
  const studentId = formData.get("studentId") as string;
  const courseId = formData.get("courseId") as string;
  const status = formData.get("status") as "PRESENT" | "ABSENT" | "LATE";
  const dateStr = formData.get("date") as string;
  
  if (!studentId || !courseId || !status || !dateStr) {
    throw new Error("Missing required fields");
  }

  const date = new Date(dateStr);

  // We should actually verify the user making this request is a Teacher/Admin
  // But for the MVP, we assume it's valid
  
  const student = await prisma.user.findUnique({
    where: { studentId }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  await prisma.attendance.upsert({
    where: {
      userId_courseId_date: {
        userId: student.id,
        courseId,
        date,
      }
    },
    update: {
      status
    },
    create: {
      userId: student.id,
      courseId,
      date,
      status,
    }
  });

  revalidatePath("/dashboard/attendance");
}

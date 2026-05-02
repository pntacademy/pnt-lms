"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { AttendanceStatus } from "@prisma/client";

// Get all courses that an admin or teacher can mark attendance for
export async function getCourses() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const role = (session?.user as any)?.role;
  
  return await prisma.course.findMany({
    where: role === "TEACHER" ? { teacherId: session.user.id } : undefined,
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" }
  });
}

// Get all students enrolled in a specific course, and their attendance for a specific date
export async function getCourseAttendance(courseId: string, dateStr: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const date = new Date(dateStr);
  
  // Find all enrollments for this course
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          studentId: true,
          className: true,
          instituteName: true
        }
      }
    }
  });

  // Find existing attendance records for these students on this specific date
  const attendances = await prisma.attendance.findMany({
    where: {
      courseId,
      date,
    }
  });

  // Map the attendance records by userId for easy lookup
  const attendanceMap = new Map();
  attendances.forEach(att => {
    attendanceMap.set(att.userId, att.status);
  });

  // Combine the data
  return enrollments.map(enrollment => {
    return {
      userId: enrollment.user.id,
      studentId: enrollment.user.studentId || "N/A",
      name: enrollment.user.name || "Unknown",
      className: enrollment.user.className || "N/A",
      status: attendanceMap.get(enrollment.user.id) || null // null means unmarked
    };
  });
}

// Bulk save attendance records
export async function saveBulkAttendance(
  courseId: string, 
  dateStr: string, 
  records: { userId: string, status: AttendanceStatus }[]
) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const date = new Date(dateStr);
  const teacherId = session.user.id;

  // Use a transaction to upsert all records efficiently
  const operations = records.map(record => {
    return prisma.attendance.upsert({
      where: {
        userId_courseId_date: {
          userId: record.userId,
          courseId,
          date,
        }
      },
      update: {
        status: record.status,
        markedBy: teacherId
      },
      create: {
        userId: record.userId,
        courseId,
        date,
        status: record.status,
        markedBy: teacherId
      }
    });
  });

  await prisma.$transaction(operations);

  revalidatePath("/dashboard/admin/attendance");
}

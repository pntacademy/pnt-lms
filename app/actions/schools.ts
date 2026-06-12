"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createSchool(data: { name: string; coordinatorName: string; location: string }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const school = await prisma.school.create({
    data,
  });

  revalidatePath("/dashboard/admin/schools");
  return school;
}

export async function createSchoolGrade(data: { schoolId: string; gradeName: string }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const grade = await prisma.schoolGrade.create({
    data,
  });

  revalidatePath(`/dashboard/admin/schools/${data.schoolId}`);
  return grade;
}

export async function updateSchoolGradeDetails(
  gradeId: string, 
  schoolId: string, 
  data: { videoUrl?: string; driveLink?: string; notes?: string; assignmentLink?: string; assignmentFileUrl?: string }
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.schoolGrade.update({
    where: { id: gradeId },
    data,
  });

  revalidatePath(`/dashboard/admin/schools/${schoolId}/grades/${gradeId}`);
}

// Bulk Upload Logic
export async function bulkUploadStudents(
  schoolId: string,
  gradeId: string,
  studentsData: Array<{ name: string; grade: string; email?: string; contactNumber?: string }>
) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const generatedUsers = [];

  for (const student of studentsData) {
    // Prevent duplicate students with the exact same name in the same grade
    const existingUser = await prisma.user.findFirst({
      where: {
        schoolId: schoolId,
        schoolGradeId: gradeId,
        name: student.name
      }
    });

    if (existingUser) {
      continue; // Skip this student since they already exist
    }

    // Generate a random student ID e.g. PNT-SCH-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const studentId = `PNT-SCH-${randomNum}`;
    
    // Generate a secure 8-character password
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await (prisma as any).user.create({
      data: {
        name: student.name,
        studentId: studentId,
        email: student.email || null,
        contactNumber: student.contactNumber || null,
        passwordHash: passwordHash,
        plainPassword: password, // Store plain text for admin visibility
        role: "STUDENT",
        schoolId: schoolId,
        schoolGradeId: gradeId,
        className: student.grade
      }
    });

    generatedUsers.push({
      Name: student.name,
      StudentId: studentId,
      Password: password,
      Email: student.email || "N/A",
      Grade: student.grade
    });
  }

  revalidatePath(`/dashboard/admin/schools/${schoolId}/grades/${gradeId}`);
  
  return generatedUsers;
}

export async function deleteStudent(studentId: string, schoolId: string, gradeId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.user.delete({
    where: { id: studentId }
  });

  revalidatePath(`/dashboard/admin/schools/${schoolId}/grades/${gradeId}`);
}

export async function deleteSchoolGrade(gradeId: string, schoolId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.schoolGrade.delete({
    where: { id: gradeId }
  });

  revalidatePath(`/dashboard/admin/schools/${schoolId}`);
}
export async function deleteSchool(schoolId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.school.delete({
    where: { id: schoolId }
  });

  revalidatePath("/dashboard/admin/schools");
}

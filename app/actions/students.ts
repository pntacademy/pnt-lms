"use server";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function bulkCreateStudents(studentsData: any[]) {
  try {
    const createdStudents = [];

    // Prefix for student ID based on current year
    const yearPrefix = `PNT-${new Date().getFullYear()}-`;

    for (let i = 0; i < studentsData.length; i++) {
      const data = studentsData[i];
      
      // Auto-generate a password (e.g., 6 random digits)
      const rawPassword = Math.floor(100000 + Math.random() * 900000).toString();
      const passwordHash = await bcrypt.hash(rawPassword, 10);
      
      // Auto-generate a unique Student ID
      const count = await prisma.user.count({ where: { role: "STUDENT" } });
      const studentId = `${yearPrefix}${(count + i + 1).toString().padStart(3, '0')}`;

      const newStudent = await prisma.user.create({
        data: {
          studentId,
          passwordHash,
          name: data.name,
          className: data.className,
          instituteName: data.instituteName,
          age: parseInt(data.age) || null,
          contactNumber: data.contactNumber,
          role: "STUDENT",
        }
      });

      createdStudents.push({
        studentId: newStudent.studentId,
        name: newStudent.name,
        rawPassword, // We return this exactly ONCE so the teacher can save it
        className: newStudent.className,
      });
    }

    return { success: true, data: createdStudents };

  } catch (error) {
    console.error("Bulk create error:", error);
    return { success: false, error: "Failed to create students" };
  }
}

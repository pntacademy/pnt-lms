"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createGradeMaterial(data: {
  gradeId: string;
  title: string;
  description?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
}) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  const material = await (prisma as any).gradeMaterial.create({
    data,
  });

  const grade = await prisma.schoolGrade.findUnique({
    where: { id: data.gradeId },
    select: { schoolId: true }
  });

  if (grade) {
    revalidatePath(`/dashboard/admin/schools/${grade.schoolId}/grades/${data.gradeId}`);
    revalidatePath(`/dashboard/admin/schools/${grade.schoolId}/grades/${data.gradeId}/materials`);
    revalidatePath(`/dashboard/school`);
  }

  return material;
}

export async function deleteGradeMaterial(materialId: string, gradeId: string, schoolId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.role !== "TEACHER") {
    throw new Error("Unauthorized");
  }

  await (prisma as any).gradeMaterial.delete({
    where: { id: materialId },
  });

  revalidatePath(`/dashboard/admin/schools/${schoolId}/grades/${gradeId}`);
  revalidatePath(`/dashboard/admin/schools/${schoolId}/grades/${gradeId}/materials`);
  revalidatePath(`/dashboard/school`);
}

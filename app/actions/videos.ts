"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

function extractDriveId(url: string): string {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : url;
}

export async function getAllVideos() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const videos = await prisma.globalVideo.findMany({
    orderBy: { createdAt: "desc" },
  });
  
  return videos;
}

export async function createGlobalVideo(formData: FormData) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const driveUrl = formData.get("driveUrl") as string;

  if (!title || !driveUrl) {
    throw new Error("Missing required fields");
  }

  const driveFileId = extractDriveId(driveUrl);

  await prisma.globalVideo.create({
    data: {
      title,
      description: description || null,
      driveUrl,
      driveFileId,
    },
  });

  revalidatePath("/dashboard/admin/videos");
  revalidatePath("/dashboard/videos");
}

export async function deleteGlobalVideo(id: string) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user || role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.globalVideo.delete({
    where: { id },
  });

  revalidatePath("/dashboard/admin/videos");
  revalidatePath("/dashboard/videos");
}

"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function sendBulkNotifications(userIds: string[], title: string, message: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");

  const notifications = userIds.map(userId => ({
    userId,
    title,
    message,
    isRead: false,
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  // Revalidate the general layout so student badges update if applicable
  revalidatePath("/dashboard", "layout");
}

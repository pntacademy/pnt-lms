"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { EventType } from "@prisma/client";

// Get events
export async function getEvents() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  const role = (session.user as any).role;
  const userId = session.user.id;

  let events;

  if (role === "STUDENT") {
    // Get courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true }
    });
    const courseIds = enrollments.map(e => e.courseId);

    events = await prisma.event.findMany({
      where: {
        OR: [
          { courseId: { in: courseIds } },
          { courseId: null } // General events
        ]
      },
      include: {
        course: { select: { title: true } },
        teacher: { select: { name: true } }
      },
      orderBy: { date: 'asc' }
    });
  } else if (role === "TEACHER") {
    const courses = await prisma.course.findMany({
      where: { teacherId: userId },
      select: { id: true }
    });
    const courseIds = courses.map(c => c.id);

    events = await prisma.event.findMany({
      where: {
        OR: [
          { courseId: { in: courseIds } },
          { teacherId: userId },
          { courseId: null } 
        ]
      },
      include: {
        course: { select: { title: true } },
        teacher: { select: { name: true } }
      },
      orderBy: { date: 'asc' }
    });
  } else {
    // ADMIN sees all events
    events = await prisma.event.findMany({
      include: {
        course: { select: { title: true } },
        teacher: { select: { name: true } }
      },
      orderBy: { date: 'asc' }
    });
  }

  return events;
}

// Create event
export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const dateStr = formData.get("date") as string;
  const durationStr = formData.get("duration") as string;
  const type = (formData.get("type") as EventType) || "GENERAL";
  const courseId = (formData.get("courseId") as string)?.trim() || null;

  if (!title || !dateStr) throw new Error("Title and Date are required");

  const userId = session.user.id;
  if (!userId) throw new Error("Unauthorized: No user ID");

  await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(dateStr),
      duration: durationStr ? parseInt(durationStr) : null,
      type,
      courseId: courseId === "general" ? null : courseId,
      teacherId: userId
    }
  });

  revalidatePath("/dashboard/admin/calendar");
  revalidatePath("/dashboard/calendar");
}

// Delete event
export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  
  await prisma.event.delete({ where: { id: eventId } });
  
  revalidatePath("/dashboard/admin/calendar");
  revalidatePath("/dashboard/calendar");
}

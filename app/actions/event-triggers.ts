"use server";

import prisma from "@/lib/prisma";
import { EventType, EventStatus, EventPriority } from "@prisma/client";

/**
 * Automatically create or update a Calendar Event when an Assignment is created.
 */
export async function syncAssignmentToCalendar(assignmentId: string, teacherId: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId }
  });

  if (!assignment || !assignment.dueDate) return;

  // We check if an event already exists for this assignment
  // For simplicity we use the title to match, or we could add a `relatedEntityId` to the Event model.
  // Since we don't have relatedEntityId, we'll just create a new one, or you can add it to schema.
  // Actually, we can use title: `Assignment Deadline: ${assignment.title}`
  
  const title = `Assignment Deadline: ${assignment.title}`;

  await prisma.event.create({
    data: {
      title,
      description: assignment.description,
      date: assignment.dueDate,
      type: "ASSIGNMENT_DEADLINE",
      status: "UPCOMING",
      priority: "HIGH",
      color: "#f59e0b", // amber
      courseId: assignment.courseId,
      teacherId
    }
  });
}

/**
 * Automatically create or update a Calendar Event when a Test is created/published.
 */
export async function syncTestToCalendar(testId: string, teacherId: string, testDate: Date) {
  const test = await prisma.test.findUnique({
    where: { id: testId }
  });

  if (!test) return;

  const title = `Test: ${test.title}`;

  await prisma.event.create({
    data: {
      title,
      description: test.description,
      date: testDate,
      type: "TEST",
      status: "UPCOMING",
      priority: "HIGH",
      color: "#ef4444", // red
      courseId: test.courseId,
      teacherId
    }
  });
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markTestsAsVisited } from "@/app/actions/tests";
import { markVideosAsVisited } from "@/app/actions/videos";
import { markAssignmentsAsVisited, markSchoolAsVisited, markCalendarAsVisited } from "@/app/actions/students";

export function NotificationClearer({ type }: { type: "tests" | "videos" | "assignments" | "school" | "calendar" }) {
  const router = useRouter();

  useEffect(() => {
    if (type === "tests") {
      markTestsAsVisited().then(() => router.refresh()).catch(console.error);
    } else if (type === "videos") {
      markVideosAsVisited().then(() => router.refresh()).catch(console.error);
    } else if (type === "assignments") {
      markAssignmentsAsVisited().then(() => router.refresh()).catch(console.error);
    } else if (type === "school") {
      markSchoolAsVisited().then(() => router.refresh()).catch(console.error);
    } else if (type === "calendar") {
      markCalendarAsVisited().then(() => router.refresh()).catch(console.error);
    }
  }, [type, router]);

  return null;
}

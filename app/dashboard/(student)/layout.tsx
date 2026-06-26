import { StudentSidebar } from "@/components/layout/StudentSidebar";
import { StudentMobileNav } from "@/components/layout/StudentMobileNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role || "STUDENT";

  if (role === "ADMIN" || role === "TEACHER") {
    redirect("/dashboard/admin");
  }

  // Fetch notification marker data
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      lastTestsVisit: true, 
      lastVideosVisit: true, 
      lastAssignmentsVisit: true,
      lastSchoolVisit: true,
      lastCalendarVisit: true,
      schoolGradeId: true 
    }
  });

  const schoolGradeId = dbUser?.schoolGradeId;

  const latestTest = await prisma.test.findFirst({
    where: { 
      isPublished: true,
      OR: [
        { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
        { schoolGradeId: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  const latestVideo = await prisma.globalVideo.findFirst({
    where: {
      OR: [
        { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
        { schoolGradeId: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  const latestAssignment = await prisma.assignment.findFirst({
    where: {
      OR: [
        { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
        { schoolGradeId: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  const latestMaterial = await prisma.gradeMaterial.findFirst({
    where: { gradeId: schoolGradeId || "NO_GRADE_MATCH" },
    orderBy: { createdAt: 'desc' }
  });

  const latestEvent = await prisma.event.findFirst({
    where: {
      OR: [
        { schoolGradeId: schoolGradeId || "NO_GRADE_MATCH" },
        { schoolGradeId: null }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  const safeDate = (d: any) => (d ? new Date(d).getTime() : 0);

  const hasNewTests = !!latestTest && (!dbUser?.lastTestsVisit || safeDate(latestTest.createdAt) > safeDate(dbUser.lastTestsVisit));
  const hasNewVideos = !!latestVideo && (!dbUser?.lastVideosVisit || safeDate(latestVideo.createdAt) > safeDate(dbUser.lastVideosVisit));
  const hasNewAssignments = !!latestAssignment && (!dbUser?.lastAssignmentsVisit || safeDate(latestAssignment.createdAt) > safeDate(dbUser.lastAssignmentsVisit));
  
  // Calculate if My School should have a red dot
  // We check if there are new materials, OR if any of the sub-categories have new items
  const hasNewMaterials = !!latestMaterial && (!dbUser?.lastSchoolVisit || latestMaterial.createdAt > dbUser.lastSchoolVisit);
  const hasNewSchool = hasNewMaterials || hasNewTests || hasNewVideos || hasNewAssignments;
  
  const hasNewCalendar = !!latestEvent && (!dbUser?.lastCalendarVisit || latestEvent.createdAt > dbUser.lastCalendarVisit);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <StudentSidebar hasNewSchool={hasNewSchool} hasNewCalendar={hasNewCalendar} />
      <main className="flex-1 pb-20 md:pb-0 relative overflow-x-clip">
        {/* Mobile top header — logo only visible on small screens */}

        <header className="md:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
          <Image src="/logo.svg" alt="PNT Academy" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="font-black text-sm uppercase tracking-tight text-slate-800 leading-none">PNT Academy</p>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Student Portal</p>
          </div>
        </header>
        {children}
      </main>
      <StudentMobileNav hasNewSchool={hasNewSchool} hasNewCalendar={hasNewCalendar} />
    </div>
  );
}

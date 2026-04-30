import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BarChart, BookOpen, CheckCircle2, ClipboardCheck, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch all enrollments for the student
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          attendances: { where: { userId: session.user.id } },
          // Instead of joining deeply, we will fetch assignments separately 
          // because Assignments are denormalized with courseId.
        }
      }
    }
  });

  // Fetch all assignments that belong to the student's enrolled courses or are legacy (courseId = null)
  const courseIds = enrollments.map(e => e.courseId);
  const assignments = await prisma.assignment.findMany({
    where: {
      OR: [
        { courseId: { in: courseIds } },
        { courseId: null }
      ]
    },
    include: {
      submissions: {
        where: { userId: session.user.id }
      }
    }
  });

  // Analytics Calculation per course
  const courseAnalytics = enrollments.map(enrollment => {
    const course = enrollment.course;
    
    // Attendance
    const totalClasses = course.attendances.length;
    const presentClasses = course.attendances.filter(a => a.status === "PRESENT").length;
    const attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    // Assignments specific to this course
    const courseAssignments = assignments.filter(a => a.courseId === course.id);
    const totalAssignments = courseAssignments.length;
    
    // Submissions
    const submissions = courseAssignments.map(a => a.submissions[0]).filter(Boolean);
    const submittedCount = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.status === "GRADED" && s.score !== null);
    
    // Grades
    const avgGrade = gradedSubmissions.length > 0 
      ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length) 
      : null;

    return {
      course,
      attendance: {
        total: totalClasses,
        present: presentClasses,
        pct: attendancePct
      },
      assignments: {
        total: totalAssignments,
        submitted: submittedCount,
        graded: gradedSubmissions.length,
        pending: totalAssignments - submittedCount,
        avgGrade: avgGrade
      }
    };
  });

  // Aggregate stats
  const totalClasses = courseAnalytics.reduce((acc, c) => acc + c.attendance.total, 0);
  const totalPresent = courseAnalytics.reduce((acc, c) => acc + c.attendance.present, 0);
  const overallAttendance = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  const allGraded = courseAnalytics.flatMap(c => c.assignments.graded > 0 ? [c.assignments.avgGrade] : []).filter(g => g !== null) as number[];
  const overallGrade = allGraded.length > 0 ? Math.round(allGraded.reduce((acc, g) => acc + g, 0) / allGraded.length) : null;

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <BarChart className="text-indigo-600 w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
            Analytics Report
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Your performance across all enrolled courses
          </p>
        </div>
      </header>

      {/* Aggregate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-200/50 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-indigo-200" size={24} strokeWidth={2.5} />
            <h2 className="text-sm font-black uppercase tracking-widest text-indigo-100">Overall Grade Average</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black tracking-tighter">{overallGrade !== null ? overallGrade : "—"}</span>
            <span className="text-lg font-bold text-indigo-200 mb-1">{overallGrade !== null ? "/100" : "No grades yet"}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl p-6 text-white shadow-xl shadow-green-200/50 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="text-green-200" size={24} strokeWidth={2.5} />
            <h2 className="text-sm font-black uppercase tracking-widest text-green-100">Overall Attendance</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black tracking-tighter">{overallAttendance}%</span>
            <span className="text-lg font-bold text-green-200 mb-1">Present</span>
          </div>
          <Progress value={overallAttendance} className="h-2 mt-4 bg-green-700/50 [&>div]:bg-white" />
        </div>
      </div>

      <h2 className="text-xl font-black uppercase text-slate-800 tracking-tight mb-6 flex items-center gap-2">
        <BookOpen size={24} className="text-amber-500" /> Course Breakdown
      </h2>

      {courseAnalytics.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-black text-lg text-slate-400 uppercase">No Enrollments Yet</h3>
          <p className="text-slate-400 text-sm font-medium mt-1">You need to be enrolled in a course to see analytics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courseAnalytics.map(({ course, attendance, assignments }) => (
            <Card key={course.id} className="border-2 border-slate-100 shadow-lg shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-black uppercase text-slate-800 truncate">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x divide-slate-100">
                  {/* Attendance Section */}
                  <div className="p-6 flex flex-col justify-center items-center text-center">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="text-slate-100 stroke-current" strokeWidth="12" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className={`${attendance.pct >= 75 ? "text-green-500" : attendance.pct >= 50 ? "text-amber-500" : "text-red-500"} stroke-current transition-all duration-1000 ease-in-out`} strokeWidth="12" fill="transparent" strokeDasharray={`${attendance.pct * 2.51} 251`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-800">{attendance.pct}%</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendance</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{attendance.present} / {attendance.total} Classes</p>
                  </div>

                  {/* Grades Section */}
                  <div className="p-6 flex flex-col justify-center items-center text-center">
                    <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                       <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" className="text-slate-100 stroke-current" strokeWidth="12" fill="transparent" />
                        <circle cx="50" cy="50" r="40" className="text-indigo-500 stroke-current transition-all duration-1000 ease-in-out" strokeWidth="12" fill="transparent" strokeDasharray={`${(assignments.avgGrade || 0) * 2.51} 251`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-800">{assignments.avgGrade !== null ? assignments.avgGrade : "—"}</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Grade</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{assignments.graded} Graded tasks</p>
                  </div>
                </div>

                {/* Assignment Stats Footer */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-around">
                  <div className="text-center">
                    <p className="text-xl font-black text-slate-800">{assignments.total}</p>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-blue-600">{assignments.submitted}</p>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Submitted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-black text-red-500">{assignments.pending}</p>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

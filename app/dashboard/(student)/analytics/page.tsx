import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { BarChart, BookOpen, CheckCircle2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DownloadReportBtn } from "@/components/ui/DownloadReportBtn";
import { TestPerformanceCharts } from "@/components/analytics/TestPerformanceCharts";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch user details for report card
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, studentId: true }
  });

  // Fetch all enrollments for the student
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: true
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
  const allGraded = courseAnalytics.flatMap(c => c.assignments.graded > 0 ? [c.assignments.avgGrade] : []).filter(g => g !== null) as number[];
  const overallGrade = allGraded.length > 0 ? Math.round(allGraded.reduce((acc, g) => acc + g, 0) / allGraded.length) : null;

  // Fetch Test Performance Data
  const availableTests = await prisma.test.count({ where: { isPublished: true } });
  const testSubmissions = await prisma.testSubmission.findMany({
    where: { userId: session.user.id },
    include: { test: true },
    orderBy: { createdAt: "asc" }
  });

  const totalAttempted = testSubmissions.length;
  let averageScore = 0;
  let highestScore = 0;
  let lowestScore = totalAttempted > 0 ? 100 : 0;
  let passedTests = 0;
  
  let bestTestName = "N/A";
  let worstTestName = "N/A";

  const trendData: any[] = [];
  const comparisonData: any[] = [];
  const distribution = {
    exceptional: 0, // 90-100%
    good: 0,        // 75-89%
    average: 0,     // 60-74%
    poor: 0         // <60%
  };

  testSubmissions.forEach(sub => {
    const percentage = sub.totalMarks > 0 ? Math.round((sub.score / sub.totalMarks) * 100) : 0;
    
    averageScore += percentage;
    if (percentage > highestScore) {
      highestScore = percentage;
      bestTestName = sub.test.title;
    }
    if (percentage <= lowestScore) {
      lowestScore = percentage;
      worstTestName = sub.test.title;
    }
    
    if (percentage >= 60) passedTests++;

    if (percentage >= 90) distribution.exceptional++;
    else if (percentage >= 75) distribution.good++;
    else if (percentage >= 60) distribution.average++;
    else distribution.poor++;

    trendData.push({
      name: sub.test.title,
      percentage,
      date: sub.createdAt.toISOString()
    });

    comparisonData.push({
      name: sub.test.title,
      score: sub.score,
      total: sub.totalMarks
    });
  });

  if (totalAttempted > 0) {
    averageScore = Math.round(averageScore / totalAttempted);
  }

  const distributionData = [
    { name: "90-100%", count: distribution.exceptional, fill: "#10b981" },
    { name: "75-89%", count: distribution.good, fill: "#3b82f6" },
    { name: "60-74%", count: distribution.average, fill: "#f59e0b" },
    { name: "< 60%", count: distribution.poor, fill: "#ef4444" },
  ];

  let recentTrend: "Improving" | "Stable" | "Declining" = "Stable";
  if (totalAttempted >= 2) {
    const last3 = trendData.slice(-3);
    const recentAvg = last3.reduce((acc, t) => acc + t.percentage, 0) / last3.length;
    if (recentAvg > averageScore + 5) recentTrend = "Improving";
    else if (recentAvg < averageScore - 5) recentTrend = "Declining";
  }

  const textualAnalysis = [];
  if (totalAttempted > 0) {
    textualAnalysis.push(`You have attempted ${totalAttempted} tests with an average score of ${averageScore}%.`);
    textualAnalysis.push(`Your strongest performance was in ${bestTestName} with a score of ${highestScore}%.`);
    if (recentTrend === "Improving") textualAnalysis.push(`Great job! Your recent results show an upward trend compared to earlier assessments.`);
    else if (recentTrend === "Declining") textualAnalysis.push(`Your recent scores are slightly declining. Consider reviewing your weaker topics like ${worstTestName}.`);
    else textualAnalysis.push(`Your performance is stable and consistent across tests.`);
    
    if (lowestScore < 60) {
      textualAnalysis.push(`Focus on improving ${worstTestName} where your score dropped to ${lowestScore}%.`);
    }
  }

  const testPerformanceData = {
    trendData,
    distributionData,
    comparisonData,
    summary: {
      totalAttempted,
      totalAvailable: availableTests,
      averageScore,
      highestScore,
      lowestScore,
      passRate: totalAttempted > 0 ? Math.round((passedTests / totalAttempted) * 100) : 0,
      bestTestName,
      worstTestName,
      recentTrend,
      textualAnalysis
    }
  };

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
        
        {courseAnalytics.length > 0 && (
          <DownloadReportBtn 
            studentName={user?.name || "Student"} 
            studentId={user?.studentId}
            overallGrade={overallGrade}
            courseAnalytics={courseAnalytics}
          />
        )}
      </header>

      {/* Aggregate Overview */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-xl shadow-indigo-200/50 flex flex-col justify-between max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-indigo-200" size={24} strokeWidth={2.5} />
            <h2 className="text-sm font-black uppercase tracking-widest text-indigo-100">Overall Grade Average</h2>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black tracking-tighter">{overallGrade !== null ? overallGrade : "—"}</span>
            <span className="text-lg font-bold text-indigo-200 mb-1">{overallGrade !== null ? "/100" : "No grades yet"}</span>
          </div>
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
          {courseAnalytics.map(({ course, assignments }) => (
            <Card key={course.id} className="border-2 border-slate-100 shadow-lg shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-black uppercase text-slate-800 truncate">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-x divide-slate-100">

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

      {/* Test Performance Module */}
      <TestPerformanceCharts data={testPerformanceData} />
    </div>
  );
}

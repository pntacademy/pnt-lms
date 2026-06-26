"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentTests, markTestsAsVisited } from "@/app/actions/tests";
import { FileText, CheckCircle, BookOpen, Clock, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";

type StudentTest = Awaited<ReturnType<typeof getStudentTests>>[0];

export default function StudentTestsPage() {
  const [tests, setTests] = useState<StudentTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getStudentTests().then((data) => {
      setTests(data);
      setIsLoading(false);
    });
    // Clear notification dot
    markTestsAsVisited().then(() => router.refresh()).catch(console.error);
  }, [router]);

  return (
    <div className="min-h-full p-4 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      <header className="sticky top-[61px] md:top-0 z-30 bg-slate-50 pt-4 md:pt-8 pb-4 -mx-4 md:-mx-8 px-4 md:px-8 -mt-4 md:-mt-8 mb-8 border-b border-slate-200 shadow-sm">
        <Link href="/dashboard/school" className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all">
          <ArrowLeft size={16} /> Back to My School
        </Link>
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <FileText size={36} className="text-amber-500" strokeWidth={2.5} />
          My Tests
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Test your knowledge here
        </p>
      </header>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
          Loading tests...
        </div>
      ) : tests.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <FileText size={48} className="text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No tests available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const isCompleted = !!test.submission;
            const scorePercentage = isCompleted
              ? Math.round((test.submission.score / test.submission.totalMarks) * 100)
              : null;

            return (
              <div
                key={test.id}
                className={`bg-white border-2 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col ${isCompleted ? "border-emerald-100" : "border-slate-100 hover:border-amber-200"
                  }`}
              >
                <div
                  className={`h-2 w-full ${isCompleted
                      ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                      : "bg-gradient-to-r from-orange-400 to-amber-500"
                    }`}
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-black text-lg text-slate-800 leading-tight">
                      {test.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                    )}
                  </div>

                  {test.description && (
                    <p className="text-xs font-medium text-slate-500 mb-5 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <BookOpen size={14} className="text-amber-500" />
                      <span className="truncate">{test.course?.title || "Global Test"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>{test._count.questions} Qs</span>
                      <span>{test.totalMarks} Marks</span>
                    </div>

                    {isCompleted ? (
                      <div className="pt-2">
                        <Link
                          href={`/dashboard/tests/${test.id}`}
                          className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl transition-colors hover:bg-emerald-100"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                              Final Score
                            </span>
                            <span className="text-lg font-black leading-none mt-1">
                              {test.submission.score} / {test.submission.totalMarks}
                            </span>
                          </div>
                          <span className="text-2xl font-black">{scorePercentage}%</span>
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={`/dashboard/tests/${test.id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-lg transition-all"
                      >
                        <Play size={16} className="fill-current" /> Start Test
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

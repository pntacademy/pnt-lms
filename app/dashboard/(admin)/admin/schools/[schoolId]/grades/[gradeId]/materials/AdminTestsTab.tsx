"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Plus, Search, Trash2, FileText, Settings, BookOpen } from "lucide-react";
import { getAllTests, deleteTest, togglePublishTest } from "@/app/actions/tests";
import Link from "next/link";

export function AdminTestsTab({ schoolId, gradeId }: { schoolId: string; gradeId: string }) {
  const [tests, setTests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(async () => {
    const data = await getAllTests();
    const gradeTests = data.filter((t: any) => t.schoolGradeId === gradeId);
    setTests(gradeTests);
    setIsLoading(false);
  }, [gradeId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    (t.course?.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the test "${title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteTest(id);
      load();
    });
  };

  const handleTogglePublish = (id: string, isPublished: boolean) => {
    startTransition(async () => {
      await togglePublishTest(id, !isPublished);
      load();
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-slate-100 bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText size={20} />
            </div>
            Grade Tests
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage quizzes and tests for this specific grade.
          </p>
        </div>
        <Link
          href={`/dashboard/admin/tests/create?gradeId=${gradeId}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold uppercase text-sm tracking-wider shadow-sm hover:shadow-md hover:bg-amber-600 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} /> Generate AI Test
        </Link>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by test title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-sm"
          />
        </div>

        {/* Tests Grid */}
        {isLoading ? (
          <div className="py-16 flex justify-center">
             <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center gap-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
            <FileText size={48} className="text-slate-300" strokeWidth={1.5} />
            <p className="font-bold text-lg text-slate-500">
              {search ? "No tests match." : "No tests created yet for this grade."}
            </p>
            <p className="text-sm mt-1 text-slate-400">Click "Generate AI Test" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((test) => (
              <div
                key={test.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-lg text-slate-800 leading-tight">
                      {test.title}
                    </h3>
                    <button
                      onClick={() => handleDelete(test.id, test.title)}
                      disabled={isPending}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {test.description && (
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  <div className="mt-auto space-y-3">
                    {test.course && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 w-fit">
                        <BookOpen size={14} className="text-amber-500" />
                        <span className="truncate">{test.course.title}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${test.isPublished ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {test.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                      <span>{test._count.questions} Qs</span>
                      <span>{test.totalMarks} Marks</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleTogglePublish(test.id, test.isPublished)}
                        disabled={isPending}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black uppercase transition-colors disabled:opacity-50 border-2 ${
                          test.isPublished 
                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                            : 'bg-emerald-50 border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {test.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/dashboard/admin/tests/${test.id}?gradeId=${gradeId}`}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase hover:bg-slate-700 transition-colors shadow-sm"
                      >
                        <Settings size={14} /> Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Search, Trash2, FileText, Settings, BookOpen } from "lucide-react";
import { getAllTests, deleteTest, togglePublishTest } from "@/app/actions/tests";
import Link from "next/link";

type Test = Awaited<ReturnType<typeof getAllTests>>[0];

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    setIsLoading(true);
    const data = await getAllTests();
    setTests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.course?.title.toLowerCase().includes(search.toLowerCase())
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
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <FileText size={36} className="text-indigo-600" strokeWidth={2.5} />
            Manage Tests
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-widest">
            AI-Powered Test Bank · {tests.length} tests
          </p>
        </div>
        <Link
          href="/dashboard/admin/tests/create"
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Generate AI Test
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by test title or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />
      </div>

      {/* Tests Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
          Loading tests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl">
          <FileText size={40} className="text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            {search ? "No tests match." : "No tests created yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((test) => (
            <div
              key={test.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600" />
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
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <BookOpen size={14} className="text-indigo-400" />
                    <span className="truncate">{test.course?.title || "Unknown Course"}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${test.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {test.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>{test._count.questions} Qs</span>
                    <span>{test.totalMarks} Marks</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      onClick={() => handleTogglePublish(test.id, test.isPublished)}
                      disabled={isPending}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-black uppercase transition-colors disabled:opacity-50 border ${
                        test.isPublished 
                          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {test.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <Link
                      href={`/dashboard/admin/tests/${test.id}`}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-black uppercase hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
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
  );
}

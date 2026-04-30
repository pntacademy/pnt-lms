"use client";

import { useState, useEffect, useTransition } from "react";
import {
  FileCheck2, CheckCircle2, Download, Search, X,
  ChevronRight, Plus, Trash2, BookOpen, Calendar,
  ClipboardList, Users,
} from "lucide-react";
import {
  getAllSubmissions, gradeSubmission,
  getAllAssignments, getCoursesWithTopics,
  createAssignment, deleteAssignment,
} from "@/app/actions/adminAssignments";
import { getDownloadPresignedUrl } from "@/app/actions/download";

type Tab = "assign" | "grade";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  courseTopic: { id: string; title: string; course: { id: string; title: string } } | null;
  project: { id: number; title: string } | null;
  _count: { submissions: number };
};

type Submission = {
  id: string;
  status: string;
  score: number | null;
  feedback: string | null;
  fileUrl: string | null;
  studentNotes: string | null;
  submittedAt: Date;
  user: { name: string | null; studentId: string | null; className: string | null };
  assignment: { title: string; project: { id: number; title: string } | null; courseTopic: { title: string; course: { title: string } } | null };
};

type CourseTopic = { id: string; title: string };
type Course = { id: string; title: string; topics: CourseTopic[] };

export default function AdminAssignmentsPage() {
  const [tab, setTab] = useState<Tab>("assign");

  // Assign tab state
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Grade tab state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const [a, c, s] = await Promise.all([getAllAssignments(), getCoursesWithTopics(), getAllSubmissions()]);
    if (a.success && a.assignments) setAssignments(a.assignments as Assignment[]);
    if (c.success && c.courses) setCourses(c.courses as Course[]);
    if (s.success && s.submissions) setSubmissions(s.submissions as Submission[]);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Topics for currently selected course
  const selectedCourseTopics = courses.find(c => c.id === selectedCourseId)?.topics ?? [];
  const pendingCount = submissions.filter(s => s.status === "SUBMITTED").length;

  // ── Create Assignment ──────────────────────────────────────────
  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    startTransition(async () => {
      const fd = new FormData(e.currentTarget);
      const res = await createAssignment(fd);
      if (res.error) { setFormError(res.error); return; }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      load();
    });
  };

  // ── Delete Assignment ──────────────────────────────────────────
  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? All student submissions for this assignment will also be removed.`)) return;
    startTransition(async () => { await deleteAssignment(id); load(); });
  };

  // ── Grade Submission ──────────────────────────────────────────
  const handleDownload = async (objectKey: string | null, filename: string) => {
    if (!objectKey) return alert("No file attached");
    try {
      const { presignedUrl, error } = await getDownloadPresignedUrl(objectKey);
      if (error || !presignedUrl) throw new Error(error || "Failed to generate download URL");
      const a = document.createElement("a");
      a.href = presignedUrl; a.target = "_blank"; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (err: any) { alert(err.message); }
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    const numScore = parseInt(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) return alert("Enter a score between 0–100");
    setIsGrading(true);
    try {
      const res = await gradeSubmission(selectedSubmission.id, numScore, feedback);
      if (res.error) throw new Error(res.error);
      setSelectedSubmission(null); setScore(""); setFeedback("");
      load();
    } catch (err: any) { alert(err.message); }
    finally { setIsGrading(false); }
  };

  const filtered = submissions.filter(sub => {
    const t = searchTerm.toLowerCase();
    return sub.user.name?.toLowerCase().includes(t) ||
      sub.assignment.title.toLowerCase().includes(t) ||
      sub.user.studentId?.toLowerCase().includes(t);
  });

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <FileCheck2 size={36} className="text-indigo-600" strokeWidth={2.5} />
            Assignments
          </h1>
          <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Staff Portal · {assignments.length} assignments · {pendingCount} pending review
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {([
          ["assign", ClipboardList, "Assign Work", assignments.length],
          ["grade", FileCheck2, "Grade Submissions", pendingCount],
        ] as const).map(([t, Icon, label, count]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all -mb-px ${
              tab === t
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon size={15} />
            {label}
            {count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                tab === t ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
              }`}>{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── ASSIGN TAB ── */}
      {tab === "assign" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Plus size={18} /> New Assignment
            </button>
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Loading...</div>
          ) : assignments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 bg-white border border-slate-200 rounded-xl">
              <ClipboardList size={40} className="text-slate-200" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No assignments yet</p>
              <p className="text-xs text-slate-400">Create your first assignment so students can submit their work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map(a => (
                <div key={a.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 w-full" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full inline-block mb-1.5">
                          {a.courseTopic ? a.courseTopic.course.title : (a.project ? `Project ${a.project.id}` : "Assignment")}
                        </span>
                        <h3 className="font-black text-sm text-slate-800 leading-tight">{a.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {a.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{a.description}</p>}

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><Users size={12} /> {a._count.submissions} submissions</span>
                      {a.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-slate-400 truncate">
                      <span className="font-bold text-slate-500">Topic:</span> {a.courseTopic?.title || a.project?.title || "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Assignment Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b bg-slate-50">
                  <h2 className="font-black text-lg uppercase text-slate-800">New Assignment</h2>
                  <button onClick={() => { setShowForm(false); setFormError(""); }} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><X size={20} /></button>
                </div>
                <form onSubmit={handleCreate} className="p-6 space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg">{formError}</div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Title *</label>
                    <input required name="title" placeholder="e.g. Traffic Light Code Submission" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Description</label>
                    <textarea name="description" rows={3} placeholder="Describe what students need to submit..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Course *</label>
                    <select required name="courseId" value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                      <option value="">Select a course...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Topic *</label>
                    <select required name="courseTopicId" disabled={!selectedCourseId} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white disabled:bg-slate-50 disabled:text-slate-400">
                      <option value="">Select a topic...</option>
                      {selectedCourseTopics.map(t => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Due Date</label>
                    <input name="dueDate" type="datetime-local" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <button type="submit" disabled={isPending}
                    className="w-full h-11 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
                    {isPending ? "Creating..." : "Create Assignment"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── GRADE TAB ── */}
      {tab === "grade" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text" placeholder="Search by student, ID or assignment..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
          </div>

          {isLoading ? (
            <div className="p-16 text-center text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 bg-white border border-slate-200 rounded-xl">
              <CheckCircle2 size={40} className="text-slate-200" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No submissions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(sub => (
                <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${sub.status === "GRADED" ? "bg-green-400" : "bg-amber-400"}`} />
                      <div>
                        <p className="font-black text-sm text-slate-800">{sub.user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{sub.user.studentId} · {sub.user.className}</p>
                        <p className="text-xs text-slate-600 mt-1 font-medium">{sub.assignment.title}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {sub.status === "GRADED" ? (
                      <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-black rounded-full">{sub.score}/100</span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black rounded-full">Pending</span>
                    )}
                    <button
                      onClick={() => { setSelectedSubmission(sub); setScore(sub.score?.toString() || ""); setFeedback(sub.feedback || ""); }}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase rounded-lg hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                    >
                      Review <ChevronRight size={13} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grade Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-slate-50">
              <div>
                <h2 className="font-black text-lg uppercase text-slate-800">Review Submission</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  {selectedSubmission.user.name} · {selectedSubmission.assignment.courseTopic?.course.title || "Project " + selectedSubmission.assignment.project?.id}
                </p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assignment</p>
                  <p className="text-sm font-bold text-slate-800">{selectedSubmission.assignment.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Attached File</p>
                  <button
                    onClick={() => handleDownload(selectedSubmission.fileUrl, `${selectedSubmission.user.name}_Submission`)}
                    className="w-full flex items-center justify-between p-4 bg-indigo-50 border-2 border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck2 size={22} className="text-indigo-500" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-indigo-900">View Attachment</p>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase">Download from Cloudflare R2</p>
                      </div>
                    </div>
                    <Download size={16} className="text-indigo-400" />
                  </button>
                </div>
                {selectedSubmission.studentNotes && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Notes</p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 italic">"{selectedSubmission.studentNotes}"</div>
                  </div>
                )}
              </div>
              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 mb-1.5 block">Score (0-100)</label>
                  <input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)}
                    className="w-28 h-12 px-3 text-2xl font-black text-indigo-600 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center" placeholder="--" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-700 mb-1.5 block">Feedback</label>
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none"
                    placeholder="Great work! Next time try to..." />
                </div>
                <button onClick={handleGradeSubmit} disabled={isGrading || !score}
                  className="w-full py-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl font-black uppercase text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50">
                  {isGrading ? "Saving..." : "Save Grade & Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

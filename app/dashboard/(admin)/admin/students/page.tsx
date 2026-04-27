"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Users, Search, Plus, X, Trash2, GraduationCap,
  CheckCircle2, ClipboardCheck, BookOpen, ChevronRight,
  Phone, Building2, Calendar, Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllStudents, registerStudent, deleteStudent } from "@/app/actions/students";
import { getCourses } from "@/app/actions/attendance";

type Student = Awaited<ReturnType<typeof getAllStudents>>[0];
type Course = { id: string; title: string };

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setIsLoading(true);
    const [s, c] = await Promise.all([getAllStudents(), getCourses()]);
    setStudents(s);
    setCourses(c);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.className?.toLowerCase().includes(q) ||
      s.instituteName?.toLowerCase().includes(q)
    );
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const formData = new FormData(e.currentTarget);
        const result = await registerStudent(formData);
        setMessage({ type: "success", text: `Student registered! Roll ID: ${result.studentId}` });
        setShowModal(false);
        load();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  const downloadRoster = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("PNT Academy — Student Roster", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Total: ${students.length} students`, 14, 26);
    autoTable(doc, {
      startY: 32,
      head: [["Roll ID", "Name", "Class", "School", "Contact", "Attendance", "Avg Score"]],
      body: students.map(s => [
        s.studentId || "—",
        s.name || "—",
        s.className || "—",
        s.instituteName || "—",
        s.contactNumber || "—",
        s.attendancePct !== null ? `${s.attendancePct}%` : "—",
        s.avgScore !== null ? `${s.avgScore}/100` : "—",
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
    doc.save(`PNT_Roster_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleDelete = (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.name}? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteStudent(student.id);
        load();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <Users size={36} className="text-indigo-600" strokeWidth={2.5} />
            Manage Students
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Staff Portal &bull; {students.length} Total Students
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Register Student
        </button>
        <button
          onClick={downloadRoster}
          disabled={students.length === 0}
          className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-black uppercase text-sm tracking-wider hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-40"
        >
          <Download size={20} /> Download Roster
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border-2 text-sm font-bold uppercase tracking-wide ${
          message.type === "error"
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, roll ID, class, or school..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />
      </div>

      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-3">
            <Users size={40} className="text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              {search ? "No students match your search." : "No students registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500 tracking-widest">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500 tracking-widest hidden md:table-cell">School</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase text-slate-500 tracking-widest hidden lg:table-cell">Attendance</th>
                  <th className="px-4 py-3 text-center text-xs font-black uppercase text-slate-500 tracking-widest hidden lg:table-cell">Avg Score</th>
                  <th className="px-4 py-3 text-right text-xs font-black uppercase text-slate-500 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                          {student.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{student.name}</div>
                          <div className="text-xs font-mono text-slate-400 mt-0.5">{student.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="text-sm font-medium text-slate-600">{student.instituteName || "—"}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{student.className || "—"}</div>
                    </td>
                    <td className="px-4 py-4 text-center hidden lg:table-cell">
                      {student.attendancePct !== null ? (
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-lg font-black ${
                            student.attendancePct >= 75 ? "text-green-600" :
                            student.attendancePct >= 50 ? "text-amber-500" : "text-red-500"
                          }`}>{student.attendancePct}%</span>
                          <span className="text-[10px] text-slate-400">{student.totalAttendance} classes</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-sm font-bold">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center hidden lg:table-cell">
                      {student.avgScore !== null ? (
                        <span className="text-lg font-black text-indigo-600">{student.avgScore}<span className="text-xs text-slate-400">/100</span></span>
                      ) : (
                        <span className="text-slate-300 text-sm font-bold">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(student); }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="font-black text-lg uppercase text-slate-800 tracking-tight">Register New Student</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Full Name *</label>
                  <input required name="name" placeholder="e.g. Rahul Sharma" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Class *</label>
                  <input required name="className" placeholder="e.g. Grade 10" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Age</label>
                  <input type="number" name="age" placeholder="e.g. 15" min={5} max={25} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">School / Institute</label>
                  <input name="instituteName" placeholder="e.g. PNT Public School" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Contact Number</label>
                  <input name="contactNumber" placeholder="e.g. +91 98765 43210" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Enroll in Course</label>
                  <select name="courseId" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="">— None —</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-400">A unique Roll ID (e.g. PNT-2026-011) will be auto-generated.</p>
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isPending ? "Registering..." : "Register & Generate ID"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm h-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 sticky top-0">
              <h2 className="font-black text-base uppercase text-slate-800 tracking-tight">Student Profile</h2>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar + Name */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-3xl">
                  {selectedStudent.name?.charAt(0) || "?"}
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-800">{selectedStudent.name}</h3>
                  <p className="font-mono text-sm text-indigo-600 font-bold">{selectedStudent.studentId}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-green-600">
                    {selectedStudent.attendancePct !== null ? `${selectedStudent.attendancePct}%` : "—"}
                  </div>
                  <div className="text-xs font-black uppercase text-green-500 tracking-widest mt-1">Attendance</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-indigo-600">
                    {selectedStudent.avgScore !== null ? `${selectedStudent.avgScore}` : "—"}
                  </div>
                  <div className="text-xs font-black uppercase text-indigo-500 tracking-widest mt-1">Avg Score</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {[
                  { icon: GraduationCap, label: "Class", value: selectedStudent.className },
                  { icon: Building2, label: "School", value: selectedStudent.instituteName },
                  { icon: Phone, label: "Contact", value: selectedStudent.contactNumber },
                  { icon: Calendar, label: "Joined", value: selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null },
                ].map(({ icon: Icon, label, value }) => (
                  value && (
                    <div key={label} className="flex items-center gap-3 py-2 border-b border-slate-100">
                      <Icon size={16} className="text-slate-400 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</div>
                        <div className="text-sm font-bold text-slate-700">{value}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Enrolled Courses */}
              {selectedStudent.enrolledCourses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                    <BookOpen size={14} /> Enrolled Courses
                  </div>
                  {selectedStudent.enrolledCourses.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700">
                      <CheckCircle2 size={14} className="text-green-500" /> {c}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 border border-slate-100 rounded-xl p-3">
                <div>
                  <div className="text-lg font-black text-slate-700">{selectedStudent.totalAttendance}</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-center gap-1"><ClipboardCheck size={10} />Records</div>
                </div>
                <div>
                  <div className="text-lg font-black text-slate-700">{selectedStudent.totalSubmissions}</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Submissions</div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedStudent)}
                className="w-full flex items-center justify-center gap-2 h-11 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl font-black uppercase text-sm tracking-wider hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} /> Remove Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

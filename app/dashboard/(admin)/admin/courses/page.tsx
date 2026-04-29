"use client";

import { useState, useEffect, useTransition } from "react";
import {
  BookOpen, Plus, X, Trash2, Search, Users,
  ChevronRight, Link2, GraduationCap, ClipboardCheck,
  UserPlus, UserMinus, Info,
} from "lucide-react";
import {
  getAllCourses,
  createCourse,
  deleteCourse,
  enrollStudent,
  unenrollStudent,
  getAllStudentsForEnroll,
} from "@/app/actions/courses";

type Course = Awaited<ReturnType<typeof getAllCourses>>[0];
type Student = Awaited<ReturnType<typeof getAllStudentsForEnroll>>[0];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollSearch, setEnrollSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setIsLoading(true);
    const [c, s] = await Promise.all([getAllCourses(), getAllStudentsForEnroll()]);
    setCourses(c);
    setStudents(s);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Refresh selected course from updated list
  useEffect(() => {
    if (selectedCourse) {
      const updated = courses.find(c => c.id === selectedCourse.id);
      if (updated) setSelectedCourse(updated);
    }
  }, [courses]);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const fd = new FormData(e.currentTarget);
        await createCourse(fd);
        setMessage({ type: "success", text: "Course created successfully!" });
        setShowModal(false);
        load();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  const handleDelete = (course: Course) => {
    if (!confirm(`Delete "${course.title}"? This will remove all enrollments and attendance records.`)) return;
    startTransition(async () => {
      try {
        await deleteCourse(course.id);
        if (selectedCourse?.id === course.id) setSelectedCourse(null);
        load();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  const handleEnroll = (userId: string) => {
    if (!selectedCourse) return;
    startTransition(async () => {
      await enrollStudent(selectedCourse.id, userId);
      load();
    });
  };

  const handleUnenroll = (userId: string) => {
    if (!selectedCourse) return;
    startTransition(async () => {
      await unenrollStudent(selectedCourse.id, userId);
      load();
    });
  };

  const enrolledIds = new Set(selectedCourse?.enrollments.map(e => e.user.id) ?? []);
  const unenrolledStudents = students.filter(s =>
    !enrolledIds.has(s.id) &&
    (s.name?.toLowerCase().includes(enrollSearch.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(enrollSearch.toLowerCase()))
  );

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <BookOpen size={36} className="text-indigo-600" strokeWidth={2.5} />
            Manage Courses
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Staff Portal · {courses.length} Total Courses
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> New Course
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
          placeholder="Search courses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
          Loading courses...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl">
          <BookOpen size={40} className="text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            {search ? "No courses match your search." : "No courses yet. Create your first!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden"
            >
              {/* Card top accent */}
              <div className={`h-2 w-full ${course.isInternship ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${
                      course.isInternship ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                    }`}>
                      {course.isInternship ? "Internship" : "Course"}
                    </span>
                    <h3 className="font-black text-slate-800 leading-tight">{course.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(course)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {course.description && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{course.description}</p>
                )}

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {course._count.enrollments} enrolled
                  </span>
                  <span className="flex items-center gap-1">
                    <ClipboardCheck size={13} /> {course._count.attendances} sessions
                  </span>
                </div>

                {course.driveLink && (
                  <a
                    href={course.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 hover:text-indigo-700 mb-3 truncate"
                  >
                    <Link2 size={12} /> Drive Link
                  </a>
                )}

                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                >
                  <span>Manage Enrollment</span>
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="font-black text-lg uppercase text-slate-800 tracking-tight">Create New Course</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Course Title *</label>
                <input required name="title" placeholder="e.g. Introduction to Robotics" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Description</label>
                <textarea name="description" rows={3} placeholder="What will students learn?" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Google Drive Link</label>
                <input name="driveLink" type="url" placeholder="https://drive.google.com/..." className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <input type="checkbox" id="isInternship" name="isInternship" value="true" className="w-4 h-4 accent-emerald-600" />
                <label htmlFor="isInternship" className="text-sm font-bold text-emerald-700">Mark as Internship Program</label>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enrollment Drawer */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-end p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm h-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 sticky top-0">
              <div>
                <h2 className="font-black text-base uppercase text-slate-800 tracking-tight">Enrollment</h2>
                <p className="text-xs font-bold text-indigo-500 truncate max-w-[200px]">{selectedCourse.title}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Currently Enrolled */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Users size={11} /> Enrolled ({selectedCourse.enrollments.length})
                </p>
                {selectedCourse.enrollments.length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">No students enrolled yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCourse.enrollments.map(e => (
                      <div key={e.user.id} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{e.user.name}</p>
                          <p className="text-[10px] font-mono text-indigo-500">{e.user.studentId}</p>
                        </div>
                        <button
                          onClick={() => handleUnenroll(e.user.id)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from course"
                        >
                          <UserMinus size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Students */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <UserPlus size={11} /> Add Students
                </p>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by name or roll ID..."
                    value={enrollSearch}
                    onChange={e => setEnrollSearch(e.target.value)}
                    className="w-full pl-8 pr-3 h-9 rounded-lg border border-slate-200 bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                {unenrolledStudents.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic p-2">
                    <Info size={13} />
                    {students.length === 0 ? "No students registered." : "All students are enrolled."}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unenrolledStudents.map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{s.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{s.studentId}</p>
                        </div>
                        <button
                          onClick={() => handleEnroll(s.id)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Enroll in course"
                        >
                          <UserPlus size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

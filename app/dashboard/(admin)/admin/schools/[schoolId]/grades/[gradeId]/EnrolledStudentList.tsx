"use client";

import { useState, useMemo } from "react";
import { Users, GraduationCap, Search, Filter, Download, Trash2, Send, CheckSquare, Mail, RefreshCcw } from "lucide-react";
import { bulkUpdateSchoolGrade, bulkUnenrollStudents } from "@/app/actions/schools";
import { PasswordVisibilityToggle } from "./PasswordVisibilityToggle";
import { DeleteStudentButton } from "./DeleteStudentButton";
import { DownloadRosterButton } from "./DownloadRosterButton";
import { StudentStatus } from "@prisma/client";

type Student = {
  id: string;
  name: string | null;
  studentId: string | null;
  email: string | null;
  studentStatus: StudentStatus;
  customStatus: string | null;
  createdAt: Date;
  plainPassword?: string | null;
};

type Grade = {
  id: string;
  gradeName: string;
  schoolId: string;
};

export function EnrolledStudentList({
  students,
  gradeName,
  schoolId,
  gradeId,
  allSchoolGrades,
}: {
  students: Student[];
  gradeName: string;
  schoolId: string;
  gradeId: string;
  allSchoolGrades: Grade[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "ALL">("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [targetGradeId, setTargetGradeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filtering
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        (s.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (s.studentId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (s.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || s.studentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Actions
  const handleAssignGrade = async () => {
    if (!targetGradeId) return;
    setIsLoading(true);
    try {
      await bulkUpdateSchoolGrade(Array.from(selectedIds), targetGradeId, schoolId, gradeId);
      setShowGradeModal(false);
      setSelectedIds(new Set());
      alert("Students moved successfully.");
    } catch (e: any) {
      alert("Error moving students: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    if (!confirm(`Are you sure you want to unenroll ${selectedIds.size} student(s) from this grade? They will remain in the system but will no longer be assigned to this grade.`)) {
      return;
    }
    setIsLoading(true);
    try {
      await bulkUnenrollStudents(Array.from(selectedIds), schoolId, gradeId);
      setSelectedIds(new Set());
      alert("Students unenrolled successfully.");
    } catch (e: any) {
      alert("Error unenrolling students: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };



  const handleExportCSV = () => {
    const selectedStudents = students.filter(s => selectedIds.has(s.id));
    if (selectedStudents.length === 0) return;

    const headers = ["Name", "Student ID", "Email", "Status", "Enrollment Date"];
    const rows = selectedStudents.map(s => [
      `"${s.name || ""}"`,
      `"${s.studentId || ""}"`,
      `"${s.email || ""}"`,
      `"${s.studentStatus}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `enrolled_students_${gradeName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
      {/* Header and Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 shrink-0 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Enrolled Students
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full ml-2">
              {students.length} Total
            </span>
          </h2>
          <DownloadRosterButton students={students} gradeName={gradeName} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div className="relative w-full sm:w-auto min-w-[150px]">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-white"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(StudentStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50/80 border-b border-indigo-100 p-3 px-6 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 shrink-0">
          <span className="text-indigo-800 font-semibold text-sm">
            {selectedIds.size} student(s) selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowGradeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Assign Grade
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={handleUnenroll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Unenroll
            </button>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="flex-1 overflow-y-auto p-2">
        {students.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <GraduationCap className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No students added yet. Use the bulk upload tool above.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Search className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No students found matching your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Table Header / Select All */}
            <div className="flex items-center px-4 py-2 bg-slate-50/50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="ml-1">Select All</span>
              </label>
            </div>
            
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center rounded-xl group">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                    checked={selectedIds.has(student.id)}
                    onChange={() => toggleSelect(student.id)}
                  />
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      {student.name}
                      {student.studentStatus !== "STUDENT" && (
                        <span className="text-[10px] uppercase bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                          {student.studentStatus}
                        </span>
                      )}
                    </p>
                    <div className="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{student.studentId}</span>
                      {student.email && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1 font-sans"><Mail className="w-3 h-3"/> {student.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <PasswordVisibilityToggle plainPassword={student.plainPassword as any} />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteStudentButton 
                      studentId={student.id}
                      schoolId={schoolId}
                      gradeId={gradeId}
                      studentName={student.name!}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showGradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Assign to Grade</h3>
            <p className="text-sm text-slate-500 mb-6">Move {selectedIds.size} student(s) to a different grade.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Grade</label>
                <select
                  value={targetGradeId}
                  onChange={(e) => setTargetGradeId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                >
                  <option value="" disabled>Select a grade...</option>
                  {allSchoolGrades.map(g => (
                    <option key={g.id} value={g.id} disabled={g.id === gradeId}>
                      {g.gradeName} {g.id === gradeId ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setShowGradeModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignGrade}
                disabled={isLoading || !targetGradeId}
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

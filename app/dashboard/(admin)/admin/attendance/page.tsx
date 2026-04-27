"use client";

import { useState, useEffect } from "react";
import { ClipboardCheck, Users, Calendar as CalendarIcon, Save, Search, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCourses, getCourseAttendance, saveBulkAttendance } from "@/app/actions/attendance";

type Course = { id: string, title: string };
type StudentRecord = {
  userId: string;
  studentId: string;
  name: string;
  className: string;
  status: "PRESENT" | "ABSENT" | "LATE" | null;
};

export default function AdminAttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    // Load courses on mount
    getCourses().then(data => {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0].id);
      }
    }).catch(err => console.error("Failed to load courses:", err));
  }, []);

  const fetchAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    
    setIsLoading(true);
    setMessage(null);
    try {
      const data = await getCourseAttendance(selectedCourse, selectedDate);
      setStudents(data);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to load students" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && selectedDate) {
      fetchAttendance();
    }
  }, [selectedCourse, selectedDate]);

  const handleStatusChange = (userId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setStudents(prev => prev.map(s => s.userId === userId ? { ...s, status } : s));
  };

  const handleMarkAll = (status: "PRESENT" | "ABSENT" | "LATE") => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSave = async () => {
    // Check if all students have a status
    const unmarked = students.filter(s => !s.status);
    if (unmarked.length > 0) {
      setMessage({ type: "error", text: `Please mark attendance for all students (${unmarked.length} unmarked)` });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      // Filter out nulls just in case, though we checked above
      const recordsToSave = students
        .filter((s): s is StudentRecord & { status: "PRESENT" | "ABSENT" | "LATE" } => s.status !== null)
        .map(s => ({
          userId: s.userId,
          status: s.status
        }));
        
      await saveBulkAttendance(selectedCourse, selectedDate, recordsToSave);
      setMessage({ type: "success", text: "Attendance records saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save attendance" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <ClipboardCheck size={36} className="text-indigo-600" strokeWidth={2.5} />
          Student Attendance
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Staff Portal &bull; Bulk Registration
        </p>
      </header>

      {/* Control Panel */}
      <Card className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 w-full md:w-1/3">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Select Course</Label>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <option value="" disabled>Select a course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2 w-full md:w-1/3">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 h-10 font-medium" 
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button 
              onClick={fetchAttendance}
              disabled={isLoading || !selectedCourse}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 h-10 bg-slate-800 text-white rounded-md font-bold uppercase text-xs hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <Search size={16} /> {isLoading ? "Loading..." : "Fetch"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`px-4 py-3 text-sm font-bold uppercase tracking-wide border-b ${
            message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Student List */}
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">
              Loading student roster...
            </div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm flex flex-col items-center gap-3">
              <Users size={32} className="opacity-20" />
              {selectedCourse ? "No students enrolled in this course yet." : "Please select a course to view students."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b border-slate-200">
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest w-1/3">Student</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Details</th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest text-right">
                    <div className="flex justify-end gap-2">
                      <span className="mr-4 hidden md:inline">Quick Mark:</span>
                      <button onClick={() => handleMarkAll("PRESENT")} className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] hover:bg-green-200 transition-colors">All P</button>
                      <button onClick={() => handleMarkAll("ABSENT")} className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] hover:bg-red-200 transition-colors">All A</button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student.userId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-sm text-slate-800">{student.name}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{student.studentId}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium text-slate-600 bg-slate-200/50 inline-block px-2 py-1 rounded">
                        {student.className}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleStatusChange(student.userId, "PRESENT")}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                            student.status === "PRESENT" 
                              ? "bg-green-500 border-green-600 text-white shadow-md shadow-green-200" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-green-300 hover:text-green-500"
                          }`}
                        >
                          <CheckCircle2 size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Present</span>
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(student.userId, "LATE")}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                            student.status === "LATE" 
                              ? "bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-200" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-500"
                          }`}
                        >
                          <Clock size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Late</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(student.userId, "ABSENT")}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black uppercase tracking-wider border-2 transition-all ${
                            student.status === "ABSENT" 
                              ? "bg-red-500 border-red-600 text-white shadow-md shadow-red-200" 
                              : "bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500"
                          }`}
                        >
                          <XCircle size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {students.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Total: {students.length} Students
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving || students.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-lg font-black uppercase tracking-wider text-sm shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <Save size={18} /> {isSaving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ClipboardCheck, Users, Calendar as CalendarIcon, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { markAttendance } from "@/app/actions/attendance";

export default function AdminAttendancePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    
    try {
      const formData = new FormData(e.currentTarget);
      await markAttendance(formData);
      setSuccessMsg("Attendance marked successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert("Error marking attendance: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <ClipboardCheck size={36} className="text-red-500" strokeWidth={2.5} />
          Mark Attendance
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Teacher & Admin Portal
        </p>
      </header>

      <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <CardTitle className="text-xl font-black uppercase text-slate-800">New Attendance Record</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {successMsg && (
              <div className="p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg text-sm font-bold uppercase tracking-wide">
                {successMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Student ID</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input required name="studentId" placeholder="e.g. PNT-2026-001" className="pl-10 h-12 font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Course ID</Label>
              <div className="relative">
                <ClipboardCheck className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input required name="courseId" placeholder="e.g. course-1" defaultValue="course-1" className="pl-10 h-12 font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                <Input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="pl-10 h-12 font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Status</Label>
              <select name="status" required className="flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium">
                <option value="PRESENT">PRESENT</option>
                <option value="ABSENT">ABSENT</option>
                <option value="LATE">LATE</option>
              </select>
            </div>

          </CardContent>
          <CardFooter className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-red-400 to-rose-500 text-white rounded-lg font-black uppercase text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Save size={18} /> {isSubmitting ? "Saving..." : "Save Record"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

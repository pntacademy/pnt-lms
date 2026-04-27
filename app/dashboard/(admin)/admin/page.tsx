"use client";

import Link from "next/link";
import { Settings, PlusCircle, Users, CheckSquare, BarChart } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <Settings size={36} className="text-indigo-600" strokeWidth={2.5} />
          Staff Portal
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Manage courses, assignments, and students
        </p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/admin/courses" className="flex flex-col items-center justify-center gap-2 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 border border-indigo-700 rounded-xl shadow-md hover:-translate-y-1 hover:shadow-lg transition-all group">
          <PlusCircle size={32} strokeWidth={2.5} className="text-white" />
          <span className="font-black uppercase text-sm text-white">Manage Courses</span>
        </Link>
        <Link href="/dashboard/admin/assignments" className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <CheckSquare size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Grade Assignments</span>
        </Link>
        <Link href="/dashboard/admin/attendance" className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <Users size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Mark Attendance</span>
        </Link>
        <Link href="/dashboard/admin/students" className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <BarChart size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Manage Students</span>
        </Link>
      </div>

      {/* Student Onboarding - redirects to dedicated Students page */}
      <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-slate-800 mb-1">Student Onboarding & ID Generation</h2>
          <p className="text-sm text-slate-500 font-medium">Register new students and generate roll IDs from the Students module.</p>
        </div>
        <Link
          href="/dashboard/admin/students"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          <Users size={18} /> Go to Students
        </Link>
      </div>
    </div>
  );
}

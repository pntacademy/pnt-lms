"use client";

import { Settings, PlusCircle, Users, CheckSquare, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <Settings size={36} className="text-rose-600" strokeWidth={2.5} />
          Admin & Teacher Panel
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Manage courses, assignments, and students
        </p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-gradient-to-br from-amber-400 to-orange-500 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:shadow-xl active:translate-y-1  transition-all">
          <PlusCircle size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Add New Course</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:translate-y-1  transition-all">
          <CheckSquare size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Grade Assignments</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:translate-y-1  transition-all">
          <Users size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Mark Attendance</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-1 hover:shadow-xl active:translate-y-1  transition-all">
          <BarChart size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Student Reports</span>
        </button>
      </div>

      {/* Recent Activity / Pending Grading */}
      <h2 className="text-2xl font-black uppercase text-slate-800 mb-4">Pending Grading</h2>
      <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-xs uppercase tracking-widest font-black text-slate-600">
                <th className="p-4 border-r-2 border-slate-200">Student</th>
                <th className="p-4 border-r-2 border-slate-200">Course</th>
                <th className="p-4 border-r-2 border-slate-200">Assignment</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r-2 border-slate-200 font-bold text-sm text-slate-800">
                    Student {item}
                  </td>
                  <td className="p-4 border-r-2 border-slate-200 font-bold text-sm text-slate-600">
                    Robotics Masterclass
                  </td>
                  <td className="p-4 border-r-2 border-slate-200 font-bold text-sm text-slate-600">
                    Project {item}: Line Follower
                  </td>
                  <td className="p-4">
                    <button className="px-4 py-2 bg-black text-white text-xs font-black uppercase border border-slate-200 rounded hover:bg-gradient-to-br from-amber-400 to-orange-500 hover:text-slate-800 transition-colors">
                      Review File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

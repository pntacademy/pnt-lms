"use client";

import { ClipboardCheck, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function AttendancePage() {
  const attendanceRecords = [
    { id: 1, date: "2026-04-20", status: "PRESENT", topic: "Robotics Basics: Motors & Sensors" },
    { id: 2, date: "2026-04-18", status: "PRESENT", topic: "Introduction to Microcontrollers" },
    { id: 3, date: "2026-04-15", status: "ABSENT", topic: "Arduino Setup & Hello World" },
    { id: 4, date: "2026-04-12", status: "LATE", topic: "Breadboards & Wiring" },
  ];

  const totalClasses = 24;
  const attended = 18;
  const attendanceRate = Math.round((attended / totalClasses) * 100);

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight flex items-center gap-3">
          <ClipboardCheck size={36} className="text-[#dc0a2d]" strokeWidth={2.5} />
          Attendance
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Track your live session presence
        </p>
      </header>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 border-4 border-black rounded-xl neo-shadow overflow-hidden bg-white">
          <CardHeader className="border-b-4 border-black bg-[#ffcb05]">
            <CardTitle className="text-xl font-black uppercase text-black">Overall Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-black">{attendanceRate}%</span>
              <span className="text-sm font-bold text-slate-500 uppercase">{attended} of {totalClasses} Sessions</span>
            </div>
            <Progress value={attendanceRate} className="h-4 border-2 border-black" />
          </CardContent>
        </Card>

        <Card className="col-span-1 border-4 border-black rounded-xl neo-shadow overflow-hidden bg-white">
           <CardHeader className="border-b-4 border-black bg-slate-100">
            <CardTitle className="text-lg font-black uppercase text-black">Live Session Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full space-y-4">
            <div className="text-sm font-bold text-slate-600 mb-2">
              Next Live Zoom Class in: 2 days
            </div>
            {/* Teacher View Placeholder Button */}
            <div className="w-full">
              <button className="w-full px-4 py-3 bg-[#dc0a2d] text-white border-2 border-black rounded-lg neo-shadow-sm font-black uppercase text-xs hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all">
                Join Zoom (Student)
              </button>
            </div>
            <div className="w-full">
              <button className="w-full px-4 py-3 bg-black text-white border-2 border-black rounded-lg neo-shadow-sm font-black uppercase text-xs hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                <ClipboardCheck size={16} /> Mark Attendance (Admin)
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <h2 className="text-2xl font-black uppercase text-black mb-4">Recent Sessions</h2>
      <div className="bg-white border-4 border-black rounded-xl neo-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-4 border-black text-xs uppercase tracking-widest font-black text-slate-600">
                <th className="p-4 border-r-2 border-slate-200">Date</th>
                <th className="p-4 border-r-2 border-slate-200">Topic</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="border-b-2 border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 border-r-2 border-slate-200 font-bold text-sm flex items-center gap-2">
                    <CalendarIcon size={16} className="text-slate-400" />
                    {record.date}
                  </td>
                  <td className="p-4 border-r-2 border-slate-200 font-bold text-sm text-black">
                    {record.topic}
                  </td>
                  <td className="p-4">
                    {record.status === "PRESENT" && (
                      <Badge className="bg-green-100 text-green-700 border-2 border-green-700 font-black neo-shadow-sm hover:bg-green-100 uppercase">
                        <CheckCircle2 size={14} className="mr-1 inline" /> Present
                      </Badge>
                    )}
                    {record.status === "ABSENT" && (
                      <Badge className="bg-red-100 text-red-700 border-2 border-red-700 font-black neo-shadow-sm hover:bg-red-100 uppercase">
                        <XCircle size={14} className="mr-1 inline" /> Absent
                      </Badge>
                    )}
                    {record.status === "LATE" && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-2 border-yellow-700 font-black neo-shadow-sm hover:bg-yellow-100 uppercase">
                        <Clock size={14} className="mr-1 inline" /> Late
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

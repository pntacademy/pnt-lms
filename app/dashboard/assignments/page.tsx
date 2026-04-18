"use client";

import { FileText, CheckCircle2, Clock, UploadCloud, X, FileUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const assignments = [
  {
    id: "a1",
    course: "Intro to Arduino",
    title: "Implement PID Controller",
    dueDate: "Tomorrow, 11:59 PM",
    status: "pending",
    type: "Code Submission (.cpp)",
  },
  {
    id: "a2",
    course: "Drone Assembly",
    title: "Propeller Calibration Report",
    dueDate: "Oct 20, 2026",
    status: "pending",
    type: "PDF Upload",
  },
  {
    id: "a3",
    course: "Robotics 101",
    title: "Motor Control Basics",
    dueDate: "Oct 10, 2026",
    status: "completed",
    type: "Code Submission (.cpp)",
    score: "95/100"
  },
];

export default function AssignmentsPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight flex items-center gap-3">
          <FileText size={36} className="text-[#43a047]" strokeWidth={2.5} />
          Assignments
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Manage your submissions and grades
        </p>
      </header>

      {/* Upload Form UI (Visual Only) */}
      <Card className="border-4 border-black rounded-xl neo-shadow bg-white">
        <CardHeader className="bg-[#ffcb05] border-b-4 border-black p-4">
          <CardTitle className="text-sm font-black uppercase text-black flex items-center gap-2">
            <UploadCloud size={20} strokeWidth={2.5} />
            Submit New Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">Select Course</label>
                <div className="w-full border-2 border-black rounded-lg p-3 bg-slate-50 text-sm font-bold text-slate-500 cursor-not-allowed">
                  Select a course...
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">Select Assignment</label>
                <div className="w-full border-2 border-black rounded-lg p-3 bg-slate-50 text-sm font-bold text-slate-500 cursor-not-allowed">
                  Select an assignment...
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">Comments (Optional)</label>
                <textarea 
                  className="w-full border-2 border-black rounded-lg p-3 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#ffcb05]" 
                  rows={3}
                  placeholder="Add any notes for the instructor..."
                ></textarea>
              </div>
            </div>
            
            {/* File Drop Zone */}
            <div className="border-4 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100 hover:border-black transition-colors cursor-pointer group">
              <div className="bg-white p-4 rounded-full border-2 border-slate-300 group-hover:border-black group-hover:neo-shadow-sm transition-all mb-4">
                <FileUp size={32} className="text-slate-400 group-hover:text-black" strokeWidth={2} />
              </div>
              <p className="text-sm font-black uppercase text-black mb-1">Click to upload or drag & drop</p>
              <p className="text-xs font-bold text-slate-500 uppercase">PDF, CPP, INO (Max 10MB)</p>
              <div className="mt-6 px-6 py-2 bg-black text-white text-xs font-black uppercase rounded-lg border-2 border-black neo-shadow-sm">
                Browse Files
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <h2 className="text-xl font-black uppercase text-black tracking-tight mt-10">Your Submissions</h2>

      {/* Desktop View: Table */}
      <div className="hidden md:block">
        <div className="border-4 border-black rounded-xl neo-shadow overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-100 border-b-4 border-black">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black text-black uppercase tracking-wider text-xs w-[300px]">Assignment</TableHead>
                <TableHead className="font-black text-black uppercase tracking-wider text-xs">Course</TableHead>
                <TableHead className="font-black text-black uppercase tracking-wider text-xs">Status</TableHead>
                <TableHead className="font-black text-black uppercase tracking-wider text-xs text-right">Action / Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id} className="border-b-2 border-slate-200">
                  <TableCell className="py-4">
                    <p className="font-black uppercase text-sm text-black">{assignment.title}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">{assignment.type}</p>
                  </TableCell>
                  <TableCell className="py-4 font-bold text-sm text-slate-600">{assignment.course}</TableCell>
                  <TableCell className="py-4">
                    {assignment.status === "completed" ? (
                      <Badge className="bg-green-100 text-green-700 border-2 border-green-600 font-black uppercase hover:bg-green-100">Submitted</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 border-2 border-amber-600 font-black uppercase flex items-center gap-1 w-fit hover:bg-amber-100">
                        <Clock size={12} strokeWidth={3} />
                        Due {assignment.dueDate}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                     {assignment.status === "completed" ? (
                       <span className="font-black text-lg text-black">{assignment.score}</span>
                     ) : (
                       <button className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase rounded-lg border-2 border-black hover:bg-[#dc0a2d] transition-colors neo-shadow-sm hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                         Submit Now
                       </button>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border-4 border-black rounded-xl neo-shadow bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] font-black text-[#43a047] uppercase tracking-widest mb-2 bg-green-50 inline-block px-2 py-1 border-2 border-[#43a047] rounded-md">
                  {assignment.course}
                </div>
                {assignment.status === "completed" ? (
                  <CheckCircle2 size={24} className="text-[#43a047]" strokeWidth={2.5} />
                ) : (
                  <Clock size={24} className="text-amber-500" strokeWidth={2.5} />
                )}
              </div>
              
              <h3 className="text-base font-black uppercase text-black leading-tight">{assignment.title}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase mt-1 mb-4">{assignment.type}</p>
              
              <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-slate-200">
                {assignment.status === "completed" ? (
                  <>
                    <span className="text-xs font-black uppercase text-slate-500">Score</span>
                    <span className="font-black text-lg text-black">{assignment.score}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-bold text-amber-600 uppercase">Due: {assignment.dueDate}</span>
                    <button className="px-3 py-1.5 bg-black text-white text-[10px] font-black uppercase rounded-lg border-2 border-black hover:bg-[#dc0a2d] transition-colors">
                      Submit
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

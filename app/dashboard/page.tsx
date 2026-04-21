"use client";

import { motion } from "framer-motion";
import { Megaphone, Wrench, Clock, ChevronRight, CheckSquare, GraduationCap, PlayCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const announcements = [
  {
    id: 1,
    title: "Upcoming Robotics Competition",
    date: "Oct 15, 2026",
    content: "Register your teams for the upcoming inter-college robotics competition. Submissions for the preliminary round are due next week.",
    isImportant: true,
  },
  {
    id: 2,
    title: "New 3D Printing Material Available",
    date: "Oct 10, 2026",
    content: "The lab has just stocked up on flexible TPU filament. You can now request prints requiring flexible parts for your rovers.",
    isImportant: false,
  },
];

const pendingAssignments = [
  {
    id: "a1",
    course: "Intro to Arduino",
    title: "Implement PID Controller",
    dueDate: "Tomorrow, 11:59 PM",
    type: "Code Submission",
  },
  {
    id: "a2",
    course: "Drone Assembly",
    title: "Propeller Calibration Report",
    dueDate: "Oct 20, 2026",
    type: "PDF Upload",
  },
];

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Colorful Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-rose-500 to-red-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .shadow-xl shadow-slate-200/50 { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
        .shadow-sm hover:shadow-md { box-shadow: 2px 2px 0px 0px rgba(0,0,0,1); }
      `}</style>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl space-y-8"
      >
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight">
              Welcome back, <span className="text-rose-600">Alex</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
              Let's continue learning
            </motion.p>
          </div>
        </header>

        {/* CSS Grid layout for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: Progress & Up Next */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Progress Card */}
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="pb-2 bg-gradient-to-br from-amber-400 to-orange-500 border-b border-slate-200">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2 text-slate-800">
                  <Trophy size={20} />
                  Overall Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Robotics Master Track</span>
                  <span className="text-2xl font-black text-slate-800">60%</span>
                </div>
                <Progress value={60} className="h-4 border border-slate-200 bg-slate-100 [&>div]:bg-[#43a047]" />
              </CardContent>
            </Card>

            {/* Up Next Card */}
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
              <CardHeader className="pb-2 bg-gradient-to-br from-rose-500 to-red-600 border-b border-slate-200 text-white">
                <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                  <PlayCircle size={20} />
                  Up Next
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-[10px] font-black text-white uppercase tracking-widest mb-3 bg-black inline-block px-2 py-1 rounded-md">
                  Intro to Arduino
                </div>
                <h3 className="text-base font-black uppercase text-slate-800 leading-tight mb-2">
                  Lesson 4: Reading Sensor Data
                </h3>
                <p className="text-xs font-medium text-slate-500 mb-6">
                  Learn how to read analog inputs from ultrasonic and infrared sensors.
                </p>
                <Link href="/dashboard/courses/arduino-101" className="w-full flex items-center justify-between px-5 py-3 bg-black rounded-lg text-white text-xs uppercase font-black border border-slate-200 hover:bg-gradient-to-br from-rose-500 to-red-600 transition-colors shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 ">
                  <span>Watch Video</span>
                  <ChevronRight strokeWidth={3} size={16} />
                </Link>
              </CardContent>
            </Card>

          </motion.div>

          {/* Column 2: Announcements */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl shadow-slate-200/50 w-fit">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg border border-slate-200">
                <Megaphone size={20} strokeWidth={2.5} className="text-slate-800" />
              </div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">Academy News</h2>
            </div>
            
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:-translate-y-1 transition-transform">
                {announcement.isImportant && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-br from-rose-500 to-red-600 border-b-4 border-l-4 border-slate-200 rounded-bl-xl font-black text-white text-[10px] uppercase tracking-wider">
                    Important
                  </div>
                )}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-sm font-black leading-tight uppercase text-slate-800 max-w-[80%]">{announcement.title}</h3>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{announcement.content}</p>
                <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 border border-slate-200 rounded-md inline-block uppercase tracking-wider">{announcement.date}</span>
              </div>
            ))}
          </motion.div>

          {/* Column 3: Pending Assignments */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl shadow-slate-200/50 w-fit">
              <div className="bg-[#43a047] p-2 rounded-lg border border-slate-200">
                <Wrench size={20} strokeWidth={2.5} className="text-white" />
              </div>
              <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">Active Assignments</h2>
            </div>

            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-transform">
                  <div className="mb-4">
                    <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 bg-red-50 inline-block px-2 py-1 border-2 border-rose-200 rounded-md">
                      {assignment.course}
                    </div>
                    <h3 className="text-base font-black uppercase text-slate-800 leading-tight mt-1">{assignment.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-bold mb-5">
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border-2 border-amber-600 rounded-md px-3 py-1.5">
                      <Clock size={14} strokeWidth={2.5} />
                      <span className="uppercase">Due: {assignment.dueDate}</span>
                    </div>
                  </div>

                  <Link href="/dashboard/assignments" className="w-full flex items-center justify-between px-5 py-3 bg-black rounded-lg text-white text-xs uppercase font-black border border-slate-200 hover:bg-[#43a047] hover:text-white transition-colors shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 ">
                    <span>Submit Work</span>
                    <ChevronRight strokeWidth={3} size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="bg-white border-4 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckSquare size={24} strokeWidth={2.5} className="text-green-600" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase mb-2">All Caught Up!</h3>
                <p className="text-xs text-slate-500 font-medium max-w-[200px]">
                  You have no pending assignments. Review your past modules or explore the lab.
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

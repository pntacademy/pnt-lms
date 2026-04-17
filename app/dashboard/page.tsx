"use client";

import { motion } from "framer-motion";
import { Megaphone, Wrench, Clock, CaretRight, CheckSquareOffset, Student, GraduationCap, Code } from "@phosphor-icons/react";
import Link from "next/link";

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
    course: "Autonomous Navigation",
    title: "Implement PID Controller",
    dueDate: "Tomorrow, 11:59 PM",
    type: "Code Submission",
  },
  {
    id: "a2",
    course: "Mechanical Design",
    title: "Rover Chassis CAD",
    dueDate: "Oct 20, 2026",
    type: "CAD File (.step)",
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
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-slate-800 selection:bg-[#ffcb05] selection:text-black p-4 md:p-8 relative overflow-hidden">
      {/* Animated Colorful Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#dc0a2d] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#ffcb05] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-[#43a047] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .neo-shadow {
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
        .neo-shadow-sm {
          box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
        }
      `}</style>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-6xl space-y-8"
      >
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-white border-2 border-black px-4 py-2 neo-shadow-sm mb-4 rounded-lg">
              <GraduationCap size={24} className="text-[#dc0a2d]" weight="fill" />
              <span className="text-sm font-black uppercase tracking-wider text-black">Student Portal</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight">
              Welcome back, <span className="text-[#dc0a2d]">Alex</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
              Let's continue learning
            </motion.p>
          </div>
          
          <motion.div variants={itemVariants}>
             <div className="bg-white border-4 border-black p-2 neo-shadow rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full border-2 border-black flex items-center justify-center overflow-hidden">
                  <Student size={28} weight="fill" className="text-slate-700" />
                </div>
                <div className="flex flex-col pr-4">
                  <span className="text-xs text-slate-500 uppercase font-black">Current Module</span>
                  <span className="text-sm text-black uppercase font-black">Robotics 101</span>
                </div>
             </div>
          </motion.div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Announcements */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 bg-white border-4 border-black rounded-xl px-4 py-3 neo-shadow w-fit">
              <div className="bg-[#ffcb05] p-2 rounded-lg border-2 border-black">
                <Megaphone size={20} weight="fill" className="text-black" />
              </div>
              <h2 className="text-base font-black text-black uppercase tracking-wide">Academy News</h2>
            </div>
            
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="bg-white border-4 border-black rounded-xl p-5 neo-shadow relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  {announcement.isImportant && (
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#dc0a2d] border-b-4 border-l-4 border-black rounded-bl-xl font-black text-white text-[10px] uppercase tracking-wider">
                      Important
                    </div>
                  )}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-sm font-black leading-tight uppercase text-black max-w-[80%]">{announcement.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">{announcement.content}</p>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 border-2 border-black rounded-md inline-block uppercase tracking-wider">{announcement.date}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Right Column: Pending Assignments */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 bg-white border-4 border-black rounded-xl px-4 py-3 neo-shadow w-fit">
              <div className="bg-[#43a047] p-2 rounded-lg border-2 border-black">
                <Wrench size={20} weight="fill" className="text-white" />
              </div>
              <h2 className="text-base font-black text-black uppercase tracking-wide">Active Assignments</h2>
            </div>

            <div className="space-y-4">
              {pendingAssignments.length > 0 ? (
                pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border-4 border-black rounded-xl p-5 neo-shadow hover:-translate-y-1 transition-transform">
                    <div className="mb-4">
                      <div className="text-[10px] font-black text-[#dc0a2d] uppercase tracking-widest mb-2 bg-red-50 inline-block px-2 py-1 border-2 border-[#dc0a2d] rounded-md">
                        {assignment.course}
                      </div>
                      <h3 className="text-base font-black uppercase text-black leading-tight mt-1">{assignment.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-bold mb-5">
                      <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 border-2 border-amber-600 rounded-md px-3 py-1.5">
                        <Clock size={14} weight="bold" />
                        <span className="uppercase">Due: {assignment.dueDate}</span>
                      </div>
                    </div>

                    <Link href="#" className="w-full flex items-center justify-between px-5 py-4 bg-black rounded-lg text-white text-xs uppercase font-black border-2 border-black hover:bg-[#dc0a2d] hover:text-white transition-colors neo-shadow-sm hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
                      <span>Begin Assignment</span>
                      <CaretRight weight="bold" size={16} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-white border-4 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-100 border-4 border-green-500 rounded-full flex items-center justify-center mb-4">
                    <CheckSquareOffset size={24} weight="bold" className="text-green-600" />
                  </div>
                  <h3 className="text-base font-black text-black uppercase mb-2">All Caught Up!</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-[200px]">
                    You have no pending assignments. Review your past modules or explore the lab.
                  </p>
                </div>
              )}
            </div>
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
}



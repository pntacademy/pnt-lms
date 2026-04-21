"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CaretRight, Robot, Code, Cpu, GraduationCap } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 selection:bg-gradient-to-br from-amber-400 to-orange-500 selection:text-slate-800 overflow-hidden relative font-sans">
      
      {/* Animated Colorful Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-rose-500 to-red-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
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
        .shadow-xl shadow-slate-200/50 {
          box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
        }
        .shadow-sm hover:shadow-md {
          box-shadow: 3px 3px 0px 0px rgba(0,0,0,1);
        }
        .shadow-xl shadow-slate-200/50-hover:hover {
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }
      `}</style>

      {/* Main Header / Nav */}
      <nav className="relative z-20 border-b border-slate-200 bg-white px-6 py-4 flex justify-between items-center shadow-sm hover:shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-red-600 border border-slate-200 rounded-md flex items-center justify-center shadow-sm hover:shadow-md">
            <GraduationCap size={16} weight="fill" className="text-white" />
          </div>
          <span className="font-black text-xl uppercase tracking-wider text-slate-800">PNT Academy</span>
        </div>
        <div className="hidden md:flex items-center gap-6 font-bold uppercase text-sm tracking-wider">
          <Link href="#programs" className="hover:text-rose-600 hover:underline underline-offset-4">Programs</Link>
          <Link href="#about" className="hover:text-rose-600 hover:underline underline-offset-4">About</Link>
          <Link href="/login" className="bg-gradient-to-br from-amber-400 to-orange-500 px-5 py-2.5 border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            Student Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-24 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Content */}
        <div className="lg:w-1/2 flex flex-col space-y-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-block bg-gradient-to-br from-rose-500 to-red-600 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest w-fit shadow-sm hover:shadow-md border border-slate-200">
              Next-Gen Learning
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.1] text-slate-800 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
              Build The Future of Robotics
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg md:text-xl font-medium text-slate-700 max-w-lg leading-relaxed">
              Master autonomous systems, computer vision, and hardware engineering through our interactive, industry-standard curriculum.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild className="h-14 px-8 bg-black hover:bg-slate-800 text-white font-black border border-slate-200 shadow-xl shadow-slate-200/50 hover:translate-x-1 hover:-translate-y-1 shadow-xl shadow-slate-200/50-hover transition-all text-sm uppercase rounded-xl">
                <Link href="/login">
                  Access Portal <CaretRight weight="bold" className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Brutalist Card/Graphic */}
        <div className="lg:w-1/2 w-full">
          <motion.div 
            initial={{ opacity: 0, rotate: -3 }}
            animate={{ opacity: 1, rotate: 2 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl shadow-slate-200/50 w-full aspect-square md:aspect-[4/3] flex flex-col relative"
          >
            {/* Window Controls Decoration */}
            <div className="absolute top-0 left-0 w-full border-b border-slate-200 bg-slate-100 p-3 rounded-t-3xl flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-slate-200"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-slate-200"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-slate-200"></div>
            </div>

            <div className="flex-1 mt-10 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md overflow-hidden relative">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_2px,transparent_2px),linear-gradient(to_bottom,#80808015_2px,transparent_2px)] bg-[size:24px_24px]"></div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 bg-white border border-slate-200 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border border-slate-200 flex items-center justify-center">
                  <Robot size={32} className="text-slate-800" weight="fill" />
                </div>
                <div className="bg-black text-white px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest">
                  System Active
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Modules Section */}
      <section id="programs" className="relative z-10 bg-white border-t-8 border-slate-200 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-800">
              Core Modules
            </h2>
            <div className="w-1/2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 border border-slate-200 shadow-sm hover:shadow-md hidden md:block"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code weight="fill" className="w-8 h-8 text-slate-800" />,
                title: "Software Engineering",
                desc: "Learn Python, C++, and algorithms optimized for robotics and hardware interfaces.",
                color: "bg-[#1e88e5]",
              },
              {
                icon: <Cpu weight="fill" className="w-8 h-8 text-slate-800" />,
                title: "Hardware Integration",
                desc: "Work with microcontrollers, sensors, and actuators to build responsive systems.",
                color: "bg-gradient-to-br from-amber-400 to-orange-500",
              },
              {
                icon: <Robot weight="fill" className="w-8 h-8 text-slate-800" />,
                title: "Autonomous Navigation",
                desc: "Implement SLAM, path planning, and computer vision for self-driving mechanisms.",
                color: "bg-[#43a047]",
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col group hover:-translate-y-2 shadow-xl shadow-slate-200/50-hover transition-all cursor-pointer overflow-hidden"
              >
                <div className={`p-5 border-b border-slate-200 ${feature.color} flex justify-between items-center`}>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md">
                    {feature.icon}
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-black rounded-full opacity-30"></div>
                    <div className="w-2.5 h-2.5 bg-black rounded-full opacity-60"></div>
                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-3 uppercase leading-tight">{feature.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


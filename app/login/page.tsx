"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogo, EnvelopeSimple, LockKey, ArrowLeft, Student } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-slate-800 selection:bg-[#ffcb05] selection:text-black p-4 relative overflow-hidden font-sans">
      
      {/* Animated Colorful Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#dc0a2d] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob"></div>
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-[#ffcb05] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-[#43a047] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>

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
          box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }
        .neo-shadow-sm {
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-0 neo-shadow bg-white border-4 border-black rounded-2xl overflow-hidden">
        
        {/* Left Side: Branding / Graphic */}
        <div className="hidden md:flex md:w-5/12 bg-[#dc0a2d] border-r-4 border-black p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 border-2 border-black rounded-lg neo-shadow-sm hover:-translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all">
              <ArrowLeft size={16} weight="bold" />
              <span className="text-xs font-black uppercase tracking-wider text-black">Back to Home</span>
            </Link>
          </div>

          <div className="relative z-10 text-white mt-12">
            <h1 className="text-4xl font-black uppercase leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              Welcome to the Academy
            </h1>
            <p className="mt-4 font-medium text-white/90 leading-relaxed text-sm">
              Access your modules, continue your projects, and view your progress in our comprehensive robotics program.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 flex items-center justify-center">
            <div className="w-32 h-32 bg-white border-4 border-black rounded-full flex justify-center items-center neo-shadow-sm relative">
              <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-20"></div>
              <Student size={48} weight="fill" className="text-[#dc0a2d] relative z-10" />
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 bg-white p-8 md:p-14 flex flex-col relative">
          
          {/* Mobile Back Button */}
          <Link href="/" className="md:hidden inline-flex items-center gap-2 bg-white px-3 py-2 border-2 border-black rounded-lg neo-shadow-sm w-fit mb-8 hover:-translate-y-1 transition-all">
            <ArrowLeft size={16} weight="bold" />
            <span className="text-xs font-black uppercase tracking-wider text-black">Back</span>
          </Link>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-sm mx-auto my-auto"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-3xl font-black uppercase text-black mb-2 tracking-tight">
                Student Login
              </h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Enter your credentials
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Link href="/dashboard" className="w-full h-12 bg-white border-2 border-black rounded-lg hover:bg-slate-50 transition-all text-black neo-shadow-sm active:translate-y-1 active:translate-x-1 active:shadow-none text-sm font-black uppercase tracking-wider relative overflow-hidden group flex items-center justify-center">
                  <span className="absolute inset-0 w-full h-full bg-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-200"></span>
                  <div className="relative flex items-center justify-center w-full">
                    <GoogleLogo weight="bold" className="absolute left-4 w-5 h-5 text-black" />
                    <span>Sign in with Google</span>
                  </div>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t-2 border-dashed border-slate-300" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="px-4 bg-white text-slate-400">Or use email</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="block text-xs uppercase font-black text-black mb-2">
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeSimple className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10 h-12 bg-white border-2 border-slate-300 text-black placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-black focus-visible:border-2 transition-all"
                        placeholder="student@pntacademy.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="block text-xs uppercase font-black text-black mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockKey className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="pl-10 h-12 bg-white border-2 border-slate-300 text-black placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-black focus-visible:border-2 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#dc0a2d] bg-white border-2 border-slate-300 rounded focus:ring-[#dc0a2d]"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-black font-bold">
                        Remember me
                      </label>
                    </div>

                    <div>
                      <a href="#" className="font-bold text-[#dc0a2d] hover:underline underline-offset-2">
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href="/dashboard" className="w-full flex justify-center items-center h-14 bg-[#ffcb05] hover:bg-[#d4a017] text-black font-black text-sm tracking-widest uppercase border-2 border-black rounded-lg neo-shadow-sm transition-all hover:shadow-[6px_6px_0_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-1 active:translate-x-1 active:shadow-none">
                      Login to Portal
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


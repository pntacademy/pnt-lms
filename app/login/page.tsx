"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, User, Lock, Eye, EyeOff, Copy, Check } from "lucide-react";
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
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        studentId,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Student ID or Password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-slate-800 selection:bg-gradient-to-br from-red-400 to-rose-500 selection:text-white p-4 relative overflow-hidden font-sans">
      
      {/* Animated Colorful Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-red-400 to-rose-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob"></div>
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-orange-300 to-amber-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-gradient-to-br from-orange-300 to-amber-400 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>



      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        
        {/* Left Side: Branding / Graphic */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-red-400 to-rose-500 border-r border-slate-200 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">Back to Home</span>
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
            <div className="w-32 h-32 bg-white border border-slate-200 rounded-full flex justify-center items-center shadow-sm hover:shadow-md relative">
              <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-20"></div>
              <GraduationCap size={48} className="text-red-500 relative z-10" />
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 bg-white p-8 md:p-14 flex flex-col relative">
          
          {/* Mobile Back Button */}
          <Link href="/" className="md:hidden inline-flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm hover:shadow-md w-fit mb-8 hover:-translate-y-1 transition-all">
            <ArrowLeft size={16} />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">Back</span>
          </Link>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-sm mx-auto my-auto"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-3xl font-black uppercase text-slate-800 mb-2 tracking-tight">
                Student Login
              </h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Enter your credentials
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.div variants={itemVariants}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded border border-red-200">
                      {error}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="studentId" className="block text-xs uppercase font-black text-slate-800 mb-2">
                      Student ID
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="pl-10 h-12 bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-slate-200 focus-visible:border-2 transition-all"
                        placeholder="PNT-2026-001"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="block text-xs uppercase font-black text-slate-800 mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-20 h-12 bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-slate-200 focus-visible:border-2 transition-all"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                        {password && (
                          <button
                            type="button"
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                            title="Copy Password"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                          title={showPassword ? "Hide Password" : "Show Password"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center h-14 bg-gradient-to-br from-red-400 to-rose-500 hover:opacity-90 text-white font-black text-sm tracking-widest uppercase border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:translate-x-1 disabled:opacity-50">
                      {isLoading ? "Logging in..." : "Login to Portal"}
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 text-center">
                <Link href="/admin-login" className="text-xs font-bold uppercase text-slate-500 hover:text-red-500 transition-colors tracking-widest">
                  Teacher/Admin? Login here
                </Link>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

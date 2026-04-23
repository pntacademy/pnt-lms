"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, UserCircle, User, Lock } from "lucide-react";
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

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        studentId: email, // auth.ts checks BOTH studentId AND email against this field
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Email or Password");
      } else {
        router.push("/dashboard/admin");
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
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-200 rounded-2xl overflow-hidden">
        
        {/* Left Side: Branding / Graphic */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-slate-800 to-slate-900 border-r border-slate-200 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 border border-white/20 text-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <ArrowLeft size={16} />
              <span className="text-xs font-black uppercase tracking-wider">Back to Home</span>
            </Link>
          </div>

          <div className="relative z-10 text-white mt-12">
            <h1 className="text-4xl font-black uppercase leading-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              Admin & Teacher Portal
            </h1>
            <p className="mt-4 font-medium text-white/70 leading-relaxed text-sm">
              Manage student accounts, grade assignments, mark attendance, and view performance metrics.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 flex items-center justify-center">
            <div className="w-32 h-32 bg-white/10 border border-white/20 rounded-full flex justify-center items-center shadow-sm hover:shadow-md relative backdrop-blur-md">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <UserCircle size={48} className="text-white relative z-10" />
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
                Staff Login
              </h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Authorized Personnel Only
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
                    <Label htmlFor="email" className="block text-xs uppercase font-black text-slate-800 mb-2">
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-slate-200 focus-visible:border-2 transition-all"
                        placeholder="teacher@pntacademy.com"
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
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 rounded-lg shadow-none font-medium text-sm focus-visible:ring-0 focus-visible:border-slate-200 focus-visible:border-2 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center h-14 bg-gradient-to-br from-slate-800 to-slate-900 hover:opacity-90 text-white font-black text-sm tracking-widest uppercase border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-1 active:translate-x-1 disabled:opacity-50">
                      {isLoading ? "Authenticating..." : "Login to Admin"}
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 text-center">
                <Link href="/login" className="text-xs font-bold uppercase text-slate-500 hover:text-red-500 transition-colors tracking-widest">
                  Not a teacher? Go to Student Login
                </Link>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

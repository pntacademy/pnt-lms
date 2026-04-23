"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, User, Settings, LogOut, GraduationCap, Calendar, Briefcase, ClipboardCheck } from "lucide-react";

export function DesktopSidebar({ role = "STUDENT" }: { role?: string }) {
  const pathname = usePathname();

  const mainLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/assignments", label: "Assignments", icon: FileText },
    { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/internships", label: "Internships", icon: Briefcase },
  ];

  const bottomLinks = [
    ...(role === "ADMIN" || role === "TEACHER" 
      ? [{ href: "/dashboard/admin", label: "Admin Panel", icon: Settings }] 
      : []),
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all group ${
          isActive
            ? "bg-gradient-to-br from-orange-300 to-amber-400 border-slate-200 shadow-xl shadow-slate-200/50 text-slate-800"
            : "bg-transparent border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm hover:shadow-md hover:-translate-y-0.5"
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-slate-800" : "group-hover:text-slate-800"} />
        <span className={`text-sm uppercase font-black tracking-wider ${isActive ? "text-slate-800" : "group-hover:text-slate-800"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 left-0 p-6 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-12 group">
        <div className="bg-gradient-to-br from-red-400 to-rose-500 p-2 rounded-lg border border-slate-200 group-hover:-translate-y-1 transition-transform group-hover:shadow-sm hover:shadow-md">
          <GraduationCap size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-xl leading-none uppercase tracking-tight text-slate-800">PNT Academy</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Student Portal</p>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-3">
        {mainLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-3 pt-6 border-t-2 border-slate-200 border-dashed">
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-transparent text-slate-600 hover:border-red-500 hover:bg-red-50 hover:text-red-600 hover:shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
          <LogOut size={24} strokeWidth={2} />
          <span className="text-sm uppercase font-black tracking-wider">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

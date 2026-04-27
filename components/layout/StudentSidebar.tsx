"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  BookOpen,
  FileText,
  ClipboardCheck,
  Calendar,
  Briefcase,
  User,
  LogOut,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Assignments", icon: FileText },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/internships", label: "Internships", icon: Briefcase },
];

const bottomLinks = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function StudentSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavLink = ({
    href,
    label,
    icon: Icon,
    exact,
  }: {
    href: string;
    label: string;
    icon: any;
    exact?: boolean;
  }) => {
    const active = isActive(href, exact);
    return (
      <Link
        href={href}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all group ${
          active
            ? "bg-gradient-to-br from-orange-300 to-amber-400 border-amber-300 shadow-xl shadow-amber-200/50 text-slate-800"
            : "bg-transparent border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5"
        }`}
      >
        <Icon
          size={22}
          strokeWidth={active ? 3 : 2}
          className={active ? "text-slate-800" : "group-hover:text-slate-800"}
        />
        <span
          className={`text-sm uppercase font-black tracking-wider ${
            active ? "text-slate-800" : "group-hover:text-slate-800"
          }`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 left-0 p-6 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="bg-gradient-to-br from-red-400 to-rose-500 p-2 rounded-lg border border-rose-300 shadow-md group-hover:-translate-y-1 transition-transform">
          <GraduationCap size={26} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-xl leading-none uppercase tracking-tight text-slate-800">
            PNT Academy
          </h1>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
            Student Portal
          </p>
        </div>
      </Link>

      {/* Section label */}
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
        Navigation
      </p>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {mainLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="space-y-2 pt-6 border-t-2 border-dashed border-slate-200">
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))!}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-transparent text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all group"
        >
          <LogOut size={22} strokeWidth={2} />
          <span className="text-sm uppercase font-black tracking-wider">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileCheck2,
  LogOut,
  ArrowLeftCircle,
} from "lucide-react";

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/students", label: "Students", icon: Users },
  { href: "/dashboard/admin/attendance", label: "Mark Attendance", icon: ClipboardCheck },
  { href: "/dashboard/admin/assignments", label: "Grade Submissions", icon: FileCheck2 },
  { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
          active
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-indigo-700 shadow-lg shadow-indigo-900/40 text-white"
            : "bg-transparent border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className="text-sm uppercase font-black tracking-wider">{label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 left-0 p-6 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Image src="/logo.svg" alt="PNT Academy" width={40} height={40} className="rounded-lg" />
        <div>
          <h1 className="font-black text-lg leading-none uppercase tracking-tight text-white">
            PNT Academy
          </h1>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">
            Staff Portal
          </p>
        </div>
      </div>

      {/* Section Label */}
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
        Management
      </p>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        {adminLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-2 pt-6 border-t border-slate-800">
        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin-login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-slate-400 hover:border-red-800 hover:bg-red-950 hover:text-red-400 transition-all"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-sm uppercase font-black tracking-wider">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

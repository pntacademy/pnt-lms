"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  FileCheck2,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/dashboard/admin", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/students", label: "Students", icon: Users },
  { href: "/dashboard/admin/attendance", label: "Attend", icon: ClipboardCheck },
  { href: "/dashboard/admin/assignments", label: "Grade", icon: FileCheck2 },
  { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-50 px-2 py-2 flex justify-around items-center">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border transition-all ${
              isActive
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-indigo-700 shadow-lg shadow-indigo-900/50 -translate-y-1"
                : "bg-transparent border-transparent text-slate-500 hover:text-white"
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : ""} />
            <span className={`text-[9px] mt-1 uppercase font-black tracking-wider ${isActive ? "text-white" : ""}`}>
              {link.label}
            </span>
          </Link>
        );
      })}

      {/* Logout button */}
      <button
        onClick={() => signOut({ callbackUrl: "/admin-login" })}
        className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border border-transparent text-slate-500 hover:text-red-400 hover:bg-red-950 hover:border-red-900 transition-all"
      >
        <LogOut size={22} strokeWidth={2} />
        <span className="text-[9px] mt-1 uppercase font-black tracking-wider">Out</span>
      </button>
    </nav>
  );
}

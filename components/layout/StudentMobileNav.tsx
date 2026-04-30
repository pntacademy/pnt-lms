"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, BookOpen, FileText, Calendar, Briefcase, LogOut, BarChart } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Tasks", icon: FileText },
  { href: "/dashboard/analytics", label: "Report", icon: BarChart },
  { href: "/dashboard/internships", label: "Intern", icon: Briefcase },
];

export function StudentMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2 flex justify-around items-center">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 transition-all ${
              isActive
                ? "bg-gradient-to-br from-orange-300 to-amber-400 border-amber-300 shadow-md -translate-y-1"
                : "bg-transparent border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 3 : 2}
              className={isActive ? "text-slate-800" : ""}
            />
            <span className={`text-[9px] mt-1 uppercase font-black tracking-wider ${isActive ? "text-slate-800" : ""}`}>
              {link.label}
            </span>
          </Link>
        );
      })}

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 border-transparent text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
      >
        <LogOut size={22} strokeWidth={2} />
        <span className="text-[9px] mt-1 uppercase font-black tracking-wider">Out</span>
      </button>
    </nav>
  );
}

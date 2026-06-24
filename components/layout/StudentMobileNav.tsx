"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home, BookOpen, FileText, Calendar, Briefcase, LogOut, BarChart, Building, Film } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Home", icon: Home, exact: true },
  { href: "/dashboard/school", label: "School", icon: Building },
  // { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
];

export function StudentMobileNav({ hasNewSchool = false, hasNewCalendar = false }: { hasNewSchool?: boolean, hasNewCalendar?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2 flex justify-around items-center">
      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        const showNotification = 
          (link.label === "School" && hasNewSchool) ||
          (link.label === "Calendar" && hasNewCalendar);

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
            <div className="relative flex flex-col items-center justify-center">
              <Icon
                size={22}
                strokeWidth={isActive ? 3 : 2}
                className={isActive ? "text-slate-800" : ""}
              />
              {showNotification && (
                <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              )}
            </div>
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

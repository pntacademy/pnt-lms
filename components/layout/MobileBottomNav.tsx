import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, User, Calendar, Briefcase } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/assignments", label: "Tasks", icon: FileText },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/internships", label: "Intern", icon: Briefcase },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-4 py-2 flex justify-between items-center">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl border-2 transition-all ${
              isActive
                ? "bg-gradient-to-br from-orange-300 to-amber-400 border-slate-200 shadow-sm hover:shadow-md -translate-y-1"
                : "bg-transparent border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-slate-800" : ""} />
            <span className={`text-[10px] mt-1 uppercase font-black tracking-wider ${isActive ? "text-slate-800" : ""}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

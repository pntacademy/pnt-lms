import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FileText, User, Settings, LogOut, GraduationCap, Calendar, Briefcase, ClipboardCheck } from "lucide-react";

export function DesktopSidebar() {
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
    { href: "/dashboard/admin", label: "Admin Panel", icon: Settings },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all group ${
          isActive
            ? "bg-[#ffcb05] border-black neo-shadow text-black"
            : "bg-transparent border-transparent text-slate-600 hover:border-black hover:bg-slate-50 hover:neo-shadow-sm hover:-translate-y-0.5"
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-black" : "group-hover:text-black"} />
        <span className={`text-sm uppercase font-black tracking-wider ${isActive ? "text-black" : "group-hover:text-black"}`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r-4 border-black h-screen sticky top-0 left-0 p-6 z-40">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-12 group">
        <div className="bg-[#dc0a2d] p-2 rounded-lg border-2 border-black group-hover:-translate-y-1 transition-transform group-hover:neo-shadow-sm">
          <GraduationCap size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-black text-xl leading-none uppercase tracking-tight text-black">PNT Academy</h1>
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
      <div className="space-y-3 pt-6 border-t-2 border-black border-dashed">
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-transparent text-slate-600 hover:border-red-500 hover:bg-red-50 hover:text-red-600 hover:neo-shadow-sm hover:-translate-y-0.5 transition-all group">
          <LogOut size={24} strokeWidth={2} />
          <span className="text-sm uppercase font-black tracking-wider">Log Out</span>
        </button>
      </div>
    </aside>
  );
}

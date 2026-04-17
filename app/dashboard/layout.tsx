import Link from "next/link";
import { House, Books, CheckSquareOffset, User } from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Courses", href: "/dashboard/courses", icon: Books },
  { label: "Assignments", href: "/dashboard/assignments", icon: CheckSquareOffset },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 overflow-hidden">
      
      {/* Sidebar for Tablet/Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-6 shadow-sm">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">PNT Academy</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Student Portal</p>
        </div>
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 dark:text-zinc-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                style={{ minHeight: '44px' }}
              >
                <Icon size={24} weight="regular" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 scroll-smooth">
        {children}
      </main>

      {/* Bottom Tab Bar for Mobile */}
      <nav className="fixed bottom-0 z-50 flex w-full justify-around border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pb-safe pt-2 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 rounded-lg"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Icon size={24} weight="regular" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

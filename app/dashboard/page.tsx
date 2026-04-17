import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Wrench, Clock, CaretRight, CheckSquareOffset } from "@phosphor-icons/react/dist/ssr";

const announcements = [
  {
    id: 1,
    title: "Upcoming Robotics Competition",
    date: "Oct 15, 2026",
    content: "Register your teams for the upcoming inter-college robotics competition. Submissions for the preliminary round are due next week.",
    isImportant: true,
  },
  {
    id: 2,
    title: "New 3D Printing Material Available",
    date: "Oct 10, 2026",
    content: "The lab has just stocked up on flexible TPU filament. You can now request prints requiring flexible parts for your rovers.",
    isImportant: false,
  },
];

const pendingAssignments = [
  {
    id: "a1",
    course: "Autonomous Navigation",
    title: "Implement PID Controller",
    dueDate: "Tomorrow, 11:59 PM",
    type: "Code Submission",
  },
  {
    id: "a2",
    course: "Mechanical Design",
    title: "Rover Chassis CAD",
    dueDate: "Oct 20, 2026",
    type: "CAD File (.step)",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back, Innovator</h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">Here's what's happening in your courses today.</p>
      </header>

      {/* Grid Layout: Stacks vertically on mobile, 2 columns on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Announcements */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone size={28} weight="fill" className="text-blue-600 dark:text-blue-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Class Announcements</h2>
          </div>
          
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={`border-l-4 ${announcement.isImportant ? 'border-l-red-500' : 'border-l-slate-300 dark:border-l-zinc-700'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg leading-tight">{announcement.title}</CardTitle>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{announcement.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-zinc-300">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Right Column: Pending Assignments */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={28} weight="fill" className="text-orange-600 dark:text-orange-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Pending Assignments</h2>
          </div>

          {pendingAssignments.length > 0 ? (
            pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className="group transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardDescription className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-xs">
                    {assignment.course}
                  </CardDescription>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-500">
                      <Clock size={16} weight="bold" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-medium">
                      {assignment.type}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full sm:w-auto min-h-[44px]" variant="default">
                    Start Assignment
                    <CaretRight weight="bold" className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 bg-slate-50/50 dark:bg-zinc-900/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckSquareOffset size={48} weight="light" className="text-emerald-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">All caught up!</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-[250px]">
                  You have no pending robotics assignments at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

      </div>
    </div>
  );
}

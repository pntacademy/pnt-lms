"use client";

import { BookOpen, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: "robotics-master-30",
    title: "Robotics Masterclass (30 Projects)",
    instructor: "Admin",
    level: "Advanced",
    imageColor: "bg-gradient-to-br from-rose-500 to-red-600",
    progress: 45,
  },
  {
    id: "robotics-essentials-15",
    title: "Robotics Essentials (15 Projects)",
    instructor: "Admin",
    level: "Beginner",
    imageColor: "bg-gradient-to-br from-amber-400 to-orange-500",
    progress: 0,
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <BookOpen size={36} className="text-rose-600" strokeWidth={2.5} />
            Course Catalog
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Select a module to continue
          </p>
        </div>
        <Link href="/dashboard/admin" className="px-5 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md font-black uppercase text-xs hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-1  transition-all flex items-center gap-2">
          <span>+ Add Course (Admin)</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white flex flex-col group hover:-translate-y-1 transition-transform">
            {/* Placeholder Thumbnail */}
            <div className={`h-40 w-full border-b border-slate-200 flex items-center justify-center relative ${course.imageColor}`}>
              <BookOpen size={48} className="text-slate-800 opacity-20" strokeWidth={2} />
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white border border-slate-200 text-slate-800 font-black uppercase rounded-md shadow-sm hover:shadow-md">
                  {course.level}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2 flex-grow">
              <CardTitle className="text-xl font-black uppercase text-slate-800 leading-tight">
                {course.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-4 bg-slate-50 border-2 border-slate-200 w-fit px-3 py-1.5 rounded-md">
                <User size={16} strokeWidth={2.5} />
                <span className="uppercase">{course.instructor}</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0 border-t-4 border-dashed border-slate-100 mt-auto bg-slate-50 flex-col gap-4 items-stretch">
              <div className="pt-4 flex justify-between items-center w-full">
                 <span className="text-xs font-black uppercase text-slate-500">{course.progress > 0 ? `${course.progress}% Complete` : 'Not Started'}</span>
              </div>
              <Link href={`/dashboard/courses/${course.id}`} className="w-full flex items-center justify-between px-5 py-3 bg-black rounded-lg text-white text-xs uppercase font-black border border-slate-200 hover:bg-gradient-to-br from-amber-400 to-orange-500 hover:text-slate-800 transition-colors shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 ">
                <span>{course.progress > 0 ? "Continue Course" : "Start Course"}</span>
                <ChevronRight strokeWidth={3} size={16} />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

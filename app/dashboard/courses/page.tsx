"use client";

import { BookOpen, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: "arduino-101",
    title: "Intro to Arduino",
    instructor: "Dr. Alan Turing",
    level: "Beginner",
    imageColor: "bg-[#dc0a2d]",
    progress: 60,
  },
  {
    id: "drone-assembly",
    title: "Drone Assembly & Flight",
    instructor: "Capt. Amelia Earhart",
    level: "Intermediate",
    imageColor: "bg-[#ffcb05]",
    progress: 10,
  },
  {
    id: "python-iot",
    title: "Python for IoT",
    instructor: "Ada Lovelace",
    level: "Advanced",
    imageColor: "bg-[#43a047]",
    progress: 0,
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight flex items-center gap-3">
            <BookOpen size={36} className="text-[#dc0a2d]" strokeWidth={2.5} />
            Course Catalog
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Select a module to continue
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="border-4 border-black rounded-xl neo-shadow overflow-hidden bg-white flex flex-col group hover:-translate-y-1 transition-transform">
            {/* Placeholder Thumbnail */}
            <div className={`h-40 w-full border-b-4 border-black flex items-center justify-center relative ${course.imageColor}`}>
              <BookOpen size={48} className="text-black opacity-20" strokeWidth={2} />
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white border-2 border-black text-black font-black uppercase rounded-md neo-shadow-sm">
                  {course.level}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2 flex-grow">
              <CardTitle className="text-xl font-black uppercase text-black leading-tight">
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
              <Link href={`/dashboard/courses/${course.id}`} className="w-full flex items-center justify-between px-5 py-3 bg-black rounded-lg text-white text-xs uppercase font-black border-2 border-black hover:bg-[#ffcb05] hover:text-black transition-colors neo-shadow-sm hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none">
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

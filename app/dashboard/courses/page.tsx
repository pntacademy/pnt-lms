"use client";

import { useState } from "react";
import { 
  Cpu, 
  Wifi, 
  Bot, 
  Eye, 
  Lock, 
  Lightbulb, 
  Droplet, 
  Activity, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { projectsData, Project } from "@/lib/data";

// Helper to render the dynamic lucide icon
const ProjectIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case "Cpu": return <Cpu className={className} />;
    case "Wifi": return <Wifi className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Eye": return <Eye className={className} />;
    case "Lock": return <Lock className={className} />;
    case "Lightbulb": return <Lightbulb className={className} />;
    case "Droplet": return <Droplet className={className} />;
    case "Activity": return <Activity className={className} />;
    default: return <Cpu className={className} />;
  }
};

export default function CoursesPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <BookOpen size={36} className="text-red-500" strokeWidth={2.5} />
            Course Catalog
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Select your enrolled program
          </p>
        </div>
      </header>

      <Tabs defaultValue="15-hour" className="w-full">
        <TabsList className="mb-8 p-1 bg-slate-100 border border-slate-200 rounded-xl inline-flex shadow-sm">
          <TabsTrigger 
            value="15-hour" 
            className="rounded-lg px-6 py-3 font-black uppercase tracking-wider text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-300 data-[state=active]:to-amber-400 data-[state=active]:text-slate-900 transition-all data-[state=active]:shadow-md"
          >
            15-Hour Program (7 Projects)
          </TabsTrigger>
          <TabsTrigger 
            value="30-hour" 
            className="rounded-lg px-6 py-3 font-black uppercase tracking-wider text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-400 data-[state=active]:to-rose-500 data-[state=active]:text-white transition-all data-[state=active]:shadow-md"
          >
            30-Hour Program (15 Projects)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="15-hour">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.filter(p => p.programs.includes("15-Hour")).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="30-hour">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.filter(p => p.programs.includes("30-Hour")).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white flex flex-col group hover:-translate-y-1 transition-transform">
      <div className="h-32 w-full border-b border-slate-200 flex items-center justify-center relative bg-gradient-to-br from-slate-50 to-slate-100">
        <ProjectIcon type={project.iconType} className="w-16 h-16 text-slate-300 group-hover:text-red-400 transition-colors" />
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white border-2 border-slate-200 text-slate-600 font-black uppercase rounded-md shadow-sm">
            Project {project.id}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2 flex-grow">
        <CardTitle className="text-lg font-black uppercase text-slate-800 leading-tight">
          {project.title}
        </CardTitle>
        <p className="text-sm font-medium text-slate-500 mt-2 line-clamp-2">
          {project.objective}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.components.map((comp, idx) => (
            <span key={idx} className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 border border-slate-200 rounded-md inline-block uppercase tracking-wider">
              {comp}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-slate-100 mt-auto bg-slate-50/50 flex-col gap-4 items-stretch p-4">
        <Link href={`/dashboard/courses/project-${project.id}`} className="w-full flex items-center justify-between px-5 py-3 bg-black rounded-lg text-white text-xs uppercase font-black border border-slate-200 hover:bg-gradient-to-br hover:from-red-400 hover:to-rose-500 hover:text-white transition-colors shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1">
          <div className="flex items-center gap-2">
            <PlayCircle size={16} />
            <span>View Lecture</span>
          </div>
          <ChevronRight strokeWidth={3} size={16} />
        </Link>
      </CardFooter>
    </Card>
  );
}

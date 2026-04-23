"use client";

import { Download, FileText, ChevronLeft, UploadCloud, Calendar, Info, FileUp, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectsData } from "@/lib/data";

export default function CourseLearningView() {
  const params = useParams();
  const courseId = params?.courseId as string | undefined;

  if (!courseId) return null;

  // Extract project ID from "project-1"
  const idMatch = courseId.match(/project-(\d+)/);
  const projectId = idMatch ? parseInt(idMatch[1], 10) : null;
  
  const project = projectsData.find(p => p.id === projectId);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
      
      {/* Navigation */}
      <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-slate-800 transition-colors group">
        <div className="bg-slate-200 p-1.5 rounded-md border-2 border-transparent group-hover:border-slate-200 group-hover:bg-gradient-to-br from-orange-300 to-amber-400 transition-all">
          <ChevronLeft size={16} strokeWidth={3} className="text-slate-700 group-hover:text-slate-800" />
        </div>
        Back to Courses
      </Link>

      {/* Top Section: Video Player */}
      <div className="w-full aspect-video bg-black rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="bg-gradient-to-br from-red-400 to-rose-500 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border border-slate-200 z-10 group-hover:scale-110 transition-transform shadow-sm hover:shadow-md">
            <PlayCircle size={32} strokeWidth={2.5} className="text-white ml-1" />
        </div>
        <span className="text-white font-black uppercase tracking-widest mt-4 z-10 bg-black px-3 py-1 border-2 border-slate-700 rounded-md text-xs">
          Lecture Video: {project.title}
        </span>
      </div>

      {/* Header Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-xl shadow-slate-200/50">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <h1 className="text-2xl md:text-3xl font-black uppercase text-slate-800 tracking-tight leading-tight">
            {project.title}
          </h1>
          <span className="text-xs font-black uppercase tracking-widest bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-200">
            Project {project.id}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <Calendar size={14} strokeWidth={2.5} className="text-red-500" />
          Included in: {project.programs.join(" & ")}
        </div>
        <div className="flex gap-3 items-start bg-slate-50 border-2 border-slate-200 p-4 rounded-lg">
          <Info size={20} strokeWidth={2.5} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {project.objective}
          </p>
        </div>
        
        <div className="mt-6 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-3">Required Components</h3>
            <div className="flex flex-wrap gap-2">
                {project.components.map((comp, idx) => (
                <span key={idx} className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 border border-slate-200 rounded-md inline-block uppercase tracking-wider">
                    {comp}
                </span>
                ))}
            </div>
        </div>
      </div>

      {/* Bottom Section: Tabs */}
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md h-auto p-1 gap-1">
          <TabsTrigger value="resources" className="text-xs md:text-sm font-black uppercase tracking-wider data-[state=active]:bg-[#43a047] data-[state=active]:border-2 data-[state=active]:border-slate-200 data-[state=active]:text-white rounded-lg py-3">
            Resources
          </TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs md:text-sm font-black uppercase tracking-wider data-[state=active]:bg-gradient-to-br from-red-400 to-rose-500 data-[state=active]:border-2 data-[state=active]:border-slate-200 data-[state=active]:text-white rounded-lg py-3">
            Assignments
          </TabsTrigger>
        </TabsList>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="pt-6 space-y-4">
                {[
                { title: `${project.title.toLowerCase().replace(/\s+/g, '_')}_code.ino`, type: "Source Code", icon: FileText, color: "bg-gradient-to-br from-orange-300 to-amber-400" },
                { title: `circuit_diagram_p${project.id}.pdf`, type: "PDF Document", icon: Download, color: "bg-[#43a047]" }
                ].map((resource, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`${resource.color} p-2 border border-slate-200 rounded-md shadow-sm hover:shadow-md`}>
                        <resource.icon size={20} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                        <p className="text-sm font-black text-slate-800">{resource.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{resource.type}</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto text-center bg-black text-white px-4 py-2 rounded-md text-xs font-black uppercase border border-slate-200 group-hover:bg-white group-hover:text-slate-800 transition-colors">
                    Download
                    </div>
                </div>
                ))}
            </CardContent>
            </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6">
            <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="pt-6">
                
                <div className="mb-6 p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                    <h3 className="text-sm font-black uppercase text-red-500 mb-2">Homework Instructions</h3>
                    <p className="text-sm font-medium text-slate-700">
                        Please wire the components according to the circuit diagram, implement the logic in the source code, and upload a video or photo of your working {project.title.toLowerCase()} below.
                    </p>
                </div>

                {/* Visual File Upload Form */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <UploadCloud size={20} className="text-slate-800" strokeWidth={2.5} />
                        <h4 className="text-sm font-black uppercase text-slate-800">Upload Submission</h4>
                    </div>
                    
                    <div className="border-4 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors cursor-pointer group">
                        <div className="bg-white p-4 rounded-full border-2 border-slate-300 group-hover:border-slate-200 group-hover:shadow-sm hover:shadow-md transition-all mb-4">
                            <FileUp size={32} className="text-slate-400 group-hover:text-slate-800" strokeWidth={2} />
                        </div>
                        <p className="text-sm font-black uppercase text-slate-800 mb-1 text-center">Click to upload or drag & drop</p>
                        <p className="text-xs font-bold text-slate-500 uppercase text-center">Supported: .ino, .pdf, .zip, .mp4, .jpg</p>
                        
                        <div className="mt-6 px-6 py-2 bg-black text-white text-xs font-black uppercase rounded-lg border border-slate-200 shadow-sm hover:shadow-md">
                            Browse Files
                        </div>
                    </div>
                </div>

            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}

"use client";

import { Download, FileText, ChevronLeft, UploadCloud, Calendar, Info, FileUp, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CourseLearningView({ params }: { params: { courseId: string } }) {
  // Placeholder data based on the prompt context
  const lectureData = {
    title: "Lecture 4: Line Following Robot Logic",
    date: "Recorded Live: October 14, 2026",
    description: "In this offline lab session, we covered the core logic for PID controllers and how to interface with dual infrared sensors to keep the rover centered on a track.",
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
      
      {/* Navigation */}
      <Link href="/dashboard/courses" className="inline-flex items-center gap-2 text-xs font-black uppercase text-slate-500 hover:text-black transition-colors group">
        <div className="bg-slate-200 p-1.5 rounded-md border-2 border-transparent group-hover:border-black group-hover:bg-[#ffcb05] transition-all">
          <ChevronLeft size={16} strokeWidth={3} className="text-slate-700 group-hover:text-black" />
        </div>
        Back to Courses
      </Link>

      {/* Top Section: Video Player */}
      <div className="w-full aspect-video bg-black rounded-xl border-4 border-black neo-shadow flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610651817366-0eb03264eb78?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="bg-[#dc0a2d] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 border-black z-10 group-hover:scale-110 transition-transform neo-shadow-sm">
            <PlayCircle size={32} strokeWidth={2.5} className="text-white ml-1" />
        </div>
        <span className="text-white font-black uppercase tracking-widest mt-4 z-10 bg-black px-3 py-1 border-2 border-slate-700 rounded-md text-xs">
          YouTube Iframe Placeholder
        </span>
      </div>

      {/* Header Section */}
      <div className="bg-white border-4 border-black rounded-xl p-5 md:p-6 neo-shadow">
        <h1 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight leading-tight mb-3">
          {lectureData.title}
        </h1>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          <Calendar size={14} strokeWidth={2.5} className="text-[#dc0a2d]" />
          {lectureData.date}
        </div>
        <div className="flex gap-3 items-start bg-slate-50 border-2 border-slate-200 p-4 rounded-lg">
          <Info size={20} strokeWidth={2.5} className="text-[#ffcb05] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-slate-700 leading-relaxed">
            {lectureData.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: Tabs */}
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border-4 border-black rounded-xl neo-shadow-sm h-auto p-1 gap-1">
          <TabsTrigger value="resources" className="text-xs md:text-sm font-black uppercase tracking-wider data-[state=active]:bg-[#43a047] data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:text-white rounded-lg py-3">
            Resources
          </TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs md:text-sm font-black uppercase tracking-wider data-[state=active]:bg-[#dc0a2d] data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:text-white rounded-lg py-3">
            Assignments
          </TabsTrigger>
        </TabsList>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
            <Card className="border-4 border-black rounded-xl neo-shadow bg-white">
            <CardContent className="pt-6 space-y-4">
                {[
                { title: "arduino_code_v2.ino", type: "Source Code", icon: FileText, color: "bg-[#ffcb05]" },
                { title: "circuit_diagram.pdf", type: "PDF Document", icon: Download, color: "bg-[#43a047]" }
                ].map((resource, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 border-black rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`${resource.color} p-2 border-2 border-black rounded-md neo-shadow-sm`}>
                        <resource.icon size={20} className="text-black" strokeWidth={2.5} />
                        </div>
                        <div>
                        <p className="text-sm font-black text-black">{resource.title}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{resource.type}</p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto text-center bg-black text-white px-4 py-2 rounded-md text-xs font-black uppercase border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                    Download
                    </div>
                </div>
                ))}
            </CardContent>
            </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6">
            <Card className="border-4 border-black rounded-xl neo-shadow bg-white">
            <CardContent className="pt-6">
                
                <div className="mb-6 p-4 border-2 border-[#dc0a2d] bg-red-50 rounded-lg">
                    <h3 className="text-sm font-black uppercase text-[#dc0a2d] mb-2">Homework Instructions</h3>
                    <p className="text-sm font-medium text-slate-700">
                        Please wire the dual IR sensors according to the circuit_diagram.pdf, implement the logic in the arduino_code_v2.ino, and upload your final .ino file below.
                    </p>
                </div>

                {/* Visual File Upload Form */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <UploadCloud size={20} className="text-black" strokeWidth={2.5} />
                        <h4 className="text-sm font-black uppercase text-black">Upload Submission</h4>
                    </div>
                    
                    <div className="border-4 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 bg-slate-50 hover:bg-slate-100 hover:border-black transition-colors cursor-pointer group">
                        <div className="bg-white p-4 rounded-full border-2 border-slate-300 group-hover:border-black group-hover:neo-shadow-sm transition-all mb-4">
                            <FileUp size={32} className="text-slate-400 group-hover:text-black" strokeWidth={2} />
                        </div>
                        <p className="text-sm font-black uppercase text-black mb-1 text-center">Click to upload or drag & drop</p>
                        <p className="text-xs font-bold text-slate-500 uppercase text-center">Supported: .ino, .pdf, .zip</p>
                        
                        <div className="mt-6 px-6 py-2 bg-black text-white text-xs font-black uppercase rounded-lg border-2 border-black neo-shadow-sm">
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

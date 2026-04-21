"use client";

import { Briefcase, Lock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const internships = [
  {
    id: "int-01",
    title: "Advanced Robotics Research Lab",
    company: "PNT Internal R&D",
    duration: "3 Months",
    driveLink: "https://drive.google.com/drive/folders/placeholder-link",
    status: "ACTIVE",
  },
  {
    id: "int-02",
    title: "IoT Systems Architecture",
    company: "SmartTech Solutions",
    duration: "6 Months",
    driveLink: "https://drive.google.com/drive/folders/placeholder-link",
    status: "LOCKED",
  }
];

export default function InternshipsPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <Briefcase size={36} className="text-rose-600" strokeWidth={2.5} />
          Internships
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Secure access to highly confidential program materials
        </p>
      </header>

      <div className="bg-red-50 border-4 border-rose-200 rounded-xl p-4 mb-8 flex items-start gap-4">
        <Lock className="text-rose-600 shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-black text-slate-800 uppercase text-sm mb-1">Strict Access Control</h3>
          <p className="text-sm font-medium text-slate-700">
            Internship recordings and resources contain proprietary IP. Access is strictly managed via Google Drive using your registered Academy email address. Do not share these links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {internships.map((internship) => (
          <Card key={internship.id} className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden bg-white flex flex-col group hover:-translate-y-1 transition-transform">
            <CardHeader className="border-b border-slate-200 bg-slate-100 flex flex-row items-start justify-between pb-4">
              <div>
                <CardTitle className="text-xl font-black uppercase text-slate-800 leading-tight mb-2">
                  {internship.title}
                </CardTitle>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  Partner: {internship.company}
                </div>
              </div>
              {internship.status === "ACTIVE" ? (
                <Badge className="bg-green-100 text-green-700 border-2 border-green-700 font-black shadow-sm hover:shadow-md hover:bg-green-100 uppercase ml-2 shrink-0">
                  Access Granted
                </Badge>
              ) : (
                <Badge className="bg-slate-200 text-slate-500 border-2 border-slate-400 font-black shadow-sm hover:shadow-md hover:bg-slate-200 uppercase ml-2 shrink-0">
                  <Lock size={12} className="mr-1 inline" /> Locked
                </Badge>
              )}
            </CardHeader>
            
            <CardContent className="p-6">
               <p className="text-sm font-bold text-slate-600 mb-4">
                 <span className="text-slate-800">Duration:</span> {internship.duration}
               </p>
               <p className="text-sm font-medium text-slate-500">
                 Clicking below will open the highly secure Google Drive Vault. You must be logged into Google with your approved Academy email to view the recordings.
               </p>
            </CardContent>

            <CardFooter className="pt-0 p-6 mt-auto">
               <a 
                 href={internship.status === "ACTIVE" ? internship.driveLink : "#"} 
                 target={internship.status === "ACTIVE" ? "_blank" : "_self"}
                 rel="noopener noreferrer"
                 className={`w-full flex items-center justify-center gap-2 px-5 py-4 border border-slate-200 rounded-lg font-black uppercase text-sm transition-all shadow-sm hover:shadow-md ${
                   internship.status === "ACTIVE" 
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-slate-800 hover:bg-[#d4a017] hover:shadow-lg hover:-translate-y-1 active:translate-y-1 " 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300"
                 }`}
               >
                 {internship.status === "ACTIVE" ? (
                   <>
                     Access Google Drive Vault <ExternalLink size={18} strokeWidth={2.5} />
                   </>
                 ) : (
                   <>
                     Requires Approval <Lock size={18} strokeWidth={2.5} />
                   </>
                 )}
               </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

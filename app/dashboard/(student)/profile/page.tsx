import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { 
  UserCircle, 
  Mail, 
  Hash, 
  Phone, 
  Building, 
  GraduationCap, 
  Calendar, 
  Clock,
  ShieldCheck,
  BookOpen,
  Trophy,
  Activity,
  Award
} from "lucide-react";

export const metadata = {
  title: "My Profile | PNT Academy",
  description: "View your student profile and details.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch the full user profile from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enrollments: true,
      submissions: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Calculate some fun stats
  const completedAssignments = user.submissions.filter(s => s.status === 'GRADED').length;
  const totalScore = user.submissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const avgScore = completedAssignments > 0 ? Math.round(totalScore / completedAssignments) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 bg-white">
        <div className="h-40 sm:h-56 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        </div>
        
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-white flex items-center justify-center p-1.5 shadow-xl">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name || "Student"} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <div className="h-full w-full rounded-full bg-indigo-50 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-indigo-400" />
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{user.name || "Student Name"}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  {user.studentStatus && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                      user.studentStatus === 'INTERN' ? 'bg-purple-100 text-purple-700' :
                      user.studentStatus === 'OTHER' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <UserCircle className="w-3.5 h-3.5" />
                      {user.studentStatus === 'OTHER' && user.customStatus ? user.customStatus : user.studentStatus}
                    </div>
                  )}
                  <span className="text-slate-500 font-medium text-sm flex items-center gap-1.5 ml-2">
                    <Calendar className="w-4 h-4" /> Joined {joinDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Enrolled Courses</p>
              <h3 className="text-2xl font-bold text-slate-900">{user.enrollments.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Submissions</p>
              <h3 className="text-2xl font-bold text-slate-900">{user.submissions.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Graded</p>
              <h3 className="text-2xl font-bold text-slate-900">{completedAssignments}</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Score</p>
              <h3 className="text-2xl font-bold text-slate-900">{avgScore}%</h3>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-300">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col hover:border-indigo-200 transition-colors duration-300">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <UserCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Information</h3>
          </div>
          <div className="p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1.5 group">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" /> Student ID
              </span>
              <p className="font-semibold text-slate-800 text-lg">{user.studentId || "Not assigned"}</p>
            </div>
            
            <div className="space-y-1.5 group">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" /> Email Address
              </span>
              <p className="font-semibold text-slate-800 text-lg truncate" title={user.email || ""}>{user.email || "No email provided"}</p>
            </div>

            <div className="space-y-1.5 group">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" /> Contact Number
              </span>
              <p className="font-semibold text-slate-800 text-lg">{user.contactNumber || "Not provided"}</p>
            </div>

            <div className="space-y-1.5 group">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 group-hover:text-indigo-500 transition-colors" /> Age
              </span>
              <p className="font-semibold text-slate-800 text-lg">{user.age ? `${user.age} years old` : "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col hover:border-purple-200 transition-colors duration-300">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Academic Details</h3>
          </div>
          <div className="p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1.5 group sm:col-span-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 group-hover:text-purple-500 transition-colors" /> Institute / School
              </span>
              <p className="font-semibold text-slate-800 text-lg">{user.instituteName || "Not provided"}</p>
            </div>
            
            <div className="space-y-1.5 group">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 group-hover:text-purple-500 transition-colors" /> Class / Standard
              </span>
              <p className="font-semibold text-slate-800 text-lg">{user.className || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-full shadow-sm text-sm font-medium text-slate-500">
          Need to update your information? Please contact your teacher or administrator.
        </div>
      </div>
    </div>
  );
}

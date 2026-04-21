"use client";

import { useState } from "react";
import { Settings, PlusCircle, Users, CheckSquare, BarChart, Download, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bulkCreateStudents } from "@/app/actions/students";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function AdminPage() {
  const [students, setStudents] = useState([
    { name: "", className: "", instituteName: "", age: "", contactNumber: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<any[]>([]);

  const addStudentRow = () => {
    setStudents([...students, { name: "", className: "", instituteName: "", age: "", contactNumber: "" }]);
  };

  const removeStudentRow = (index: number) => {
    const newStudents = [...students];
    newStudents.splice(index, 1);
    setStudents(newStudents);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newStudents = [...students] as any;
    newStudents[index][field] = value;
    setStudents(newStudents);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter out completely empty rows
    const validStudents = students.filter(s => s.name.trim() !== "");
    
    if (validStudents.length === 0) {
      alert("Please add at least one student with a name.");
      setIsSubmitting(false);
      return;
    }

    const result = await bulkCreateStudents(validStudents);
    if (result.success) {
      setGeneratedCredentials(result.data || []);
      // Reset form
      setStudents([{ name: "", className: "", instituteName: "", age: "", contactNumber: "" }]);
    } else {
      alert("Error generating students: " + result.error);
    }
    
    setIsSubmitting(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("PNT Academy - Student Credentials", 14, 22);
    
    doc.setFontSize(11);
    doc.text("Please share these login credentials securely. Students can login at pntacademy.com/login", 14, 30);

    const tableColumn = ["Student Name", "Class", "Login ID (Student ID)", "Password"];
    const tableRows = generatedCredentials.map(cred => [
      cred.name,
      cred.className,
      cred.studentId,
      cred.rawPassword
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [220, 10, 45] } // Red theme
    });

    doc.save("PNT_Student_Credentials.pdf");
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
          <Settings size={36} className="text-red-500" strokeWidth={2.5} />
          Admin & Teacher Panel
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Manage courses, assignments, and students
        </p>
      </header>

      {/* Quick Actions (Visual Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-gradient-to-br from-orange-300 to-amber-400 border border-slate-200 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
          <PlusCircle size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Add New Course</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <CheckSquare size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Grade Assignments</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <Users size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Mark Attendance</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-2 p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:-translate-y-1 hover:shadow-lg transition-all">
          <BarChart size={32} strokeWidth={2.5} className="text-slate-800" />
          <span className="font-black uppercase text-sm text-slate-800">Student Reports</span>
        </button>
      </div>

      {/* Student Onboarding Tool */}
      <h2 className="text-2xl font-black uppercase text-slate-800 mb-4">Student Onboarding & Bulk ID Generation</h2>
      
      {generatedCredentials.length > 0 && (
        <Card className="border border-green-200 rounded-xl shadow-xl shadow-slate-200/50 bg-green-50 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase text-green-800">Success! Credentials Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-green-700 mb-4">
              Successfully generated {generatedCredentials.length} student accounts. These passwords are NOT stored in plain text anywhere in the database. Please download the PDF now before leaving this page!
            </p>
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-lg font-black uppercase text-sm shadow-md hover:bg-green-700 transition-all hover:-translate-y-0.5"
            >
              <Download size={18} /> Download Credentials (PDF)
            </button>
          </CardContent>
        </Card>
      )}

      <Card className="border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 bg-white">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest font-black text-slate-500">
                  <th className="p-4">Student Name*</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Institute Name</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Contact Number</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-2">
                      <Input 
                        required 
                        placeholder="John Doe" 
                        value={student.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                        className="h-10 text-sm font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        placeholder="Grade 10" 
                        value={student.className}
                        onChange={(e) => handleChange(index, 'className', e.target.value)}
                        className="h-10 text-sm font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        placeholder="PNT School" 
                        value={student.instituteName}
                        onChange={(e) => handleChange(index, 'instituteName', e.target.value)}
                        className="h-10 text-sm font-medium"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        type="number" 
                        placeholder="15" 
                        value={student.age}
                        onChange={(e) => handleChange(index, 'age', e.target.value)}
                        className="h-10 text-sm font-medium w-20"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        placeholder="+91..." 
                        value={student.contactNumber}
                        onChange={(e) => handleChange(index, 'contactNumber', e.target.value)}
                        className="h-10 text-sm font-medium"
                      />
                    </td>
                    <td className="p-2 text-center">
                      {students.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeStudentRow(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CardFooter className="flex justify-between p-4 border-t border-slate-100 bg-slate-50">
            <button 
              type="button"
              onClick={addStudentRow}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-900 transition-colors"
            >
              <Plus size={16} /> Add Another Student
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-red-400 to-rose-500 text-white rounded-lg font-black uppercase text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? "Generating..." : "Generate Accounts"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

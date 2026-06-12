"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function DownloadRosterButton({ students, gradeName }: { students: any[]; gradeName: string }) {
  const downloadRoster = () => {
    if (!students || students.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add a neat title
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text(`Student Credentials Roster`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Grade: ${gradeName}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    const data = students.map(s => [
      s.name, 
      s.studentId, 
      s.email || "N/A", 
      s.plainPassword || "Unavailable"
    ]);

    autoTable(doc, {
      startY: 42,
      head: [["Name", "Student ID", "Email", "Password"]],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600
      alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
      styles: { fontSize: 9, cellPadding: 4 },
    });

    doc.save(`${gradeName}_Roster_Credentials.pdf`);
  };

  return (
    <button 
      onClick={downloadRoster}
      disabled={students.length === 0}
      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-sm"
    >
      <Download className="w-3.5 h-3.5" />
      Download PDF
    </button>
  );
}

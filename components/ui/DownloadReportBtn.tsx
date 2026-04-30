"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface CourseAnalytic {
  course: { title: string };
  attendance: { pct: number; present: number; total: number };
  assignments: { avgGrade: number | null; graded: number; total: number; submitted: number; pending: number };
}

interface DownloadReportBtnProps {
  studentName: string;
  studentId?: string | null;
  overallGrade: number | null;
  overallAttendance: number;
  courseAnalytics: CourseAnalytic[];
}

export function DownloadReportBtn({ studentName, studentId, overallGrade, overallAttendance, courseAnalytics }: DownloadReportBtnProps) {
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(255, 203, 5); // PNT Yellow
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PNT ACADEMY", 105, 18, { align: "center" });
    
    doc.setFontSize(14);
    doc.text("Official Student Report Card", 105, 28, { align: "center" });

    // Student Info Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    doc.text(`Student Name: ${studentName}`, 14, 55);
    if (studentId) {
      doc.text(`Student ID: ${studentId}`, 14, 63);
    }
    doc.text(`Date of Issue: ${today}`, 130, 55);

    // Overall Performance Summary
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(14, 75, 182, 25, "FD");
    
    doc.setFont("helvetica", "bold");
    doc.text("Overall Performance Summary", 18, 83);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Attendance: ${overallAttendance}%`, 18, 92);
    doc.text(`Overall Average Grade: ${overallGrade !== null ? overallGrade + '/100' : 'N/A'}`, 105, 92);

    // Course Breakdown Table
    const tableData = courseAnalytics.map(c => [
      c.course.title,
      `${c.attendance.pct}% (${c.attendance.present}/${c.attendance.total})`,
      c.assignments.avgGrade !== null ? `${c.assignments.avgGrade}/100` : 'N/A',
      `${c.assignments.submitted}/${c.assignments.total}`
    ]);

    autoTable(doc, {
      startY: 110,
      head: [['Course Title', 'Attendance', 'Avg Grade', 'Tasks Submitted']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        "This is a system generated report from the PNT Academy LMS Portal.",
        105,
        285,
        { align: "center" }
      );
    }

    doc.save(`${studentName.replace(/\s+/g, '_')}_Report_Card.pdf`);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-black uppercase hover:-translate-y-1 hover:shadow-lg transition-all active:translate-y-0"
    >
      <Download size={18} strokeWidth={2.5} />
      Download PDF
    </button>
  );
}

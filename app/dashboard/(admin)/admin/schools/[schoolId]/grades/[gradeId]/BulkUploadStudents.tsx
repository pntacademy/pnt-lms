"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, CheckCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { bulkUploadStudents } from "@/app/actions/schools";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function BulkUploadStudents({ schoolId, gradeId, gradeName }: { schoolId: string; gradeId: string; gradeName: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [roster, setRoster] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: async (results) => {
        try {
          const validStudents = results.data
            .filter((row: any) => row.name)
            .map((row: any) => ({
              name: row.name,
              grade: row.grade || gradeName,
              email: row.email || "",
              contactNumber: row.phone || row.contact || row.contactnumber || "",
            }));

          if (validStudents.length === 0) {
            alert("No valid students found in CSV. Please ensure you have a 'Name' column.");
            setIsUploading(false);
            return;
          }

          const generatedRoster = await bulkUploadStudents(schoolId, gradeId, validStudents);
          setRoster(generatedRoster);
        } catch (error) {
          console.error(error);
          alert("Failed to process bulk upload.");
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error("Error parsing CSV", error);
        alert("Failed to parse CSV file.");
        setIsUploading(false);
      }
    });
  };

  const downloadRoster = () => {
    if (!roster || roster.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add a neat title
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text(`Student Credentials Roster`, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Grade: ${gradeName}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    // Extract headers dynamically from the first object
    const headers = Object.keys(roster[0]);
    // Extract rows mapping keys to values
    const data = roster.map(student => headers.map(header => student[header]));

    autoTable(doc, {
      startY: 42,
      head: [headers],
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600
      alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
      styles: { fontSize: 9, cellPadding: 4 },
    });

    doc.save(`${gradeName}_Roster_Credentials.pdf`);
  };

  if (roster) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Successfully Created {roster.length} Accounts!</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          The student accounts have been created. **This is the ONLY time you can download the plain-text passwords.** Please download the roster now and share it with the school.
        </p>
        <button 
          onClick={downloadRoster}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
        >
          <Download className="w-5 h-5" />
          Download Roster PDF
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileSpreadsheet className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">Bulk Upload Students</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
        Upload a CSV file containing the student details. Ensure your file has a header row with at least a <strong>Name</strong> column.
      </p>

      <input 
        type="file" 
        accept=".csv"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" /> Select CSV File
          </>
        )}
      </button>

      <div className="mt-6 text-xs text-slate-400">
        Supported format: .csv | Required columns: Name
      </div>
    </div>
  );
}

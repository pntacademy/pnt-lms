"use client";

import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-black tracking-tight flex items-center gap-3">
          <CalendarIcon size={36} className="text-[#dc0a2d]" strokeWidth={2.5} />
          Academy Calendar
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
          Upcoming classes, deadlines, and events
        </p>
      </header>

      <div className="bg-yellow-50 border-4 border-[#ffcb05] rounded-xl p-4 mb-8 flex items-start gap-4">
        <Info className="text-[#d4a017] shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="font-black text-black uppercase text-sm mb-1">Google Calendar Integration</h3>
          <p className="text-sm font-medium text-slate-700">
            This calendar is synced directly from the Academy&apos;s free Google Calendar. Any events added by instructors will instantly appear here for all students.
          </p>
        </div>
      </div>

      <Card className="border-4 border-black rounded-xl neo-shadow overflow-hidden bg-white">
        <CardHeader className="border-b-4 border-black bg-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black uppercase text-black">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] bg-slate-100 relative">
            {/* 
              To make this work with a REAL Google Calendar:
              1. Go to Google Calendar -> Settings -> "Integrate Calendar"
              2. Make the calendar "Public"
              3. Copy the "Embed code" iframe src link and replace the src below.
            */}
            <iframe
              src="https://calendar.google.com/calendar/embed?src=en.indian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0"
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Users, BookOpen, AlertCircle } from "lucide-react";
import { getEvents } from "@/app/actions/calendar";
import FullCalendarWrapper, { CalendarEvent } from "@/components/calendar/FullCalendarWrapper";
import { NotificationClearer } from "@/components/layout/NotificationClearer";

type Event = CalendarEvent;

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const e = await getEvents();
        setEvents(e);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <NotificationClearer type="calendar" />
      <header className="mb-8 flex items-center gap-3">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center">
          <CalendarIcon size={28} className="text-red-500" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight">
            Schedule
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Upcoming classes, deadlines, and events
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading schedule...</div>
      ) : events.length === 0 ? (
        <div className="space-y-4">
          <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-sm">
            <CalendarIcon size={40} className="text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              No upcoming events scheduled
            </p>
          </div>
          <FullCalendarWrapper events={events as any} />
        </div>
      ) : (
        <div className="mt-8">
          <FullCalendarWrapper events={events as any} />
        </div>
      )}
    </div>
  );
}

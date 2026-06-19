"use client";

import React from "react";
import { CalendarEvent } from "./FullCalendarWrapper";
import { Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpcomingEventsWidgetProps {
  events: CalendarEvent[];
  role: "ADMIN" | "STUDENT";
}

export function UpcomingEventsWidget({ events, role }: UpcomingEventsWidgetProps) {
  // Get next 5 upcoming events
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const href = role === "ADMIN" ? "/dashboard/admin/calendar" : "/dashboard/calendar";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <CalendarIcon size={20} className="text-indigo-500" />
          Upcoming Events
        </h3>
        <Link href={href} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1">
          Full Calendar <ArrowRight size={14} />
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 text-slate-400">
            <CalendarIcon size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-bold uppercase tracking-widest">No upcoming events</p>
          </div>
        ) : (
          upcomingEvents.map(evt => (
            <div key={evt.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white font-black" style={{ backgroundColor: evt.color || "#3b82f6" }}>
                <span className="text-xs uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="text-lg leading-none">{new Date(evt.date).getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{evt.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                  <Clock size={12} />
                  {new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {evt.course && <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-wider truncate">{evt.course.title}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function CalendarAnalytics({ events }: { events: CalendarEvent[] }) {
  const thisMonthEvents = events.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const upcomingTests = events.filter(e => (e.type === "TEST" || e.type === "EXAMINATION") && new Date(e.date) >= new Date());
  const pendingDeadlines = events.filter(e => e.type === "ASSIGNMENT_DEADLINE" && new Date(e.date) >= new Date());

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Total This Month</span>
        <span className="text-3xl font-black text-slate-800">{thisMonthEvents.length}</span>
      </div>
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-1">Upcoming Tests</span>
        <span className="text-3xl font-black text-red-700">{upcomingTests.length}</span>
      </div>
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Pending Deadlines</span>
        <span className="text-3xl font-black text-amber-700">{pendingDeadlines.length}</span>
      </div>
      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-center">
        <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest mb-1">Total Events</span>
        <span className="text-3xl font-black text-indigo-700">{events.length}</span>
      </div>
    </div>
  );
}

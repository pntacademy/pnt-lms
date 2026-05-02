"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Users, BookOpen, AlertCircle } from "lucide-react";
import { getEvents } from "@/app/actions/calendar";

type Event = Awaited<ReturnType<typeof getEvents>>[0];

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
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl shadow-sm">
          <CalendarIcon size={40} className="text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No upcoming events scheduled
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(evt => {
            const date = new Date(evt.date);
            return (
              <div key={evt.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${evt.type === 'LIVE_CLASS' ? "bg-gradient-to-r from-red-400 to-rose-500" : evt.type === 'DEADLINE' ? "bg-gradient-to-r from-orange-400 to-amber-500" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`} />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block ${
                        evt.type === 'LIVE_CLASS' ? "bg-red-50 text-red-600" : evt.type === 'DEADLINE' ? "bg-orange-50 text-orange-600" : "bg-indigo-50 text-indigo-600"
                      }`}>{evt.type.replace("_", " ")}</span>
                      <h3 className="font-black text-slate-800 leading-tight">{evt.title}</h3>
                    </div>
                  </div>

                  {evt.description && <p className="text-xs text-slate-500 mb-4 line-clamp-2">{evt.description}</p>}

                  <div className="mt-auto space-y-2 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-slate-400" />
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {evt.duration && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        {evt.duration} minutes
                      </div>
                    )}
                    {evt.course ? (
                      <div className="flex items-center gap-2 text-indigo-600">
                        <BookOpen size={14} className="text-indigo-400" />
                        {evt.course.title}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Users size={14} className="text-emerald-400" />
                        General Academy Event
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 tracking-wider">Instructor: {evt.teacher.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useTransition } from "react";
import {
  CalendarDays, Plus, X, Trash2, Clock, Calendar as CalendarIcon, MapPin, Video,
  BookOpen, Users
} from "lucide-react";
import { getEvents, createEvent, deleteEvent } from "@/app/actions/calendar";
import { getAllCourses } from "@/app/actions/courses";

type Event = Awaited<ReturnType<typeof getEvents>>[0];
type Course = Awaited<ReturnType<typeof getAllCourses>>[0];

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = async () => {
    setIsLoading(true);
    const [e, c] = await Promise.all([getEvents(), getAllCourses()]);
    setEvents(e);
    setCourses(c);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const fd = new FormData(e.currentTarget);
        await createEvent(fd);
        setMessage({ type: "success", text: "Event created!" });
        setShowModal(false);
        load();
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  const handleDelete = (event: Event) => {
    if (!confirm(`Delete event "${event.title}"?`)) return;
    startTransition(async () => {
      await deleteEvent(event.id);
      load();
    });
  };

  return (
    <div className="min-h-full font-sans text-slate-800 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase text-slate-800 tracking-tight flex items-center gap-3">
            <CalendarDays size={36} className="text-indigo-600" strokeWidth={2.5} />
            Manage Calendar
          </h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-widest">
            Schedule Live Classes & Deadlines
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> New Event
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border-2 text-sm font-bold uppercase tracking-wide ${
          message.type === "error" ? "bg-red-50 border-red-200 text-red-600" : "bg-green-50 border-green-200 text-green-700"
        }`}>{message.text}</div>
      )}

      {/* Events List */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl">
          <CalendarDays size={40} className="text-slate-200" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No upcoming events. Schedule a class!
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
                    <button onClick={() => handleDelete(evt as any)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {evt.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{evt.description}</p>}

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
                        General Event
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 tracking-wider">Created by {evt.teacher.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="font-black text-lg uppercase text-slate-800 tracking-tight">Schedule New Event</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Event Title *</label>
                <input required name="title" placeholder="e.g. Live Python Session 1" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Description</label>
                <textarea name="description" rows={2} placeholder="Optional details..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Date & Time *</label>
                  <input required type="datetime-local" name="date" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Duration (min)</label>
                  <input type="number" name="duration" placeholder="e.g. 60" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Event Type</label>
                  <select name="type" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="LIVE_CLASS">Live Class</option>
                    <option value="DEADLINE">Deadline</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Related Course</label>
                  <select name="courseId" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="general">No Course (General)</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isPending}
                className="w-full h-11 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4">
                {isPending ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

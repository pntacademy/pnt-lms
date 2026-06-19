"use client";

import { useState, useEffect, useTransition } from "react";
import {
  CalendarDays, Plus, X, Trash2, Clock, Calendar as CalendarIcon, MapPin, Video,
  BookOpen, Users
} from "lucide-react";
import { getEvents, createEvent, deleteEvent } from "@/app/actions/calendar";
import { getAllCourses } from "@/app/actions/courses";

import FullCalendarWrapper, { CalendarEvent } from "@/components/calendar/FullCalendarWrapper";

type Event = CalendarEvent;
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

  // eslint-disable-next-line
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

      {/* Events Calendar */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm animate-pulse">Loading calendar...</div>
      ) : events.length === 0 ? (
        <div className="space-y-4">
          <div className="p-16 text-center flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-xl">
            <CalendarDays size={40} className="text-slate-200" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
              No upcoming events. Schedule a class!
            </p>
          </div>
          <FullCalendarWrapper events={events as any} />
        </div>
      ) : (
        <div className="mt-8">
          <FullCalendarWrapper events={events as any} onEventClick={(evt) => {
            // Optional: Handle admin event click, e.g. open edit modal
            if (confirm(`Delete event "${evt.title}"?`)) {
              handleDelete(evt as any);
            }
          }} />
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
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Type</label>
                  <select name="type" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="LIVE_CLASS">Live Class</option>
                    <option value="ASSIGNMENT_DEADLINE">Deadline</option>
                    <option value="TEST">Test/Exam</option>
                    <option value="HOLIDAY">Holiday</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="CUSTOM">Custom/General</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Priority</label>
                  <select name="priority" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Course</label>
                  <select name="courseId" className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    <option value="general">General (No Course)</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Color</label>
                  <input type="color" name="color" defaultValue="#3b82f6" className="w-full h-10 px-1 py-1 rounded-lg border border-slate-200 cursor-pointer" />
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

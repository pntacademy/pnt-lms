"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { EventType, EventStatus, EventPriority } from "@prisma/client";
import { X, Calendar as CalendarIcon, Clock, MapPin, Tag, Flag } from "lucide-react";
import "./calendar.css";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  date: Date;
  endDate?: Date | null;
  duration?: number | null;
  type: EventType;
  status: EventStatus;
  priority: EventPriority;
  color?: string | null;
  teacher?: { name: string | null };
  course?: { title: string } | null;
  schoolGrade?: { gradeName: string } | null;
}

interface FullCalendarWrapperProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  height?: string;
}

export default function FullCalendarWrapper({ events, onEventClick, height = "550px" }: FullCalendarWrapperProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Map our events to FullCalendar event objects
  const calendarEvents = events.map((evt) => {
    // If we have duration but no endDate, calculate endDate for display
    let end = evt.endDate;
    if (!end && evt.duration) {
      end = new Date(new Date(evt.date).getTime() + evt.duration * 60000);
    }

    // Default colors based on type if no specific color is provided
    let backgroundColor = evt.color || "#3b82f6"; // blue-500
    if (!evt.color) {
      if (evt.type === "TEST" || evt.type === "EXAMINATION") backgroundColor = "#ef4444"; // red
      else if (evt.type === "ASSIGNMENT_DEADLINE" || evt.type === "PROJECT_SUBMISSION") backgroundColor = "#f59e0b"; // amber
      else if (evt.type === "HOLIDAY") backgroundColor = "#10b981"; // emerald
      else if (evt.type === "ANNOUNCEMENT") backgroundColor = "#8b5cf6"; // violet
    }

    return {
      id: evt.id,
      title: evt.title,
      start: evt.date,
      end: end || undefined,
      backgroundColor,
      borderColor: backgroundColor,
      extendedProps: { ...evt }
    };
  });

  const handleEventClick = (info: any) => {
    const evt = info.event.extendedProps as CalendarEvent;
    if (onEventClick) {
      onEventClick(evt);
    } else {
      setSelectedEvent(evt);
    }
  };

  return (
    <>
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
          }}
          height={height}
          events={calendarEvents}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'Agenda'
          }}
        />
      </div>

      {/* Default Event Modal if no custom handler provided */}
      {selectedEvent && !onEventClick && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                  style={{ backgroundColor: selectedEvent.color || '#eef2ff', color: selectedEvent.color ? '#fff' : '#4f46e5' }}>
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{selectedEvent.type.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {selectedEvent.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Clock size={14} /> Start Time
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(selectedEvent.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                
                {(selectedEvent.endDate || selectedEvent.duration) && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <Clock size={14} /> End Time
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {selectedEvent.endDate 
                        ? new Date(selectedEvent.endDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                        : new Date(new Date(selectedEvent.date).getTime() + (selectedEvent.duration || 0) * 60000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                      }
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                {selectedEvent.course && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag size={16} className="text-indigo-400" />
                    <span className="text-slate-600">Course: <span className="font-semibold text-slate-800">{selectedEvent.course.title}</span></span>
                  </div>
                )}
                {selectedEvent.schoolGrade && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-emerald-400" />
                    <span className="text-slate-600">Class/Batch: <span className="font-semibold text-slate-800">{selectedEvent.schoolGrade.gradeName}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Flag size={16} className={
                    selectedEvent.priority === 'HIGH' ? 'text-red-400' : 
                    selectedEvent.priority === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'
                  } />
                  <span className="text-slate-600">Priority: <span className="font-semibold text-slate-800">{selectedEvent.priority}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

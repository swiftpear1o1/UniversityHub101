"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, X } from "lucide-react";
import { useStudyTracker } from "@/components/study/StudyProvider";
import { PROJECTS, getLocalISODate } from "@/lib/study/data";
import { displayDate, formatMonth, parseISODate } from "@/lib/study/calculations";
import type { CalendarEvent } from "@/lib/study/types";

const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function EventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const project = PROJECTS.find((item)=>item.id===event.projectId)!;
  return <button onClick={onClick} title={`${project.name}: ${event.title}`} className="block w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-semibold leading-4 transition hover:brightness-95 sm:text-[11px]" style={{ backgroundColor: `${event.color}18`, color: event.color, borderLeft: `2px solid ${event.color}` }}><span className="mr-1">{project.icon}</span>{event.title}</button>;
}

function EventDetails({ event, onClose, onUpdateDate }: { event: CalendarEvent; onClose: () => void; onUpdateDate: (event: CalendarEvent, date: string | null) => void }) {
  const project = PROJECTS.find((item)=>item.id===event.projectId)!;
  const [dateValue, setDateValue] = useState(event.date ?? "");
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose();}}>
    <section role="dialog" aria-modal="true" aria-labelledby="event-dialog-title" className="w-full max-w-lg rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
      <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl">{project.icon}</div><div><div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{project.name}</div><h2 id="event-dialog-title" className="mt-1 text-xl font-bold leading-6">{event.title}</h2></div></div><button onClick={onClose} aria-label="Close event details" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={18}/></button></div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{event.details}</p>
      <div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"><Clock3 size={14}/> Planner date</div><div className="mt-2 text-sm font-semibold text-slate-800">{displayDate(event.date,event.dateLabel ?? (event.month ? formatMonth(event.month) : undefined))}</div>
        <label className="mt-4 block text-xs font-semibold text-slate-600">Set or adjust an exact date<input type="date" value={dateValue} onChange={(e)=>{setDateValue(e.target.value);onUpdateDate(event,e.target.value || null);}} className="mt-1.5 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"/></label>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">Only the planner's stated dates are prefilled. Month-only milestones stay undated until you set an exact day.</p>
        {event.date && <button onClick={()=>{setDateValue("");onUpdateDate(event,null);}} className="mt-2 text-xs font-semibold text-blue-700 hover:underline">Keep as a month window</button>}
      </div>
      {event.final && <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Final deadline</div>}
      <button onClick={onClose} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Done</button>
    </section>
  </div>;
}

export default function IACalendarPage() {
  const { state, update } = useStudyTracker();
  const today = getLocalISODate();
  const [month, setMonth] = useState(today.slice(0,7));
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(year, monthNumber - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const cells = Array.from({length: Math.ceil((offset + daysInMonth) / 7) * 7},(_,index)=>{
    const day = index - offset + 1;
    return day >= 1 && day <= daysInMonth ? `${month}-${String(day).padStart(2,"0")}` : null;
  });
  const monthDatedEvents = useMemo(()=>state?.events.filter((event)=>event.date?.startsWith(month)) ?? [],[state?.events,month]);
  const monthWindowEvents = useMemo(()=>state?.events.filter((event)=>event.month===month) ?? [],[state?.events,month]);
  const selectedEvents = state?.events.filter((event)=>event.date===selectedDate) ?? [];

  function changeMonth(delta: number) {
    const date = new Date(year,monthNumber-1+delta,1);
    const value = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
    setMonth(value);
    setSelectedDate(`${value}-01`);
  }

  function updateEventDate(event: CalendarEvent, date: string | null) {
    update((current)=>({
      ...current,
      events: current.events.map((item)=>item.id===event.id ? {
        ...item,
        date,
        month: date ? date.slice(0,7) : (item.month ?? event.date?.slice(0,7) ?? month),
        dateLabel: date ? undefined : (item.dateLabel ?? formatMonth(item.month ?? month)),
      } : item),
    }));
    setSelectedEvent((current)=>current?.id===event.id ? { ...current, date, month: date ? date.slice(0,7) : (current.month ?? month), dateLabel: date ? undefined : (current.dateLabel ?? formatMonth(current.month ?? month)) } : current);
  }

  if (!state) return null;
  const count = monthDatedEvents.length + monthWindowEvents.length;

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">School planner � 2026-27</div><h2 className="mt-1 text-3xl font-bold tracking-tight">IA Calendar</h2><p className="mt-1.5 text-sm text-slate-500">Click any milestone for details. Month-only planner windows stay undated.</p></div><div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500"><CalendarDays size={15}/>{count} items this month</div></section>

    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6"><button onClick={()=>changeMonth(-1)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Previous month"><ArrowLeft size={16}/></button><div className="text-center"><h3 className="text-lg font-bold">{formatMonth(month)}</h3><p className="mt-0.5 text-[11px] text-slate-400">{monthDatedEvents.length} dated � {monthWindowEvents.length} month windows</p></div><button onClick={()=>changeMonth(1)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Next month"><ArrowRight size={16}/></button></div>
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80">{weekdayNames.map((day)=><div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 sm:py-3 sm:text-xs">{day}</div>)}</div>
      <div className="grid grid-cols-7">
        {cells.map((date,index)=>{
          if(!date) return <div key={`empty-${index}`} className="min-h-[76px] border-b border-r border-slate-100 bg-slate-50/35 sm:min-h-[110px]"/>;
          const dayNumber = Number(date.slice(-2));
          const events = monthDatedEvents.filter((event)=>event.date===date);
          const isToday = date===today;
          const isSelected = date===selectedDate;
          return <div key={date} className={`min-w-0 min-h-[76px] border-b border-r border-slate-100 p-1.5 align-top transition sm:min-h-[110px] sm:p-2 ${isSelected?"bg-blue-50/60":"hover:bg-slate-50"}`}>
            <button onClick={()=>setSelectedDate(date)} aria-label={`Show milestones for ${date}`} className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${isToday?"bg-blue-600 text-white":isSelected?"bg-blue-100 text-blue-800":"text-slate-600 hover:bg-slate-200"}`}>{dayNumber}</button>
            <div className="mt-1 space-y-1">{events.slice(0,2).map((event)=><span key={event.id} className="hidden sm:block"><EventPill event={event} onClick={()=>{setSelectedDate(date);setSelectedEvent(event);}}/></span>)}{events.length>2&&<button onClick={()=>setSelectedDate(date)} className="hidden pl-1 text-[9px] font-semibold text-slate-400 hover:text-slate-700 sm:block sm:text-[10px]">+{events.length-2} more</button>}</div>
            <div className="mt-1 flex gap-1 sm:hidden">{events.slice(0,3).map((event)=><button key={event.id} onClick={()=>{setSelectedDate(date);setSelectedEvent(event);}} aria-label={`Open ${event.title}`} title={event.title} className="h-2 w-2 rounded-full" style={{backgroundColor:event.color}}/>)}{events.length>3&&<button onClick={()=>setSelectedDate(date)} className="text-[9px] font-semibold text-slate-400" aria-label={`Show all ${events.length} milestones`}>+{events.length-3}</button>}</div>
          </div>;
        })}
      </div>
    </section>

    {monthWindowEvents.length>0&&<section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 sm:p-5"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-700"><CalendarDays size={16}/></div><div><h3 className="font-bold">Month focus</h3><p className="text-xs text-slate-500">The planner gives these milestones a month but no exact day.</p></div></div><div className="mt-3 grid gap-2 md:grid-cols-2">{monthWindowEvents.map((event)=><button key={event.id} onClick={()=>setSelectedEvent(event)} className="flex items-start gap-3 rounded-xl border border-white bg-white/80 p-3 text-left transition hover:bg-white"><span className="mt-0.5 rounded-lg px-2 py-1 text-[10px] font-bold" style={{backgroundColor:`${event.color}16`,color:event.color}}>{event.dateLabel??formatMonth(month)}</span><span><span className="block text-sm font-semibold text-slate-800">{event.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{event.details}</span></span></button>)}</div></section>}

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{selectedDate===today?"Today's milestones":`Milestones � ${displayDate(selectedDate)}`}</h3><p className="mt-1 text-xs text-slate-500">{selectedEvents.length ? `${selectedEvents.length} dated item${selectedEvents.length===1?"":"s"}` : "No dated milestones on this day."}</p></div><button onClick={()=>setSelectedDate(today)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50">Today</button></div>
      {selectedEvents.length>0&&<div className="mt-4 space-y-2">{selectedEvents.map((event)=><div key={event.id} className="flex items-center gap-2"><div className="min-w-0 flex-1"><EventPill event={event} onClick={()=>setSelectedEvent(event)}/></div><button onClick={()=>setSelectedEvent(event)} className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Details</button></div>)}</div>}
    </section>

    {selectedEvent&&<EventDetails event={selectedEvent} onClose={()=>setSelectedEvent(null)} onUpdateDate={updateEventDate}/>}
  </div>;
}


"use client";

import { useEffect, useState } from "react";
import { Clock3, MessageSquareText, Star } from "lucide-react";
import { useStudyTracker } from "@/components/study/StudyProvider";
import { getCurrentDayIndex, getLocalISODate } from "@/lib/study/data";
import { SUBJECTS } from "@/lib/study/types";
import type { SubjectId } from "@/lib/study/types";

const icons: Record<SubjectId,string>={Physics:"?",Mathematics:"�",Chemistry:"??",Spanish:"????",English:"??",Economics:"??"};
const colorClasses: Record<SubjectId,string>={Physics:"focus:ring-blue-500",Mathematics:"focus:ring-violet-500",Chemistry:"focus:ring-emerald-500",Spanish:"focus:ring-orange-500",English:"focus:ring-indigo-500",Economics:"focus:ring-amber-500"};

export default function DailyUpdatePage(){
  const {state,ready,update}=useStudyTracker();
  const [dayNumber,setDayNumber]=useState(0);
  const today=getLocalISODate();
  const actualDay=state?getCurrentDayIndex(state.startDate,today):1;
  useEffect(()=>{if(ready&&state&&dayNumber===0)setDayNumber(actualDay);},[ready,state,actualDay,dayNumber]);
  if(!state||!ready)return null;
  const day=dayNumber||actualDay;
  const log=state.logs[String(day)];
  const total=SUBJECTS.reduce((sum,subject)=>sum+(Number(log?.hours[subject])||0),0);

  function setHours(subject:SubjectId,value:number){
    const safe=Math.max(0,Math.min(24,Number.isFinite(value)?value:0));
    update((current)=>({...current,logs:{...current.logs,[String(day)]:{...current.logs[String(day)],hours:{...current.logs[String(day)].hours,[subject]:safe}}}}));
  }
  function setFocus(value:number){update((current)=>({...current,logs:{...current.logs,[String(day)]:{...current.logs[String(day)],focus:value}}}));}
  function setNotes(value:string){update((current)=>({...current,logs:{...current.logs,[String(day)]:{...current.logs[String(day)],notes:value}}}));}

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Study reflection</div><h2 className="mt-1 text-3xl font-bold tracking-tight">Daily Update</h2><p className="mt-1.5 text-sm text-slate-500">Log time, focus, and a short note for any tracker day.</p></div><label className="text-xs font-semibold text-slate-500">Study day<select value={day} onChange={(event)=>setDayNumber(Number(event.target.value))} className="ml-2 h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800">{Array.from({length:30},(_,i)=><option key={i+1} value={i+1}>Day {i+1}{i+1===actualDay?" � Today":""}</option>)}</select></label></section>

    <section className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">Study hours by subject</h3><p className="mt-1 text-xs text-slate-500">Enter time in 15-minute increments, such as 1.25.</p></div><Clock3 className="text-slate-400" size={19}/></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{SUBJECTS.map((subject)=><label key={subject} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"><span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="text-lg">{icons[subject]}</span>{subject}</span><span className="mt-3 flex items-center gap-2"><input type="number" min="0" max="24" step="0.25" value={log?.hours[subject]??0} onChange={(event)=>setHours(subject,Number(event.target.value))} aria-label={`${subject} study hours`} className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:ring-2 ${colorClasses[subject]}`}/><span className="text-xs text-slate-400">hours</span></span></label>)}</div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-4 text-white"><div><div className="text-xs text-slate-300">Total study time</div><div className="mt-1 text-2xl font-bold">{total.toFixed(total%1===0?0:2)} <span className="text-sm font-medium text-slate-300">hours</span></div></div><div className="rounded-xl bg-white/10 p-2.5"><Clock3 size={20}/></div></div>
      </div>

      <div className="space-y-4">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">Focus rating</h3><p className="mt-1 text-xs text-slate-500">How focused did you feel today?</p></div><Star className="text-amber-500" size={19}/></div><div className="mt-5 flex items-center gap-2" role="radiogroup" aria-label="Focus rating from 1 to 5 stars">{[1,2,3,4,5].map((rating)=><button key={rating} role="radio" aria-checked={log?.focus===rating} aria-label={`${rating} out of 5 stars`} onClick={()=>setFocus(rating)} className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${Number(log?.focus)>=rating?"bg-amber-100 text-amber-600":"bg-slate-50 text-slate-300 hover:bg-amber-50 hover:text-amber-400"}`}><Star size={21} fill={Number(log?.focus)>=rating?"currentColor":"none"}/></button>)}</div><div className="mt-2 text-xs text-slate-400">{log?.focus?`${log.focus} of 5`:"Not rated"}</div></section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h3 className="font-bold">Notes & reflection</h3><p className="mt-1 text-xs text-slate-500">What went well? What needs another pass?</p></div><MessageSquareText className="text-slate-400" size={18}/></div><textarea value={log?.notes??""} onChange={(event)=>setNotes(event.target.value)} placeholder="Write a quick note to your future self." rows={6} className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm leading-6 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"/><div className="mt-2 text-right text-[11px] text-slate-400">Saved automatically</div></section>
      </div>
    </section>
  </div>;
}


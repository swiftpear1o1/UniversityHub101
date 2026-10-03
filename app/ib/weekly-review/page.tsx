"use client";

import { BookOpenCheck, CheckCircle2, Sparkles } from "lucide-react";
import { ProgressBar } from "@/components/study/ProgressBar";
import { useStudyTracker } from "@/components/study/StudyProvider";
import { WEEKLY_REVIEWS } from "@/lib/study/data";

const accents = ["#2563eb", "#059669", "#7c3aed", "#d97706"];

export default function WeeklyReviewPage() {
  const { state, update } = useStudyTracker();
  if (!state) return null;
  const allGoals = WEEKLY_REVIEWS.reduce((sum,week)=>sum+week.goals.length,0);
  const completed = WEEKLY_REVIEWS.reduce((sum,week)=>sum+week.goals.filter((_,index)=>state.weeks[String(week.week)]?.[`goal-${index}`]).length,0);

  function toggle(weekNumber: number, goalIndex: number, checked: boolean) {
    update((current)=>({ ...current, weeks: { ...current.weeks, [String(weekNumber)]: { ...current.weeks[String(weekNumber)], [`goal-${goalIndex}`]: checked } } }));
  }

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Four-week plan</div><h2 className="mt-1 text-3xl font-bold tracking-tight">Weekly Review</h2><p className="mt-1.5 text-sm text-slate-500">Mark the weekly milestones you’ve completed and spot your next focus.</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm"><div className="text-xs text-slate-400">Milestones completed</div><div className="mt-0.5 text-lg font-bold">{completed}<span className="ml-1 text-sm font-medium text-slate-400">/ {allGoals}</span></div></div></section>
    <section className="grid gap-4 xl:grid-cols-2">
      {WEEKLY_REVIEWS.map((week,index)=>{
        const done=week.goals.filter((_,goalIndex)=>state.weeks[String(week.week)]?.[`goal-${goalIndex}`]).length;
        const percent=Math.round((done/week.goals.length)*100);
        return <article key={week.week} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 font-bold" style={{color:accents[index]}}>0{week.week}</div><div><div className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">Week {week.week}</div><h3 className="mt-1 text-lg font-bold leading-6">{week.title}</h3></div></div>{percent===100?<CheckCircle2 className="text-emerald-600" size={20}/>:<Sparkles className="text-slate-300" size={19}/>}</div>
          <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{done} of {week.goals.length} milestones</span><span className="font-bold" style={{color:accents[index]}}>{percent}%</span></div><ProgressBar value={percent} color={accents[index]} className="mt-2"/>
          <div className="mt-4 space-y-1.5">{week.goals.map((goal,goalIndex)=>{const checked=Boolean(state.weeks[String(week.week)]?.[`goal-${goalIndex}`]);return <label key={goal} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition ${checked?"bg-emerald-50/70":"hover:bg-slate-50"}`}><input type="checkbox" checked={checked} onChange={(event)=>toggle(week.week,goalIndex,event.target.checked)} aria-label={`Week ${week.week}: ${goal}`} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/><span className={`text-sm ${checked?"text-slate-400 line-through":"text-slate-700"}`}>{goal}</span></label>;})}</div>
        </article>;
      })}
    </section>
    <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900"><BookOpenCheck size={17}/>Each week’s review saves locally and stays available after a refresh.</div>
  </div>;
}

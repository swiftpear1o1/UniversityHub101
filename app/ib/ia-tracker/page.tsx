"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, ChevronDown, ChevronUp, Clock3, ListChecks, ShieldAlert, Target } from "lucide-react";
import { ProgressBar } from "@/components/study/ProgressBar";
import { StatusBadge } from "@/components/study/StatusBadge";
import { useStudyTracker } from "@/components/study/StudyProvider";
import { PROJECTS, getLocalISODate } from "@/lib/study/data";
import { displayDate, eventSortDate, getAllProjectSummaries, getMostUrgentProject, getProjectSummary } from "@/lib/study/calculations";
import type { ProjectId } from "@/lib/study/types";

function StageStatus({ status, label }: { status: string; label: string }) {
  const complete = status === "Complete";
  const started = status === "In progress";
  return <div className="rounded-xl bg-slate-50 px-3 py-2.5"><div className="text-[10px] font-bold uppercase tracking-[0.11em] text-slate-400">{label}</div><div className={`mt-1.5 flex items-center gap-1.5 text-xs font-semibold ${complete ? "text-emerald-700" : started ? "text-amber-700" : "text-slate-500"}`}><span aria-hidden="true">{complete ? "✓" : started ? "◔" : "○"}</span>{status}</div></div>;
}

export default function IATrackerPage() {
  const { state, update } = useStudyTracker();
  const [expanded, setExpanded] = useState<ProjectId | null>("physics-ia");
  const today = getLocalISODate();
  const summaries = useMemo(()=>state?getAllProjectSummaries(state,today):[],[state,today]);
  const urgent = state?getMostUrgentProject(state,today):undefined;
  if (!state) return null;
  const allDone = summaries.reduce((sum,item)=>sum+item.summary.completed,0);
  const allTotal = summaries.reduce((sum,item)=>sum+item.summary.total,0);
  const overall = allTotal?Math.round((allDone/allTotal)*100):0;
  const projectCounts = { onTrack: summaries.filter((item)=>item.summary.status==="On Track").length, atRisk: summaries.filter((item)=>item.summary.status==="At Risk").length, behind: summaries.filter((item)=>item.summary.status==="Behind").length };
  const nextDeadline = state.events.filter((event)=>event.date?event.date>=today:Boolean(event.month&&event.month>=today.slice(0,7))).sort((a,b)=>eventSortDate(a).localeCompare(eventSortDate(b)))[0];
  const nextDeadlineProject = nextDeadline?PROJECTS.find((project)=>project.id===nextDeadline.projectId):undefined;

  function toggleCheck(projectId: ProjectId,itemId: string,checked: boolean) {
    update((current)=>({ ...current, checklist: { ...current.checklist, [projectId]: { ...current.checklist[projectId], [itemId]: checked } } }));
  }

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="text-xs font-bold uppercase tracking-[0.16em] text-violet-700">Project progress</div><h2 className="mt-1 text-3xl font-bold tracking-tight">IA & Coursework</h2><p className="mt-1.5 text-sm text-slate-500">Simple checklists, compared against the school’s 2026–27 planner.</p></div><Link href="/ib/ia-calendar" className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><CalendarClock size={16}/>View calendar</Link></section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>Overall completion</span><Target size={16}/></div><div className="mt-3 flex items-end justify-between"><div className="text-3xl font-bold">{overall}%</div><div className="text-xs text-slate-400">{allDone}/{allTotal} steps</div></div><ProgressBar value={overall} className="mt-3"/></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>Most urgent project</span><ShieldAlert size={16}/></div><div className="mt-3 truncate text-lg font-bold">{urgent?.project.icon} {urgent?.project.name??"All complete"}</div><div className="mt-1 text-xs text-slate-500">{urgent?.summary.nextEvent?.title??urgent?.summary.overdueEvent?.title??"All checklist items are complete."}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>Next deadline</span><Clock3 size={16}/></div><div className="mt-3 truncate text-lg font-bold">{nextDeadline?displayDate(nextDeadline.date,nextDeadline.dateLabel??(nextDeadline.month?new Intl.DateTimeFormat("en-IN",{month:"long",year:"numeric"}).format(new Date(Number(nextDeadline.month.slice(0,4)),Number(nextDeadline.month.slice(5))-1,1)):undefined)):"None"}</div><div className="mt-1 truncate text-xs text-slate-500">{nextDeadlineProject?.icon} {nextDeadline?.title??"No upcoming deadlines"}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>Schedule status</span><CheckCircle2 size={16}/></div><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{projectCounts.onTrack} on track</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">{projectCounts.atRisk} at risk</span><span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">{projectCounts.behind} behind</span></div><div className="mt-2 text-xs text-slate-400">Across all eight projects</div></div>
    </section>

    {projectCounts.behind>0&&<section role="status" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><ShieldAlert size={18}/></div><div><div className="font-bold text-rose-900">⚠️ IA PROGRESS BEHIND SCHEDULE</div><p className="mt-1 text-sm leading-5 text-rose-800">{summaries.filter((item)=>item.summary.status==="Behind").map((item)=>item.project.name).join(", ")} have an unchecked milestone dated before today. Update the checklists below to reflect completed work.</p></div></section>}

    <div className="grid gap-4 xl:grid-cols-2">
      {PROJECTS.map((project)=>{
        const summary = getProjectSummary(project,state,today);
        const isOpen = expanded===project.id;
        const dataItems = project.checklist.filter((item)=>item.group==="data");
        const writingItems = project.checklist.filter((item)=>item.group==="writing");
        const dataDone = dataItems.filter((item)=>state.checklist[project.id]?.[item.id]).length;
        const writingDone = writingItems.filter((item)=>state.checklist[project.id]?.[item.id]).length;
        const stage = (done:number,total:number)=>total>0&&done===total?"Complete":done>0?"In progress":"Not started";
        const next = summary.nextEvent??summary.overdueEvent??summary.finalDeadline;
        return <article key={project.id} className={`rounded-2xl border bg-white shadow-sm ${summary.status==="Behind"?"border-rose-200":"border-slate-200"}`}>
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-xl">{project.icon}</span><div className="min-w-0"><h3 className="truncate font-bold">{project.name}</h3><p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500">{project.description}</p></div></div><StatusBadge status={summary.status}/></div>
            <div className="mt-4 flex items-end justify-between"><div><span className="text-2xl font-bold">{summary.progress}%</span><span className="ml-2 text-xs text-slate-400">{summary.completed}/{summary.total} items</span></div><span className="text-xs font-semibold text-slate-500">{next?.title??"All milestones complete"}</span></div>
            <ProgressBar value={summary.progress} color={project.color} className="mt-2.5"/>
            {(project.id==="physics-ia"||project.id==="chemistry-ia")&&<div className="mt-3 grid grid-cols-2 gap-2"><StageStatus label="Data collection" status={stage(dataDone,dataItems.length)}/><StageStatus label="Writing" status={stage(writingDone,writingItems.length)}/></div>}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500"><span>{summary.finalDeadline?`Final: ${displayDate(summary.finalDeadline.date,summary.finalDeadline.dateLabel??(summary.finalDeadline.month?new Intl.DateTimeFormat("en-IN",{month:"long",year:"numeric"}).format(new Date(Number(summary.finalDeadline.month.slice(0,4)),Number(summary.finalDeadline.month.slice(5))-1,1)):undefined))}`:"Final deadline not listed"}</span><button onClick={()=>setExpanded(isOpen?null:project.id)} className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-semibold text-blue-700 hover:bg-blue-50" aria-expanded={isOpen}>{isOpen?"Hide checklist":"Update Progress"}{isOpen?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</button></div>
          </div>
          {isOpen&&<div className="border-t border-slate-100 px-4 py-3 sm:px-5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400"><ListChecks size={14}/> Checklist</div>
            <div className="grid gap-x-5 sm:grid-cols-2">{project.checklist.map((item)=><label key={item.id} className="flex cursor-pointer items-start gap-2.5 rounded-lg py-2 text-sm hover:bg-slate-50"><input type="checkbox" checked={Boolean(state.checklist[project.id]?.[item.id])} onChange={(event)=>toggleCheck(project.id,item.id,event.target.checked)} aria-label={`${project.name}: ${item.label}`} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"/><span className={state.checklist[project.id]?.[item.id]?"text-slate-400 line-through":"text-slate-700"}>{item.label}</span></label>)}</div>
            {summary.overdueEvent&&<div className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-800"><strong>Overdue:</strong> {summary.overdueEvent.title} · {displayDate(summary.overdueEvent.date)}</div>}
          </div>}
        </article>;
      })}
    </div>
    <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs text-slate-600"><ArrowRight size={14}/> Physics EE is a Physics-only project and has its own checklist, separate from Physics IA.</div>
  </div>;
}

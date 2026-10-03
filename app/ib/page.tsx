"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, CalendarDays, Check, Clock3, Flame, Sparkles, Target, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/study/ProgressBar";
import { StatusBadge } from "@/components/study/StatusBadge";
import { useStudyTracker } from "@/components/study/StudyProvider";
import { PROJECTS, getCurrentDayIndex, getLocalISODate } from "@/lib/study/data";
import { displayDate, eventSortDate, getDayTaskStats, getDaysCompleted, getMostUrgentProject, getOverallStudyStats, getProjectSummary, getStudyStreak, getSubjectStats, parseISODate } from "@/lib/study/calculations";
import { SUBJECTS } from "@/lib/study/types";

const subjectColors: Record<string, string> = { Physics: "#2563eb", Mathematics: "#7c3aed", Chemistry: "#059669", Spanish: "#ea580c", English: "#4f46e5", Economics: "#d97706" };
const subjectIcons: Record<string, string> = { Physics: "⚡", Mathematics: "∑", Chemistry: "🧪", Spanish: "🇪🇸", English: "✍️", Economics: "📈" };

function ProgressRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 39;
  return <div className="relative flex h-24 w-24 items-center justify-center" aria-label={`${value}% overall completion`}><svg viewBox="0 0 100 100" className="h-full w-full -rotate-90"><circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="9" className="text-slate-100"/><circle cx="50" cy="50" r="39" fill="none" stroke="#2563eb" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} className="transition-all duration-700"/></svg><span className="absolute text-xl font-bold">{value}%</span></div>;
}

export default function IBDashboard() {
  const { state, update } = useStudyTracker();
  if (!state) return null;
  const today = getLocalISODate();
  const currentDay = getCurrentDayIndex(state.startDate, today);
  const overall = getOverallStudyStats(state.days);
  const todayStats = getDayTaskStats(state.days[String(currentDay)]);
  const streak = getStudyStreak(state.days, state.startDate, today);
  const daysCompleted = getDaysCompleted(state.days, state.startDate, today);
  const urgent = getMostUrgentProject(state, today);
  const dateLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(parseISODate(today));
  const upcomingEvents = state.events.filter((event) => event.date ? event.date >= today : Boolean(event.month && event.month >= today.slice(0, 7))).sort((a, b) => eventSortDate(a).localeCompare(eventSortDate(b))).slice(0, 5);
  const urgentEvent = urgent?.summary.nextEvent ?? urgent?.summary.overdueEvent ?? urgent?.summary.finalDeadline;
  const urgentProject = urgent?.project;
  const finalDate = urgent?.summary.finalDeadline;

  const toggleTask = (subject: (typeof SUBJECTS)[number], taskId: string, bucket: "main" | "extra", checked: boolean) => {
    update((current) => {
      const day = current.days[String(currentDay)];
      return { ...current, days: { ...current.days, [String(currentDay)]: { ...day, [bucket]: { ...day[bucket], [subject]: day[bucket][subject].map((task) => task.id === taskId ? { ...task, completed: checked } : task) } } } };
    });
  };

  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"><Sparkles size={13}/> Your personal IB command center</div><h2 className="text-3xl font-bold tracking-tight sm:text-[34px]">Today, with a plan.</h2><p className="mt-1.5 text-sm text-slate-500">{dateLabel} <span className="mx-1.5 text-slate-300">·</span> Academic year 2026–27</p></div>
      <Link href="/ib/daily-tasks" className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Open today’s tasks <ArrowRight size={16}/></Link>
    </section>

    <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-5"><ProgressRing value={overall.percent}/><div><div className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">30-day study progress</div><div className="mt-1 text-2xl font-bold">Day {currentDay} <span className="text-base font-medium text-slate-400">/ 30</span></div><div className="mt-1 text-sm text-slate-500">{overall.completed} of {overall.total} study checkboxes complete</div></div></div>
          <div className="grid grid-cols-3 gap-2 sm:w-[310px]">
            <div className="rounded-2xl bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-xs text-slate-500"><Check size={13}/> Today</div><div className="mt-2 text-lg font-bold">{todayStats.completed}<span className="ml-1 text-xs font-medium text-slate-400">/{todayStats.total}</span></div></div>
            <div className="rounded-2xl bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-xs text-slate-500"><Flame size={13}/> Streak</div><div className="mt-2 text-lg font-bold">{streak}<span className="ml-1 text-xs font-medium text-slate-400">days</span></div></div>
            <div className="rounded-2xl bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays size={13}/> Active</div><div className="mt-2 text-lg font-bold">{daysCompleted}<span className="ml-1 text-xs font-medium text-slate-400">days</span></div></div>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
          {Array.from({ length: 30 }, (_, index) => {
            const day = index + 1;
            const taskStats = getDayTaskStats(state.days[String(day)]);
            const isCurrent = day === currentDay;
            const isComplete = taskStats.total > 0 && taskStats.completed === taskStats.total;
            const hasActivity = taskStats.completed > 0;
            return <Link key={day} href={`/ib/daily-tasks?day=${day}`} title={`Day ${day}: ${taskStats.completed}/${taskStats.total} tasks`} className={`flex aspect-square items-center justify-center rounded-lg text-[11px] font-semibold transition ${isCurrent ? "ring-2 ring-blue-500 ring-offset-1" : ""} ${isComplete ? "bg-blue-600 text-white" : hasActivity ? "bg-blue-100 text-blue-800" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}>{day}</Link>;
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400"><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-slate-100"/> No activity</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-blue-100"/> Started</span><span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-blue-600"/> All done</span></div>
      </div>

      <div className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-7 ${urgent?.summary.status === "Behind" ? "border-rose-200 bg-rose-50" : urgent?.summary.status === "At Risk" ? "border-amber-200 bg-amber-50" : "border-sky-200 bg-sky-50"}`}>
        <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500"><Target size={15}/> Today’s IA priority</div><h3 className="mt-3 text-2xl font-bold tracking-tight">{urgentProject ? `${urgentProject.icon} ${urgentProject.name}` : "All caught up"}</h3></div>{urgent && <StatusBadge status={urgent.summary.status}/>}</div>
        {urgentProject && urgent ? <>
          <p className="mt-2 text-sm leading-6 text-slate-600">{urgent.summary.status === "Behind" ? "A planner milestone is past due. Update your checklist to bring the schedule into focus." : urgent.summary.status === "At Risk" ? "This milestone is approaching. Choose one concrete next step today." : "Your next project milestone is on the horizon."}</p>
          <div className="mt-5 rounded-2xl border border-white/80 bg-white/70 p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Next milestone</div>
            <div className="mt-1.5 font-semibold text-slate-900">{urgentEvent?.title ?? "Review project checklist"}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 size={13}/>{displayDate(urgentEvent?.date, urgentEvent?.dateLabel ?? (urgentEvent?.month ? new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(Number(urgentEvent.month.slice(0,4)), Number(urgentEvent.month.slice(5))-1, 1)) : undefined))}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/70 pt-3"><div><div className="text-[11px] text-slate-400">Final deadline</div><div className="mt-1 text-sm font-semibold text-slate-800">{displayDate(finalDate?.date, finalDate?.dateLabel ?? (finalDate?.month ? `Second week of ${new Intl.DateTimeFormat("en-IN", { month: "long" }).format(new Date(Number(finalDate.month.slice(0,4)), Number(finalDate.month.slice(5))-1, 1))}` : undefined))}</div></div><div><div className="text-[11px] text-slate-400">Current progress</div><div className="mt-1 text-sm font-semibold text-slate-800">{urgent.summary.progress}%</div></div></div>
            <ProgressBar value={urgent.summary.progress} color={urgentProject.color} className="mt-3"/>
          </div>
          <Link href="/ib/ia-tracker" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:underline">Update IA progress <ArrowRight size={15}/></Link>
        </> : <p className="mt-3 text-sm text-slate-600">Every project checklist is complete. You can use today’s focus for exam practice or a weekly review.</p>}
      </div>
    </section>

    <section>
      <div className="mb-3 flex items-end justify-between"><div><h3 className="text-lg font-bold">Study by subject</h3><p className="mt-0.5 text-sm text-slate-500">Main tasks and extra practice are tracked separately.</p></div><Link href="/ib/daily-tasks" className="hidden items-center gap-1 text-sm font-semibold text-blue-700 sm:flex">View daily tasks <ArrowRight size={15}/></Link></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SUBJECTS.map((subject) => {
          const stats = getSubjectStats(state.days, subject);
          const currentTasks = state.days[String(currentDay)];
          const tasks = currentTasks?.main[subject] ?? [];
          const extra = currentTasks?.extra[subject] ?? [];
          return <div key={subject} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg">{subjectIcons[subject]}</span><div><div className="font-semibold">{subject}</div><div className="text-[11px] text-slate-400">30-day completion</div></div></div><span className="text-sm font-bold">{stats.percent}%</span></div>
            <ProgressBar value={stats.percent} color={subjectColors[subject]} className="mt-3"/>
            <div className="mt-3 flex justify-between text-[11px] text-slate-500"><span>Main {stats.mainDone}/{stats.mainTotal}</span><span>Extra {stats.extraDone}/{stats.extraTotal}</span></div>
            <div className="mt-3 border-t border-slate-100 pt-2.5">
              {tasks.slice(0,1).map((task)=><label key={task.id} className="flex cursor-pointer items-center gap-2 text-xs text-slate-600"><input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" type="checkbox" checked={task.completed} onChange={(e)=>toggleTask(subject,task.id,"main",e.target.checked)}/><span className={task.completed?"text-slate-400 line-through":""}>{task.title}</span></label>)}
              {extra.slice(0,1).map((task)=><label key={task.id} className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-500"><input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" type="checkbox" checked={task.completed} onChange={(e)=>toggleTask(subject,task.id,"extra",e.target.checked)}/><span>Extra · {task.title}</span></label>)}
            </div>
          </div>;
        })}
      </div>
    </section>

    <section>
      <div className="mb-3 flex items-end justify-between"><div><h3 className="text-lg font-bold">IA & Coursework</h3><p className="mt-0.5 text-sm text-slate-500">Eight separate project checklists against the 2026–27 school calendar.</p></div><Link href="/ib/ia-tracker" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Open tracker <ArrowRight size={15}/></Link></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((project)=>{
          const summary = getProjectSummary(project,state,today);
          const next = summary.overdueEvent ?? summary.nextEvent ?? summary.finalDeadline;
          return <Link href="/ib/ia-tracker" key={project.id} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-lg">{project.icon}</span><div className="font-semibold leading-tight">{project.name}</div></div><span className="mt-0.5 h-2.5 w-2.5 rounded-full" style={{backgroundColor:project.color}}/></div>
            <div className="mt-4 flex items-end justify-between"><span className="text-2xl font-bold">{summary.progress}%</span><StatusBadge status={summary.status}/></div>
            <ProgressBar value={summary.progress} color={project.color} className="mt-2.5"/>
            <div className="mt-3 min-h-[34px] text-xs leading-5 text-slate-500"><span className="font-semibold text-slate-600">Next:</span> {next?.title ?? "All milestones complete"}</div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400"><span>{summary.completed}/{summary.total} steps</span><span className="group-hover:text-slate-700">Update <ArrowRight className="ml-1 inline" size={13}/></span></div>
          </Link>;
        })}
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between"><div><h3 className="font-bold">Upcoming deadlines</h3><p className="mt-1 text-xs text-slate-500">Confirmed dates and planner month windows.</p></div><Link href="/ib/ia-calendar" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Calendar <ArrowRight size={13}/></Link></div>
        <div className="mt-4 divide-y divide-slate-100">
          {upcomingEvents.map((event)=>{
            const project = PROJECTS.find((item)=>item.id===event.projectId)!;
            return <Link href="/ib/ia-calendar" key={event.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex h-9 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-50 text-[9px] font-semibold leading-3 text-slate-400">{event.date ? new Intl.DateTimeFormat("en-IN",{day:"2-digit",month:"short"}).format(parseISODate(event.date)) : event.dateLabel}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-800">{event.title}</span><span className="mt-0.5 block text-xs text-slate-400">{project.icon} {project.name}</span></span><ArrowRight className="text-slate-300" size={15}/></Link>;
          })}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><BookOpenCheck size={18}/></div><div><h3 className="font-bold">Keep your rhythm</h3><p className="mt-0.5 text-xs text-slate-500">Short check-ins make progress visible.</p></div></div>
        <div className="mt-4 space-y-2"><Link href="/ib/weekly-review" className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"><span>Weekly review milestones</span><ArrowRight size={15}/></Link><Link href="/ib/daily-update" className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"><span>Log study time and focus</span><ArrowRight size={15}/></Link></div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-xs text-emerald-800"><TrendingUp size={15}/>Your daily tracker stays separate from your IA checklist.</div>
      </div>
    </section>
  </div>;
}

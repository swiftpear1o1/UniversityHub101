"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CirclePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { ProgressBar } from "@/components/study/ProgressBar";
import { setTaskCompletion, useStudyTracker } from "@/components/study/StudyProvider";
import { getCurrentDayIndex, getLocalISODate } from "@/lib/study/data";
import { getDayTaskStats } from "@/lib/study/calculations";
import { SUBJECTS, type StudyTask, type SubjectId } from "@/lib/study/types";

const colors: Record<SubjectId, string> = { Physics: "#2563eb", Mathematics: "#7c3aed", Chemistry: "#059669", Spanish: "#ea580c", English: "#4f46e5", Economics: "#d97706" };
const icons: Record<SubjectId, string> = { Physics: "?", Mathematics: "�", Chemistry: "??", Spanish: "????", English: "??", Economics: "??" };

function TaskRow({ task, subject, day, bucket, onEdit, onDelete }: { task: StudyTask; subject: SubjectId; day: number; bucket: "main" | "extra"; onEdit: (task: StudyTask) => void; onDelete: (task: StudyTask) => void }) {
  const { update } = useStudyTracker();
  return <div className="group flex items-center gap-2.5 py-2">
    <input aria-label={`${task.completed ? "Mark incomplete" : "Mark complete"}: ${task.title}`} className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500" type="checkbox" checked={task.completed} onChange={(event) => setTaskCompletion(update, day, subject, bucket, task.id, event.target.checked)}/>
    <span className={`min-w-0 flex-1 text-sm ${task.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>{task.title}</span>
    {task.custom && <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition group-hover:opacity-100 group-focus-within:opacity-100"><button onClick={()=>onEdit(task)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${task.title}`}><Pencil size={13}/></button><button onClick={()=>onDelete(task)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${task.title}`}><Trash2 size={13}/></button></div>}
  </div>;
}

export default function DailyTasksPage() {
  const { state, ready, update } = useStudyTracker();
  const [dayNumber, setDayNumber] = useState(0);
  const [customForm, setCustomForm] = useState<SubjectId | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customBucket, setCustomBucket] = useState<"main" | "extra">("main");
  const today = getLocalISODate();
  const actualDay = state ? getCurrentDayIndex(state.startDate, today) : 1;

  useEffect(() => {
    if (!ready || !state) return;
    const requested = Number(new URLSearchParams(window.location.search).get("day"));
    setDayNumber(requested >= 1 && requested <= 30 ? requested : actualDay);
  }, [ready, state, actualDay]);

  const activeDay = dayNumber || actualDay;
  const day = state?.days[String(activeDay)];
  const stats = useMemo(() => getDayTaskStats(day), [day]);

  function saveCustomTask() {
    if (!state || !customForm || !customTitle.trim()) return;
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `custom-${Date.now()}`;
    const task: StudyTask = { id, title: customTitle.trim(), completed: false, custom: true };
    update((current) => {
      const selected = current.days[String(activeDay)];
      return { ...current, days: { ...current.days, [String(activeDay)]: { ...selected, [customBucket]: { ...selected[customBucket], [customForm]: [...selected[customBucket][customForm], task] } } } };
    });
    setCustomTitle("");
    setCustomForm(null);
  }

  function editTask(subject: SubjectId, bucket: "main" | "extra", task: StudyTask) {
    const next = window.prompt("Edit your task", task.title);
    if (!next?.trim()) return;
    update((current) => {
      const selected = current.days[String(activeDay)];
      return { ...current, days: { ...current.days, [String(activeDay)]: { ...selected, [bucket]: { ...selected[bucket], [subject]: selected[bucket][subject].map((item) => item.id === task.id ? { ...item, title: next.trim() } : item) } } } };
    });
  }

  function deleteTask(subject: SubjectId, bucket: "main" | "extra", task: StudyTask) {
    update((current) => {
      const selected = current.days[String(activeDay)];
      return { ...current, days: { ...current.days, [String(activeDay)]: { ...selected, [bucket]: { ...selected[bucket], [subject]: selected[bucket][subject].filter((item) => item.id !== task.id) } } } };
    });
  }

  function moveDay(delta: number) {
    const next = Math.max(1, Math.min(30, activeDay + delta));
    setDayNumber(next);
    window.history.replaceState(null, "", `/ib/daily-tasks?day=${next}`);
    setCustomForm(null);
  }

  if (!ready || !state || !day) return null;

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">30-day study tracker</div><h2 className="mt-1 text-3xl font-bold tracking-tight">Day {activeDay} <span className="text-slate-300">/ 30</span></h2><p className="mt-1.5 text-sm text-slate-500">Work through each subject, then mark extra practice separately.</p></div>
      <div className="flex items-center gap-2"><button onClick={()=>moveDay(-1)} disabled={activeDay===1} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40" aria-label="Previous day"><ArrowLeft size={17}/></button><select aria-label="Select study day" value={activeDay} onChange={(event)=>moveDay(Number(event.target.value)-activeDay)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"><option value={activeDay}>Day {activeDay}</option>{Array.from({length:30},(_,i)=>i+1).filter((number)=>number!==activeDay).map((number)=><option key={number} value={number}>Day {number}</option>)}</select><button onClick={()=>moveDay(1)} disabled={activeDay===30} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40" aria-label="Next day"><ArrowRight size={17}/></button></div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Day {activeDay} progress</div><div className="mt-1 text-lg font-bold">{stats.completed} <span className="text-sm font-medium text-slate-400">of {stats.total} tasks complete</span></div></div><div className="text-2xl font-bold text-slate-800">{stats.percent}%</div></div>
      <ProgressBar value={stats.percent} className="mt-3"/>
      <div className="mt-3 flex gap-5 text-xs text-slate-500"><span>Main tasks {stats.mainCompleted}/{stats.mainTotal}</span><span>Extra practice {stats.extraCompleted}/{stats.extraTotal}</span></div>
    </section>

    <div className="grid gap-4 lg:grid-cols-2">
      {SUBJECTS.map((subject)=>{
        const main = day.main[subject];
        const extra = day.extra[subject];
        const completed = [...main,...extra].filter((task)=>task.completed).length;
        return <article key={subject} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg">{icons[subject]}</span><div><h3 className="font-bold">{subject}</h3><p className="text-xs text-slate-400">{completed}/{main.length+extra.length} tasks complete</p></div></div><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor:colors[subject]}}/></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50/70 px-3.5 py-2.5"><div className="flex items-center justify-between"><h4 className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Main tasks</h4><button onClick={()=>{setCustomForm(subject);setCustomBucket("main");}} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50"><Plus size={13}/> Add</button></div>
              {main.length ? main.map((task)=><TaskRow key={task.id} task={task} subject={subject} day={activeDay} bucket="main" onEdit={(item)=>editTask(subject,"main",item)} onDelete={(item)=>deleteTask(subject,"main",item)}/>) : <p className="py-2 text-xs text-slate-400">No main tasks for this day.</p>}
            </div>
            <div className="rounded-xl bg-blue-50/50 px-3.5 py-2.5"><div className="flex items-center justify-between"><h4 className="text-xs font-bold uppercase tracking-[0.1em] text-blue-700">Extra practice</h4><button onClick={()=>{setCustomForm(subject);setCustomBucket("extra");}} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"><Plus size={13}/> Add</button></div>
              {extra.length ? extra.map((task)=><TaskRow key={task.id} task={task} subject={subject} day={activeDay} bucket="extra" onEdit={(item)=>editTask(subject,"extra",item)} onDelete={(item)=>deleteTask(subject,"extra",item)}/>) : <p className="py-2 text-xs text-slate-400">No extra practice added.</p>}
            </div>
          </div>
          {customForm === subject && <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5">
            <div className="flex flex-wrap items-end gap-2.5"><label className="min-w-0 flex-1 text-xs font-semibold text-slate-600">New {customBucket === "main" ? "main task" : "extra practice"}<input autoFocus value={customTitle} onChange={(event)=>setCustomTitle(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter")saveCustomTask();if(event.key==="Escape")setCustomForm(null);}} placeholder="e.g. Review the error log" className="mt-1.5 block h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/></label><button onClick={saveCustomTask} disabled={!customTitle.trim()} className="h-10 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white disabled:opacity-50"><Check className="mr-1 inline" size={14}/>Save</button><button onClick={()=>{setCustomForm(null);setCustomTitle("");}} className="h-10 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-white">Cancel</button></div>
          </div>}
        </article>;
      })}
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div><div className="font-semibold">Custom tasks stay attached to this day.</div><div className="mt-1 text-xs text-slate-500">Add, edit, remove, and complete tasks without changing the preloaded study plan.</div></div><div className="flex items-center gap-2 text-xs text-slate-400"><CirclePlus size={15}/> Saved automatically</div></div>
  </div>;
}


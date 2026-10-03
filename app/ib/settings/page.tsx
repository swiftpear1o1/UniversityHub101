"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarDays, Download, Moon, Sun, Upload, RotateCcw, CheckCircle2 } from "lucide-react";
import { useStudyTracker } from "@/components/study/StudyProvider";
import type { TrackerState } from "@/lib/study/types";

export default function StudySettingsPage(){
  const {state,update,reset}=useStudyTracker();
  const [message,setMessage]=useState("");
  const [messageType,setMessageType]=useState<"success"|"error">("success");
  const fileRef=useRef<HTMLInputElement>(null);
  if(!state)return null;

  function setStartDate(value:string){update((current)=>({...current,startDate:value}));}
  function toggleTheme(){update((current)=>({...current,theme:current.theme==="dark"?"light":"dark"}));}
  function exportData(){
    const payload={app:"ib-command-center",version:1,exportedAt:new Date().toISOString(),data:state};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="ib-command-center-backup.json";anchor.click();URL.revokeObjectURL(url);
    setMessage("Your tracker backup was downloaded.");setMessageType("success");
  }
  function importData(file?:File){
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(String(reader.result));
        const candidate=(parsed?.data??parsed) as Partial<TrackerState>;
        const valid=candidate?.version===1&&typeof candidate.startDate==="string"&&Boolean(candidate.days)&&Boolean(candidate.checklist)&&Array.isArray(candidate.events);
        if(!valid)throw new Error("Invalid backup");
        update(candidate as TrackerState);setMessage("Tracker data imported successfully.");setMessageType("success");
      }catch{setMessage("That file is not a valid IB Command Center backup.");setMessageType("error");}
      if(fileRef.current)fileRef.current.value="";
    };
    reader.onerror=()=>{setMessage("The selected file could not be read.");setMessageType("error");};
    reader.readAsText(file);
  }
  function resetData(){
    if(!window.confirm("Reset all IB tracker data in this browser? This clears study checkboxes, IA progress, logs, theme, and calendar date edits."))return;
    reset();setMessage("Tracker data reset. Your 30-day plan has been restored.");setMessageType("success");
  }

  return <div className="space-y-6">
    <section><div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Personal preferences</div><h2 className="mt-1 text-3xl font-bold tracking-tight">Settings</h2><p className="mt-1.5 text-sm text-slate-500">Choose your tracker start date, theme, and data backup options.</p></section>
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays size={18}/></div><div><h3 className="font-bold">Tracker start date</h3><p className="mt-1 text-sm leading-5 text-slate-500">Day 1 is calculated from this date. You can still move between all 30 days manually.</p></div></div><label className="mt-5 block text-xs font-semibold text-slate-600">Start date<input type="date" value={state.startDate} onChange={(event)=>setStartDate(event.target.value)} className="mt-1.5 block h-11 w-full max-w-sm rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"/></label><p className="mt-3 text-xs text-slate-400">Changing the date recalculates the current day and streak. Your saved task history remains in place.</p></article>
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">{state.theme==="dark"?<Moon size={18}/>:<Sun size={18}/>}</div><div><h3 className="font-bold">Appearance</h3><p className="mt-1 text-sm leading-5 text-slate-500">Switch the tracker between a light and dark interface.</p></div></div><button onClick={toggleTheme} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">{state.theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}Use {state.theme==="dark"?"light":"dark"} mode</button><div className="mt-3 text-xs text-slate-400">Current theme: {state.theme}</div></article>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div><h3 className="font-bold">Your tracker data</h3><p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">Study tasks, IA checklists, deadlines, weekly reviews, hours, ratings, notes, and theme settings save in this browser. Export a JSON copy before switching devices or clearing browser storage.</p></div><div className="mt-5 flex flex-wrap gap-2.5"><button onClick={exportData} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Download size={16}/>Export data as JSON</button><button onClick={()=>fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Upload size={16}/>Import JSON</button><input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(event)=>importData(event.target.files?.[0])}/></div><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400"><span>{Object.keys(state.days).length} study days</span><span>{state.events.length} planner milestones</span><Link href="/ib/ia-calendar" className="font-semibold text-blue-700 hover:underline">Review calendar dates</Link></div></section>

    {message&&<div role="status" className={`flex items-center gap-2 rounded-xl border p-3.5 text-sm ${messageType==="success"?"border-emerald-100 bg-emerald-50 text-emerald-800":"border-rose-100 bg-rose-50 text-rose-800"}`}>{messageType==="success"?<CheckCircle2 size={16}/>:<AlertTriangle size={16}/>} {message}</div>}

    <section className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700"><AlertTriangle size={18}/></div><div className="flex-1"><h3 className="font-bold text-slate-900">Reset all tracker data</h3><p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">Clear saved study completion, custom tasks, IA progress, calendar date edits, weekly reviews, and daily updates. The confirmation dialog gives you a chance to cancel.</p><button onClick={resetData} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50"><RotateCcw size={15}/>Reset tracker data</button></div></div></section>
  </div>;
}

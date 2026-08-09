"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

const APP_KEY="universityhub-applications";
type Application={universityId:string;status:string};
function deadlineValue(value:string) { if (!value) return Number.POSITIVE_INFINITY; const parsed = Date.parse(value); return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed; }
function daysUntil(value:string){ const t=deadlineValue(value); if(!Number.isFinite(t)) return null; return Math.ceil((t-Date.now())/86400000); }
function urgency(value:string){ const d=daysUntil(value); if(d===null) return "pending"; if(d<0) return "past"; if(d<=14) return "urgent"; if(d<=30) return "soon"; return "normal"; }
function loadApplications():Application[]{if(typeof window==="undefined")return [];try{const parsed=JSON.parse(localStorage.getItem(APP_KEY)||"[]");return Array.isArray(parsed)?parsed:[];}catch{return []}}

export default function DeadlinesPage(){
 const [filter,setFilter]=useState("All");
 const [applications,setApplications]=useState<Application[]>([]);
 useEffect(()=>{setApplications(loadApplications());},[]);
 const statusByUniversity=useMemo(()=>new Map(applications.map(a=>[a.universityId,a.status])),[applications]);
 const rows=useMemo(()=>[...universities].sort((a,b)=>deadlineValue(a.deadline)-deadlineValue(b.deadline)),[]);
 const tracked=rows.filter(u=>u.deadline), pending=rows.filter(u=>!u.deadline), urgent=tracked.filter(u=>{const d=daysUntil(u.deadline);return d!==null&&d>=0&&d<=14});
 const visible=rows.filter(u=>filter==="All" || urgency(u.deadline)===filter);
 return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen"><header className="border-b bg-white px-8 py-6"><p className="text-sm font-medium text-blue-600">Admissions 2027</p><h1 className="mt-1 text-2xl font-semibold">Deadlines</h1><p className="mt-1 text-sm text-slate-500">All tracked application dates in one place, with live urgency indicators.</p></header><div className="space-y-5 p-8">
 <div className="grid gap-4 md:grid-cols-4"><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Tracked</p><p className="mt-2 text-3xl font-semibold">{tracked.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Within 14 days</p><p className="mt-2 text-3xl font-semibold text-red-600">{urgent.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Date pending</p><p className="mt-2 text-3xl font-semibold">{pending.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Applications tracked</p><p className="mt-2 text-3xl font-semibold">{applications.length}</p></div></div>
 <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-sm font-medium text-slate-600">Show:</span>{[["All","All"],["Urgent","urgent"],["Soon","soon"],["Normal","normal"],["Past","past"],["Pending","pending"]].map(([label,value])=><button key={value} onClick={()=>setFilter(value)} className={`rounded-lg border px-3 py-2 text-xs font-medium ${filter===value?"border-blue-200 bg-blue-50 text-blue-700":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{label}</button>)}</div></section>
 <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">University</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Time remaining</th><th className="px-4 py-3">Classification</th><th className="px-4 py-3">Application status</th></tr></thead><tbody className="divide-y divide-slate-100">{visible.map(u=>{const d=daysUntil(u.deadline);const state=urgency(u.deadline);const applicationStatus=statusByUniversity.get(u.id);return <tr key={u.id} className={state==="urgent"?"bg-red-50/40":state==="past"?"bg-slate-50":""}><td className="px-5 py-4"><Link className="font-semibold text-blue-700 hover:underline" href={`/universities/${u.id}`}>{u.name}</Link></td><td className="px-4 py-4">{u.country}</td><td className="px-4 py-4">{u.deadline||"Pending verification"}</td><td className="px-4 py-4">{d===null?<span className="text-slate-400">Pending</span>:d<0?<span className="font-medium text-slate-500">Passed {Math.abs(d)}d ago</span>:<span className={`font-medium ${d<=14?"text-red-600":d<=30?"text-amber-600":"text-emerald-600"}`}>{d===0?"Today":`${d} days`}</span>}</td><td className="px-4 py-4">{u.classification}</td><td className="px-4 py-4">{applicationStatus||<span className="text-slate-400">Not tracked</span>}</td></tr>})}</tbody></table></section>
 </div></main></div>;
}
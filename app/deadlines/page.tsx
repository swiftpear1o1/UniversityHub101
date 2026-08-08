"use client";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

function deadlineValue(value: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

export default function DeadlinesPage(){
  const rows=[...universities].sort((a,b)=>deadlineValue(a.deadline)-deadlineValue(b.deadline));
  const tracked=rows.filter(u=>u.deadline);
  const pending=rows.filter(u=>!u.deadline);
  return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen"><header className="border-b bg-white px-8 py-6"><p className="text-sm font-medium text-blue-600">Admissions 2027</p><h1 className="mt-1 text-2xl font-semibold">Deadlines</h1><p className="mt-1 text-sm text-slate-500">All tracked application dates in one place.</p></header><div className="space-y-5 p-8">
    <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Tracked</p><p className="mt-2 text-3xl font-semibold">{tracked.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Date pending</p><p className="mt-2 text-3xl font-semibold">{pending.length}</p></div><div className="rounded-2xl border bg-white p-5"><p className="text-xs uppercase tracking-wide text-slate-400">Total universities</p><p className="mt-2 text-3xl font-semibold">{rows.length}</p></div></div>
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">University</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Classification</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(u=><tr key={u.id}><td className="px-5 py-4"><Link className="font-semibold text-blue-700 hover:underline" href={`/universities/${u.id}`}>{u.name}</Link></td><td className="px-4 py-4">{u.country}</td><td className="px-4 py-4">{u.deadline||"Pending verification"}</td><td className="px-4 py-4">{u.classification}</td><td className="px-4 py-4">{u.status}</td></tr>)}</tbody></table></section>
  </div></main></div>
}

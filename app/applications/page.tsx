"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileText, Plus, Search, Send, XCircle } from "lucide-react";

const seed = [
  { university: "Imperial College London", country: "United Kingdom", degree: "Mechanical Engineering", deadline: "15 Oct 2026", status: "Preparing", offer: "—", scholarship: "Not started", visa: "Not started" },
  { university: "University College London", country: "United Kingdom", degree: "Mechanical Engineering", deadline: "29 Jan 2027", status: "Shortlisted", offer: "—", scholarship: "Not started", visa: "Not started" },
  { university: "University of Toronto", country: "Canada", degree: "Mechanical Engineering", deadline: "15 Jan 2027", status: "Shortlisted", offer: "—", scholarship: "Not started", visa: "Not started" },
  { university: "Nanyang Technological University", country: "Singapore", degree: "Mechanical Engineering", deadline: "15 Jan 2027", status: "Shortlisted", offer: "—", scholarship: "Not started", visa: "Not started" },
];

const statusStyles: Record<string, string> = { Shortlisted: "bg-slate-100 text-slate-700", Preparing: "bg-amber-50 text-amber-700", Submitted: "bg-blue-50 text-blue-700", Offer: "bg-emerald-50 text-emerald-700", Rejected: "bg-red-50 text-red-700" };

export default function ApplicationsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [apps, setApps] = useState(seed);
  const filtered = useMemo(() => apps.filter(a => (status === "All" || a.status === status) && `${a.university} ${a.country} ${a.degree}`.toLowerCase().includes(query.toLowerCase())), [apps, query, status]);
  const updateStatus = (university: string, next: string) => setApps(current => current.map(a => a.university === university ? { ...a, status: next } : a));

  return <div className="min-h-screen bg-slate-50"><main className="ml-64 min-h-screen"><header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8"><div><p className="text-sm text-slate-500">Admissions 2027</p><h1 className="text-xl font-semibold">Application Tracker</h1></div><button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"><Plus size={17}/> Add application</button></header><div className="space-y-6 p-8">
    <section><h2 className="text-3xl font-semibold tracking-tight">Your applications</h2><p className="mt-2 text-slate-500">Track preparation, submissions, offers, scholarships and visa progress in one place.</p></section>
    <section className="grid gap-4 md:grid-cols-4">{[["Shortlisted",apps.filter(a=>a.status==="Shortlisted").length,FileText],["Preparing",apps.filter(a=>a.status==="Preparing").length,Clock3],["Submitted",apps.filter(a=>a.status==="Submitted").length,Send],["Offers",apps.filter(a=>a.status==="Offer").length,CheckCircle2]].map(([label,value,Icon])=><div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between text-sm text-slate-500"><span>{label as string}</span><Icon size={18} className="text-blue-600"/></div><div className="mt-3 text-3xl font-semibold">{value as number}</div></div>)}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="relative max-w-md flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search applications..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400"/></div><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"><option>All</option><option>Shortlisted</option><option>Preparing</option><option>Submitted</option><option>Offer</option><option>Rejected</option></select></div>
      <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400"><th className="px-3 py-3">University</th><th>Country</th><th>Degree</th><th>Deadline</th><th>Status</th><th>Offer</th><th>Scholarship</th><th>Visa</th></tr></thead><tbody>{filtered.map(a=><tr key={a.university} className="border-b border-slate-100 last:border-0"><td className="px-3 py-4 font-medium text-slate-900">{a.university}</td><td className="py-4 text-slate-500">{a.country}</td><td className="py-4 text-slate-500">{a.degree}</td><td className="py-4 text-slate-500">{a.deadline}</td><td className="py-4"><select value={a.status} onChange={e=>updateStatus(a.university,e.target.value)} className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium ${statusStyles[a.status]}`}><option>Shortlisted</option><option>Preparing</option><option>Submitted</option><option>Offer</option><option>Rejected</option></select></td><td className="py-4 text-slate-500">{a.offer}</td><td className="py-4 text-slate-500">{a.scholarship}</td><td className="py-4 text-slate-500">{a.visa}</td></tr>)}</tbody></table>{filtered.length===0&&<div className="flex flex-col items-center py-16 text-center"><XCircle size={28} className="text-slate-300"/><p className="mt-3 font-medium text-slate-500">No applications found</p></div>}</div></section>
  </div></main></div>;
}

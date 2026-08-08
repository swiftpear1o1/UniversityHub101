"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

const KEY="universityhub-scholarship-tracking";
const statuses=["Not started","Researching","Eligible","Applied","Awarded","Not eligible"];
function load(){if(typeof window==="undefined")return {};try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
export default function ScholarshipsPage(){
 const [tracking,setTracking]=useState<Record<string,string>>(load);
 const [country,setCountry]=useState("All countries");
 const [search,setSearch]=useState("");
 const countries=["All countries",...Array.from(new Set(universities.map(u=>u.country))).sort()];
 const rows=useMemo(()=>universities.filter(u=>u.scholarship&&!/pending/i.test(u.scholarship)&&(!search||`${u.name} ${u.country} ${u.scholarship}`.toLowerCase().includes(search.toLowerCase()))&&(country==="All countries"||u.country===country)),[search,country]);
 const update=(id:string,value:string)=>{const next={...tracking,[id]:value};setTracking(next);localStorage.setItem(KEY,JSON.stringify(next));};
 const counts=statuses.map(s=>[s,rows.filter(u=>(tracking[u.id]||"Not started")===s).length]);
 return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen"><header className="border-b bg-white px-8 py-6"><p className="text-sm font-medium text-blue-600">Funding</p><h1 className="mt-1 text-2xl font-semibold">Scholarships</h1><p className="mt-1 text-sm text-slate-500">Research, track and update scholarship opportunities for your shortlist.</p></header><div className="space-y-5 p-8"><div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">{[["Opportunities",rows.length],[...counts[1]],[...counts[2]],[...counts[3]],[...counts[4]],[...counts[5]]].map(([label,value])=><div key={String(label)} className="rounded-2xl border bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}</div><section className="rounded-2xl border bg-white p-4"><div className="grid gap-3 md:grid-cols-[1fr_180px]"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scholarship, university or country..." className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"/><select value={country} onChange={e=>setCountry(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">{countries.map(c=><option key={c}>{c}</option>)}</select></div></section><section className="grid gap-5 md:grid-cols-2">{rows.map(u=><article key={u.id} className="rounded-2xl border bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><Link href={`/universities/${u.id}`} className="font-semibold text-blue-700 hover:underline">{u.name}</Link><p className="mt-1 text-xs text-slate-500">{u.country} · {u.major}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Scholarship</span></div><p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-600">{u.scholarship}</p><div className="mt-5 flex items-center justify-between gap-3 border-t pt-4"><label className="text-xs font-medium text-slate-500">My status</label><select value={tracking[u.id]||"Not started"} onChange={e=>update(u.id,e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs">{statuses.map(s=><option key={s}>{s}</option>)}</select></div></article>)}{!rows.length&&<div className="col-span-full rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">No scholarship records match your filters.</div>}</section></div></main></div>
}

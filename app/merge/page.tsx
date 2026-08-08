"use client";
import { useMemo, useState } from "react";
import { Database, GitMerge, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { mergeImportedBatches, readImportedBatches, universityName } from "@/lib/merge";

export default function MergePage() {
  const [batches, setBatches] = useState(readImportedBatches);
  const merged = useMemo(() => mergeImportedBatches(batches), [batches]);
  const refresh = () => setBatches(readImportedBatches());
  const clear = () => { localStorage.removeItem("universityhub-imported-records"); setBatches([]); };

  return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen">
    <header className="border-b border-slate-200 bg-white px-8 py-6"><p className="text-sm font-medium text-blue-600">Data management</p><h1 className="mt-1 text-2xl font-semibold">Merge & deduplicate</h1><p className="mt-1 text-sm text-slate-500">Matching universities are combined without deleting conflicting source values.</p></header>
    <div className="space-y-6 p-8">
      <div className="grid gap-4 md:grid-cols-3"><Stat label="Imported batches" value={batches.length}/><Stat label="Raw records" value={batches.reduce((n,b)=>n+b.records.length,0)}/><Stat label="Unique universities" value={merged.length}/></div>
      <div className="flex gap-3"><button onClick={refresh} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"><RefreshCw size={16}/> Refresh imports</button><button onClick={clear} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Clear imported cache</button></div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 p-5"><GitMerge size={20} className="text-blue-600"/><div><h2 className="font-semibold">Merged university records</h2><p className="text-sm text-slate-500">Each normalized university appears once. Conflicting fields retain both source values.</p></div></div><div className="divide-y divide-slate-100">{merged.length ? merged.map((item,i)=><article key={i} className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-semibold text-slate-900">{item.university}</h3><p className="mt-1 text-xs text-slate-500">Sources: {item.sources.join(" · ")}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Merged safely</span></div><div className="mt-4 grid gap-3 md:grid-cols-3">{Object.entries(item.fields).slice(0,12).map(([key,val])=><div key={key} className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{key}</p><p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{String(val)}</p></div>)}</div>{item.rawSources.length>1&&<details className="mt-4"><summary className="cursor-pointer text-sm font-medium text-blue-600">View preserved raw source versions ({item.rawSources.length})</summary><div className="mt-3 space-y-3">{item.rawSources.map((raw,j)=><pre key={j} className="max-h-72 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-200">{raw}</pre>)}</div></details>}</article>) : <div className="p-12 text-center"><Database className="mx-auto text-slate-300"/><p className="mt-3 font-medium text-slate-700">No imported data yet</p><p className="mt-1 text-sm text-slate-400">Use Import & Merge first, then return here.</p></div>}</div></section>
    </div></main></div>;
}
function Stat({label,value}:{label:string;value:number}){return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div>}

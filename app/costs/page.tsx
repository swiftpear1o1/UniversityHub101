"use client";
import { useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

export default function CostsPage(){
 const rows=useMemo(()=>universities.map(u=>({name:u.name,country:u.country,tuition:u.tuition||"Not provided",living:u.livingCost||"Not provided",total:u.totalCost||"Not provided"})),[]);
 return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen"><header className="border-b border-slate-200 bg-white px-8 py-6"><p className="text-sm font-medium text-blue-600">Financial planning</p><h1 className="mt-1 text-2xl font-semibold">Cost Comparison</h1><p className="mt-1 text-sm text-slate-500">Compare the cost fields currently recorded in the university database without inventing missing figures.</p></header><div className="p-8"><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">University</th><th className="px-3 py-3">Country</th><th className="px-3 py-3">Tuition</th><th className="px-3 py-3">Living cost</th><th className="px-3 py-3">Total cost</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(r=><tr key={r.name}><td className="px-5 py-4 font-semibold">{r.name}</td><td className="px-3 py-4">{r.country}</td><td className="px-3 py-4">{r.tuition}</td><td className="px-3 py-4">{r.living}</td><td className="px-3 py-4">{r.total}</td></tr>)}</tbody></table></div></div></main></div>
}

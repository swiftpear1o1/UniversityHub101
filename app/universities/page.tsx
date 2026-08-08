"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Star, ArrowUpRight } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { universities, University } from "@/lib/universities";

const classificationStyles = {
  Reach: "bg-red-50 text-red-700 border-red-100",
  Target: "bg-amber-50 text-amber-700 border-amber-100",
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function UniversitiesPage() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All countries");
  const [classification, setClassification] = useState("All types");
  const [major, setMajor] = useState("All majors");
  const [favourites, setFavourites] = useState<string[]>([]);

  const countries = ["All countries", ...Array.from(new Set(universities.map((u) => u.country)))];
  const majors = ["All majors", ...Array.from(new Set(universities.map((u) => u.major)))];

  const filtered = useMemo(() => universities.filter((u) => {
    const q = query.toLowerCase();
    return (!q || `${u.name} ${u.country} ${u.major}`.toLowerCase().includes(q))
      && (country === "All countries" || u.country === country)
      && (classification === "All types" || u.classification === classification)
      && (major === "All majors" || u.major === major);
  }), [query, country, classification, major]);

  const toggleFavourite = (id: string) => setFavourites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <header className="border-b border-slate-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-blue-600">Admissions 2027</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">Universities</h1><p className="mt-1 text-sm text-slate-500">Search, filter and manage your university shortlist.</p></div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">{filtered.length} universities</div>
          </div>
        </header>
        <div className="space-y-5 p-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_160px_180px]">
              <label className="relative block"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search universities, countries or majors..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"/></label>
              <Select value={country} onChange={setCountry} options={countries}/>
              <Select value={classification} onChange={setClassification} options={["All types","Reach","Target","Safe"]}/>
              <Select value={major} onChange={setMajor} options={majors}/>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><SlidersHorizontal size={14}/> Filters update instantly. Full report fields will populate after the data import phase.</div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr><th className="px-5 py-3">University</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Major</th><th className="px-4 py-3">IB</th><th className="px-4 py-3">QS</th><th className="px-4 py-3">Tuition</th><th className="px-4 py-3">Classification</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"/></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u: University) => <tr key={u.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><button onClick={() => toggleFavourite(u.id)} aria-label="Favourite" className={favourites.includes(u.id) ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}><Star size={17} fill={favourites.includes(u.id) ? "currentColor" : "none"}/></button><div><div className="font-semibold text-slate-900">{u.name}</div><div className="text-xs text-slate-400">{u.degree}</div></div></div></td>
                    <td className="px-4 py-4 text-slate-600">{u.country}</td><td className="px-4 py-4 text-slate-600">{u.major}</td><td className="px-4 py-4 font-semibold">{u.ib}</td><td className="px-4 py-4 text-slate-600">#{u.qs}</td><td className="px-4 py-4 text-slate-600">{u.tuition}</td>
                    <td className="px-4 py-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${classificationStyles[u.classification]}`}>{u.classification}</span></td>
                    <td className="px-4 py-4"><span className="text-xs font-medium text-slate-600">{u.status}</span></td>
                    <td className="px-4 py-4"><Link href={`/universities/${u.id}`} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">View <ArrowUpRight size={13}/></Link></td>
                  </tr>)}
                  {!filtered.length && <tr><td colSpan={9} className="px-6 py-16 text-center text-sm text-slate-500">No universities match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

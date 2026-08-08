"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

const fields = [
  ["Country", "country"],
  ["Degree / major", "major"],
  ["IB requirement", "ib"],
  ["HL requirements", "hl"],
  ["English", "english"],
  ["Entrance test / profile", "entranceTest"],
  ["Acceptance", "acceptance"],
  ["Tuition", "tuition"],
  ["Living cost", "living"],
  ["Total cost", "totalCost"],
  ["Scholarship", "scholarship"],
  ["Employability", "employability"],
  ["Starting salary", "startingSalary"],
  ["Work rights", "workRights"],
  ["Recommendation", "recommendation"],
] as const;

type UniversityKey = (typeof fields)[number][1] | "name";

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(universities.slice(0, 2).map((u) => u.id));
  const [query, setQuery] = useState("");

  const choices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities
      .filter((u) => !q || `${u.name} ${u.country} ${u.major}`.toLowerCase().includes(q))
      .filter((u) => !selected.includes(u.id))
      .slice(0, 12);
  }, [query, selected]);

  const compared = selected.map((id) => universities.find((u) => u.id === id)).filter(Boolean) as typeof universities;

  function add(id: string) {
    if (selected.length < 4 && !selected.includes(id)) setSelected((current) => [...current, id]);
    setQuery("");
  }

  function remove(id: string) {
    setSelected((current) => current.filter((item) => item !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <header className="border-b border-slate-200 bg-white px-8 py-6">
          <p className="text-sm font-medium text-blue-600">Decision workspace</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Compare Universities</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">Put up to four universities side by side using the same fields from the university database.</p>
        </header>

        <div className="space-y-6 p-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Add universities</h2>
                <p className="text-sm text-slate-500">{selected.length}/4 selected</p>
              </div>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search universities..." className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 md:w-80" />
            </div>
            {query && choices.length > 0 && (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {choices.map((u) => (
                  <button key={u.id} onClick={() => add(u.id)} disabled={selected.length >= 4} className="rounded-xl border border-slate-200 p-3 text-left hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="font-medium text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.country} · {u.major}</div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {compared.length > 0 ? (
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="sticky left-0 z-10 w-44 bg-slate-50 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Metric</th>
                      {compared.map((u) => (
                        <th key={u.id} className="min-w-[240px] px-4 py-4 text-left align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/universities/${u.id}`} className="font-semibold text-slate-900 hover:text-blue-600">{u.name}</Link>
                              <div className="mt-1 text-xs text-slate-500">{u.classification}</div>
                            </div>
                            <button onClick={() => remove(u.id)} className="text-xs text-slate-400 hover:text-red-600" aria-label={`Remove ${u.name}`}>Remove</button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(([label, key]) => (
                      <tr key={key} className="border-b border-slate-100 last:border-0">
                        <th className="sticky left-0 z-10 bg-white px-4 py-4 text-left align-top font-medium text-slate-600">{label}</th>
                        {compared.map((u) => (
                          <td key={`${u.id}-${key}`} className="px-4 py-4 align-top leading-6 text-slate-700">{String(u[key as UniversityKey] || "Not provided")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="font-semibold text-slate-900">No universities selected</h2>
              <p className="mt-1 text-sm text-slate-500">Search above to start a comparison.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

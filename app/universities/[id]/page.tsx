import Link from "next/link";
import { ArrowLeft, CalendarDays, ExternalLink, GraduationCap, Heart, MapPin, Wallet } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { universities } from "@/lib/universities";

export default async function UniversityProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = universities.find((u) => u.id === id);
  if (!university) return <div className="p-10">University not found.</div>;

  return <div className="min-h-screen bg-slate-50"><Sidebar/><main className="ml-64 min-h-screen">
    <header className="border-b border-slate-200 bg-white px-8 py-6"><Link href="/universities" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft size={16}/> Back to universities</Link></header>
    <div className="space-y-6 p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><div className="flex flex-col justify-between gap-5 md:flex-row"><div><div className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{university.country}</div><h1 className="mt-2 text-3xl font-semibold tracking-tight">{university.name}</h1><p className="mt-2 text-slate-500">{university.degree} · {university.major}</p></div><div className="flex items-start gap-2"><span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">{university.classification}</span><button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><Heart size={18}/></button></div></div></section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[
        ["IB requirement", university.ib, GraduationCap], ["HL requirement", university.hl, GraduationCap], ["QS ranking", `#${university.qs}`, GraduationCap], ["Application deadline", university.deadline, CalendarDays]
      ].map(([label,value,Icon]) => <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon size={18} className="text-blue-600"/><p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">{label as string}</p><p className="mt-1 text-xl font-semibold">{value as string}</p></div>)}</section>
      <section className="grid gap-6 lg:grid-cols-2"><Info title="Admissions" icon={<GraduationCap size={18}/>} rows={[["Degree",university.degree],["Recommended major",university.major],["Exact IB requirement",university.ib],["HL subjects",university.hl],["Application status",university.status]]}/><Info title="Costs" icon={<Wallet size={18}/>} rows={[["Tuition",university.tuition],["Living cost",university.living],["Estimated total","Add full report data"]]}/></section>
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6"><h2 className="font-semibold">Full admissions record</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">This profile is designed to hold the complete admissions record: requirements, subject prerequisites, English requirements, scholarships, costs, research, internships, employability, salaries, work rights, recommendations and your own notes. Those fields will be populated from the full report during the data-import phase.</p><button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Open admissions source <ExternalLink size={15}/></button></section>
    </div></main></div>;
}

function Info({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: [string,string][] }) { return <section className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-2 font-semibold">{icon}{title}</div><div className="mt-5 divide-y divide-slate-100">{rows.map(([label,value])=><div key={label} className="flex items-start justify-between gap-6 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="text-right font-medium text-slate-900">{value}</span></div>)}</div></section>; }

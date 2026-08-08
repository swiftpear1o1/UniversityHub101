import { Sidebar } from "@/components/Sidebar";
import { ArrowUpRight, CalendarClock, CheckCircle2, Clock3, GraduationCap, MapPin, TrendingUp } from "lucide-react";

const stats = [
  ["Universities", "0", "Your database will appear here", GraduationCap],
  ["Applications", "0", "Nothing submitted yet", CheckCircle2],
  ["Offers", "0", "Offers will be tracked here", TrendingUp],
  ["Upcoming deadlines", "0", "No deadlines imported yet", CalendarClock],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div><p className="text-sm text-slate-500">Admissions 2027</p><h1 className="text-xl font-semibold">Dashboard</h1></div>
          <div className="flex items-center gap-3"><div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Planning mode</div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">K</div></div>
        </header>
        <div className="space-y-8 p-8">
          <section><p className="mb-1 text-sm font-medium text-blue-600">Welcome back</p><h2 className="text-3xl font-semibold tracking-tight">Your university command center.</h2><p className="mt-2 max-w-2xl text-slate-500">Track universities, requirements, deadlines, applications, scholarships and decisions in one place.</p></section>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map(([label,value,detail,Icon]) => <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{label as string}</span><Icon size={19} className="text-blue-600"/></div><div className="text-3xl font-semibold">{value as string}</div><div className="mt-1 text-xs text-slate-400">{detail as string}</div></div>)}
          </section>
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2"><div className="flex items-center justify-between"><div><h3 className="font-semibold">Application pipeline</h3><p className="mt-1 text-sm text-slate-500">Your application activity will appear here.</p></div><ArrowUpRight size={18} className="text-slate-400"/></div><div className="mt-8 grid grid-cols-4 gap-3">{["Shortlisted","Preparing","Submitted","Decision"].map((stage,i)=><div key={stage} className="rounded-xl bg-slate-50 p-4"><div className="text-xs font-medium text-slate-500">{stage}</div><div className="mt-3 text-2xl font-semibold">0</div><div className="mt-1 text-xs text-slate-400">{i===0?"Universities":"Applications"}</div></div>)}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-semibold">Upcoming deadlines</h3><p className="mt-1 text-sm text-slate-500">Nothing due yet.</p><div className="mt-7 flex min-h-40 flex-col items-center justify-center text-center"><Clock3 size={28} className="text-slate-300"/><p className="mt-3 text-sm font-medium text-slate-500">Import your university data</p><p className="mt-1 text-xs text-slate-400">Deadlines will be surfaced automatically.</p></div></div>
          </section>
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6"><div className="flex items-start gap-4"><MapPin className="mt-0.5 text-blue-600" size={20}/><div><h3 className="font-semibold text-slate-900">Next: build your university database</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">The UI foundation is now in place. The next build will add the university database, search and filters, followed by your Markdown report and shortlist import.</p></div></div></section>
        </div>
      </main>
    </div>
  );
}

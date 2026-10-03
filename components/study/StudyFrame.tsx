"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BookOpenCheck, CalendarDays, CheckSquare2, GraduationCap, LayoutDashboard, Moon, MoreHorizontal, Settings, Sun, Target, TimerReset } from "lucide-react";
import { useStudyTracker } from "@/components/study/StudyProvider";

const primaryLinks = [
  { title: "Dashboard", href: "/ib", icon: LayoutDashboard },
  { title: "Daily Tasks", href: "/ib/daily-tasks", icon: CheckSquare2 },
  { title: "IA Calendar", href: "/ib/ia-calendar", icon: CalendarDays },
  { title: "IA Tracker", href: "/ib/ia-tracker", icon: Target },
  { title: "Weekly Review", href: "/ib/weekly-review", icon: BookOpenCheck },
  { title: "Daily Update", href: "/ib/daily-update", icon: TimerReset },
  { title: "Settings", href: "/ib/settings", icon: Settings },
];

const mobileLinks = primaryLinks.slice(0, 4);
const utilityLinks = primaryLinks.slice(4);

function activePath(pathname: string, href: string) {
  return href === "/ib" ? pathname === "/ib" : pathname === href || pathname.startsWith(`${href}/`);
}

export function StudyFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state, ready, update } = useStudyTracker();
  const [moreOpen, setMoreOpen] = useState(false);
  const pageName = primaryLinks.find((item) => activePath(pathname, item.href))?.title ?? "Dashboard";

  if (!ready || !state) {
    return <div className="min-h-screen bg-slate-50 p-8"><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-8 w-48 rounded-lg bg-slate-200"/><div className="h-40 rounded-3xl bg-slate-200"/><div className="grid gap-4 md:grid-cols-3"><div className="h-48 rounded-3xl bg-slate-200"/><div className="h-48 rounded-3xl bg-slate-200"/><div className="h-48 rounded-3xl bg-slate-200"/></div></div></div>;
  }

  const toggleTheme = () => update((current) => ({ ...current, theme: current.theme === "dark" ? "light" : "dark" }));
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white"><GraduationCap size={21}/></div>
          <div className="min-w-0"><div className="truncate text-sm font-bold tracking-tight">IB Command Center</div><div className="mt-0.5 text-xs text-slate-500">Study · IA · Coursework</div></div>
        </div>
        <div className="px-5 pt-6"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</div></div>
        <nav aria-label="Study tracker navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {primaryLinks.map(({ title, href, icon: Icon }) => {
            const active = activePath(pathname, href);
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}><Icon size={17}/>{title}</Link>;
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <Link href="/admissions" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"><GraduationCap size={17}/>UniversityHub</Link>
          <button onClick={toggleTheme} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100" aria-label={`Switch to ${state.theme === "dark" ? "light" : "dark"} mode`}>{state.theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>} {state.theme === "dark" ? "Light mode" : "Dark mode"}</button>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white lg:hidden"><GraduationCap size={19}/></div><div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">IB Study & IA Tracker</p><h1 className="text-sm font-semibold text-slate-900 sm:text-base">{pageName}</h1></div></div>
          <div className="flex items-center gap-2"><span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">2026–27</span><button onClick={toggleTheme} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50" aria-label={`Switch to ${state.theme === "dark" ? "light" : "dark"} mode`}>{state.theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}</button></div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-7 sm:py-8 sm:pb-28 lg:pb-10">{children}</div>
      </main>

      <nav aria-label="Mobile study tracker navigation" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-[max(6px,env(safe-area-inset-bottom))] pt-1 lg:hidden">
        {mobileLinks.map(({ title, href, icon: Icon }) => {
          const active = activePath(pathname, href);
          return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${active ? "text-slate-900" : "text-slate-500"}`}><Icon size={18}/><span>{title}</span></Link>;
        })}
        <div className="relative flex items-center justify-center">
          {moreOpen && <div className="absolute bottom-16 right-1 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">{utilityLinks.map(({ title, href, icon: Icon })=><Link key={href} href={href} onClick={()=>setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><Icon size={17}/>{title}</Link>)}<Link href="/admissions" onClick={()=>setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"><GraduationCap size={17}/>UniversityHub</Link><button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">{state.theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}Theme</button></div>}
          <button aria-expanded={moreOpen} onClick={()=>setMoreOpen((open)=>!open)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${utilityLinks.some((item)=>activePath(pathname,item.href)) ? "text-slate-900" : "text-slate-500"}`}><MoreHorizontal size={18}/><span>More</span></button>
        </div>
      </nav>
    </div>
  );
}

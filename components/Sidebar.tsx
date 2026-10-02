"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpenCheck, CalendarDays, ClipboardCheck, Columns3, Database, FileText, GitMerge, GraduationCap, LayoutDashboard, SearchCheck, Settings, ShieldCheck, Star, Upload, WalletCards } from "lucide-react";

const items = [
  ["IB Command Center", "/ib", BookOpenCheck],
  ["Admissions Dashboard", "/admissions", LayoutDashboard],
  ["Universities", "/universities", GraduationCap],
  ["Compare", "/compare", Columns3],
  ["Applications", "/tracker", FileText],
  ["Deadlines", "/deadlines", CalendarDays],
  ["Documents", "/documents", ClipboardCheck],
  ["Scholarships", "/scholarships", WalletCards],
  ["Analytics", "/analytics", BarChart3],
  ["Requirements Research", "/research", SearchCheck],
  ["Data Integrity", "/data-integrity", ShieldCheck],
  ["Import data", "/import", Upload],
  ["Merge data", "/merge", GitMerge],
  ["Data Center", "/data-center", Database],
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
    <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white"><GraduationCap size={22}/></div><div><div className="font-semibold tracking-tight">UniversityHub</div><div className="text-xs text-slate-500">Admissions command center</div></div></div>
    <nav aria-label="UniversityHub navigation" className="flex-1 space-y-1 overflow-y-auto p-4">{items.map(([label,href,Icon])=>{const active=pathname===href||pathname.startsWith(`${href}/`);return <Link key={href} href={href} aria-current={active?"page":undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon size={18}/>{label}</Link>})}<Link href="/favorites" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${pathname==="/favorites"?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50"}`}><Star size={18}/>Favorites</Link></nav>
    <div className="border-t border-slate-100 p-4"><Link href="/settings" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${pathname==="/settings"?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50"}`}><Settings size={18}/>Admissions Settings</Link></div>
  </aside>;
}


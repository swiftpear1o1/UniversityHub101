import { PROJECTS, getCurrentDayIndex, getLocalISODate } from "./data";
import type { CalendarEvent, DayTasks, ProjectDefinition, ProjectId, ProjectStatus, StatusSummary, SubjectId, TrackerState } from "./types";
import { SUBJECTS } from "./types";

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function dayDifference(from: string, to: string): number {
  const a = from.split("-").map(Number);
  const b = to.split("-").map(Number);
  return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86_400_000);
}

export function monthStart(month: string): string {
  return `${month}-01`;
}

export function getAllTaskRows(day: DayTasks) {
  return SUBJECTS.flatMap((subject) => [
    ...day.main[subject].map((task) => ({ ...task, subject, bucket: "main" as const })),
    ...day.extra[subject].map((task) => ({ ...task, subject, bucket: "extra" as const })),
  ]);
}

export function getDayTaskStats(day?: DayTasks) {
  if (!day) return { completed: 0, total: 0, mainCompleted: 0, mainTotal: 0, extraCompleted: 0, extraTotal: 0, percent: 0 };
  const main = SUBJECTS.flatMap((subject) => day.main[subject]);
  const extra = SUBJECTS.flatMap((subject) => day.extra[subject]);
  const completed = [...main, ...extra].filter((task) => task.completed).length;
  const total = main.length + extra.length;
  return {
    completed,
    total,
    mainCompleted: main.filter((task) => task.completed).length,
    mainTotal: main.length,
    extraCompleted: extra.filter((task) => task.completed).length,
    extraTotal: extra.length,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getSubjectStats(days: Record<string, DayTasks>, subject: SubjectId) {
  const main = Object.values(days).flatMap((day) => day.main[subject]);
  const extra = Object.values(days).flatMap((day) => day.extra[subject]);
  const mainDone = main.filter((task) => task.completed).length;
  const extraDone = extra.filter((task) => task.completed).length;
  const total = main.length + extra.length;
  return {
    mainDone,
    mainTotal: main.length,
    extraDone,
    extraTotal: extra.length,
    done: mainDone + extraDone,
    total,
    percent: total ? Math.round(((mainDone + extraDone) / total) * 100) : 0,
  };
}

export function getOverallStudyStats(days: Record<string, DayTasks>) {
  const stats = Object.values(days).flatMap((day) => getAllTaskRows(day));
  const completed = stats.filter((task) => task.completed).length;
  return { completed, total: stats.length, percent: stats.length ? Math.round((completed / stats.length) * 100) : 0 };
}

export function getStudyStreak(days: Record<string, DayTasks>, startDate: string, today = getLocalISODate()): number {
  const latestDay = getCurrentDayIndex(startDate, today);
  const hasWork = (dayNumber: number) => getAllTaskRows(days[String(dayNumber)]).some((task) => task.completed);
  let mostRecent = 0;
  for (let day = latestDay; day >= 1; day -= 1) {
    if (hasWork(day)) { mostRecent = day; break; }
  }
  if (!mostRecent) return 0;
  let streak = 0;
  for (let day = mostRecent; day >= 1 && hasWork(day); day -= 1) streak += 1;
  return streak;
}

export function getDaysCompleted(days: Record<string, DayTasks>, startDate: string, today = getLocalISODate()): number {
  const latestDay = getCurrentDayIndex(startDate, today);
  return Array.from({ length: latestDay }, (_, index) => index + 1)
    .filter((day) => getAllTaskRows(days[String(day)]).some((task) => task.completed)).length;
}

function eventMonth(event: CalendarEvent): string | undefined {
  return event.month ?? (event.date ? event.date.slice(0, 7) : undefined);
}

export function eventSortDate(event: CalendarEvent): string {
  return event.date ?? (event.month ? monthStart(event.month) : "9999-12-31");
}

export function getProjectEvents(events: CalendarEvent[], projectId: ProjectId): CalendarEvent[] {
  return events.filter((event) => event.projectId === projectId).sort((a, b) => eventSortDate(a).localeCompare(eventSortDate(b)));
}

export function getProjectSummary(project: ProjectDefinition, state: TrackerState, today = getLocalISODate()): StatusSummary {
  const checks = state.checklist[project.id] ?? {};
  const completed = project.checklist.filter((item) => checks[item.id]).length;
  const total = project.checklist.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const events = getProjectEvents(state.events, project.id);
  const overdueEvent = events.find((event) => {
    const isPast = event.date ? event.date < today : Boolean(event.month && event.month < today.slice(0, 7));
    return isPast && event.itemId && !checks[event.itemId];
  });
  const upcoming = events.filter((event) => {
    const month = eventMonth(event);
    return event.date ? event.date >= today : Boolean(month && month >= today.slice(0, 7));
  });
  const nextEvent = upcoming[0];
  const finalDeadline = events.find((event) => event.final);
  let status: ProjectStatus = "On Track";
  if (progress === 100) status = "Complete";
  else if (overdueEvent) status = "Behind";
  else if (nextEvent) {
    const daysUntil = nextEvent.date ? dayDifference(today, nextEvent.date) : nextEvent.month ? Math.max(0, dayDifference(today, monthStart(nextEvent.month))) : 999;
    if ((daysUntil <= 14 && progress < 60) || (daysUntil <= 30 && progress < 25)) status = "At Risk";
  }
  return { status, progress, completed, total, nextEvent, overdueEvent, finalDeadline };
}

export function getAllProjectSummaries(state: TrackerState, today = getLocalISODate()) {
  return PROJECTS.map((project) => ({ project, summary: getProjectSummary(project, state, today) }));
}

export function getMostUrgentProject(state: TrackerState, today = getLocalISODate()) {
  const rank: Record<ProjectStatus, number> = { Behind: 0, "At Risk": 1, "On Track": 2, Complete: 3 };
  return getAllProjectSummaries(state, today)
    .filter(({ summary }) => summary.status !== "Complete")
    .sort((a, b) => {
      const rankDiff = rank[a.summary.status] - rank[b.summary.status];
      if (rankDiff) return rankDiff;
      const aDue = a.summary.nextEvent ? eventSortDate(a.summary.nextEvent) : eventSortDate(a.summary.finalDeadline ?? ({ date: null, month: "9999-12" } as CalendarEvent));
      const bDue = b.summary.nextEvent ? eventSortDate(b.summary.nextEvent) : eventSortDate(b.summary.finalDeadline ?? ({ date: null, month: "9999-12" } as CalendarEvent));
      return aDue.localeCompare(bDue);
    })[0];
}

export function statusClasses(status: ProjectStatus): string {
  if (status === "Complete") return "bg-emerald-50 text-emerald-700";
  if (status === "Behind") return "bg-rose-50 text-rose-700";
  if (status === "At Risk") return "bg-amber-50 text-amber-800";
  return "bg-sky-50 text-sky-700";
}

export function displayDate(date: string | null | undefined, dateLabel?: string): string {
  if (dateLabel) return dateLabel;
  if (!date) return "Date not set";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(parseISODate(date));
}

export function formatMonth(month: string): string {
  const [year, number] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(year, number - 1, 1));
}

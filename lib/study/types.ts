export const SUBJECTS = ["Physics", "Mathematics", "Chemistry", "Spanish", "English", "Economics"] as const;

export type SubjectId = (typeof SUBJECTS)[number];
export type Theme = "light" | "dark";
export type ProjectId = "physics-ia" | "math-ia" | "chemistry-ia" | "economics-ia" | "physics-ee" | "tok-essay" | "english-hle" | "language-io";
export type ProjectStatus = "On Track" | "At Risk" | "Behind" | "Complete";

export interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
  custom?: boolean;
}

export interface DayTasks {
  main: Record<SubjectId, StudyTask[]>;
  extra: Record<SubjectId, StudyTask[]>;
}

export interface DailyLog {
  hours: Record<SubjectId, number>;
  focus: number;
  notes: string;
}

export interface CalendarEvent {
  id: string;
  projectId: ProjectId;
  title: string;
  date: string | null;
  month?: string;
  dateLabel?: string;
  itemId?: string;
  final?: boolean;
  color: string;
  details: string;
}

export interface ProjectChecklistItem {
  id: string;
  label: string;
  group?: "planning" | "data" | "writing" | "submission";
}

export interface ProjectDefinition {
  id: ProjectId;
  name: string;
  icon: string;
  color: string;
  description: string;
  checklist: ProjectChecklistItem[];
}

export interface TrackerState {
  version: 1;
  startDate: string;
  theme: Theme;
  days: Record<string, DayTasks>;
  checklist: Record<ProjectId, Record<string, boolean>>;
  weeks: Record<string, Record<string, boolean>>;
  logs: Record<string, DailyLog>;
  events: CalendarEvent[];
}

export type StatusSummary = {
  status: ProjectStatus;
  progress: number;
  completed: number;
  total: number;
  nextEvent?: CalendarEvent;
  overdueEvent?: CalendarEvent;
  finalDeadline?: CalendarEvent;
};

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { createInitialState, PROJECTS, WEEKLY_REVIEWS } from "@/lib/study/data";
import { SUBJECTS, type DayTasks, type ProjectId, type SubjectId, type TrackerState } from "@/lib/study/types";

const STORAGE_KEY = "ib-command-center-v1";

interface StudyContextValue {
  state: TrackerState | null;
  ready: boolean;
  update: Dispatch<SetStateAction<TrackerState>>;
  reset: () => void;
}

const StudyContext = createContext<StudyContextValue | null>(null);

function normalizeState(raw: unknown): TrackerState {
  const defaults = createInitialState();
  if (!raw || typeof raw !== "object" || (raw as { version?: unknown }).version !== 1) return defaults;
  const input = raw as Partial<TrackerState>;
  const days = { ...defaults.days };
  if (input.days && typeof input.days === "object") {
    for (const dayNumber of Object.keys(days)) {
      const source = input.days[dayNumber] as DayTasks | undefined;
      if (!source || typeof source !== "object") continue;
      days[dayNumber] = {
        main: Object.fromEntries(SUBJECTS.map((subject) => [subject, Array.isArray(source.main?.[subject]) ? source.main[subject] : days[dayNumber].main[subject]])) as DayTasks["main"],
        extra: Object.fromEntries(SUBJECTS.map((subject) => [subject, Array.isArray(source.extra?.[subject]) ? source.extra[subject] : days[dayNumber].extra[subject]])) as DayTasks["extra"],
      };
    }
  }
  const checklist = { ...defaults.checklist } as TrackerState["checklist"];
  if (input.checklist && typeof input.checklist === "object") {
    for (const project of PROJECTS) {
      checklist[project.id] = { ...defaults.checklist[project.id], ...(input.checklist[project.id] ?? {}) };
    }
  }
  const weeks = { ...defaults.weeks };
  if (input.weeks && typeof input.weeks === "object") {
    for (const week of WEEKLY_REVIEWS) weeks[String(week.week)] = { ...defaults.weeks[String(week.week)], ...(input.weeks[String(week.week)] ?? {}) };
  }
  const logs = { ...defaults.logs };
  if (input.logs && typeof input.logs === "object") {
    for (const day of Object.keys(logs)) {
      const source = input.logs[day];
      if (!source) continue;
      logs[day] = { ...logs[day], ...source, hours: { ...logs[day].hours, ...(source.hours ?? {}) } };
    }
  }
  return {
    ...defaults,
    startDate: typeof input.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.startDate) ? input.startDate : defaults.startDate,
    theme: input.theme === "dark" ? "dark" : "light",
    days,
    checklist,
    weeks,
    logs,
    events: Array.isArray(input.events) ? input.events : defaults.events,
  };
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TrackerState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setState(saved ? normalizeState(JSON.parse(saved)) : createInitialState());
    } catch {
      setState(createInitialState());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state?.theme ?? "light";
  }, [state?.theme]);

  const update = useCallback<Dispatch<SetStateAction<TrackerState>>>((next) => {
    setState((current) => current ? (typeof next === "function" ? next(current) : next) : current);
  }, []);

  const reset = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  const value = useMemo(() => ({ state, ready, update, reset }), [state, ready, update, reset]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudyTracker() {
  const value = useContext(StudyContext);
  if (!value) throw new Error("useStudyTracker must be used inside StudyProvider");
  return value;
}

export function setTaskCompletion(
  update: Dispatch<SetStateAction<TrackerState>>,
  dayNumber: number,
  subject: SubjectId,
  bucket: "main" | "extra",
  taskId: string,
  completed: boolean,
) {
  update((current) => {
    const day = current.days[String(dayNumber)];
    if (!day) return current;
    return {
      ...current,
      days: {
        ...current.days,
        [String(dayNumber)]: {
          ...day,
          [bucket]: {
            ...day[bucket],
            [subject]: day[bucket][subject].map((task) => task.id === taskId ? { ...task, completed } : task),
          },
        },
      },
    };
  });
}

export function getChecklistValue(state: TrackerState, projectId: ProjectId, itemId: string): boolean {
  return Boolean(state.checklist[projectId]?.[itemId]);
}

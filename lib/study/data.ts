import type { CalendarEvent, DayTasks, DailyLog, ProjectDefinition, ProjectId, SubjectId, StudyTask, TrackerState } from "./types";
import { SUBJECTS } from "./types";

export const DEFAULT_START_DATE = "2026-10-03";

export const PROJECTS: ProjectDefinition[] = [
  {
    id: "physics-ia", name: "Physics IA", icon: "?", color: "#2563eb", description: "Independent investigation, from research question through final submission.",
    checklist: [
      { id: "research-question", label: "Research question finalized", group: "planning" },
      { id: "background", label: "Background research completed", group: "planning" },
      { id: "variables", label: "Variables identified", group: "planning" },
      { id: "methodology", label: "Methodology finalized", group: "planning" },
      { id: "equipment", label: "Equipment and materials ready", group: "planning" },
      { id: "pilot", label: "Pilot testing completed", group: "data" },
      { id: "data-collection", label: "DATA COLLECTION completed", group: "data" },
      { id: "data-organized", label: "Data organized", group: "data" },
      { id: "calculations", label: "Calculations completed", group: "data" },
      { id: "graphs", label: "Graphs and tables completed", group: "data" },
      { id: "analysis", label: "ANALYSIS written", group: "writing" },
      { id: "evaluation", label: "EVALUATION written", group: "writing" },
      { id: "conclusion", label: "CONCLUSION written", group: "writing" },
      { id: "full-draft", label: "Full IA draft completed", group: "writing" },
      { id: "feedback", label: "Teacher feedback incorporated", group: "submission" },
      { id: "final-submit", label: "Final IA submitted", group: "submission" },
    ],
  },
  {
    id: "math-ia", name: "Mathematics IA", icon: "�", color: "#7c3aed", description: "A focused exploration with a clear mathematical approach.",
    checklist: [
      { id: "topic", label: "Topic selected", group: "planning" },
      { id: "research-question", label: "Research question finalized", group: "planning" },
      { id: "approach", label: "Mathematical approach planned", group: "planning" },
      { id: "exploration", label: "Mathematics / exploration completed", group: "data" },
      { id: "analysis", label: "Analysis completed", group: "writing" },
      { id: "evaluation", label: "Evaluation completed", group: "writing" },
      { id: "conclusion", label: "Conclusion completed", group: "writing" },
      { id: "first-draft", label: "Full first draft completed", group: "writing" },
      { id: "feedback", label: "Teacher feedback incorporated", group: "submission" },
      { id: "final-submit", label: "Final IA submitted", group: "submission" },
    ],
  },
  {
    id: "chemistry-ia", name: "Chemistry IA", icon: "??", color: "#059669", description: "Experimental investigation with separate data and writing progress.",
    checklist: [
      { id: "research-question", label: "Research question finalized", group: "planning" },
      { id: "background", label: "Background research completed", group: "planning" },
      { id: "variables", label: "Variables identified", group: "planning" },
      { id: "methodology", label: "Methodology finalized", group: "planning" },
      { id: "equipment", label: "Equipment and materials ready", group: "planning" },
      { id: "pilot", label: "Pilot testing completed", group: "data" },
      { id: "data-collection", label: "DATA COLLECTION completed", group: "data" },
      { id: "data-organized", label: "Data organized", group: "data" },
      { id: "calculations", label: "Calculations completed", group: "data" },
      { id: "graphs", label: "Graphs and tables completed", group: "data" },
      { id: "analysis", label: "ANALYSIS written", group: "writing" },
      { id: "evaluation", label: "EVALUATION written", group: "writing" },
      { id: "conclusion", label: "CONCLUSION written", group: "writing" },
      { id: "full-draft", label: "Full IA draft completed", group: "writing" },
      { id: "feedback", label: "Teacher feedback incorporated", group: "submission" },
      { id: "final-submit", label: "Final IA submitted", group: "submission" },
    ],
  },
  {
    id: "economics-ia", name: "Economics IA", icon: "??", color: "#d97706", description: "Commentaries built around current articles, theory, analysis, and evaluation.",
    checklist: [
      { id: "article", label: "Article selected", group: "planning" },
      { id: "plan", label: "Commentary plan finalized", group: "planning" },
      { id: "concept", label: "Key concept identified", group: "planning" },
      { id: "theory", label: "Economic theory and diagrams completed", group: "data" },
      { id: "analysis", label: "Analysis completed", group: "writing" },
      { id: "evaluation", label: "Evaluation completed", group: "writing" },
      { id: "conclusion", label: "Conclusion completed", group: "writing" },
      { id: "full-draft", label: "Full draft completed", group: "writing" },
      { id: "feedback", label: "Teacher feedback incorporated", group: "submission" },
      { id: "final-submit", label: "Final commentary submitted", group: "submission" },
    ],
  },
  {
    id: "physics-ee", name: "Physics EE", icon: "??", color: "#0891b2", description: "Physics Extended Essay milestones tracked separately from the Physics IA.",
    checklist: [
      { id: "data-collection", label: "Data collection completed", group: "data" },
      { id: "word-count", label: "Approximately 1,500 words completed", group: "writing" },
      { id: "reflection-1", label: "First reflection completed", group: "planning" },
      { id: "first-draft", label: "First draft completed", group: "writing" },
      { id: "supervisor-feedback", label: "Written supervisor feedback received", group: "writing" },
      { id: "final-submit", label: "Final submission completed", group: "submission" },
      { id: "viva", label: "Viva voce completed", group: "submission" },
      { id: "reflection-3", label: "Third reflection completed", group: "submission" },
    ],
  },
  {
    id: "tok-essay", name: "TOK Essay", icon: "??", color: "#db2777", description: "Essay, teacher interactions, and TK/PPF work in one tracker.",
    checklist: [
      { id: "title", label: "Prescribed title selected", group: "planning" },
      { id: "teacher-1", label: "Initial teacher interaction completed", group: "planning" },
      { id: "outline", label: "Outline completed", group: "planning" },
      { id: "ppf-1", label: "TK/PPF work completed", group: "planning" },
      { id: "body", label: "Body paragraphs completed", group: "writing" },
      { id: "draft", label: "First / final draft completed", group: "writing" },
      { id: "teacher-2", label: "Second teacher interaction completed", group: "writing" },
      { id: "corrections", label: "Final corrections completed", group: "writing" },
      { id: "ppf-final", label: "TK/PPF completed", group: "submission" },
      { id: "final-submit", label: "Final submission completed", group: "submission" },
    ],
  },
  {
    id: "english-hle", name: "English HLE / coursework", icon: "??", color: "#4f46e5", description: "English A HLE drafts, moderation, and final coursework period.",
    checklist: [
      { id: "first-draft", label: "HLE first draft completed", group: "writing" },
      { id: "november-submit", label: "19 November submission milestone completed", group: "submission" },
      { id: "mock-moderation", label: "March mock / moderation milestone completed", group: "submission" },
      { id: "final-period", label: "April final examination / coursework period completed", group: "submission" },
    ],
  },
  {
    id: "language-io", name: "Language B IO / coursework", icon: "???", color: "#ea580c", description: "Language B coursework milestone and final Individual Oral.",
    checklist: [
      { id: "preparation", label: "IO preparation completed", group: "planning" },
      { id: "final-io", label: "Final IO completed", group: "submission" },
    ],
  },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "math-topics", projectId: "math-ia", title: "Exploration of topics, planning + viva", date: "2026-07-22", itemId: "topic", color: "#7c3aed", details: "Mathematics IA planner milestone: exploration of topics, planning, and viva." },
  { id: "physics-ee-data", projectId: "physics-ee", title: "Data collection completion", date: "2026-07-22", itemId: "data-collection", color: "#0891b2", details: "Physics Extended Essay data collection completion." },
  { id: "physics-ee-words", projectId: "physics-ee", title: "Approximately 1,500 words completed", date: "2026-07-29", itemId: "word-count", color: "#0891b2", details: "Physics Extended Essay early word-count milestone." },
  { id: "physics-ia-august", projectId: "physics-ia", title: "Physics IA planner milestone", date: "2026-08-19", itemId: "research-question", color: "#2563eb", details: "Milestone shown on the school Year 2 Components Planner." },
  { id: "english-hle-first", projectId: "english-hle", title: "HLE First Draft", date: "2026-09-30", itemId: "first-draft", color: "#4f46e5", details: "English A Higher Level Essay first draft." },
  { id: "economics-sept", projectId: "economics-ia", title: "Commentary: article selection and plan finalisation", date: "2026-09-30", itemId: "article", color: "#d97706", details: "Economics commentary article selection and plan finalisation." },
  { id: "math-plan", projectId: "math-ia", title: "Final plan submission", date: "2026-09-16", itemId: "research-question", color: "#7c3aed", details: "Mathematics IA final plan submission." },
  { id: "physics-ee-reflection", projectId: "physics-ee", title: "EE first reflection", date: "2026-09-28", dateLabel: "28-29 Sep", itemId: "reflection-1", color: "#0891b2", details: "Physics EE reflection window shown on the school planner (28-29 September)." },
  { id: "tok-october", projectId: "tok-essay", title: "First teacher interaction, TK/PPF, and outline", date: null, month: "2026-10", dateLabel: "October", color: "#db2777", details: "Complete the first teacher interaction, complete or update TK/PPF work, and work on the TOK essay outline. The planner gives the month but no exact day." },
  { id: "math-first-draft", projectId: "math-ia", title: "Mathematics IA First Draft", date: "2026-10-21", itemId: "first-draft", color: "#7c3aed", details: "Submit the Mathematics IA first draft." },
  { id: "economics-macro", projectId: "economics-ia", title: "Economics Macro Commentary", date: "2026-10-22", itemId: "full-draft", color: "#d97706", details: "Macro Commentary deadline." },
  { id: "physics-ee-first-draft", projectId: "physics-ee", title: "Physics EE First Draft", date: "2026-10-22", itemId: "first-draft", color: "#0891b2", details: "Submit the Physics Extended Essay first draft." },
  { id: "physics-ee-feedback", projectId: "physics-ee", title: "Physics EE supervisor written feedback", date: "2026-10-30", itemId: "supervisor-feedback", color: "#0891b2", details: "Written feedback from the Physics EE supervisor." },
  { id: "english-hle-nov", projectId: "english-hle", title: "HLE next submission milestone", date: "2026-11-19", itemId: "november-submit", color: "#4f46e5", details: "English A HLE next submission milestone." },
  { id: "math-final", projectId: "math-ia", title: "Mathematics IA Final Submission", date: "2026-12-03", itemId: "final-submit", final: true, color: "#7c3aed", details: "Final Mathematics IA submission." },
  { id: "physics-ia-feedback", projectId: "physics-ia", title: "Physics IA first-draft feedback milestone", date: "2026-12-03", itemId: "full-draft", color: "#2563eb", details: "Physics IA milestone based on first-draft feedback." },
  { id: "chemistry-ia-feedback", projectId: "chemistry-ia", title: "Chemistry IA first-draft feedback milestone", date: "2026-12-03", itemId: "full-draft", color: "#059669", details: "Chemistry IA milestone based on first-draft feedback." },
  { id: "economics-dec", projectId: "economics-ia", title: "Global Economics commentary: article selection and finalisation", date: "2026-12-09", itemId: "article", color: "#d97706", details: "Economics Global Economics commentary article selection and finalisation." },
  { id: "tok-december", projectId: "tok-essay", title: "Second teacher interaction, TK/PPF, and body paragraphs", date: null, month: "2026-12", dateLabel: "December", color: "#db2777", details: "Complete the second teacher interaction and TK/PPF work, then complete the body paragraphs. The planner gives the month but no exact day." },
  { id: "physics-ee-final", projectId: "physics-ee", title: "Physics EE Final Submission", date: "2027-01-06", itemId: "final-submit", final: true, color: "#0891b2", details: "Final Physics Extended Essay submission." },
  { id: "physics-ee-viva", projectId: "physics-ee", title: "Physics EE Viva voce", date: "2027-01-08", itemId: "viva", color: "#0891b2", details: "Complete the Physics EE viva voce." },
  { id: "physics-ee-third-reflection", projectId: "physics-ee", title: "Physics EE third reflection", date: "2027-01-08", itemId: "reflection-3", color: "#0891b2", details: "Complete the Physics EE third reflection." },
  { id: "tok-january", projectId: "tok-essay", title: "Final draft and teacher interaction", date: null, month: "2027-01", dateLabel: "January", color: "#db2777", details: "Complete the final TOK essay draft and teacher interaction. The planner gives the month but no exact day." },
  { id: "chemistry-ia-final", projectId: "chemistry-ia", title: "Chemistry IA Final Submission", date: "2027-01-20", itemId: "final-submit", final: true, color: "#059669", details: "Final Chemistry IA submission." },
  { id: "physics-ia-final", projectId: "physics-ia", title: "Physics IA Final Submission", date: "2027-01-21", itemId: "final-submit", final: true, color: "#2563eb", details: "Final Physics IA submission." },
  { id: "econ-final", projectId: "economics-ia", title: "Economics Final Commentary submission", date: "2027-02-12", itemId: "final-submit", final: true, color: "#d97706", details: "Submit the final Economics commentary." },
  { id: "language-final-io", projectId: "language-io", title: "Language B Final IO", date: "2027-02-12", itemId: "final-io", final: true, color: "#ea580c", details: "Final Language B Individual Oral." },
  { id: "tok-february", projectId: "tok-essay", title: "TOK Essay final submission and TK/PPF completion", date: null, month: "2027-02", dateLabel: "Second week of February", itemId: "final-submit", final: true, color: "#db2777", details: "Final TOK Essay submission and TK/PPF completion. The planner places the deadline in the second week of February but does not give an exact day." },
  { id: "english-march", projectId: "english-hle", title: "English A mock / moderation milestone", date: null, month: "2027-03", dateLabel: "March", itemId: "mock-moderation", color: "#4f46e5", details: "March mock or moderation-related milestone for English A. The planner gives the month but no exact day." },
  { id: "english-april", projectId: "english-hle", title: "English A final examination / coursework period", date: null, month: "2027-04", dateLabel: "April", itemId: "final-period", final: true, color: "#4f46e5", details: "April final examination and coursework period for English A. The planner gives the month but no exact day." },
];

export const WEEKLY_REVIEWS = [
  { week: 1, title: "Analytical Reasoning & Formula Application", goals: ["Build routine", "Core reviews", "Formula mastery", "Solve without notes", "Identify weak topics"] },
  { week: 2, title: "Linguistic Fluency & Data Interpretation", goals: ["Spanish fluency", "Unfamiliar data", "Evidence selection", "Identify recurring mistakes"] },
  { week: 3, title: "Complex Problem Solving & Critical Analysis", goals: ["Harder questions", "Evaluation", "Mixed-topic sets", "Timed work"] },
  { week: 4, title: "Synthesis & Exam Simulation", goals: ["Connect topics", "Timed papers", "Error log", "Exam conditions"] },
] as const;

const TOPICS: Record<SubjectId, string[]> = {
  Physics: ["Kinematics", "Forces", "Momentum", "Work, energy & power", "Circular motion", "Rotational motion", "Gravitational fields", "Electric fields", "Magnetic fields", "Charged-particle motion", "Electromagnetic induction", "Relativity", "Data-based questions", "Paper 1 practice", "Paper 2 practice", "Mixed timed practice"],
  Mathematics: ["Differentiation", "Integration", "Functions", "Algebra", "Binomial theorem", "Sequences", "Probability", "Statistics", "Calculus applications", "Paper 1 practice", "Paper 2 practice", "Mixed problem set"],
  Chemistry: ["Atomic structure", "Bonding", "Stoichiometry", "Energetics", "Kinetics", "Equilibrium", "Acids and bases", "Redox", "Organic chemistry", "Reaction mechanisms", "Spectroscopy", "Data-based questions", "Calculations", "Paper 1 practice", "Paper 2 practice"],
  Spanish: ["Vocabulary retrieval", "Grammar review", "Reading comprehension", "Listening practice", "Speaking practice", "Writing practice", "Tecnolog�a", "Medios de comunicaci�n", "Mi barrio", "Connectors", "Tenses", "IB writing task"],
  English: ["Literary analysis", "Close reading", "Character", "Themes", "Literary devices", "Comparison", "PEEL paragraph", "Thesis writing", "Paper 2 planning", "Timed writing", "Evidence selection", "Global issues"],
  Economics: ["Demand and supply", "Elasticity", "Market failure", "Government intervention", "Externalities", "Public goods", "Market structures", "Macroeconomic indicators", "AD/AS", "Inflation", "Unemployment", "Economic growth", "Fiscal policy", "Monetary policy", "International economics", "Development", "Diagrams", "Case studies", "Evaluation", "Paper 2 practice"],
};

function emptyHours(): Record<SubjectId, number> {
  return Object.fromEntries(SUBJECTS.map((subject) => [subject, 0])) as Record<SubjectId, number>;
}

function makeTask(id: string, title: string): StudyTask {
  return { id, title, completed: false };
}

export function buildDefaultDays(): Record<string, DayTasks> {
  return Object.fromEntries(Array.from({ length: 30 }, (_, index) => {
    const dayNumber = index + 1;
    const main = Object.fromEntries(SUBJECTS.map((subject, subjectIndex) => {
      const list = TOPICS[subject];
      const topic = list[(index * 2 + subjectIndex) % list.length];
      return [subject, [makeTask(`day-${dayNumber}-${subjectIndex}-main`, topic)]];
    })) as Record<SubjectId, StudyTask[]>;
    const extra = Object.fromEntries(SUBJECTS.map((subject, subjectIndex) => [
      subject,
      [makeTask(`day-${dayNumber}-${subjectIndex}-extra`, `15-minute ${subject.toLowerCase()} retrieval practice`)],
    ])) as Record<SubjectId, StudyTask[]>;
    return [String(dayNumber), { main, extra } satisfies DayTasks];
  }));
}

export function createInitialState(startDate = DEFAULT_START_DATE): TrackerState {
  const checklist = Object.fromEntries(PROJECTS.map((project) => [
    project.id,
    Object.fromEntries(project.checklist.map((item) => [item.id, false])),
  ])) as Record<ProjectId, Record<string, boolean>>;
  const weeks = Object.fromEntries(WEEKLY_REVIEWS.map((week) => [
    String(week.week), Object.fromEntries(week.goals.map((_, index) => [`goal-${index}`, false])),
  ]));
  const logs: Record<string, DailyLog> = Object.fromEntries(Array.from({ length: 30 }, (_, index) => [
    String(index + 1), { hours: emptyHours(), focus: 0, notes: "" },
  ]));
  return { version: 1, startDate, theme: "light", days: buildDefaultDays(), checklist, weeks, logs, events: CALENDAR_EVENTS.map((event) => ({ ...event })) };
}

export function getLocalISODate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getCurrentDayIndex(startDate: string, today = getLocalISODate()): number {
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  const start = Date.UTC(sy, sm - 1, sd);
  const current = Date.UTC(ty, tm - 1, td);
  return Math.min(30, Math.max(1, Math.floor((current - start) / 86_400_000) + 1));
}


import type { ProjectStatus } from "@/lib/study/types";
import { statusClasses } from "@/lib/study/calculations";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const symbol = status === "Complete" ? "�" : status === "Behind" ? "!" : status === "At Risk" ? "" : "�";
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(status)}`}><span aria-hidden="true">{symbol}</span>{status}</span>;
}


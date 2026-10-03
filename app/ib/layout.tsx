import type { ReactNode } from "react";
import { StudyFrame } from "@/components/study/StudyFrame";

export default function IBLayout({ children }: { children: ReactNode }) {
  return <StudyFrame>{children}</StudyFrame>;
}

import type { Metadata } from "next";
import "./globals.css";
import { StudyProvider } from "@/components/study/StudyProvider";

export const metadata: Metadata = {
  title: "IB Study & IA Tracker",
  description: "A 30-day IB study planner and IA, Extended Essay, TOK, and coursework command center.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><StudyProvider>{children}</StudyProvider></body>
    </html>
  );
}


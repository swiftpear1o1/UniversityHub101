import { universities } from "@/lib/universities";
import { UniversityProfileClient } from "@/components/UniversityProfileClient";

export default async function UniversityProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = universities.find((u) => u.id === id);
  if (!university) return <div className="p-10">University not found.</div>;
  return <UniversityProfileClient initial={university} />;
}

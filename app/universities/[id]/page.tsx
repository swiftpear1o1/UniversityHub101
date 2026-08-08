import { universities } from "@/lib/universities";
import { getVerifiedRequirement } from "@/lib/verifiedRequirements";
import { UniversityProfileClient } from "@/components/UniversityProfileClient";
import { VerifiedRequirementsCard } from "@/components/VerifiedRequirementsCard";

export default async function UniversityProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = universities.find((u) => u.id === id);
  if (!university) return <div className="p-10">University not found.</div>;
  const verified = getVerifiedRequirement(university.name);
  return <div>{verified && <div className="mx-auto max-w-7xl px-8 pt-8"><VerifiedRequirementsCard verified={verified}/></div>}<UniversityProfileClient initial={university} /></div>;
}

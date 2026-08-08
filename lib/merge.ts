export type ImportedBatch = {
  source: string;
  importedAt: string;
  records: Record<string, unknown>[];
};

const NAME_KEYS = ["university", "University", "university name", "University Name", "name", "Name"];

function value(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const v = record[key];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

export function universityName(record: Record<string, unknown>) {
  return value(record, NAME_KEYS);
}

export function normalizeName(name: string) {
  return name.toLowerCase().replace(/university|college|the|\(ucl\)/g, "").replace(/[^a-z0-9]/g, "");
}

export function mergeImportedBatches(batches: ImportedBatch[]) {
  const merged = new Map<string, { university: string; sources: string[]; fields: Record<string, unknown>; rawSources: string[] }>();
  for (const batch of batches) {
    for (const record of batch.records) {
      const name = universityName(record);
      if (!name) continue;
      const key = normalizeName(name);
      const existing = merged.get(key);
      if (!existing) {
        merged.set(key, { university: name, sources: [batch.source], fields: { ...record }, rawSources: [String(record.raw ?? "")] });
      } else {
        if (!existing.sources.includes(batch.source)) existing.sources.push(batch.source);
        for (const [field, incoming] of Object.entries(record)) {
          if (incoming !== undefined && incoming !== null && String(incoming).trim() !== "") {
            const current = existing.fields[field];
            if (current === undefined || String(current).trim() === "") existing.fields[field] = incoming;
            else if (String(current) !== String(incoming)) {
              const prior = String(current);
              existing.fields[field] = prior.includes(String(incoming)) ? prior : `${prior}\n--- MERGED SOURCE VALUE ---\n${String(incoming)}`;
            }
          }
        }
        const raw = String(record.raw ?? "");
        if (raw && !existing.rawSources.includes(raw)) existing.rawSources.push(raw);
      }
    }
  }
  return [...merged.values()].map(item => ({ ...item, rawSources: item.rawSources.filter(Boolean) }));
}

export function readImportedBatches(): ImportedBatch[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("universityhub-imported-records") || "[]"); }
  catch { return []; }
}

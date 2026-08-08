export type SourceAuditUniversity = { number:number; university:string; sourceCharacters:number };
export const REPORT_UNIVERSITIES: SourceAuditUniversity[] = [
{"number":1,"university":"Imperial College London","sourceCharacters":2439},
{"number":2,"university":"University College London (UCL)","sourceCharacters":2076},
{"number":3,"university":"University of Warwick","sourceCharacters":1881},
{"number":4,"university":"University of Manchester","sourceCharacters":1765},
{"number":5,"university":"University of Bristol","sourceCharacters":1725},
{"number":6,"university":"University of Bath","sourceCharacters":1738},
{"number":7,"university":"University of Toronto (U of T)","sourceCharacters":1926},
{"number":8,"university":"University of British Columbia (UBC)","sourceCharacters":1961},
{"number":9,"university":"University of Waterloo","sourceCharacters":1935},
{"number":10,"university":"McMaster University","sourceCharacters":1561},
{"number":11,"university":"Queen's University","sourceCharacters":1423},
{"number":12,"university":"Western University","sourceCharacters":1459},
{"number":13,"university":"National University of Singapore (NUS)","sourceCharacters":2026},
{"number":14,"university":"Nanyang Technological University (NTU)","sourceCharacters":1771},
{"number":15,"university":"Technical University of Munich (TUM)","sourceCharacters":1738},
{"number":16,"university":"Karlsruhe Institute of Technology (KIT) – Carl Benz School","sourceCharacters":1761},
{"number":17,"university":"RWTH Aachen University","sourceCharacters":1515},
{"number":18,"university":"TU Dresden","sourceCharacters":1308},
{"number":19,"university":"Ashoka University","sourceCharacters":1267},
{"number":20,"university":"Shiv Nadar Institution of Eminence (SNU)","sourceCharacters":1369},
{"number":21,"university":"Plaksha University","sourceCharacters":1234},
{"number":22,"university":"FLAME University","sourceCharacters":1066}
];
export const EXTRA_SHORTLIST_COUNT = 18;
export const SOURCE_FILES = ["Pasted markdown.md","University_Shortlist_IB_Editable(1).xlsx"] as const;
export const SOURCE_AUDIT = {
  reportUniversityCount: REPORT_UNIVERSITIES.length,
  extraShortlistCount: EXTRA_SHORTLIST_COUNT,
  reportNamesComplete: REPORT_UNIVERSITIES.length === 22,
  extraRowsComplete: EXTRA_SHORTLIST_COUNT === 18,
  note: "This audit records the complete source-file university/row inventory. It does not replace source text with a summary."
} as const;

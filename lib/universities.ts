export type University = {
  id: string;
  name: string;
  country: string;
  degree: string;
  major: string;
  ib: string;
  hl: string;
  tuition: string;
  living: string;
  classification: "Reach" | "Target" | "Safe";
  status: "Shortlisted" | "Preparing" | "Applied" | "Offer" | "Rejected";
  deadline: string;
  qs: string;
};

// Seed structure only. Full report data will be imported in the data phase.
export const universities: University[] = [
  { id: "imperial", name: "Imperial College London", country: "United Kingdom", degree: "BEng / MEng", major: "Mechanical Engineering", ib: "40", hl: "7,7,6", tuition: "£40,900", living: "£15,000", classification: "Reach", status: "Shortlisted", deadline: "15 Oct", qs: "2" },
  { id: "ucl", name: "University College London", country: "United Kingdom", degree: "BEng", major: "Mechanical Engineering", ib: "39", hl: "6,6,6", tuition: "£39,800", living: "£15,000", classification: "Target", status: "Shortlisted", deadline: "29 Jan", qs: "9" },
  { id: "warwick", name: "University of Warwick", country: "United Kingdom", degree: "MEng", major: "Mechanical Engineering", ib: "38", hl: "6,6,6", tuition: "£31,620", living: "£12,000", classification: "Target", status: "Shortlisted", deadline: "29 Jan", qs: "74" },
  { id: "toronto", name: "University of Toronto", country: "Canada", degree: "BASc", major: "Mechanical Engineering", ib: "36", hl: "6,6,6", tuition: "CAD 68,000", living: "CAD 20,000", classification: "Target", status: "Shortlisted", deadline: "15 Jan", qs: "29" },
  { id: "ntu", name: "Nanyang Technological University", country: "Singapore", degree: "BEng", major: "Mechanical Engineering", ib: "39", hl: "6,6,6", tuition: "SGD 35,000", living: "SGD 14,000", classification: "Reach", status: "Shortlisted", deadline: "15 Jan", qs: "12" },
];

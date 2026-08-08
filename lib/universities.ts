export type University = {
  id: string;
  name: string;
  country: string;
  degree: string;
  major: string;
  ib: string;
  hl: string;
  english: string;
  entranceTest: string;
  tuition: string;
  living: string;
  classification: "Reach" | "Target" | "Safe";
  status: "Shortlisted" | "Preparing" | "Applied" | "Offer" | "Rejected";
  deadline: string;
  qs: string;
  scholarship: string;
  internship: string;
  employability: string;
  startingSalary: string;
  workRights: string;
  recommendation: string;
  notes: string;
};

export const universities: University[] = [
  { id: "imperial", name: "Imperial College London", country: "United Kingdom", degree: "BEng / MEng", major: "Mechanical Engineering", ib: "40", hl: "7,7,6", english: "To be verified", entranceTest: "To be verified", tuition: "£40,900", living: "£15,000", classification: "Reach", status: "Shortlisted", deadline: "15 Oct", qs: "2", scholarship: "To be researched", internship: "To be researched", employability: "To be researched", startingSalary: "To be researched", workRights: "Graduate Route", recommendation: "Strong fit for engineering", notes: "Priority university" },
  { id: "ucl", name: "University College London", country: "United Kingdom", degree: "BEng", major: "Mechanical Engineering", ib: "39", hl: "6,6,6", english: "To be verified", entranceTest: "To be verified", tuition: "£39,800", living: "£15,000", classification: "Target", status: "Shortlisted", deadline: "29 Jan", qs: "9", scholarship: "To be researched", internship: "To be researched", employability: "To be researched", startingSalary: "To be researched", workRights: "Graduate Route", recommendation: "Strong option", notes: "" },
  { id: "warwick", name: "University of Warwick", country: "United Kingdom", degree: "MEng", major: "Mechanical Engineering", ib: "38", hl: "6,6,6", english: "To be verified", entranceTest: "To be verified", tuition: "£31,620", living: "£12,000", classification: "Target", status: "Shortlisted", deadline: "29 Jan", qs: "74", scholarship: "To be researched", internship: "To be researched", employability: "To be researched", startingSalary: "To be researched", workRights: "Graduate Route", recommendation: "Strong value option", notes: "" },
  { id: "toronto", name: "University of Toronto", country: "Canada", degree: "BASc", major: "Mechanical Engineering", ib: "36", hl: "6,6,6", english: "To be verified", entranceTest: "To be verified", tuition: "CAD 68,000", living: "CAD 20,000", classification: "Target", status: "Shortlisted", deadline: "15 Jan", qs: "29", scholarship: "To be researched", internship: "To be researched", employability: "To be researched", startingSalary: "To be researched", workRights: "Post-graduation work permit", recommendation: "Strong option", notes: "" },
  { id: "ntu", name: "Nanyang Technological University", country: "Singapore", degree: "BEng", major: "Mechanical Engineering", ib: "39", hl: "6,6,6", english: "To be verified", entranceTest: "To be verified", tuition: "SGD 35,000", living: "SGD 14,000", classification: "Reach", status: "Shortlisted", deadline: "15 Jan", qs: "12", scholarship: "To be researched", internship: "To be researched", employability: "To be researched", startingSalary: "To be researched", workRights: "To be verified", recommendation: "Strong engineering option", notes: "" },
];

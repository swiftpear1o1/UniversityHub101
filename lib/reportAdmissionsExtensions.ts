export type ReportAdmissionsExtension={name:string;reportSection:number;typicalOffer:string;typicalCompetitiveIBScore:string;reportPrerequisites:string};

export const REPORT_ADMISSIONS_EXTENSIONS: ReportAdmissionsExtension[] = [
  {name:"Imperial College London",reportSection:1,typicalOffer:"40 points overall with 7 in HL Mathematics AA and 7 in HL Physics for Mechanical Engineering; 39–40 points for BSc Physics.",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University College London (UCL)",reportSection:2,typicalOffer:"38–39 points overall, with a minimum of 18 points in Higher Level subjects (6,6,6 including HL Mathematics AA and HL Physics).",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University of Warwick",reportSection:3,typicalOffer:"38 points (6,6,6 at HL including Math AA and Physics) for BEng; 36 points (6,6 at HL) for BSc Physics.",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University of Manchester",reportSection:4,typicalOffer:"37–38 points overall, with 6,6,6 at Higher Level including Mathematics AA and Physics.",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University of Bristol",reportSection:5,typicalOffer:"36–38 points, including 6,6 at HL in Mathematics AA and Physics.",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University of Bath",reportSection:6,typicalOffer:"36 points total, with 6,6 at HL in Mathematics AA and Physics.",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"University of Toronto (U of T)",reportSection:7,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL mandatory."},
  {name:"University of British Columbia (UBC)",reportSection:8,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL required."},
  {name:"University of Waterloo",reportSection:9,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL (grade 6 min), Physics HL (6 min), Chemistry HL."},
  {name:"McMaster University",reportSection:10,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL."},
  {name:"Queen's University",reportSection:11,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL."},
  {name:"Western University",reportSection:12,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL required."},
  {name:"National University of Singapore (NUS)",reportSection:13,typicalOffer:"",typicalCompetitiveIBScore:"39–41 points for engineering and science majors.",reportPrerequisites:""},
  {name:"Nanyang Technological University (NTU)",reportSection:14,typicalOffer:"",typicalCompetitiveIBScore:"38–40 points.",reportPrerequisites:""},
  {name:"Technical University of Munich (TUM)",reportSection:15,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"Karlsruhe Institute of Technology (KIT) – Carl Benz School",reportSection:16,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL and Physics HL mandatory."},
  {name:"RWTH Aachen University",reportSection:17,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"TU Dresden",reportSection:18,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"Ashoka University",reportSection:19,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"HL Mathematics AA and HL Physics recommended."},
  {name:"Shiv Nadar Institution of Eminence (SNU)",reportSection:20,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:"Mathematics AA HL, Physics HL, Chemistry HL."},
  {name:"Plaksha University",reportSection:21,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:""},
  {name:"FLAME University",reportSection:22,typicalOffer:"",typicalCompetitiveIBScore:"",reportPrerequisites:""}
];

export const REPORT_ADMISSIONS_BY_NAME = Object.fromEntries(REPORT_ADMISSIONS_EXTENSIONS.map(x=>[x.name.toLowerCase(),x]));

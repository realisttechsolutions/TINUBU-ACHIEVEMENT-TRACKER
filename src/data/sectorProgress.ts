export interface SectorData {
  name: string;
  progress: number;
  description: string;
  keyAchievements?: string[];
  challenges?: string[];
  source?: string;
}

export const sectorProgress: SectorData[] = [
  {
    name: "Economic Reforms",
    progress: 68,
    description: "Implementation of economic policies including subsidy removal and forex reforms.",
    keyAchievements: [
      "Foreign exchange market unification",
      "Fuel subsidy removal saving ₦4 trillion annually",
      "Consumer Credit Scheme establishment",
      "Implementation of tax reforms"
    ],
    challenges: [
      "Managing inflation during transition period",
      "Addressing short-term economic discomfort"
    ],
    source: "https://www.worldbank.org/en/country/nigeria/overview"
  },
  {
    name: "Infrastructure",
    progress: 42,
    description: "Ongoing projects in transportation, energy, and digital infrastructure.",
    keyAchievements: [
      "Launch of ₦20 trillion Renewed Hope Infrastructure Fund",
      "Reactivation of stalled federal highway projects",
      "Electricity Act for decentralized power generation",
      "Lagos-Calabar coastal highway project commencement"
    ],
    challenges: [
      "Project financing constraints",
      "Lengthy procurement processes",
      "Maintenance of existing infrastructure"
    ],
    source: "https://www.worldbank.org/en/topic/infrastructure/overview"
  },
  {
    name: "Social Services",
    progress: 55,
    description: "Improvements in healthcare, education, and social security programs.",
    keyAchievements: [
      "Student Loan Act implementation",
      "Expanded social safety nets for vulnerable populations",
      "Healthcare facility revitalization initiative",
      "Conditional cash transfer program for 15 million households"
    ],
    challenges: [
      "Reaching remote communities",
      "Service quality standardization",
      "Healthcare worker retention"
    ],
    source: "https://www.worldbank.org/en/topic/socialprotection"
  },
  {
    name: "Governance",
    progress: 61,
    description: "Administrative reforms and anti-corruption initiatives.",
    keyAchievements: [
      "Digital government services implementation",
      "Enhanced transparency in government procurement",
      "Strengthened anti-corruption agencies",
      "Civil service reform program launch"
    ],
    challenges: [
      "Institutional capacity building",
      "Overcoming systemic corruption",
      "Implementing e-governance fully"
    ],
    source: "https://www.transparency.org/en/countries/nigeria"
  }
];

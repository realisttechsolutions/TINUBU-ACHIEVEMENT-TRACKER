export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: string;
  impact?: string;
  source?: {
    name: string;
    url: string;
  };
}

export const timelineEvents: TimelineEvent[] = [
  {
    date: "May 29, 2023",
    title: "Presidential Inauguration",
    description: "President Bola Tinubu sworn in as the 16th President of Nigeria.",
    category: "Governance",
    source: {
      name: "Nigerian Presidency",
      url: "https://statehouse.gov.ng/"
    }
  },
  {
    date: "May 29, 2023",
    title: "Fuel Subsidy Removal",
    description: "Announcement of the removal of fuel subsidy during inaugural speech to reduce fiscal burden on government finances.",
    category: "Economic Reform",
    impact: "Projected to save Nigeria approximately ₦4 trillion annually, redirecting funds to critical infrastructure and social programs.",
    source: {
      name: "Central Bank of Nigeria",
      url: "https://www.cbn.gov.ng/"
    }
  },
  {
    date: "June 14, 2023",
    title: "Foreign Exchange Reform",
    description: "Unification of multiple exchange rate windows to enhance transparency, reduce arbitrage opportunities and attract foreign investment.",
    category: "Monetary Policy",
    impact: "Expected to improve transparency in the forex market and increase foreign direct investment by up to 25% over two years.",
    source: {
      name: "Central Bank of Nigeria",
      url: "https://www.cbn.gov.ng/"
    }
  },
  {
    date: "July 31, 2023",
    title: "Student Loan Act",
    description: "Signing of the Access to Higher Education Act establishing the Nigerian Education Loan Fund to increase access to higher education.",
    category: "Education",
    impact: "Targets supporting over 100,000 students annually from disadvantaged backgrounds to access higher education.",
    source: {
      name: "Federal Ministry of Education",
      url: "https://education.gov.ng/"
    }
  },
  {
    date: "August 13, 2023",
    title: "Electricity Act",
    description: "Signing of the Electricity Act 2023 to decentralize electricity generation and distribution, allowing states to generate and distribute electricity.",
    category: "Energy",
    impact: "Aims to increase national power generation capacity by 30% over three years and improve electricity access across the country.",
    source: {
      name: "Federal Ministry of Power",
      url: "https://www.power.gov.ng/"
    }
  },
  {
    date: "October 23, 2023",
    title: "Tax Reform Initiatives",
    description: "Launch of comprehensive tax reform program to broaden the tax base and improve revenue collection efficiency.",
    category: "Fiscal Policy",
    impact: "Targeting a 40% increase in tax revenue to GDP ratio over five years without increasing tax rates for most Nigerians.",
    source: {
      name: "Federal Inland Revenue Service",
      url: "https://www.firs.gov.ng/"
    }
  },
  {
    date: "December 4, 2023",
    title: "National Consumer Credit Corporation",
    description: "Establishment of the Consumer Credit Scheme to improve access to consumer credit and boost economic activity.",
    category: "Financial Inclusion",
    impact: "Expected to increase consumer credit access for over 5 million Nigerians within two years.",
    source: {
      name: "Central Bank of Nigeria",
      url: "https://www.cbn.gov.ng/"
    }
  },
  {
    date: "January 15, 2024",
    title: "CNG Initiative",
    description: "Launch of Presidential Compressed Natural Gas Initiative (PCNGi) to accelerate adoption of CNG as transportation fuel alternative.",
    category: "Energy Transition",
    impact: "Projects conversion of 1 million vehicles to CNG by 2026, reducing transportation costs by up to 40% compared to petrol.",
    source: {
      name: "Nigerian National Petroleum Corporation",
      url: "https://nnpcgroup.com/"
    }
  },
  {
    date: "February 28, 2024",
    title: "Digital Economy Policy",
    description: "Approval of the National Digital Economy Policy and Strategy to drive innovation and digital transformation across sectors.",
    category: "Technology",
    impact: "Aims to create 2 million tech-related jobs by 2027 and increase ICT's contribution to GDP to 15%.",
    source: {
      name: "Federal Ministry of Communications & Digital Economy",
      url: "https://www.commtech.gov.ng/"
    }
  },
  {
    date: "April 10, 2024",
    title: "Renewed Hope Infrastructure Fund",
    description: "Establishment of ₦20 trillion infrastructure development fund to accelerate critical national projects.",
    category: "Infrastructure",
    impact: "Projected to finance over 5,000 km of roads, rail lines, and power infrastructure over the next five years.",
    source: {
      name: "Federal Ministry of Finance",
      url: "https://finance.gov.ng/"
    }
  }
];

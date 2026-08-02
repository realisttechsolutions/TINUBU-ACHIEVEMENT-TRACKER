// Structured data schemas for SEO

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Renewed Hope Achievements Tracker",
  "description": "A comprehensive data-driven hub showcasing President Bola Ahmed Tinubu's policies and achievements across economic, security, social, and infrastructure sectors since May 2023.",
  "url": "https://renewedhope-tracker.gov.ng",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://renewedhope-tracker.gov.ng/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "Office of the President of Nigeria",
  "description": "Official progress tracking platform for the Renewed Hope Agenda",
  "url": "https://renewedhope-tracker.gov.ng",
  "logo": "https://renewedhope-tracker.gov.ng/assets/logo.png",
  "sameAs": [
    "https://twitter.com/NGRPresident",
    "https://facebook.com/NigeriaPresidency"
  ]
};

export const datasetSchema = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": title,
  "description": description,
  "url": url,
  "creator": {
    "@type": "GovernmentOrganization",
    "name": "Federal Government of Nigeria"
  },
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "keywords": ["Nigeria", "government data", "economic statistics", "social indicators"]
});

export const reportSchema = (title: string, description: string, url: string, datePublished: string) => ({
  "@context": "https://schema.org",
  "@type": "Report",
  "headline": title,
  "description": description,
  "url": url,
  "datePublished": datePublished,
  "author": {
    "@type": "GovernmentOrganization",
    "name": "Federal Government of Nigeria"
  },
  "publisher": {
    "@type": "GovernmentOrganization",
    "name": "Office of the President of Nigeria"
  }
});

export const faqSchema = (faqs: Array<{question: string; answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});
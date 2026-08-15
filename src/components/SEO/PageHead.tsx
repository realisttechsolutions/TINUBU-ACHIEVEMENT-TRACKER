'use client';

import React, { useEffect } from 'react';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

export const PageHead: React.FC<PageHeadProps> = ({
  title = "Tinubu Achievement Tracker - Nigeria Progress Dashboard",
  description = "A comprehensive data-driven hub showcasing President Bola Ahmed Tinubu's policies and achievements across economic, security, social, and infrastructure sectors (2023 - 2026).",
  keywords = "Nigeria progress, Tinubu administration, economic reforms, infrastructure development, security improvements, social services, data dashboard, government achievements",
  canonical,
  ogImage = "/assets/og-image.jpg",
  structuredData
}) => {
  const fullTitle = title.includes("Tinubu") || title.includes("Renewed Hope") ? title : `${title} | Tinubu Achievement Tracker`;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = fullTitle;
      
      // Update meta description if element exists
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && description) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [fullTitle, description]);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};

export default PageHead;

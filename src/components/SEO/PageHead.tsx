import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

const PageHead: React.FC<PageHeadProps> = ({
  title = "Renewed Hope Achievements Tracker - Nigeria Progress Dashboard",
  description = "A comprehensive data-driven hub showcasing President Bola Ahmed Tinubu's policies and achievements across economic, security, social, and infrastructure sectors since May 2023.",
  keywords = "Nigeria progress, Tinubu administration, economic reforms, infrastructure development, security improvements, social services, data dashboard, government achievements",
  canonical,
  ogImage = "/assets/og-image.jpg",
  structuredData
}) => {
  const fullTitle = title.includes("Renewed Hope") ? title : `${title} | Renewed Hope Achievements Tracker`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Tinubu Progress Watch" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Renewed Hope Achievements Tracker" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Language and Region */}
      <meta name="language" content="en" />
      <meta name="geo.region" content="NG" />
      <meta name="geo.country" content="Nigeria" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#2E3192" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    </Helmet>
  );
};

export default PageHead;
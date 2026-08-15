import React, { Component, ReactNode, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

class HelmetErrorBoundary extends Component<{ children: ReactNode; title: string }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; title: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // If Helmet context is missing (e.g. In unit tests), fallback to setting document.title directly
    if (typeof document !== 'undefined' && this.props.title) {
      document.title = this.props.title;
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
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
    }
  }, [fullTitle]);

  return (
    <HelmetErrorBoundary title={fullTitle}>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="Tinubu Achievement Tracker" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Tinubu Achievement Tracker" />
        
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
      </Helmet>
    </HelmetErrorBoundary>
  );
};

export default PageHead;
import { MetadataRoute } from 'next';
import { isStagingEnvironment } from '@/lib/deployment/environment';

export default function robots(): MetadataRoute.Robots {
  if (isStagingEnvironment()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/private/'],
    },
    sitemap: 'https://tinubutracker.ng/sitemap.xml',
  };
}

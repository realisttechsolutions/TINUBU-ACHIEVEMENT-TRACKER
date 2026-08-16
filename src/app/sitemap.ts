import { MetadataRoute } from 'next';
import { dataAdapter } from '@/adapters/dataAdapter';
import { getPublicDataSnapshot } from '@/server/data/public-snapshot';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tinubutracker.ng';
  const now = new Date();

  // Static Core Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/dashboard',
    '/achievements',
    '/sectors',
    '/impact-map',
    '/states',
    '/policies',
    '/projects',
    '/programmes',
    '/timeline',
    '/data-sources',
    '/sources',
    '/corrections',
    '/data',
    '/downloads',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Achievement Pages
  const snapshot = await getPublicDataSnapshot();
  const achievements = snapshot?.achievements ?? dataAdapter.getAchievements();
  const achievementRoutes: MetadataRoute.Sitemap = achievements.map((ach) => ({
    url: `${baseUrl}/achievements/${ach.slug}`,
    lastModified: new Date(ach.date || now),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Dynamic Sector Pages
  const sectors = snapshot?.sectors ?? dataAdapter.getSectors();
  const sectorRoutes: MetadataRoute.Sitemap = sectors.map((s) => ({
    url: `${baseUrl}/sectors/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic State Pages
  const states = snapshot?.states ?? dataAdapter.getStates();
  const stateRoutes: MetadataRoute.Sitemap = states.map((st) => ({
    url: `${baseUrl}/states/${st.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic Policy Pages
  const policies = snapshot?.policies ?? dataAdapter.getPolicies();
  const policyRoutes: MetadataRoute.Sitemap = policies.map((p) => ({
    url: `${baseUrl}/policies/${p.slug}`,
    lastModified: new Date(p.effectiveDate || p.approvalDate || now),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...achievementRoutes,
    ...sectorRoutes,
    ...stateRoutes,
    ...policyRoutes,
  ];
}

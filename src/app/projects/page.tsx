import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ProjectsCatalogue from '@/views/ProjectsCatalogue';
import Loading from '../loading';

export const metadata: Metadata = {
  title: 'Capital Infrastructure Projects | Tinubu Achievement Tracker',
  description:
    'Major physical infrastructure, rail transit, highway corridors, energy assets, and housing developments delivered across Nigeria.',
  alternates: {
    canonical: 'https://tinubutracker.ng/projects',
  },
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectsCatalogue />
    </Suspense>
  );
}
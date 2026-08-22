import type { Metadata } from 'next';
import React from 'react';
import { PTATAIExperienceClient } from '@/components/ai/PTATAIExperienceClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PTAT AI — Evidence-Grounded Public Intelligence Assistant',
  description:
    'Official AI evidence intelligence interface for the President Tinubu Achievement Tracker. Explore 270 verified public records, statutory policies, infrastructure projects, and empirical financial disclosures.',
  openGraph: {
    title: 'PTAT AI — Evidence-Grounded Public Intelligence Assistant',
    description:
      'Official AI evidence intelligence interface for the President Tinubu Achievement Tracker.',
    url: 'https://tinubutracker.ng/ai',
    siteName: 'President Tinubu Achievement Tracker',
  },
};

export default function AIPage() {
  return <PTATAIExperienceClient />;
}

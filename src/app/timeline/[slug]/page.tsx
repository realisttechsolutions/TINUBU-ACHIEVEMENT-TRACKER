import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import TimelineEventDetail from '@/views/TimelineEventDetail';
import Loading from '../../loading';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = dataAdapter.getTimelineEvents();
  return events.map((ev) => ({
    slug: ev.slug || ev.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const event = dataAdapter.getTimelineEventByIdOrSlug(slug);
  if (!event) {
    return {
      title: 'Timeline Event Not Found | President Tinubu Achievement Tracker',
      description: 'The requested administration timeline event could not be found.',
    };
  }

  return {
    title: `${event.title} | Administration Timeline Dossier`,
    description: event.summary,
    alternates: {
      canonical: `https://tinubutracker.ng/timeline/${event.slug || event.id}`,
    },
    openGraph: {
      title: event.title,
      description: event.summary,
      url: `https://tinubutracker.ng/timeline/${event.slug || event.id}`,
      siteName: 'President Tinubu Achievement Tracker',
      locale: 'en_NG',
      type: 'article',
      publishedTime: event.eventDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.summary,
    },
  };
}

export default async function TimelineEventDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || '';
  const event = dataAdapter.getTimelineEventByIdOrSlug(slug);
  if (!event) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <TimelineEventDetail />
    </Suspense>
  );
}

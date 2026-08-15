import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import AchievementDetail from '@/views/AchievementDetail';
import Loading from '../../loading';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const achievements = dataAdapter.getAchievements();
  return achievements.map((ach) => ({
    slug: ach.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const achievement = dataAdapter.getAchievementBySlug(params.slug);
  if (!achievement) {
    return {
      title: 'Achievement Not Found | Tinubu Achievement Tracker',
      description: 'The requested achievement record could not be found.',
    };
  }

  return {
    title: `${achievement.title} | Tinubu Achievement Tracker`,
    description: achievement.summary,
    alternates: {
      canonical: `https://tinubutracker.ng/achievements/${achievement.slug}`,
    },
    openGraph: {
      title: achievement.title,
      description: achievement.summary,
      url: `https://tinubutracker.ng/achievements/${achievement.slug}`,
      type: 'article',
      images: [
        {
          url: '/assets/og-image.jpg',
          width: 1200,
          height: 630,
          alt: achievement.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: achievement.title,
      description: achievement.summary,
      images: ['/assets/og-image.jpg'],
    },
  };
}

export default function AchievementDetailPage({ params }: Props) {
  const achievement = dataAdapter.getAchievementBySlug(params.slug);
  if (!achievement) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <AchievementDetail />
    </Suspense>
  );
}
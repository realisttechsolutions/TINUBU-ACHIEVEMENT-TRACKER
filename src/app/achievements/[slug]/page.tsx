import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { dataAdapter } from '@/adapters/dataAdapter';
import AchievementDetail from '@/views/AchievementDetail';
import Loading from '../../loading';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const achievements = dataAdapter.getAchievements();
  return achievements.map((ach) => ({
    slug: ach.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const achievement = dataAdapter.getAchievementBySlug(resolvedParams?.slug || '');
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
      siteName: 'Tinubu Achievement Tracker',
      locale: 'en_NG',
      type: 'article',
      publishedTime: achievement.date || '2023-05-29',
    },
    twitter: {
      card: 'summary_large_image',
      title: achievement.title,
      description: achievement.summary,
    },
  };
}

export default async function AchievementDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const achievement = dataAdapter.getAchievementBySlug(resolvedParams?.slug || '');
  if (!achievement) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <AchievementDetail />
    </Suspense>
  );
}
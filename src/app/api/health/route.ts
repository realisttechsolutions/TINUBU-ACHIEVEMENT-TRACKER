import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      application: 'Tinubu Achievement Tracker V2',
      framework: 'Next.js App Router',
      version: '2.0.0-m09',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      capabilities: {
        serverRendering: true,
        dynamicMetadata: true,
        appHostingReady: true,
      },
    },
    { status: 200 }
  );
}
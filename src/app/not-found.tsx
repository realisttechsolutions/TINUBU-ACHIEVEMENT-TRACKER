import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The requested page or record could not be found in the Tinubu Achievement Tracker database.',
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-500/5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-full">
            HTTP 404
          </span>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Record Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page, policy, or achievement record you are looking for does not exist or has been relocated within the official register.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild variant="default" className="gap-2">
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/achievements">
              <Search className="w-4 h-4" />
              Browse Catalogue
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

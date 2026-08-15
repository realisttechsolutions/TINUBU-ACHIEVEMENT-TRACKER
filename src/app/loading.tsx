import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-4 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
        </div>
      </div>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider animate-pulse">
        Loading Tracker Registry...
      </p>
    </div>
  );
}

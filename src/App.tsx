import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import AppShell from "./components/layout/AppShell";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { SuspenseFallback } from "./components/ui/LoadingSpinner";

// Import i18n instance
import './i18n/i18n';

// Lazy load all page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const SectorsCatalogue = lazy(() => import("./pages/SectorsCatalogue"));
const SectorDetail = lazy(() => import("./pages/SectorDetail"));
const ImpactMapPage = lazy(() => import("./pages/ImpactMapPage"));
const StatesCatalogue = lazy(() => import("./pages/StatesCatalogue"));
const StateDetail = lazy(() => import("./pages/StateDetail"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const DataSources = lazy(() => import("./pages/DataSources"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Downloads = lazy(() => import("./pages/Downloads"));
const AchievementsCatalogue = lazy(() => import("./pages/AchievementsCatalogue"));
const AchievementDetail = lazy(() => import("./pages/AchievementDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LegacySectorRedirect = lazy(() => import("./components/common/LegacySectorRedirect"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <div className="scroll-smooth">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<SuspenseFallback />}>
                <AppShell>
                  <Routes>
                    {/* Main routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/achievements" element={<AchievementsCatalogue />} />
                    <Route path="/achievements/:slug" element={<AchievementDetail />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/policy-timeline" element={<TimelinePage />} />
                    
                    {/* Geographic Experience Routes */}
                    <Route path="/impact-map" element={<ImpactMapPage />} />
                    <Route path="/states" element={<StatesCatalogue />} />
                    <Route path="/states/:slug" element={<StateDetail />} />

                    {/* Canonical Sector System Routes */}
                    <Route path="/sectors" element={<SectorsCatalogue />} />
                    <Route path="/sectors/:slug" element={<SectorDetail />} />

                    {/* Legacy Sector Redirects */}
                    <Route path="/economic-reforms" element={<LegacySectorRedirect targetSlug="economy" />} />
                    <Route path="/security-progress" element={<LegacySectorRedirect targetSlug="security" />} />
                    <Route path="/infrastructure" element={<LegacySectorRedirect targetSlug="infrastructure" />} />
                    <Route path="/social-services" element={<LegacySectorRedirect targetSlug="social-services" />} />

                    {/* Evidence & Platform routes */}
                    <Route path="/data-sources" element={<DataSources />} />
                    <Route path="/downloads" element={<Downloads />} />

                    {/* 404 catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppShell>
              </Suspense>
            </BrowserRouter>
          </div>
        </ErrorBoundary>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

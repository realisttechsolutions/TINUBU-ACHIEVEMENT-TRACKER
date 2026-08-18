'use client';

import React from "react";
import {
  ArrowUpRight,
  TrendingUp,
  Banknote,
  Activity,
  ShoppingCart,
  Briefcase
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for inflation trends
const inflationData = [
  { name: "May 2023", value: 22.41 },
  { name: "Jul 2023", value: 24.08 },
  { name: "Sep 2023", value: 26.72 },
  { name: "Nov 2023", value: 28.20 },
  { name: "Jan 2024", value: 29.90 },
  { name: "Mar 2024", value: 33.20 },
  { name: "May 2024", value: 32.15 },
];

// Sample data for exchange rate
const exchangeRateData = [
  { name: "May 2023", value: 461 },
  { name: "Jul 2023", value: 777 },
  { name: "Sep 2023", value: 755 },
  { name: "Nov 2023", value: 830 },
  { name: "Jan 2024", value: 1356 },
  { name: "Mar 2024", value: 1310 },
  { name: "May 2024", value: 1250 },
];

// Sample data for GDP by sector
const gdpBySectorData = [
  { name: "Q1 2023", agriculture: 21.66, industry: 21.05, services: 57.29 },
  { name: "Q2 2023", agriculture: 23.01, industry: 18.56, services: 58.43 },
  { name: "Q3 2023", agriculture: 29.31, industry: 18.01, services: 52.68 },
  { name: "Q4 2023", agriculture: 26.29, industry: 17.50, services: 56.21 },
  { name: "Q1 2024", agriculture: 21.07, industry: 21.90, services: 57.03 },
  { name: "Q2 2024", agriculture: 22.61, industry: 19.83, services: 57.56 },
];

// Sample data for foreign investment
const foreignInvestmentData = [
  { name: "Q2 2023", fdi: 0.12, portfolio: 0.75, other: 0.25 },
  { name: "Q3 2023", fdi: 0.15, portfolio: 0.85, other: 0.35 },
  { name: "Q4 2023", fdi: 0.22, portfolio: 0.98, other: 0.40 },
  { name: "Q1 2024", fdi: 0.29, portfolio: 2.08, other: 1.00 },
  { name: "Q2 2024", fdi: 0.35, portfolio: 2.15, other: 0.92 },
];

// Key policy initiatives data
const policyInitiatives = [
  {
    id: 1,
    title: "Fuel Subsidy Removal",
    date: "May 29, 2023",
    description: "Elimination of the long-standing petrol subsidy to reduce fiscal deficit and redirect resources to critical infrastructure, education, and healthcare sectors.",
    impact: "Saved over ₦1 trillion monthly in government expenditure, improving fiscal balance.",
    status: "Completed",
    category: "Fiscal Policy"
  },
  {
    id: 2,
    title: "Foreign Exchange Market Unification",
    date: "June 14, 2023",
    description: "Abolition of multiple exchange rate windows and transition to a market-determined exchange rate system to enhance transparency and attract foreign investment.",
    impact: "Increased foreign capital inflows by over 200% year-on-year in Q2 2024.",
    status: "Ongoing",
    category: "Monetary Policy"
  },
  {
    id: 3,
    title: "Tax Administration and Reform Committee",
    date: "July 7, 2023",
    description: "Establishment of the Presidential Committee on Fiscal Policy and Tax Reforms to streamline tax administration, eliminate multiple taxation, and improve revenue collection.",
    impact: "Harmonization of federal taxes with projected increase in tax-to-GDP ratio to 18% within 3 years.",
    status: "In Progress",
    category: "Fiscal Policy"
  },
  {
    id: 4,
    title: "National Single Window Project",
    date: "April 16, 2024",
    description: "Implementation of a digital platform integrating international trade stakeholders to simplify import/export processes and reduce port congestion.",
    impact: "Projected to generate over ₦4.2 trillion annually in economic benefits and reduce trade processing times by 70%.",
    status: "Implementation",
    category: "Trade & Commerce"
  },
  {
    id: 5,
    title: "Consumer Credit Corporation (CREDICORP)",
    date: "April 24, 2024",
    description: "Establishment of institutional framework to accelerate access to consumer credit for Nigerian workers, driving domestic manufacturing and economic activity.",
    impact: "Initial capitalization of ₦100 billion with first phase beneficiaries rolling out across civil service.",
    status: "Rollout",
    category: "Financial Inclusion"
  }
];

const EconomicReforms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <HeroSection
          title="Economic Reforms"
          subtitle="Tracking Nigeria's Economic Transition — Comprehensive overview of major structural policy reforms"
          action={{
            text: "Explore Sector Data",
            href: "/sectors"
          }}
          secondaryAction={{
            text: "View Timeline",
            href: "/timeline"
          }}
        />

        <section className="container mx-auto px-4 py-12">
          <SectionHeader
            title="Economic Indicators"
            description="Key metrics tracking the performance of Nigeria's economy since May 2023"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <MetricCard
              title="GDP Growth Rate"
              value="+1.5%"
              description="Q2 2024"
              trend="up"
              trendValue="from -0.5% in Q2 2023"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <MetricCard
              title="Foreign Exchange Reserves"
              value="36-Month High"
              description="As of June 2024 (CBN Buffer)"
              trend="up"
              trendValue="15% increase in 12 months"
              icon={<Banknote className="h-6 w-6" />}
            />
            <MetricCard
              title="Inflation Rate"
              value="32.15%"
              description="May 2024"
              trend="down"
              trendValue="from 33.20% in March 2024"
              icon={<Activity className="h-6 w-6" />}
            />
            <MetricCard
              title="Exchange Rate (NGN / USD)"
              value="₦1,250"
              description="As of May 2024"
              trend="down"
              trendValue="from ₦1,310 in March 2024"
              icon={<ArrowUpRight className="h-6 w-6" />}
            />
            <MetricCard
              title="Capital Inflow Growth"
              value="+205%"
              description="Q2 2024 Capital Inflows"
              trend="up"
              trendValue="205% increase from Q2 2023"
              icon={<Briefcase className="h-6 w-6" />}
            />
            <MetricCard
              title="Consumer Spending"
              value="+2.8%"
              description="Q2 2024 (YoY)"
              trend="up"
              trendValue="First positive growth since 2022"
              icon={<ShoppingCart className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <AreaChart
              title="Inflation Rate Trend"
              data={inflationData}
              dataKey="value"
              color="#F7931E"
              yAxisFormatter={(value) => `${value}%`}
              tooltipFormatter={(value) => `${value}%`}
              description="Monthly inflation rates showing recent trends"
            />

            <AreaChart
              title="Exchange Rate Trend (NGN to USD)"
              data={exchangeRateData}
              dataKey="value"
              color="#2E3192"
              yAxisFormatter={(value) => `₦${value}`}
              tooltipFormatter={(value) => `₦${value}`}
              description="Official exchange rate fluctuations showing recent stabilization"
            />
          </div>

          <div className="mb-12">
            <BarChart
              title="GDP Composition by Sector (%)"
              data={gdpBySectorData}
              dataKeys={[
                { key: "agriculture", color: "#7E69AB", name: "Agriculture" },
                { key: "industry", color: "#2E3192", name: "Industry" },
                { key: "services", color: "#F7931E", name: "Services" }
              ]}
              stacked={true}
              yAxisFormatter={(value) => `${value}%`}
              tooltipFormatter={(value) => `${value}%`}
              description="Quarterly breakdown of GDP contribution by major economic sectors"
            />
          </div>

          <div className="mb-12">
            <BarChart
              title="Foreign Investment Inflows Trend"
              data={foreignInvestmentData}
              dataKeys={[
                { key: "fdi", color: "#2E3192", name: "FDI" },
                { key: "portfolio", color: "#7E69AB", name: "Portfolio Investment" },
                { key: "other", color: "#F7931E", name: "Other Investments" }
              ]}
              yAxisFormatter={(value) => `${value}x`}
              tooltipFormatter={(value) => `${value} index value`}
              description="Quarterly breakdown of foreign investment by type showing growth trends"
            />
          </div>
        </section>

        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Major Policy Reforms"
              description="Detailed analysis of key economic reforms implemented since May 2023"
            />

            <div className="space-y-6">
              {policyInitiatives.map((policy, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{policy.title}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-500">{policy.date}</span>
                          <span className="bg-brand-light-purple text-brand-purple text-xs font-medium px-2 py-1 rounded">
                            {policy.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{policy.description}</p>
                        <div className="p-3 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-semibold text-blue-800 mb-1">Impact Analysis:</h4>
                          <p className="text-sm text-blue-700">{policy.impact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>


        <section className="container mx-auto px-4 py-12">
          <SectionHeader
            title="Expert Analysis"
            description="Insights from economists and financial analysts on the impact of economic reforms"
          />

          <Tabs defaultValue="fiscal" className="space-y-4">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-4 h-auto">
              <TabsTrigger value="fiscal" className="py-3">Fiscal Policy</TabsTrigger>
              <TabsTrigger value="monetary" className="py-3">Monetary Policy</TabsTrigger>
              <TabsTrigger value="trade" className="py-3">Trade Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="fiscal" className="p-6 border rounded-md bg-white">
              <h3 className="text-xl font-bold mb-4">Fiscal Policy Analysis</h3>
              <p className="mb-4">
                The removal of the fuel subsidy has been a landmark fiscal policy change under the Tinubu administration.
                This bold move, while initially causing economic hardship, has freed up substantial resources
                previously trapped in an unsustainable subsidy regime.
              </p>
              <p className="mb-4">
                Data from the Ministry of Finance indicates savings of approximately ₦4 trillion annually,
                which is being redirected to infrastructure development, healthcare, and education.
                The fiscal space created has also allowed the government to implement targeted social
                intervention programs to cushion the impact on vulnerable populations.
              </p>
              <blockquote className="border-l-4 border-brand-blue pl-4 italic text-gray-700 my-4">
                "The subsidy removal, while painful in the short term, was necessary to avoid a fiscal crisis.
                The challenge now is ensuring that the savings are transparently deployed to productive sectors
                that can stimulate economic growth and job creation."
                <footer className="text-sm mt-2">- Dr. Aisha Mohammed, Economic Advisory Council</footer>
              </blockquote>
            </TabsContent>

            <TabsContent value="monetary" className="p-6 border rounded-md bg-white">
              <h3 className="text-xl font-bold mb-4">Monetary Policy Analysis</h3>
              <p className="mb-4">
                The Central Bank of Nigeria has implemented significant monetary policy reforms under the
                Tinubu administration, including the unification of multiple exchange rate windows and
                adoption of a more flexible exchange rate regime.
              </p>
              <p className="mb-4">
                These reforms have helped eliminate arbitrage opportunities in the foreign exchange market
                and improved transparency. The initial sharp depreciation of the naira has begun to stabilize
                as foreign investor confidence gradually returns, evidenced by increased portfolio inflows
                in recent quarters.
              </p>
              <blockquote className="border-l-4 border-brand-purple pl-4 italic text-gray-700 my-4">
                "The monetary policy framework now has greater credibility with international markets.
                The short-term pain of currency adjustment should yield long-term benefits through increased
                foreign investment and a more sustainable external position."
                <footer className="text-sm mt-2">- Prof. Samuel Adejuwon, Center for Economic Policy Research</footer>
              </blockquote>
            </TabsContent>

            <TabsContent value="trade" className="p-6 border rounded-md bg-white">
              <h3 className="text-xl font-bold mb-4">Trade Policy Analysis</h3>
              <p className="mb-4">
                Trade policy reforms under the Tinubu administration have focused on promoting export
                diversification and reducing dependency on oil exports. The import duty adjustment strategy
                has been designed to protect strategic industries while ensuring access to essential inputs
                for local manufacturers.
              </p>
              <p className="mb-4">
                The push for greater integration with the African Continental Free Trade Area (AfCFTA)
                represents a significant opportunity for Nigerian businesses to access new markets across
                the continent. Early data suggests a modest increase in non-oil exports, though significant
                challenges remain in addressing infrastructure and logistics constraints.
              </p>
              <blockquote className="border-l-4 border-brand-gold pl-4 italic text-gray-700 my-4">
                "The strategic approach to trade policy, particularly the selective protection of infant
                industries while pursuing greater African integration, shows promise. However, Nigeria must
                address fundamental competitiveness issues to fully capitalize on trade opportunities."
                <footer className="text-sm mt-2">- Dr. Olusegun Adeyemi, Nigerian Export Promotion Council</footer>
              </blockquote>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EconomicReforms;

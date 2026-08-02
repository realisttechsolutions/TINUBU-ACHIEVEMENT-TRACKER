
import React from "react";
import { 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
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

// Sample data for GDP by sector
const gdpBySectorData = [
  { 
    name: "Q2 2023", 
    agriculture: 23.1, 
    industry: 18.5, 
    services: 58.4 
  },
  { 
    name: "Q3 2023", 
    agriculture: 23.0, 
    industry: 18.2, 
    services: 58.8 
  },
  { 
    name: "Q4 2023", 
    agriculture: 23.5, 
    industry: 18.9, 
    services: 57.6 
  },
  { 
    name: "Q1 2024", 
    agriculture: 24.2, 
    industry: 19.5, 
    services: 56.3 
  },
  { 
    name: "Q2 2024", 
    agriculture: 24.8, 
    industry: 20.1, 
    services: 55.1 
  },
];

// Sample data for exchange rate trends
const exchangeRateData = [
  { name: "May 2023", value: 464 },
  { name: "Jul 2023", value: 755 },
  { name: "Sep 2023", value: 745 },
  { name: "Nov 2023", value: 825 },
  { name: "Jan 2024", value: 895 },
  { name: "Mar 2024", value: 1310 },
  { name: "May 2024", value: 1250 },
];

// Sample data for foreign investment
const foreignInvestmentData = [
  {
    name: "Q2 2023",
    fdi: 0.22,
    portfolio: 0.15,
    other: 0.78
  },
  {
    name: "Q3 2023",
    fdi: 0.28,
    portfolio: 0.31,
    other: 0.85
  },
  {
    name: "Q4 2023",
    fdi: 0.35,
    portfolio: 0.62,
    other: 0.92
  },
  {
    name: "Q1 2024",
    fdi: 0.48,
    portfolio: 0.95,
    other: 1.1
  },
  {
    name: "Q2 2024",
    fdi: 0.72,
    portfolio: 1.25,
    other: 1.45
  },
];

// Policy reforms list
const policyReforms = [
  {
    title: "Fuel Subsidy Removal",
    date: "May 29, 2023",
    description: "Elimination of the fuel subsidy program to redirect funds to more productive sectors and reduce fiscal burden.",
    impact: "Saved approximately ₦4 trillion annually in government expenditure, allowing redirection of funds to critical infrastructure and social programs.",
    source: "Ministry of Finance"
  },
  {
    title: "Exchange Rate Unification",
    date: "June 14, 2023",
    description: "Consolidation of multiple exchange rate windows into a single market-determined exchange rate system.",
    impact: "Enhanced transparency in the foreign exchange market, reduced arbitrage opportunities, and improved foreign investor confidence.",
    source: "Central Bank of Nigeria"
  },
  {
    title: "Tax System Reform",
    date: "August 2023",
    description: "Implementation of comprehensive tax system reforms to improve efficiency and broaden the tax base.",
    impact: "Increased non-oil revenue by 28% and simplified tax compliance procedures for businesses.",
    source: "Federal Inland Revenue Service"
  },
  {
    title: "Import Duty Reform",
    date: "October 2023",
    description: "Adjustment of import duty rates to protect local industries and encourage domestic production.",
    impact: "Improved competitiveness of local manufacturers and stimulated growth in the manufacturing sector.",
    source: "Nigeria Customs Service"
  }
];

const EconomicReforms = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection 
          title="Economic Reforms"
          subtitle="A comprehensive analysis of the transformative economic policies implemented under President Tinubu's administration."
          backgroundImage="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          className="h-[40vh] md:h-[50vh]"
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
              value="$36.2B" 
              description="As of June 2024" 
              trend="up" 
              trendValue="15% increase in 12 months" 
              icon={<DollarSign className="h-6 w-6" />}
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
              title="Exchange Rate (N/USD)" 
              value="₦1,250" 
              description="As of May 2024" 
              trend="down" 
              trendValue="from ₦1,310 in March 2024" 
              icon={<ArrowUpRight className="h-6 w-6" />}
            />
            <MetricCard 
              title="Foreign Investment" 
              value="$3.42B" 
              description="Q2 2024" 
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
              title="Foreign Investment Inflows (Billion USD)" 
              data={foreignInvestmentData}
              dataKeys={[
                { key: "fdi", color: "#2E3192", name: "FDI" },
                { key: "portfolio", color: "#7E69AB", name: "Portfolio Investment" },
                { key: "other", color: "#F7931E", name: "Other Investments" }
              ]}
              yAxisFormatter={(value) => `$${value}B`}
              tooltipFormatter={(value) => `$${value}B`}
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
              {policyReforms.map((policy, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{policy.title}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-500">{policy.date}</span>
                          <span className="bg-brand-light-purple text-brand-purple text-xs font-medium px-2 py-1 rounded">
                            Source: {policy.source}
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

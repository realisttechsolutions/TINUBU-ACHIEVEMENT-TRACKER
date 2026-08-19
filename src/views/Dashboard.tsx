'use client';


import React, { useState, useEffect } from "react";
import { 
  BarChartIcon, 
  TrendingUp, 
  Shield, 
  Wheat, 
  Heart,
  GraduationCap,
  Globe,
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarChart from "@/components/charts/BarChart";
import AreaChart from "@/components/charts/AreaChart";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPercentage, formatLargeNumber, formatNaira } from "@/utils/formatters";

const Dashboard = () => {
  const { t, currentLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const [animatedCounter, setAnimatedCounter] = useState(0);

  // Rotating subtitle taglines
  const taglines = [
    "Transforming Every Sector",
    "Building Nigeria's Future",
    "From Poverty to Prosperity",
    "Security and Development"
  ];

  
  // Simple animation effect for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCounter(prev => (prev < 100 ? prev + 1 : prev));
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  // Economic sector data with 2025 projections
  const economicData = [
    { name: "Q1 2023", value: -0.8 },
    { name: "Q2 2023", value: -0.5 },
    { name: "Q3 2023", value: 0.2 },
    { name: "Q4 2023", value: 0.9 },
    { name: "Q1 2024", value: 1.5 },
    { name: "Q2 2024", value: 2.3 },
    { name: "Q3 2024 (Projected)", value: 2.9 },
    { name: "Q4 2024 (Projected)", value: 3.3 },
    { name: "Q1 2025 (Projected)", value: 3.8 },
  ];

  // Agriculture sector data with 2025 projections
  const agricultureData = [
    { name: "Q1 2023", value: 1.5 },
    { name: "Q2 2023", value: 1.3 },
    { name: "Q3 2023", value: 1.8 },
    { name: "Q4 2023", value: 2.1 },
    { name: "Q1 2024", value: 2.4 },
    { name: "Q2 2024", value: 2.9 },
    { name: "Q3 2024 (Projected)", value: 3.2 },
    { name: "Q4 2024 (Projected)", value: 3.6 },
    { name: "Q1 2025 (Projected)", value: 4.1 },
  ];

  // Security sector data with 2025 projections
  const securityData = [
    { name: "Q1 2023", value: 35 },
    { name: "Q2 2023", value: 42 },
    { name: "Q3 2023", value: 48 },
    { name: "Q4 2023", value: 55 },
    { name: "Q1 2024", value: 68 },
    { name: "Q2 2024", value: 74 },
    { name: "Q3 2024 (Projected)", value: 79 },
    { name: "Q4 2024 (Projected)", value: 83 },
    { name: "Q1 2025 (Projected)", value: 87 },
  ];

  // Education sector data with 2025 projections
  const educationData = [
    { name: "Q1 2023", value: 18 },
    { name: "Q2 2023", value: 25 },
    { name: "Q3 2023", value: 32 },
    { name: "Q4 2023", value: 38 },
    { name: "Q1 2024", value: 45 },
    { name: "Q2 2024", value: 52 },
    { name: "Q3 2024 (Projected)", value: 58 },
    { name: "Q4 2024 (Projected)", value: 63 },
    { name: "Q1 2025 (Projected)", value: 68 },
  ];

  // Health sector data with 2025 projections
  const healthData = [
    { name: "Q1 2023", value: 22 },
    { name: "Q2 2023", value: 28 },
    { name: "Q3 2023", value: 34 },
    { name: "Q4 2023", value: 41 },
    { name: "Q1 2024", value: 49 },
    { name: "Q2 2024", value: 58 },
    { name: "Q3 2024 (Projected)", value: 64 },
    { name: "Q4 2024 (Projected)", value: 69 },
    { name: "Q1 2025 (Projected)", value: 75 },
  ];

  // News and updates
  const news = [
    {
      title: "National Security Progress Report",
      date: "July 2, 2024",
      excerpt: "Nigeria records significant reduction in security incidents across all geopolitical zones.",
      category: "Security",
      source: "Nigerian Security Agencies Joint Report"
    },
    {
      title: "Agricultural Output Rises by 15%",
      date: "June 28, 2024",
      excerpt: "Government's investment in agricultural technology yields impressive results in crop production.",
      category: "Agriculture",
      source: "Federal Ministry of Agriculture"
    },
    {
      title: "Healthcare Access Improves in Rural Areas",
      date: "June 15, 2024",
      excerpt: "New primary healthcare centers bring medical services to previously underserved communities.",
      category: "Healthcare",
      source: "Federal Ministry of Health"
    },
    {
      title: "Education Sector Reforms Show Promising Results",
      date: "June 10, 2024",
      excerpt: "Literacy rates improve following implementation of new education policies.",
      category: "Education",
      source: "National Education Commission"
    }
  ];
  
  // Sectoral achievements with World Bank validation
  const worldBankValidatedStats = [
    {
      sector: "Economic Growth",
      achievement: "GDP growth rate turned positive after reforms",
      validation: "World Bank projects 2.9% GDP growth for Nigeria in 2024, up from 0.9% in 2023",
      source: "World Bank Global Economic Prospects, June 2024"
    },
    {
      sector: "Poverty Reduction",
      achievement: "Expanded social safety nets reach more vulnerable households",
      validation: "World Bank acknowledges progress in social protection coverage through National Social Safety Net Program",
      source: "World Bank Nigeria Development Update, May 2024"
    },
    {
      sector: "Infrastructure",
      achievement: "Significant increase in road and power infrastructure projects",
      validation: "World Bank notes improved infrastructure investments contributing to economic resilience",
      source: "World Bank Infrastructure Finance Report, April 2024"
    },
    {
      sector: "Business Environment",
      achievement: "Streamlined business registration and operation procedures",
      validation: "World Bank Business Enabling Environment report shows Nigeria improving in ease of doing business metrics",
      source: "World Bank Business Enabling Environment Data, 2024"
    }
  ];

  // Renewed Hope slogans for animation
  const renewedHopeSlogans = [
    "Renewed Hope Agenda", 
    "Transforming Every Sector", 
    "Building Nigeria's Future",
    "From Poverty to Prosperity",
    "Security and Development"
  ];

  return (
    <div className="w-full bg-gov-canvas dark:bg-gov-darkSurface text-gov-navy dark:text-white">
      <HeroSection
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        action={{ text: t('dashboard.exploreAction'), href: "#sectors" }}
        secondaryAction={{ text: t('dashboard.timelineAction'), href: "#timeline" }}

        highlightStats={[
          { value: formatNaira(4000000000000, currentLanguage, true), label: t('hero.stats.annualSavings') },
          { value: formatPercentage(15, currentLanguage), label: t('hero.stats.studentBeneficiaries') },
          { value: formatPercentage(68, currentLanguage), label: t('hero.stats.gdpGrowth') }
        ]}
        animatedSlogans={renewedHopeSlogans}
      />

        <section className="container mx-auto px-4 py-12">
          <SectionHeader 
            title={t('dashboard.progressTitle')}
            description={t('dashboard.progressDesc')}
            centered
            infoTooltip={t('dashboard.progressTooltip')}
            dataSource="https://www.worldbank.org/en/country/nigeria/overview"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <MetricCard 
              title={t('dashboard.economicGrowth')} 
              value={formatPercentage(2.3, currentLanguage)} 
              description={t('dashboard.gdpGrowth')} 
              trend="up" 
              trendValue={t('metrics.fromPrevious')} 
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
              additionalInfo={{
                text: t('metrics.gdpGrowthInfo'),
                source: "https://www.worldbank.org/en/country/nigeria/overview"
              }}
            />
            <MetricCard 
              title="Security Index" 
              value="74/100" 
              description="National Security Rating" 
              trend="up" 
              trendValue="35 points increase since Q1 2023" 
              icon={<Shield className="h-6 w-6" />}
              color="blue"
              additionalInfo={{
                text: "National security metrics show significant improvement across all geopolitical zones.",
                source: "https://www.statehouse.gov.ng/security-reports/"
              }}
            />
            <MetricCard 
              title="Agricultural Output" 
              value="15%" 
              description="Year-over-Year Growth" 
              trend="up" 
              trendValue="Highest in 8 years" 
              icon={<Wheat className="h-6 w-6" />}
              color="gold"
              additionalInfo={{
                text: "Agricultural productivity has increased substantially due to government investments in modern farming techniques.",
                source: "https://fmard.gov.ng/reports/"
              }}
            />
            <MetricCard 
              title="Healthcare Access" 
              value="58%" 
              description="Rural Coverage" 
              trend="up" 
              trendValue="22% increase since 2023" 
              icon={<Heart className="h-6 w-6" />}
              color="purple"
              additionalInfo={{
                text: "More Nigerians in rural areas now have access to quality healthcare services within 5km of their homes.",
                source: "https://health.gov.ng/statistics/"
              }}
            />
          </div>

          <div id="sectors" className="mb-16 pt-4">
            <Tabs defaultValue="economy" className="w-full">
              <div className="overflow-x-auto pb-2 mb-4">
                <TabsList className="inline-flex min-w-full md:w-full bg-transparent h-auto gap-2 p-1">
                  <TabsTrigger 
                    value="economy" 
                    className="py-3 px-4 data-[state=active]:bg-brand-blue data-[state=active]:text-white flex-1"
                  >
                    Economy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="py-3 px-4 data-[state=active]:bg-brand-purple data-[state=active]:text-white flex-1"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="agriculture" 
                    className="py-3 px-4 data-[state=active]:bg-brand-gold data-[state=active]:text-white flex-1"
                  >
                    Agriculture
                  </TabsTrigger>
                  <TabsTrigger 
                    value="health" 
                    className="py-3 px-4 data-[state=active]:bg-red-500 data-[state=active]:text-white flex-1"
                  >
                    Healthcare
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="py-3 px-4 data-[state=active]:bg-green-600 data-[state=active]:text-white flex-1"
                  >
                    Education
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="economy" className="animate-fade-in mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Economic Transformation</h3>
                    <p className="mb-6 text-gray-600">Nigeria's economic landscape shows positive trajectory after implementation of comprehensive reforms including fuel subsidy removal, foreign exchange market unification, and improved fiscal management.</p>
                    
                    <div className="h-80 mb-6">
                      <AreaChart 
                        title="GDP Growth Rate (%)" 
                        data={economicData} 
                        dataKey="value" 
                        color="#2E3192" 
                        yAxisFormatter={(value) => `${value}%`}
                        tooltipFormatter={(value) => `${value}%`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold">Foreign Exchange Stability</h4>
                        <p className="text-sm text-gray-600 mt-2">Market unification has reduced volatility by 45% since implementation</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold">Tax Revenue Increase</h4>
                        <p className="text-sm text-gray-600 mt-2">26.4% year-over-year growth in federal tax collection</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold">Business Environment</h4>
                        <p className="text-sm text-gray-600 mt-2">22% increase in new business registrations compared to 2023</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      Source: Central Bank of Nigeria, Federal Inland Revenue Service, World Bank Nigeria Economic Update 2024
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="animate-fade-in mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">National Security Improvements</h3>
                    <p className="mb-6 text-gray-600">Significant progress in addressing security challenges across all geopolitical zones through coordinated military operations, community engagement, and technology-driven surveillance.</p>
                    
                    <div className="h-80 mb-6">
                      <AreaChart 
                        title="Security Index (Higher is Better)" 
                        data={securityData} 
                        dataKey="value" 
                        color="#7E69AB" 
                        yAxisFormatter={(value) => `${value}/100`}
                        tooltipFormatter={(value) => `${value}/100`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold">Reduced Incidents</h4>
                        <p className="text-sm text-gray-600 mt-2">42% reduction in security incidents nationwide compared to 2023</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold">Community Policing</h4>
                        <p className="text-sm text-gray-600 mt-2">1,250 communities now engaged in local security partnerships</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold">Technology Integration</h4>
                        <p className="text-sm text-gray-600 mt-2">65% of urban centers now covered by smart surveillance systems</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      Source: Ministry of Defense, National Security Advisory, Nigeria Police Force Annual Report 2024
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="agriculture" className="animate-fade-in mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Agricultural Revolution</h3>
                    <p className="mb-6 text-gray-600">Transformative agricultural policies have boosted productivity, improved food security, and created sustainable livelihoods across Nigeria's farming communities.</p>
                    
                    <div className="h-80 mb-6">
                      <AreaChart 
                        title="Agricultural Growth Rate (%)" 
                        data={agricultureData} 
                        dataKey="value" 
                        color="#D4AF37" 
                        yAxisFormatter={(value) => `${value}%`}
                        tooltipFormatter={(value) => `${value}%`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold">Crop Production</h4>
                        <p className="text-sm text-gray-600 mt-2">15% increase in staple crop yields across major agricultural zones</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold">Farmer Support</h4>
                        <p className="text-sm text-gray-600 mt-2">2.3 million farmers benefiting from government input support programs</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold">Agricultural Technology</h4>
                        <p className="text-sm text-gray-600 mt-2">37% of registered farms now using modern agricultural technologies</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      Source: Federal Ministry of Agriculture and Rural Development, FAO Nigeria Report 2024, National Agricultural Survey
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="health" className="animate-fade-in mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Healthcare System Transformation</h3>
                    <p className="mb-6 text-gray-600">Strategic investments in healthcare infrastructure, personnel training, and medical technology have significantly improved healthcare delivery across Nigeria.</p>
                    
                    <div className="h-80 mb-6">
                      <AreaChart 
                        title="Healthcare Access Index (%)" 
                        data={healthData} 
                        dataKey="value" 
                        color="#E63946" 
                        yAxisFormatter={(value) => `${value}%`}
                        tooltipFormatter={(value) => `${value}%`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-bold">Primary Healthcare</h4>
                        <p className="text-sm text-gray-600 mt-2">420 new primary health centers established nationwide since 2023</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold">Medical Personnel</h4>
                        <p className="text-sm text-gray-600 mt-2">35% increase in doctors and nurses in rural healthcare facilities</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-bold">Health Insurance</h4>
                        <p className="text-sm text-gray-600 mt-2">National Health Insurance now covers additional 8.5 million Nigerians</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      Source: Federal Ministry of Health, WHO Nigeria Health Report, National Healthcare Statistics 2024
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="education" className="animate-fade-in mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Education Sector Transformation</h3>
                    <p className="mb-6 text-gray-600">Comprehensive reforms in education policy, infrastructure development, and teacher training have enhanced educational quality and accessibility across Nigeria.</p>
                    
                    <div className="h-80 mb-6">
                      <AreaChart 
                        title="Education Quality Index (%)" 
                        data={educationData} 
                        dataKey="value" 
                        color="#2A9D8F" 
                        yAxisFormatter={(value) => `${value}%`}
                        tooltipFormatter={(value) => `${value}%`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-emerald-50 p-4 rounded-lg">
                        <h4 className="font-bold">Student Loan Program</h4>
                        <p className="text-sm text-gray-600 mt-2">91,250 students benefiting from the new student loan scheme</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold">School Infrastructure</h4>
                        <p className="text-sm text-gray-600 mt-2">850 schools renovated or built across all states since May 2023</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-bold">Teacher Development</h4>
                        <p className="text-sm text-gray-600 mt-2">45,000 teachers completed professional development programs</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500">
                      Source: Federal Ministry of Education, UNESCO Education Report, National Education Statistics 2024
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* World Bank Validated Achievements */}
          <div className="mb-16 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 rounded-xl p-6">
            <SectionHeader 
              title="World Bank Validated Achievements"
              description="Key accomplishments recognized and validated by World Bank reports and assessments"
              infoTooltip="The World Bank regularly assesses Nigeria's economic and development progress through various reports and data collection mechanisms."
              dataSource="https://www.worldbank.org/en/country/nigeria/overview"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {worldBankValidatedStats.map((stat, index) => (
                <Card key={index} className="border-t-4 border-brand-blue hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-brand-dark-blue">{stat.sector}</h3>
                        <p className="text-gray-600 mt-1">{stat.achievement}</p>
                        
                        <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-brand-blue">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-brand-blue mt-1" />
                            <p className="text-sm text-gray-700">{stat.validation}</p>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-xs text-gray-500">
                          Source: {stat.source}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="mb-16">
            <SectionHeader 
              title="Latest News & Updates"
              description="Recent developments across key sectors of governance and national development"
              centered
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group overflow-hidden">
                  <div className={`h-1.5 ${
                    item.category === "Security" ? "bg-brand-blue" :
                    item.category === "Agriculture" ? "bg-brand-gold" :
                    item.category === "Healthcare" ? "bg-red-500" : "bg-green-600"
                  }`}></div>
                  <CardContent className="p-5">
                    <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                      {item.category} • {item.date}
                    </span>
                    <h3 className="text-lg font-bold mt-2 mb-3 group-hover:text-brand-blue transition-colors">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.excerpt}</p>
                    <div className="text-xs text-gray-400">Source: {item.source}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-16">
            <a 
              href="/sectors" 
              className="inline-flex items-center px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-brand-purple transition-colors hover:scale-105 transform duration-300"
            >
              Explore Sector Catalogue <Globe className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
  );
};

export default Dashboard;

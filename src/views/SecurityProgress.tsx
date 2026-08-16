'use client';
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeader from "@/components/common/SectionHeader";
import { Shield, Users, MapPin, TrendingDown, BarChart3, CalendarRange, ArrowUpRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import MetricCard from "@/components/dashboard/MetricCard";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/navigation";
import PolicyTimeline from "@/components/dashboard/PolicyTimeline";

const SecurityProgress = () => {
  const securityMetrics = [
    {
      title: "Crime Rate Reduction",
      value: "-15%",
      description: "Overall crime rate reduction since June 2023",
      icon: TrendingDown,
      color: "text-green-600"
    },
    {
      title: "Security Personnel",
      value: "42,500",
      description: "New security personnel deployed nationwide",
      icon: Users,
      color: "text-brand-blue"
    },
    {
      title: "Coverage Areas",
      value: "744",
      description: "Local government areas with enhanced security",
      icon: MapPin,
      color: "text-brand-purple"
    }
  ];

  // Crime rate reduction data for visualization
  const crimeRateData = [
    { name: "Q2 2023", value: 0 },
    { name: "Q3 2023", value: -5.2 },
    { name: "Q4 2023", value: -8.7 },
    { name: "Q1 2024", value: -12.3 },
    { name: "Q2 2024", value: -15 }
  ];

  // Security personnel deployment data
  const securityPersonnelData = [
    { name: "Police", value: 18500 },
    { name: "Military", value: 12000 },
    { name: "Civil Defense", value: 7800 },
    { name: "Intelligence", value: 4200 }
  ];

  // Security improvement by region
  const regionalImprovementData = [
    { name: "North-Central", value: 68 },
    { name: "North-East", value: 62 },
    { name: "North-West", value: 57 },
    { name: "South-East", value: 73 },
    { name: "South-South", value: 65 },
    { name: "South-West", value: 78 }
  ];

  // Policy timeline events
  const policyTimelineEvents = [
    {
      date: "June 2023",
      title: "National Security Strategy Launch",
      description: "Comprehensive security framework focusing on intelligence-led operations and community engagement across all geopolitical zones.",
      category: "Policy",
      impact: "Created unified approach across all security agencies and established clear metrics for tracking progress.",
      source: {
        name: "Office of the National Security Adviser",
        url: "https://onsa.gov.ng"
      }
    },
    {
      date: "August 2023",
      title: "Special Operations Forces Expansion",
      description: "Training and deployment of specialized forces to address specific security challenges in high-risk areas.",
      category: "Operations",
      impact: "Enhanced rapid response capabilities and increased presence in previously vulnerable communities.",
      source: {
        name: "Ministry of Defence",
        url: "https://defence.gov.ng"
      }
    },
    {
      date: "November 2023",
      title: "Community Security Partnership Program",
      description: "Initiative to strengthen collaboration between security forces and local communities through joint intelligence gathering and trust-building exercises.",
      category: "Community Engagement",
      impact: "Increased intelligence tips from civilians by 45% and improved early warning systems.",
      source: {
        name: "Nigeria Police Force",
        url: "https://npf.gov.ng"
      }
    },
    {
      date: "February 2024",
      title: "Advanced Surveillance Technology Deployment",
      description: "Implementation of AI-powered surveillance systems and drones in strategic locations and borders.",
      category: "Technology",
      impact: "Improved border security with 30% increase in interdiction of illegal crossings and contraband.",
      source: {
        name: "Nigerian Customs Service",
        url: "https://customs.gov.ng"
      }
    },
    {
      date: "April 2024",
      title: "Security Infrastructure Modernization",
      description: "Upgrading of command centers, communications equipment, and mobility assets for security agencies.",
      category: "Infrastructure",
      impact: "Reduced response time to security incidents by an average of 18 minutes nationwide.",
      source: {
        name: "Ministry of Interior",
        url: "https://interior.gov.ng"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="relative bg-gradient-to-br from-indigo-900 to-blue-900 text-white py-16">
          <div className="absolute inset-0 opacity-10 bg-[url('/lovable-uploads/0cce3ec5-b800-424c-9c93-8ca7249b5ba2.png')] bg-cover"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">National Security Progress</h1>
              <p className="text-xl opacity-90 mb-6">Comprehensive overview of security initiatives and achievements under the Renewed Hope Agenda</p>
              
              <div className="flex flex-wrap gap-3 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 inline-flex items-center">
                  <Shield className="h-8 w-8 mr-4 text-brand-gold" />
                  <div>
                    <div className="text-sm opacity-80">Progress Assessment</div>
                    <div className="text-2xl font-semibold">63% Complete</div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 inline-flex items-center">
                  <CalendarRange className="h-8 w-8 mr-4 text-brand-gold" />
                  <div>
                    <div className="text-sm opacity-80">Implementation Period</div>
                    <div className="text-2xl font-semibold">2023-2027</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal>
            <SectionHeader
              title="Security Metrics Overview"
              description="Key performance indicators tracking security improvements across Nigeria"
              centered
              infoTooltip="Data sourced from the Office of the National Security Adviser and Federal Ministry of Interior"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {securityMetrics.map((metric, index) => (
              <ScrollReveal
                key={index}
                delay={index * 200}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                        <metric.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{metric.value}</h3>
                        <p className="text-gray-600">{metric.title}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">{metric.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="trends" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="regional">Regional</TabsTrigger>
                  <TabsTrigger value="personnel">Personnel</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="trends" className="mt-6">
                <ScrollReveal>
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Crime Rate Reduction Trend</h3>
                      <p className="text-gray-600 mb-6">
                        Since the implementation of the Renewed Hope security agenda in June 2023, 
                        Nigeria has experienced a steady decline in overall crime rates nationwide.
                      </p>
                      <div className="h-80">
                        <AreaChart
                          title="Crime Rate Reduction (%)"
                          data={crimeRateData}
                          dataKey="value"
                          color="#10b981"
                          yAxisFormatter={(value) => `${value}%`}
                          tooltipFormatter={(value) => `${value}%`}
                          description="Percentage change in crime rates compared to Q2 2023 baseline"
                        />
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-700 mb-1">Armed Robbery</h4>
                          <div className="text-2xl font-bold text-green-800">-21%</div>
                          <p className="text-green-600 text-sm">Highest reduction</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-700 mb-1">Kidnapping</h4>
                          <div className="text-2xl font-bold text-blue-800">-18%</div>
                          <p className="text-blue-600 text-sm">Significant progress</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-700 mb-1">Terrorism</h4>
                          <div className="text-2xl font-bold text-purple-800">-12%</div>
                          <p className="text-purple-600 text-sm">Steady improvement</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </TabsContent>
              
              <TabsContent value="regional" className="mt-6">
                <ScrollReveal>
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Regional Security Improvement</h3>
                      <p className="text-gray-600 mb-6">
                        Security improvement varies across Nigeria's six geopolitical zones, with targeted 
                        interventions based on region-specific challenges.
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-80">
                          <BarChart
                            title="Regional Security Progress"
                            data={regionalImprovementData}
                            dataKeys={[{ key: "value", color: "#7E69AB", name: "Security Score" }]}
                            xAxisKey="name"
                            yAxisFormatter={(value) => `${value}%`}
                            tooltipFormatter={(value) => `${value}%`}
                            description="Security improvement score by region (0-100)"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          {regionalImprovementData.map((region, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{region.name}</h4>
                                <span className="font-bold text-brand-purple">{region.value}%</span>
                              </div>
                              <Progress value={region.value} className="h-2" />
                              <p className="text-sm text-gray-500 mt-2">
                                {region.value >= 70 ? "Excellent progress" : 
                                region.value >= 60 ? "Good progress" : "Moderate progress"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </TabsContent>
              
              <TabsContent value="personnel" className="mt-6">
                <ScrollReveal>
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Security Personnel Deployment</h3>
                      <p className="text-gray-600 mb-6">
                        Distribution of 42,500 newly deployed security personnel across different security agencies.
                      </p>
                      
                      <div className="h-80">
                        <BarChart
                            title="Personnel Deployment"
                            data={securityPersonnelData}
                            dataKeys={[{ key: "value", color: "#2E3192", name: "Personnel" }]}
                            xAxisKey="name"
                            yAxisFormatter={(value) => `${value}`}
                            tooltipFormatter={(value) => `${value.toLocaleString()} personnel`}
                            description="Security personnel distribution by agency"
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-blue">68%</div>
                          <p className="text-sm text-gray-600">Rural Deployment</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-brand-purple">32%</div>
                          <p className="text-sm text-gray-600">Urban Deployment</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">12,750</div>
                          <p className="text-sm text-gray-600">Female Personnel</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">85%</div>
                          <p className="text-sm text-gray-600">Advanced Training</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal>
            <SectionHeader
              title="Security Policy Implementation"
              description="Timeline of major security initiatives and their impact"
            />
          </ScrollReveal>
          
          <div className="mt-8">
            <PolicyTimeline events={policyTimelineEvents} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-brand-light-blue/20 to-gray-50 py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader
                title="Success Stories & Impact"
                description="Real-world examples of security improvements across Nigeria"
                centered
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <ScrollReveal delay={100}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">North-East Stabilization</h3>
                    <p className="text-gray-600 mb-4">
                      Comprehensive security operations have led to a 62% reduction in terrorist activities 
                      in the North-East region, allowing for the safe return of 18,500 displaced persons.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Borno, Yobe, Adamawa</span>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          High Impact
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Safer Highways Initiative</h3>
                    <p className="text-gray-600 mb-4">
                      Strategic deployment of security personnel along major highways has reduced road 
                      banditry by 75%, enabling safe travel and commerce across previously high-risk corridors.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">National Highway Network</span>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          High Impact
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                    <MapPin className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Border Security Enhancement</h3>
                    <p className="text-gray-600 mb-4">
                      Modernized border patrol operations have led to a 58% increase in interdiction of 
                      illegal crossings and trafficking, strengthening national sovereignty and public safety.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">International Borders</span>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Medium Impact
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal>
            <div className="bg-gradient-to-r from-brand-blue to-brand-purple p-8 rounded-2xl text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Ongoing Commitments</h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
                The administration remains committed to further strengthening national security through continued 
                investment in personnel, technology, and community partnerships.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="font-bold text-xl mb-2">₦480 Billion</div>
                  <p className="opacity-90">Security funding for FY 2024</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="font-bold text-xl mb-2">+25,000</div>
                  <p className="opacity-90">Additional personnel by 2025</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="font-bold text-xl mb-2">+35%</div>
                  <p className="opacity-90">Increase in security technology</p>
                </div>
              </div>
              
              <div className="mt-12">
                <Link 
                  to="/data-sources" 
                  className="inline-flex items-center px-6 py-3 bg-white text-brand-purple rounded-lg hover:bg-gray-100 transition-colors"
                >
                  View Detailed Security Data
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityProgress;

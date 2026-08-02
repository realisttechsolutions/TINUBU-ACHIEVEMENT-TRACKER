
import React from "react";
import { 
  HeartPulse, 
  GraduationCap, 
  Home, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  BarChart,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MetricCard from "@/components/dashboard/MetricCard";
import AreaChart from "@/components/charts/AreaChart";
import PolicyTimeline from "@/components/dashboard/PolicyTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  socialServicesStats, 
  programEnrollmentData, 
  healthcareAccessData,
  socialProgramsData,
  testimonials,
  socialTimelineEvents
} from "@/data/socialServicesData";

// Map of icon names to components for dynamic rendering
const iconMap: { [key: string]: React.ElementType } = {
  HeartPulse,
  GraduationCap,
  Home,
  Users,
  ShieldCheck,
  TrendingUp
};

const SocialServices = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ScrollReveal>
          <HeroSection 
            title="Social Services & Protection"
            subtitle="Tracking the implementation and impact of social welfare programs, healthcare initiatives, education support, and other social interventions under President Tinubu's administration."
            action={{ text: "Explore Programs", href: "#programs" }}
            secondaryAction={{ text: "View Impact Data", href: "#impact" }}
            backgroundImage="/lovable-uploads/0cce3ec5-b800-424c-9c93-8ca7249b5ba2.png"
            highlightStats={socialServicesStats}
          />
        </ScrollReveal>

        <section id="overview" className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Social Services Implementation Progress"
                description="Key performance indicators tracking the reach and effectiveness of social programs"
                centered
                infoTooltip="Data sourced from Federal Ministry of Humanitarian Affairs, Ministry of Health, and other government agencies"
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <ScrollReveal delay={200}>
                <MetricCard 
                  title="Cash Transfer Coverage" 
                  value="5.4M" 
                  description="Households reached" 
                  trend="up" 
                  trendValue="+28% from 2023" 
                  icon={<Users className="h-6 w-6" />}
                  color="purple"
                  additionalInfo={{
                    text: "Direct cash support to vulnerable households across all 36 states and FCT.",
                    source: "Ministry of Humanitarian Affairs"
                  }}
                />
              </ScrollReveal>
              
              <ScrollReveal delay={400}>
                <MetricCard 
                  title="Student Loan Beneficiaries" 
                  value="91,250" 
                  description="Since program launch" 
                  trend="up" 
                  trendValue="+100% since Q3 2023" 
                  icon={<GraduationCap className="h-6 w-6" />}
                  color="blue"
                  additionalInfo={{
                    text: "Students supported through the Access to Higher Education Act program.",
                    source: "Federal Ministry of Education"
                  }}
                />
              </ScrollReveal>
              
              <ScrollReveal delay={600}>
                <MetricCard 
                  title="Healthcare Access" 
                  value="52%" 
                  description="Population coverage" 
                  trend="up" 
                  trendValue="+14% from 2022" 
                  icon={<HeartPulse className="h-6 w-6" />}
                  color="green"
                  additionalInfo={{
                    text: "Percentage of population with access to essential healthcare services.",
                    source: "Federal Ministry of Health"
                  }}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>
        
        <section id="timeline" className="scroll-mt-24 py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Social Services Implementation Timeline"
                description="Key milestones in the rollout of major social welfare programs"
                centered
              />
            </ScrollReveal>
            
            <div className="mt-8">
              <PolicyTimeline events={socialTimelineEvents} />
            </div>
          </div>
        </section>
        
        <section id="impact" className="scroll-mt-24 py-16 bg-gradient-to-br from-gray-50 to-brand-light-blue/20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Impact Metrics"
                description="Measuring the real-world impact of social service programs across Nigeria"
                centered
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <ScrollReveal direction="left">
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-6">Social Investment Program Enrollment</h3>
                    <p className="text-gray-600 mb-4">
                      Quarterly growth in households enrolled in social investment programs, showing
                      steady expansion of coverage across Nigeria.
                    </p>
                    <div className="h-80">
                      <AreaChart 
                        title="Households Enrolled (Millions)" 
                        data={programEnrollmentData} 
                        dataKey="value" 
                        color="#7E69AB"
                        yAxisFormatter={(value) => `${value}M`}
                        tooltipFormatter={(value) => `${value}M households`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-brand-purple">93%</div>
                        <div className="text-xs text-gray-600">Target Achievement</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-brand-blue">+19%</div>
                        <div className="text-xs text-gray-600">Annual Growth</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">6.7M</div>
                        <div className="text-xs text-gray-600">End-2024 Target</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              <ScrollReveal direction="right">
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-6">Healthcare Access Coverage</h3>
                    <p className="text-gray-600 mb-4">
                      Percentage of population with access to essential healthcare services,
                      showing consistent improvement through targeted interventions.
                    </p>
                    <div className="h-80">
                      <AreaChart 
                        title="Population Coverage (%)" 
                        data={healthcareAccessData} 
                        dataKey="value" 
                        color="#2E3192"
                        yAxisFormatter={(value) => `${value}%`}
                        tooltipFormatter={(value) => `${value}%`}
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-brand-blue">+14%</div>
                        <div className="text-xs text-gray-600">Annual Growth</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">345</div>
                        <div className="text-xs text-gray-600">New Health Centers</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">60%</div>
                        <div className="text-xs text-gray-600">End-2024 Target</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
            
            <div className="mt-16">
              <ScrollReveal>
                <SectionHeader 
                  title="Impact Stories"
                  description="Real experiences from beneficiaries of social service programs"
                />
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {testimonials.map((testimonial, index) => (
                  <ScrollReveal key={index} delay={index * 200}>
                    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                      <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-gold"></div>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{testimonial.name}</h3>
                              <p className="text-gray-600 text-sm">{testimonial.location}</p>
                            </div>
                            <div className="bg-brand-purple/10 px-3 py-1 rounded-full">
                              <span className="text-xs font-medium text-brand-purple">{testimonial.program}</span>
                            </div>
                          </div>
                        </div>
                        
                        <blockquote className="text-gray-700 italic mb-4">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="bg-gray-50 p-3 rounded-md mt-auto">
                          <div className="text-sm font-medium text-gray-700">Impact:</div>
                          <div className="text-sm text-gray-600">{testimonial.impact}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section id="programs" className="scroll-mt-24 py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Social Service Programs"
                description="Comprehensive overview of key social welfare and protection initiatives"
                centered
              />
            </ScrollReveal>
            
            <Tabs defaultValue="all" className="mt-8">
              <div className="flex justify-center">
                <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="housing">Housing</TabsTrigger>
                  <TabsTrigger value="safety">Safety Nets</TabsTrigger>
                  <TabsTrigger value="youth">Youth</TabsTrigger>
                  <TabsTrigger value="protection">Protection</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {socialProgramsData.map((program, index) => {
                    const Icon = iconMap[program.icon];
                    return (
                      <ScrollReveal key={index} delay={index * 150}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                          <div className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-gold h-1"></div>
                          <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                              <div className="bg-brand-blue/10 p-3 rounded-lg">
                                <Icon className="h-6 w-6 text-brand-blue" />
                              </div>
                              <h3 className="text-xl font-bold ml-3">{program.title}</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-5">{program.description}</p>
                            
                            <div className="grid grid-cols-3 gap-2 text-center mb-5">
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-lg font-bold text-brand-blue">{program.beneficiaries}</div>
                                <div className="text-xs text-gray-500">Beneficiaries</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-lg font-bold text-brand-purple">{program.budget}</div>
                                <div className="text-xs text-gray-500">Budget</div>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-md">
                                <div className="text-lg font-bold text-brand-gold">{program.progress}%</div>
                                <div className="text-xs text-gray-500">Progress</div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2 text-gray-700">Key Initiatives:</div>
                              <ul className="space-y-2 text-sm text-gray-600">
                                {program.keyPrograms.map((initiative, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></span>
                                    {initiative}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              className="w-full mt-2 text-brand-blue hover:text-brand-purple hover:bg-brand-blue/5"
                              asChild
                            >
                              <Link to="/data-sources" className="flex items-center justify-center">
                                View Program Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </TabsContent>
              
              {/* Filtered views for each category */}
              {["healthcare", "education", "housing", "safety", "youth", "protection"].map((category, idx) => {
                // Map category to icon name for filtering
                const categoryToIcon: {[key: string]: string} = {
                  healthcare: "HeartPulse",
                  education: "GraduationCap",
                  housing: "Home",
                  safety: "Users",
                  youth: "TrendingUp",
                  protection: "ShieldCheck"
                };
                
                const filteredPrograms = socialProgramsData.filter(
                  program => program.icon === categoryToIcon[category]
                );
                
                return (
                  <TabsContent key={idx} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                      {filteredPrograms.map((program, index) => {
                        const Icon = iconMap[program.icon];
                        return (
                          <ScrollReveal key={index}>
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                              <div className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-gold h-1"></div>
                              <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                  <div className="bg-brand-blue/10 p-3 rounded-lg">
                                    <Icon className="h-6 w-6 text-brand-blue" />
                                  </div>
                                  <h3 className="text-xl font-bold ml-3">{program.title}</h3>
                                </div>
                                
                                <p className="text-gray-600 mb-5">{program.description}</p>
                                
                                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-lg font-bold text-brand-blue">{program.beneficiaries}</div>
                                    <div className="text-xs text-gray-500">Beneficiaries</div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-lg font-bold text-brand-purple">{program.budget}</div>
                                    <div className="text-xs text-gray-500">Budget</div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-lg font-bold text-brand-gold">{program.progress}%</div>
                                    <div className="text-xs text-gray-500">Progress</div>
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <div className="text-sm font-medium mb-2 text-gray-700">Key Initiatives:</div>
                                  <ul className="space-y-2 text-sm text-gray-600">
                                    {program.keyPrograms.map((initiative, idx) => (
                                      <li key={idx} className="flex items-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></span>
                                        {initiative}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  className="w-full mt-2 text-brand-blue hover:text-brand-purple hover:bg-brand-blue/5"
                                  asChild
                                >
                                  <Link to="/data-sources" className="flex items-center justify-center">
                                    View Program Details
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>
        
        <section className="bg-gradient-to-br from-brand-blue/95 to-brand-purple/95 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold mb-4">Supporting Nigeria's Most Vulnerable</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-10">
                The administration is committed to expanding social services to reach
                20 million Nigerians by 2027, focusing on sustainable poverty reduction.
              </p>
              
              <Link 
                to="/data-sources" 
                className="inline-flex items-center px-6 py-3 bg-white text-brand-purple rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Data Sources
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SocialServices;

'use client';
import React from "react";
import { 
  Building2, 
  Train, 
  Plug, 
  Wifi, 
  Anchor, 
  Droplet, 
  TrendingUp,
  BarChart3,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import MetricCard from "@/components/dashboard/MetricCard";

const infrastructureStats = [
  { value: "₦20T+", label: "Infrastructure Fund Size" },
  { value: "247", label: "Active Projects" },
  { value: "32", label: "States Covered" }
];

const sectorData = [
  {
    title: "Road Infrastructure",
    icon: Building2,
    description: "Federal highways, expressways, and municipal road networks being constructed and rehabilitated across Nigeria.",
    projects: 87,
    budget: "₦6.2 trillion",
    completion: 42,
    keyProjects: [
      "Lagos-Calabar Coastal Highway - 700km",
      "Reconstruction of Abuja-Kaduna-Kano Expressway",
      "Second Niger Bridge Project",
      "Rehabilitation of Enugu-Port Harcourt Expressway"
    ]
  },
  {
    title: "Power & Energy",
    icon: Plug,
    description: "Generation, transmission, and distribution projects to boost Nigeria's power capacity and reliability.",
    projects: 63,
    budget: "₦4.8 trillion",
    completion: 38,
    keyProjects: [
      "Zungeru Hydroelectric Power Project - 700MW",
      "Mambilla Hydroelectric Power Project - 3,050MW",
      "Solar Power Mini-Grids in Rural Areas",
      "National Metering Program"
    ]
  },
  {
    title: "Rail Transport",
    icon: Train,
    description: "Modern railway lines to connect Nigeria's major economic centers and facilitate movement of goods and people.",
    projects: 28,
    budget: "₦3.9 trillion",
    completion: 44,
    keyProjects: [
      "Lagos-Ibadan Standard Gauge Railway",
      "Kaduna-Kano Standard Gauge Railway",
      "Port Harcourt-Maiduguri Narrow Gauge Rehabilitation",
      "Abuja Light Rail Phase 2"
    ]
  },
  {
    title: "Digital Infrastructure",
    icon: Wifi,
    description: "National broadband and telecommunications infrastructure to boost digital inclusion and tech innovation.",
    projects: 24,
    budget: "₦1.2 trillion",
    completion: 36,
    keyProjects: [
      "National Fiber Optic Network Expansion",
      "Rural Broadband Initiative",
      "Digital Innovation Hubs in 6 Geopolitical Zones",
      "e-Government Infrastructure Development"
    ]
  },
  {
    title: "Maritime & Ports",
    icon: Anchor,
    description: "Port expansion, dredging, and modernization projects to boost Nigeria's import-export capacity.",
    projects: 19,
    budget: "₦2.8 trillion",
    completion: 28,
    keyProjects: [
      "Lekki Deep Sea Port Development",
      "Badagry Deep Sea Port Project",
      "Calabar Port Dredging",
      "Eastern Ports Modernization"
    ]
  },
  {
    title: "Water Resources",
    icon: Droplet,
    description: "Dams, water treatment plants, and irrigation projects to improve water supply and agricultural productivity.",
    projects: 26,
    budget: "₦1.4 trillion",
    completion: 32,
    keyProjects: [
      "Completion of Kashimbila Multipurpose Dam",
      "Water Supply Projects in 15 States",
      "Irrigation Development in Northern States",
      "Flood Control Infrastructure"
    ]
  }
];

const timelineEvents = [
  {
    year: 2023,
    quarter: "Q3",
    event: "Launch of Renewed Hope Infrastructure Fund",
    details: "Establishment of ₦20 trillion fund for critical infrastructure"
  },
  {
    year: 2023,
    quarter: "Q4",
    event: "Lagos-Calabar Coastal Highway Commencement",
    details: "Groundbreaking for 700km coastal highway project"
  },
  {
    year: 2024,
    quarter: "Q1",
    event: "National Rural Roads Development Program",
    details: "Initiative to construct 500km of rural roads across 36 states"
  },
  {
    year: 2024,
    quarter: "Q2",
    event: "Digital Infrastructure Expansion",
    details: "Rollout of broadband infrastructure to 25 underserved states"
  },
  {
    year: 2024,
    quarter: "Q3 (Expected)",
    event: "Railway Modernization Phase 2",
    details: "Contract awards for additional standard gauge railway lines"
  },
];

const Infrastructure = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <ScrollReveal>
          <HeroSection 
            title="Infrastructure Development"
            subtitle="Tracking the progress of Nigeria's infrastructure projects across transportation, power, water, and digital sectors under President Tinubu's administration."
            action={{ text: "Explore Projects", href: "#sectors" }}
            secondaryAction={{ text: "View Progress Metrics", href: "#progress" }}
            backgroundImage="/lovable-uploads/0cce3ec5-b800-424c-9c93-8ca7249b5ba2.png"
            highlightStats={infrastructureStats}
          />
        </ScrollReveal>

        <section id="progress" className="scroll-mt-24 py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Infrastructure Progress Metrics"
                description="Key performance indicators tracking Nigeria's infrastructure development across critical sectors"
                centered
                infoTooltip="Data sourced from Federal Ministry of Works, Ministry of Power, and other government agencies"
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <ScrollReveal delay={200}>
                <MetricCard 
                  title="Road Construction" 
                  value="2,450 km" 
                  description="Under construction" 
                  trend="up" 
                  trendValue="+35% from 2023" 
                  icon={<Building2 className="h-6 w-6" />}
                  color="blue"
                  additionalInfo={{
                    text: "Includes ongoing federal highways, expressways, and municipal road projects nationwide.",
                    source: "Federal Ministry of Works"
                  }}
                />
              </ScrollReveal>
              
              <ScrollReveal delay={400}>
                <MetricCard 
                  title="Power Generation" 
                  value="5,300 MW" 
                  description="Current capacity" 
                  trend="up" 
                  trendValue="+15% from 2023" 
                  icon={<Plug className="h-6 w-6" />}
                  color="green"
                  additionalInfo={{
                    text: "Current power generation capacity with targets to reach 10,000 MW by 2025.",
                    source: "Ministry of Power"
                  }}
                />
              </ScrollReveal>
              
              <ScrollReveal delay={600}>
                <MetricCard 
                  title="Digital Access" 
                  value="45%" 
                  description="Broadband penetration" 
                  trend="up" 
                  trendValue="+12% from 2022" 
                  icon={<Wifi className="h-6 w-6" />}
                  color="purple"
                  additionalInfo={{
                    text: "Broadband access has expanded significantly with the National Digital Economy Policy implementation.",
                    source: "Nigerian Communications Commission"
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
                title="Infrastructure Development Timeline"
                description="Key milestones in Nigeria's infrastructure development journey under the Renewed Hope Agenda"
                centered
              />
            </ScrollReveal>
            
            <div className="max-w-4xl mx-auto mt-12">
              <div className="relative">
                {/* Timeline central line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-blue via-brand-purple to-brand-gold"></div>
                
                {/* Timeline events */}
                {timelineEvents.map((event, index) => (
                  <ScrollReveal 
                    key={index} 
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 200}
                  >
                    <div className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                        <h3 className="text-xl font-bold text-brand-dark-blue">{event.event}</h3>
                        <p className="text-gray-600 mt-1">{event.details}</p>
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-center w-2/12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-brand-blue to-brand-purple flex items-center justify-center shadow-lg">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      <div className={`w-5/12 ${index % 2 === 0 ? 'text-left pl-8' : 'text-right pr-8'}`}>
                        <div className="flex items-center font-semibold text-brand-purple">
                          {index % 2 !== 0 && <BarChart3 className="h-4 w-4 mr-2" />}
                          <span>{event.year} {event.quarter}</span>
                          {index % 2 === 0 && <BarChart3 className="h-4 w-4 ml-2" />}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        <section id="sectors" className="scroll-mt-24 py-16 bg-gradient-to-br from-gray-50 to-brand-light-purple/10">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Infrastructure Sectors"
                description="Comprehensive overview of infrastructure development across key sectors"
                centered
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {sectorData.map((sector, index) => {
                const Icon = sector.icon;
                return (
                  <ScrollReveal key={index} delay={index * 150}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-gold h-1"></div>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="bg-brand-blue/10 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-brand-blue" />
                          </div>
                          <h3 className="text-xl font-bold ml-3">{sector.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-5">{sector.description}</p>
                        
                        <div className="grid grid-cols-3 gap-2 text-center mb-5">
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-xl font-bold text-brand-blue">{sector.projects}</div>
                            <div className="text-xs text-gray-500">Projects</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-xl font-bold text-brand-purple">{sector.budget}</div>
                            <div className="text-xs text-gray-500">Budget</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <div className="text-xl font-bold text-brand-gold">{sector.completion}%</div>
                            <div className="text-xs text-gray-500">Completion</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2 text-gray-700">Key Projects:</div>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {sector.keyProjects.map((project, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></span>
                                {project}
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
                            View Detailed Projects
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Infrastructure;

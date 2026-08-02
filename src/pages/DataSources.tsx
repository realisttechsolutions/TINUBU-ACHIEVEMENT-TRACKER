
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/hero-section";
import SectionHeader from "@/components/common/SectionHeader";
import DataSource from "@/components/common/DataSource";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { governmentSources, newsSources, academicSources } from "@/data/appData";
import { Shield, FileCheck, LineChart, Database, BookOpen, ChartBar, BarChart } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DataSources = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection 
          title="Data Sources & Methodology"
          subtitle="Transparency is our foundation. Explore the sources behind our data and analyses."
          backgroundImage="/lovable-uploads/0cce3ec5-b800-424c-9c93-8ca7249b5ba2.png"
          className="h-[40vh] md:h-[50vh]"
        />
        
        <section className="container mx-auto px-4 py-12">
          <ScrollReveal>
            <SectionHeader 
              title="Our Approach to Data"
              description="We are committed to providing accurate, verifiable data from reliable sources. All information presented on this platform is sourced from official government statistics, reputable news organizations, and respected academic institutions."
            />
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <div className="p-6 bg-gradient-to-br from-brand-light-purple/70 to-brand-light-purple/20 rounded-lg mb-12">
              <h3 className="text-xl font-bold text-brand-purple mb-4">Data Integrity Principles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-brand-blue/10 p-3 rounded-full mr-3">
                      <Shield className="h-5 w-5 text-brand-blue" />
                    </div>
                    <h4 className="font-semibold text-brand-blue">Rigorous Verification</h4>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-blue mr-2"></div>
                      Multiple source cross-checking
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-blue mr-2"></div>
                      Data point validation
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-blue mr-2"></div>
                      Regular updates and revisions
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-brand-purple/10 p-3 rounded-full mr-3">
                      <FileCheck className="h-5 w-5 text-brand-purple" />
                    </div>
                    <h4 className="font-semibold text-brand-purple">Transparent Documentation</h4>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                      Clear citation of all sources
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                      Detailed methodology notes
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                      Data limitations disclosure
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="bg-brand-gold/10 p-3 rounded-full mr-3">
                      <LineChart className="h-5 w-5 text-brand-gold" />
                    </div>
                    <h4 className="font-semibold text-brand-gold">Balanced Presentation</h4>
                  </div>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-gold mr-2"></div>
                      Contextual information included
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-gold mr-2"></div>
                      Both achievements and challenges
                    </li>
                    <li className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-gold mr-2"></div>
                      Comparative data when available
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mb-12">
            <ScrollReveal>
              <SectionHeader 
                title="Our Data Partners"
                description="We collaborate with trusted institutions to ensure accurate and comprehensive data"
                centered
              />
            </ScrollReveal>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Database className="h-8 w-8 text-brand-blue" />
                </div>
                <p className="mt-2 font-medium text-sm">National Bureau of Statistics</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-green-50 p-3 rounded-full">
                  <BarChart className="h-8 w-8 text-green-600" />
                </div>
                <p className="mt-2 font-medium text-sm">World Bank Group</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-50 p-3 rounded-full">
                  <ChartBar className="h-8 w-8 text-brand-purple" />
                </div>
                <p className="mt-2 font-medium text-sm">IMF</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-amber-50 p-3 rounded-full">
                  <BookOpen className="h-8 w-8 text-amber-600" />
                </div>
                <p className="mt-2 font-medium text-sm">Central Bank of Nigeria</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="government" className="space-y-8">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 gap-4 h-auto">
              <TabsTrigger value="government" className="py-3">Government Sources</TabsTrigger>
              <TabsTrigger value="news" className="py-3">News & Media</TabsTrigger>
              <TabsTrigger value="academic" className="py-3">Research & Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="government" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50/50 to-transparent">
                <CardContent className="p-6">
                  <p className="text-gray-700">
                    Official government sources provide authoritative data on economic indicators, policy implementation, and outcomes. 
                    We regularly access and analyze reports, databases, and public records from the following institutions:
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {governmentSources.map((source, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <DataSource 
                      name={source.name}
                      type={source.type}
                      url={source.url}
                      description={source.description}
                      verificationStatus={source.verificationStatus}
                      lastUpdated={source.lastUpdated}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="news" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50/50 to-transparent">
                <CardContent className="p-6">
                  <p className="text-gray-700">
                    Reputable news organizations provide timely reporting, expert commentary, and diverse perspectives on policy implementation. 
                    We monitor and verify information from the following trusted news sources:
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {newsSources.map((source, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <DataSource 
                      name={source.name}
                      type={source.type}
                      url={source.url}
                      description={source.description}
                      verificationStatus={source.verificationStatus}
                      lastUpdated={source.lastUpdated}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="academic" className="space-y-6">
              <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50/50 to-transparent">
                <CardContent className="p-6">
                  <p className="text-gray-700">
                    Academic institutions, think tanks, and international organizations provide in-depth research and analysis 
                    on Nigeria's economic policies and their impacts. We incorporate insights from the following research sources:
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {academicSources.map((source, index) => (
                  <ScrollReveal key={index} delay={index * 100}>
                    <DataSource 
                      name={source.name}
                      type={source.type}
                      url={source.url}
                      description={source.description}
                      verificationStatus={source.verificationStatus}
                      lastUpdated={source.lastUpdated}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
        
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeader 
                title="Data Visualization Methodology"
                description="Our approach to presenting complex economic data in accessible ways"
                centered
              />
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <ScrollReveal delay={100} direction="up">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-brand-blue to-brand-purple"></div>
                  <CardContent className="p-6">
                    <div className="h-16 w-16 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">1</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark-blue">Data Collection</h3>
                    <p className="text-gray-700">
                      We gather data from primary sources, ensuring all figures are accurate, timely, and properly attributed. 
                      When conflicting data exists, we note discrepancies and explain our methodology for reconciliation.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              <ScrollReveal delay={200} direction="up">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-brand-purple to-brand-gold"></div>
                  <CardContent className="p-6">
                    <div className="h-16 w-16 bg-brand-purple rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">2</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark-blue">Analysis & Context</h3>
                    <p className="text-gray-700">
                      Raw data is analyzed to identify trends, correlations, and potential causative relationships. 
                      We provide essential context, including historical comparisons and relevant global benchmarks.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              <ScrollReveal delay={300} direction="up">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-brand-gold to-brand-blue"></div>
                  <CardContent className="p-6">
                    <div className="h-16 w-16 bg-brand-gold rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">3</div>
                    <h3 className="text-xl font-bold mb-3 text-brand-dark-blue">Visualization</h3>
                    <p className="text-gray-700">
                      We transform complex datasets into clear, accessible visualizations that highlight key trends and insights. 
                      All charts and graphs are designed to be accurate, unbiased, and accessible to diverse audiences.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <SectionHeader 
                title="Request Additional Data"
                centered
              />
            </ScrollReveal>
            
            <p className="text-gray-700 mb-8">
              We are committed to transparency and continuous improvement. If you would like to suggest additional data sources 
              or request specific information not currently included on our platform, please fill out the form below.
            </p>
            
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    />
                  </div>
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Request</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                    placeholder="Please describe the data or information you'd like to see included on our platform..."
                  />
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suggested Source (if any)</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-purple hover:to-brand-blue text-white font-medium py-3 px-8 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataSources;

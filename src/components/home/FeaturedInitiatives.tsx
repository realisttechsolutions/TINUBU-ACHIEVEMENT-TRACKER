
import React from 'react';
import { BarChartIcon, ChevronRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SectionHeader from '@/components/common/SectionHeader';
import { Link } from "@/lib/navigation";
import { featuredInitiatives } from '@/data/statistics';

const FeaturedInitiatives = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-brand-light-purple/30 py-20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader 
            title="Flagship Initiatives"
            description="Transformative programs designed to address Nigeria's most pressing challenges and create sustainable economic growth"
            centered
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {featuredInitiatives.map((initiative, index) => (
            <ScrollReveal key={index} delay={index * 150} direction={index % 2 === 0 ? 'left' : 'right'}>
              <Card className="border hover:shadow-lg transition-all duration-300 hover:scale-102 group overflow-hidden h-full bg-white/80 backdrop-blur-sm">
                <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-gold"></div>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase text-brand-purple tracking-wider bg-brand-light-purple/30 px-2 py-1 rounded-full">
                      {initiative.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-brand-blue transition-colors">
                      {initiative.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{initiative.description}</p>
                    
                    {initiative.highlights && initiative.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-brand-dark-blue mb-2">Key Achievements:</h4>
                        <ul className="space-y-1.5">
                          {initiative.highlights.slice(0, 3).map((highlight, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex items-center text-sm">
                      <BarChartIcon className="h-4 w-4 text-brand-gold mr-2 flex-shrink-0" />
                      <span className="font-medium">{initiative.stats}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Source: {initiative.source}</div>
                  </div>
                  
                  <Link 
                    to={initiative.link} 
                    className="flex items-center text-brand-blue hover:text-brand-purple font-medium transition-colors group-hover:translate-x-2 duration-300"
                  >
                    Learn more <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInitiatives;

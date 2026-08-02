
import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SectionHeader from '@/components/common/SectionHeader';
import { worldBankStats } from '@/data/statistics';

const EconomicOutlook = () => {
  return (
    <div className="mb-16 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 rounded-xl p-6">
      <ScrollReveal>
        <SectionHeader 
          title="Economic Outlook & Global Benchmarks"
          description="Key statistical indicators as referenced by World Bank and International Monetary Fund reports"
          infoTooltip="These projections and indicators are based on World Bank and IMF economic analysis and reports on Nigeria's economic outlook."
          dataSource="https://www.worldbank.org/en/country/nigeria/overview"
        />
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {worldBankStats.map((stat, index) => (
          <ScrollReveal key={index} delay={index * 200} direction={index % 2 === 0 ? 'left' : 'right'}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 group border-t-4 border-brand-blue">
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-dark-blue group-hover:text-brand-blue transition-colors">
                  {stat.title}
                </h3>
                <div className="flex justify-between items-end mt-3">
                  <div>
                    <div className="text-xl md:text-2xl font-bold font-display">{stat.current}</div>
                    <div className="text-sm text-gray-500">Current</div>
                  </div>
                  <div className="flex items-center text-amber-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <div>
                      <div className="text-sm font-semibold">{stat.target}</div>
                      <div className="text-xs">{stat.timeline}</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">{stat.description}</p>
                <div className="mt-3 text-xs text-gray-400 flex items-center">
                  <span>Source: {stat.source}</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default EconomicOutlook;

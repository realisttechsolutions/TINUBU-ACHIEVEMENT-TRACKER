
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/scroll-reveal';
import SectionHeader from '@/components/common/SectionHeader';
import { energyMetrics } from '@/data/statistics';

const EnergyTransitionMetrics = () => {
  return (
    <section className="bg-gradient-to-r from-slate-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader 
            title="Energy Transition Progress"
            description="Tracking Nigeria's journey towards sustainable energy and reduced carbon emissions"
            centered
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <ScrollReveal direction="left">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Power Generation</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Current: {energyMetrics.powerGeneration.current}</span>
                    <span className="text-sm font-medium">Target: {energyMetrics.powerGeneration.target2030}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${energyMetrics.powerGeneration.percentComplete}%` }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {energyMetrics.powerGeneration.percentComplete}% towards 2030 target
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>2025 Milestone:</span>
                    <span className="font-medium">{energyMetrics.powerGeneration.target2025}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Projects in Progress:</span>
                    <span className="font-medium">42</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/infrastructure" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    View power infrastructure projects <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">Renewable Energy</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Current: {energyMetrics.renewableShare.current}</span>
                    <span className="text-sm font-medium">Target: {energyMetrics.renewableShare.target2030}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${energyMetrics.renewableShare.percentComplete}%` }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {energyMetrics.renewableShare.percentComplete}% towards 2030 target
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>2025 Milestone:</span>
                    <span className="font-medium">{energyMetrics.renewableShare.target2025}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Solar Projects:</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/infrastructure" className="text-green-600 hover:text-green-800 text-sm flex items-center">
                    View renewable energy projects <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal direction="right">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-2"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4">CNG Vehicles</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Current: {energyMetrics.cngVehicles.current}</span>
                    <span className="text-sm font-medium">Target: {energyMetrics.cngVehicles.target2030}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${energyMetrics.cngVehicles.percentComplete}%` }}></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {energyMetrics.cngVehicles.percentComplete}% towards 2030 target
                  </div>
                </div>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>2025 Milestone:</span>
                    <span className="font-medium">{energyMetrics.cngVehicles.target2025}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Centers:</span>
                    <span className="font-medium">35</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link to="/infrastructure" className="text-amber-600 hover:text-amber-800 text-sm flex items-center">
                    View CNG initiative details <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/infrastructure" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Explore All Energy Projects <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EnergyTransitionMetrics;

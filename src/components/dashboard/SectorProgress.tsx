
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface SectorData {
  name: string;
  progress: number;
  description: string;
  keyAchievements?: string[];
  challenges?: string[];
  source?: string;
}

interface SectorProgressProps {
  sectors: SectorData[];
  className?: string;
}

const SectorProgress = ({ sectors, className }: SectorProgressProps) => {
  // Function to determine progress color based on value
  const getProgressColor = (value: number) => {
    if (value >= 70) return "bg-green-500";
    if (value >= 50) return "bg-brand-gold";
    return "bg-brand-blue";
  };

  return (
    <Card className={cn("border border-border hover:shadow-md transition-all", className)}>
      <CardHeader className="pb-2 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5">
        <CardTitle className="text-xl font-display">Sector Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {sectors.map((sector, index) => (
            <div 
              key={index} 
              className="group hover:bg-gray-50 p-3 -mx-2 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium group-hover:text-brand-blue transition-colors">{sector.name}</span>
                      <span className="text-sm font-semibold bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-brand-blue/10 transition-colors">
                        {sector.progress}%
                      </span>
                    </div>
                    <Progress 
                      value={sector.progress} 
                      className={cn(
                        "h-2 transition-all group-hover:h-3", 
                        getProgressColor(sector.progress)
                      )} 
                    />
                    <p className="mt-2 text-xs text-gray-500 leading-relaxed">{sector.description}</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4 shadow-lg border-t-2 border-t-brand-blue animate-fade-in">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-brand-blue">{sector.name} Details</h4>
                    
                    {sector.keyAchievements && sector.keyAchievements.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Key Achievements:</h5>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                          {sector.keyAchievements.map((achievement, idx) => (
                            <li key={idx} className="leading-relaxed">{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {sector.challenges && sector.challenges.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Challenges:</h5>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                          {sector.challenges.map((challenge, idx) => (
                            <li key={idx} className="leading-relaxed">{challenge}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {sector.source && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-100">
                        Source: <a href={sector.source} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{sector.source}</a>
                      </p>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorProgress;

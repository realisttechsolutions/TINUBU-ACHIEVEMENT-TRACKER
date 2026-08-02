
import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { InfoIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  infoTooltip?: string;
  dataSource?: string;
}

const SectionHeader = ({
  title,
  description,
  centered = false,
  className,
  infoTooltip,
  dataSource,
}: SectionHeaderProps) => {
  return (
    <div 
      className={cn(
        "mb-8 animate-fade-in",
        centered && "text-center",
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brand-dark-blue mb-2 relative group">
          <span className="relative inline-block">
            {/* Enhanced decorative element behind title */}
            <span className="absolute -left-2 -top-2 w-12 h-12 bg-brand-gold/10 rounded-full blur-xl -z-10 group-hover:bg-brand-gold/20 transition-all duration-500"></span>
            <span className="absolute -right-2 -bottom-2 w-16 h-16 bg-brand-purple/10 rounded-full blur-xl -z-10 group-hover:bg-brand-purple/20 transition-all duration-700"></span>
            
            {title}
            
            {/* After element for hover animation */}
            <span className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-brand-purple via-brand-gold to-brand-blue group-hover:w-full transition-all duration-500 rounded-full"></span>
          </span>
          
          {infoTooltip && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="inline-flex ml-2 items-center justify-center align-middle">
                  <InfoIcon className="h-4 w-4 text-brand-blue/70 hover:text-brand-blue transition-colors" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 shadow-lg border-brand-blue/10 animate-fade-in">
                <div className="text-sm text-left">
                  <p>{infoTooltip}</p>
                  {dataSource && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Source: <a href={dataSource} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{dataSource}</a>
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </h2>
      </div>
      
      {centered ? (
        <div className="flex justify-center">
          <Separator className="w-24 bg-gradient-to-r from-brand-purple via-brand-gold to-brand-blue h-1.5 my-4 rounded-full transition-all duration-500 group-hover:w-32 hover:shadow-lg hover:w-36 hover:h-2" />
        </div>
      ) : (
        <Separator className="w-24 bg-gradient-to-r from-brand-purple via-brand-gold to-brand-blue h-1.5 my-4 rounded-full transition-all duration-500 hover:w-32 hover:shadow-lg hover:h-2" />
      )}
      
      {description && (
        <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

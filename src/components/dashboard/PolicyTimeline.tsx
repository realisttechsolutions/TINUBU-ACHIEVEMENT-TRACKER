
import React, { useState } from "react";
import { ExternalLink, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ui/scroll-reveal";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

interface TimelineEventSource {
  name: string;
  url: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  category: string;
  impact?: string;
  source?: TimelineEventSource;
}

interface PolicyTimelineProps {
  events: TimelineEvent[];
}

const PolicyTimeline = ({ events }: PolicyTimelineProps) => {
  // Track open state for each event
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(current => 
      current.includes(index) 
        ? current.filter(item => item !== index)
        : [...current, index]
    );
  };

  const isItemOpen = (index: number) => openItems.includes(index);

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="space-y-6">
        {sortedEvents.map((event, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <Collapsible 
              className="w-full group"
              open={isItemOpen(index)}
              onOpenChange={() => toggleItem(index)}
            >
              <div className="relative">
                {/* Timeline connector line */}
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/50 to-transparent"></div>
                
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "p-4 rounded-lg transition-all duration-300 cursor-pointer",
                    "border border-transparent hover:border-gray-200",
                    "hover:bg-gray-50 group",
                    isItemOpen(index) && "bg-gray-50 border-gray-200"
                  )}>
                    <div className="flex items-start gap-4">
                      {/* Date marker */}
                      <div className="flex items-center mt-1.5">
                        <div className={cn(
                          "h-3 w-3 rounded-full bg-brand-blue shrink-0",
                          "transition-all duration-300",
                          isItemOpen(index) && "scale-125"
                        )}></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-500 flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 inline" />
                              {event.date}
                            </div>
                            <h3 className={cn(
                              "font-semibold text-lg transition-colors",
                              isItemOpen(index) ? "text-brand-blue" : "text-brand-purple group-hover:text-brand-blue"
                            )}>
                              {event.title}
                            </h3>
                          </div>
                          <div className="transition-transform duration-300">
                            {isItemOpen(index) ? (
                              <ChevronUp className="h-5 w-5 text-brand-blue" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-brand-blue group-hover:-translate-y-0.5" />
                            )}
                          </div>
                        </div>
                        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 mt-1">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="animate-accordion-down">
                  <div className="ml-10 pl-4 pr-4 pb-4">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {event.description}
                      </p>
                      
                      {event.impact && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2">Expected Impact</h4>
                          <p className="text-gray-700 bg-brand-blue/5 p-3 rounded-md border-l-4 border-brand-blue">
                            {event.impact}
                          </p>
                        </div>
                      )}
                      
                      {event.source && (
                        <div className="pt-3 border-t text-sm text-gray-500 flex items-center justify-between">
                          <div>Source: {event.source.name}</div>
                          <a 
                            href={event.source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-brand-blue hover:text-brand-purple flex items-center group"
                          >
                            <span>View Source</span> 
                            <ExternalLink className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

export default PolicyTimeline;

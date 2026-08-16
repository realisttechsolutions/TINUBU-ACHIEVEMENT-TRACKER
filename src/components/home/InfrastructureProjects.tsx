
import React from "react";
import { Building2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/scroll-reveal";
import SectionHeader from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/navigation";

const InfrastructureProjects = () => {
  const projects = [
    {
      name: "Lagos-Calabar Coastal Highway",
      progress: 32,
      description: "A 700km coastal highway connecting Lagos to Calabar",
      location: "Lagos, Cross River",
      value: "₦6.5T",
      completion: "2027",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2940&auto=format&fit=crop"
    },
    {
      name: "Second Niger Bridge",
      progress: 95,
      description: "Connecting Asaba and Onitsha across River Niger",
      location: "Delta, Anambra",
      value: "₦336B",
      completion: "2024",
      image: "https://images.unsplash.com/photo-1545421536-78e2aba6d614?q=80&w=2787&auto=format&fit=crop"
    },
    {
      name: "Ajaokuta-Kaduna-Kano Gas Pipeline",
      progress: 67,
      description: "614km natural gas pipeline from South to North Nigeria",
      location: "Multiple States",
      value: "₦2.8T",
      completion: "2025",
      image: "https://images.unsplash.com/photo-1471513671800-b09c87e1497c?q=80&w=2940&auto=format&fit=crop"
    },
    {
      name: "Mambilla Hydroelectric Power Project",
      progress: 15,
      description: "3,050MW hydroelectric power plant in Taraba State",
      location: "Taraba",
      value: "₦5.8T",
      completion: "2030",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2940&auto=format&fit=crop"
    }
  ];

  // Function to determine color based on progress percentage
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "text-green-500";
    if (progress >= 50) return "text-brand-gold";
    return "text-brand-blue";
  };

  // Function to format progress text with appropriate color
  const getProgressText = (progress: number) => {
    const className = cn(
      "font-bold",
      progress >= 75 ? "text-green-500" : 
      progress >= 50 ? "text-brand-gold" : "text-brand-blue"
    );
    
    return <span className={className}>{progress}%</span>;
  };

  return (
    <section className="bg-gradient-to-r from-slate-50 to-blue-50/30 py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <SectionHeader
            title="Major Infrastructure Projects"
            description="Key national infrastructure initiatives currently under implementation across Nigeria"
            centered
            infoTooltip="Data sourced from Federal Ministry of Works and Housing, Ministry of Transportation, and other relevant agencies."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {projects.map((project, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 group">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white text-lg truncate pr-2">{project.name}</h3>
                      
                      {/* Circular progress indicator */}
                      <div className="relative w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          {/* Background circle */}
                          <circle 
                            cx="18" cy="18" r="15" 
                            fill="none" 
                            strokeWidth="3"
                            className="opacity-30 stroke-white" 
                          />
                          
                          {/* Progress circle - stroke-dasharray is the circumference of the circle */}
                          <circle 
                            cx="18" cy="18" r="15" 
                            fill="none" 
                            strokeWidth="3"
                            className={cn(
                              "stroke-current transition-all duration-700 ease-out", 
                              project.progress >= 75 ? "text-green-500" : 
                              project.progress >= 50 ? "text-brand-gold" : "text-brand-blue"
                            )} 
                            strokeDasharray="94.2"
                            strokeDashoffset={94.2 - (project.progress / 100) * 94.2}
                            strokeLinecap="round"
                          />
                          
                          {/* Percentage text */}
                          <text 
                            x="18" y="20" 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            className="text-xs font-bold fill-white"
                          >
                            {project.progress}%
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-gray-600 text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Value</p>
                      <p className="font-medium">{project.value}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completion</p>
                      <p className="font-medium">{project.completion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className={cn(
                        "font-medium",
                        project.progress >= 75 ? "text-green-600" : 
                        project.progress >= 50 ? "text-amber-600" : 
                        "text-blue-600"
                      )}>
                        {project.progress >= 75 ? "Near completion" : 
                         project.progress >= 50 ? "In progress" : 
                         "Early stage"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link 
            to="/infrastructure" 
            className="inline-flex items-center px-6 py-3 bg-brand-blue/90 text-white rounded-md hover:bg-brand-blue transition-colors"
          >
            View All Projects <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureProjects;

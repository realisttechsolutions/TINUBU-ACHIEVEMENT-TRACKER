import React from "react";
import { ExternalLink, Check, Calendar, Info, AlertCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface DataSourceProps {
  name: string;
  type: "government" | "news" | "academic" | "other";
  url: string;
  description: string;
  verificationStatus?: "verified" | "pending" | "unverified";
  lastUpdated?: string;
  className?: string;
}

const DataSource = ({ 
  name, 
  type, 
  url, 
  description, 
  verificationStatus = "verified", 
  lastUpdated,
  className 
}: DataSourceProps) => {
  const getTypeStyle = () => {
    switch (type) {
      case "government":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700";
      case "news":
        return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700";
      case "academic":
        return "bg-gradient-to-r from-green-50 to-green-100 text-green-700";
      default:
        return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center text-green-600 text-xs">
                <Check className="h-3.5 w-3.5 mr-1" />
                <span>Verified</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white shadow-lg border rounded-md">
              <div className="text-sm">
                <p className="font-medium mb-1">Verified Data Source</p>
                <p className="text-gray-600">This source has been verified for accuracy and consistency with all data presented across the platform.</p>
                {lastUpdated && (
                  <p className="text-xs text-gray-500 mt-2">Last verified: {lastUpdated}</p>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      case "pending":
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center text-amber-600 text-xs">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span>Verification Pending</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white shadow-lg border rounded-md">
              <div className="text-sm">
                <p className="font-medium mb-1">Verification In Progress</p>
                <p className="text-gray-600">This source is currently being reviewed for accuracy and consistency. Data from this source should be cross-verified with other sources.</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      case "unverified":
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center text-red-600 text-xs">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                <span>Not Verified</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-white shadow-lg border rounded-md">
              <div className="text-sm">
                <p className="font-medium mb-1">Unverified Data Source</p>
                <p className="text-gray-600">This source has not been fully verified. Information should be used cautiously and cross-referenced with verified sources.</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "transform transition-all duration-300 hover:scale-102 overflow-hidden border-t-4", 
      type === "government" ? "border-t-brand-blue shadow-blue-100" : 
      type === "news" ? "border-t-brand-gold shadow-amber-100" : 
      type === "academic" ? "border-t-green-600 shadow-green-100" : "border-t-gray-400 shadow-gray-100",
      "hover:shadow-lg",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-grow">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg text-brand-dark-blue">{name}</h3>
                {getVerificationBadge()}
              </div>
              <Badge variant="outline" className={`${getTypeStyle()} mb-3 inline-flex items-center`}>
                <Shield className="h-3 w-3 mr-1" />
                {getTypeLabel()}
              </Badge>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              {lastUpdated && (
                <div className="flex items-center text-gray-500 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Updated: {lastUpdated}</span>
                </div>
              )}
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-brand-blue hover:text-brand-purple font-medium transition-colors group"
            >
              Visit Source 
              <ExternalLink className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSource;

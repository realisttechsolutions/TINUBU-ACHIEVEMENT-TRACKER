import React from "react";
import { Navigate } from "@/lib/navigation";

interface LegacySectorRedirectProps {
  targetSlug: string;
}

export const LegacySectorRedirect: React.FC<LegacySectorRedirectProps> = ({ targetSlug }) => {
  return <Navigate to={`/sectors/${targetSlug}`} replace />;
};

export default LegacySectorRedirect;

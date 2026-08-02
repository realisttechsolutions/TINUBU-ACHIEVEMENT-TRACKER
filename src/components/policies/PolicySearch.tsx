import React from "react";
import { Search } from "lucide-react";

interface PolicySearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export const PolicySearch: React.FC<PolicySearchProps> = ({
  query,
  onQueryChange,
  placeholder = "Search policy titles, legal gazettes, laws, or agencies..."
}) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gov-slate" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-gov-navy/40 border border-gov-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-emerald text-gov-navy dark:text-white"
      />
    </div>
  );
};

export default PolicySearch;

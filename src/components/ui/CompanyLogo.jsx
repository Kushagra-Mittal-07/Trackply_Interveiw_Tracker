import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Mapped domains for popular companies to retrieve high-resolution favicons
const domainMap = {
  stripe: "stripe.com",
  google: "google.com",
  figma: "figma.com",
  notion: "notion.so",
  vercel: "vercel.com",
  meta: "meta.com",
  airbnb: "airbnb.com",
  slack: "slack.com",
  apple: "apple.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  netflix: "netflix.com",
  openai: "openai.com",
};

/**
 * CompanyLogo Component
 * Renders the corporate favicon logo using Google's Favicon service.
 * Automatically falls back to a styled letter-initial circle if the image fails to load.
 * 
 * Props:
 * - company: name of the company (string)
 * - className: optional wrapper styles (string)
 */
export default function CompanyLogo({ company = "", className }) {
  const [hasError, setHasError] = useState(false);
  const cleanName = company.trim().toLowerCase();
  
  // Resolve domain name
  const domain = domainMap[cleanName] || `${cleanName.replace(/[^a-z0-9]/g, "")}.com`;
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // Reset error state if the company name changes
  useEffect(() => {
    setHasError(false);
  }, [company]);

  // Generate color palette based on first character code for beautiful fallbacks
  const getInitialsColor = (name) => {
    const charCode = name.charCodeAt(0) || 0;
    const colors = [
      "bg-red-950/40 text-red-400 border border-red-900/30",
      "bg-blue-950/40 text-blue-400 border border-blue-900/30",
      "bg-green-950/40 text-green-400 border border-green-900/30",
      "bg-yellow-950/40 text-yellow-400 border border-yellow-900/30",
      "bg-purple-950/40 text-purple-400 border border-purple-900/30",
      "bg-pink-950/40 text-pink-400 border border-pink-900/30",
      "bg-teal-950/40 text-teal-400 border border-teal-900/30",
    ];
    return colors[charCode % colors.length];
  };

  const firstLetter = company.trim().charAt(0).toUpperCase() || "?";

  if (hasError || !company) {
    return (
      <div
        className={cn(
          "w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 select-none",
          getInitialsColor(company || "A"),
          className
        )}
      >
        {firstLetter}
      </div>
    );
  }

  return (
    <div className={cn("w-6 h-6 rounded overflow-hidden bg-zinc-800 border border-border flex items-center justify-center shrink-0 select-none", className)}>
      <img
        src={logoUrl}
        alt={`${company} Logo`}
        onError={() => setHasError(true)}
        className="w-4 h-4 object-contain"
      />
    </div>
  );
}

// Utility to resolve homepages dynamically
export function getCompanyHomepageUrl(companyName = "") {
  const cleanName = companyName.trim().toLowerCase();
  const domain = domainMap[cleanName] || `${cleanName.replace(/[^a-z0-9]/g, "")}.com`;
  return `https://${domain}`;
}

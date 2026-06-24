import React from "react";
import { cn } from "@/lib/utils";

/**
 * StatusBadge Component - Dark Theme
 * Displays a color-coded pill badge corresponding to the job application status.
 * Optimized for dark mode with rich, slightly darkened, desaturated colors that maintain high legibility.
 * 
 * Props:
 * - status: The status string ('Applied', 'Screening', 'OA', 'Interview', 'Offer', 'Rejected')
 * - className: Optional additional CSS classes (string)
 */
export default function StatusBadge({ status, className }) {
  // Define status style mappings optimized for dark backgrounds
  const statusStyles = {
    Applied: {
      bg: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
      label: "Applied",
    },
    Screening: {
      bg: "bg-purple-950/40 text-purple-300 border-purple-800/30",
      label: "Screening",
    },
    OA: {
      bg: "bg-amber-950/40 text-amber-300 border-amber-800/30",
      label: "OA",
    },
    Interview: {
      bg: "bg-blue-950/40 text-blue-300 border-blue-800/30",
      label: "Interview",
    },
    Offer: {
      bg: "bg-green-950/40 text-green-300 border-green-800/30",
      label: "Offer",
    },
    Rejected: {
      bg: "bg-red-950/40 text-red-355 text-red-300 border-red-800/30",
      label: "Rejected",
    },
  };

  // Safe fallback if an unexpected status is passed
  const currentStyle = statusStyles[status] || {
    bg: "bg-zinc-800 text-zinc-400 border-zinc-700",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border select-none shrink-0",
        currentStyle.bg,
        className
      )}
    >
      {currentStyle.label}
    </span>
  );
}

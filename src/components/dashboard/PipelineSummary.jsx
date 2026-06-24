import React from "react";
import { FolderKanban, Activity, CalendarDays, Award, XCircle } from "lucide-react";

/**
 * PipelineSummary Component - Dark Theme
 * Renders the pipeline summary stats at the top of the dashboard.
 * Calculates counters dynamically and formats them for the dark aesthetic.
 * 
 * Props:
 * - applications: array of application objects
 */
export default function PipelineSummary({ applications = [] }) {
  // 1. Total: count of all applications
  const totalCount = applications.length;

  // 2. Active: count of applications in progress (Applied, Screening, OA, Interview)
  const activeCount = applications.filter(
    (app) => ["Applied", "Screening", "OA", "Interview"].includes(app.status)
  ).length;

  // 3. Interviews: count of applications currently at 'Interview' stage
  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  // 4. Offers: count of applications at 'Offer' stage (successful applications)
  const offerCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  // 5. Rejected: count of applications at 'Rejected' stage
  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  // Configuration for each stat card to render dynamically
  const stats = [
    {
      label: "Total Applications",
      count: totalCount,
      icon: FolderKanban,
      colorClass: "text-zinc-400 bg-zinc-900/30 border-l-zinc-500",
    },
    {
      label: "Active Pipeline",
      count: activeCount,
      icon: Activity,
      colorClass: "text-primary bg-primary/5 border-l-primary",
    },
    {
      label: "Interviews Scheduled",
      count: interviewCount,
      icon: CalendarDays,
      colorClass: "text-blue-400 bg-blue-950/15 border-l-blue-500",
    },
    {
      label: "Offers Received",
      count: offerCount,
      icon: Award,
      colorClass: "text-green-400 bg-green-950/15 border-l-green-500",
    },
    {
      label: "Rejections",
      count: rejectedCount,
      icon: XCircle,
      colorClass: "text-red-400 bg-red-950/15 border-l-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 select-none">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`bg-card border border-border rounded-lg p-4 flex flex-col justify-between transition-all hover:border-zinc-700 border-l-4 ${stat.colorClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon size={16} className="text-zinc-500 shrink-0" />
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">
                {stat.count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

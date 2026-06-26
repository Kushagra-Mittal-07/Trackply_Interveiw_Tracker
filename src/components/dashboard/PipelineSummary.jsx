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
export default function PipelineSummary({
  applications = [],
  selectedStatus = "All",
  setSelectedStatus,
}) {
  // 1. Total: count of all applications
  const totalCount = applications.length;

  // 2. Active: count of applications in progress (Applied, OA)
  const activeCount = applications.filter(
    (app) => ["Applied", "OA"].includes(app.status)
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
      id: "All",
      label: "Total Applications",
      count: totalCount,
      icon: FolderKanban,
      colorClass: "text-zinc-400 bg-zinc-900/30 border-l-zinc-500",
      activeClass: "text-foreground bg-zinc-800/80 border-l-zinc-400 border-zinc-700",
    },
    {
      id: "Active",
      label: "In Progress",
      count: activeCount,
      icon: Activity,
      colorClass: "text-primary bg-primary/5 border-l-primary",
      activeClass: "text-primary bg-primary/20 border-l-primary border-primary/30",
    },
    {
      id: "Interview",
      label: "Interviews",
      count: interviewCount,
      icon: CalendarDays,
      colorClass: "text-blue-400 bg-blue-950/15 border-l-blue-500",
      activeClass: "text-blue-400 bg-blue-950/40 border-l-blue-400 border-blue-800/40",
    },
    {
      id: "Offer",
      label: "Offers",
      count: offerCount,
      icon: Award,
      colorClass: "text-green-400 bg-green-950/15 border-l-green-500",
      activeClass: "text-green-400 bg-green-950/40 border-l-green-400 border-green-800/40",
    },
    {
      id: "Rejected",
      label: "Rejected",
      count: rejectedCount,
      icon: XCircle,
      colorClass: "text-red-400 bg-red-950/15 border-l-red-500",
      activeClass: "text-red-400 bg-red-950/40 border-l-red-400 border-red-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 select-none">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const isActive = selectedStatus === stat.id;
        return (
          <button
            key={idx}
            onClick={() => setSelectedStatus && setSelectedStatus(stat.id)}
            className={`text-left border rounded-lg p-4 flex flex-col justify-between transition-all border-l-4 ${
              isActive
                ? `${stat.activeClass} scale-[1.02] shadow-[0_0_12px_rgba(0,0,0,0.3)]`
                : `${stat.colorClass} border-border hover:border-zinc-700 opacity-60 hover:opacity-100`
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <Icon size={16} className={`${isActive ? "text-foreground" : "text-zinc-500"} shrink-0`} />
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="text-2xl font-bold text-foreground">
                {stat.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

import React from "react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { PlusCircle, Edit3, Trash2, Clock, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * RecentActivities Component - Dark Theme
 * Renders a scrollable vertical timeline of all CRUD activities.
 * Shows relative timestamps using date-fns and category-specific styling.
 * 
 * Props:
 * - activities: array of activity log items (array)
 * - onClearLog: callback to clear all logs (function)
 */
export default function RecentActivities({ activities = [], onClearLog }) {
  // Helper to format timestamps dynamically
  const formatTime = (timeString) => {
    if (!timeString) return "Just now";
    try {
      const date = parseISO(timeString);
      if (isValid(date)) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return timeString;
    } catch (e) {
      return "Some time ago";
    }
  };

  // Helper to resolve styling properties based on activity type
  const getActivityMeta = (type) => {
    switch (type) {
      case "CREATE":
        return {
          icon: PlusCircle,
          iconClass: "text-green-400 bg-green-950/30 border border-green-800/40",
          title: "Application Added",
        };
      case "UPDATE":
        return {
          icon: Edit3,
          iconClass: "text-blue-400 bg-blue-950/30 border border-blue-800/40",
          title: "Application Updated",
        };
      case "DELETE":
        return {
          icon: Trash2,
          iconClass: "text-red-400 bg-red-950/30 border border-red-800/40",
          title: "Application Deleted",
        };
      default:
        return {
          icon: Clock,
          iconClass: "text-zinc-400 bg-zinc-900/30 border border-zinc-700/40",
          title: "System Log",
        };
    }
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Header action section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground leading-tight">
            Recent Activities
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Timeline of recent changes and logs inside your tracking workspace.
          </p>
        </div>

        {activities.length > 0 && (
          <Button
            onClick={onClearLog}
            variant="outline"
            className="border-border text-red-400 hover:text-red-300 hover:bg-red-950/20 flex items-center gap-1.5 h-9 text-xs font-semibold uppercase tracking-wider"
          >
            <Trash size={14} />
            <span>Clear Log</span>
          </Button>
        )}
      </div>

      {activities.length === 0 ? (
        /* Empty State */
        <div className="border border-border rounded-lg p-12 text-center bg-card/20">
          <Clock className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No activities</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Activities will automatically appear here as you manage applications.
          </p>
        </div>
      ) : (
        /* Timeline container */
        <div className="border border-border rounded-lg bg-card p-6 overflow-hidden">
          <div className="relative border-l border-border pl-6 ml-3 space-y-6">
            {activities.map((act) => {
              const meta = getActivityMeta(act.type);
              const Icon = meta.icon;

              return (
                <div key={act.id} className="relative group animate-in slide-in-from-left-2 duration-150">
                  {/* Timeline icon indicator */}
                  <span className={`absolute -left-[37px] top-0 rounded-lg p-1.5 shrink-0 ${meta.iconClass}`}>
                    <Icon size={14} />
                  </span>

                  {/* Log Content Card */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <span className="text-xs font-bold text-foreground">
                        {meta.title} — {act.company} ({act.role})
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground/60 select-none">
                        {formatTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {act.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar, Link as LinkIcon, Edit2, AlertCircle } from "lucide-react";
import CompanyLogo, { getCompanyCareersUrl } from "../ui/CompanyLogo";

// Helper to determine deadline color classes based on three-color scheme
const getDeadlineStatus = (deadlineDateStr) => {
  if (!deadlineDateStr) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50",
      cardBorder: "border-border hover:border-zinc-700/60"
    };
  }
  try {
    const deadlineDate = new Date(deadlineDateStr);
    if (isNaN(deadlineDate.getTime())) {
      return {
        textClass: "text-muted-foreground/70",
        iconClass: "text-muted-foreground/50",
        cardBorder: "border-border hover:border-zinc-700/60"
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 10) {
      return {
        textClass: "text-red-400 font-semibold",
        iconClass: "text-red-400",
        cardBorder: "border-red-950/40 hover:border-red-900/60"
      };
    } else if (diffDays <= 30) {
      return {
        textClass: "text-amber-400 font-semibold",
        iconClass: "text-amber-400",
        cardBorder: "border-amber-950/40 hover:border-amber-900/60"
      };
    } else {
      return {
        textClass: "text-emerald-400 font-medium",
        iconClass: "text-emerald-400",
        cardBorder: "border-emerald-950/40 hover:border-emerald-900/60"
      };
    }
  } catch (e) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50",
      cardBorder: "border-border hover:border-zinc-700/60"
    };
  }
};

const COLUMNS = [
  { id: "Applied", label: "Applied", accentClass: "border-t-[3px] border-t-purple-500/80", dotClass: "bg-purple-500" },
  { id: "OA", label: "OA", accentClass: "border-t-[3px] border-t-amber-500/80", dotClass: "bg-amber-500" },
  { id: "Interview", label: "Interview", accentClass: "border-t-[3px] border-t-blue-500/80", dotClass: "bg-blue-500" },
  { id: "Offer", label: "Offer", accentClass: "border-t-[3px] border-t-green-500/80", dotClass: "bg-green-500" },
  { id: "Rejected", label: "Rejected", accentClass: "border-t-[3px] border-t-red-500/80", dotClass: "bg-red-500" },
];

/**
 * ApplicationCards Component - Dark Theme Kanban Board
 * Renders pipeline stages as vertical columns.
 * Implements HTML5 Drag and Drop for updates.
 */
export default function ApplicationCards({
  applications = [],
  onEditClick,
  onCompanyClick,
  onStatusChange,
}) {
  const [draggedOverCol, setDraggedOverCol] = useState(null);
  const [isDraggingId, setIsDraggingId] = useState(null);

  // Format dates helper using date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString;
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, id) => {
    setIsDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDraggingId(null);
    setDraggedOverCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (draggedOverCol !== colId) {
      setDraggedOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverCol(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || isDraggingId;
    setDraggedOverCol(null);
    setIsDraggingId(null);
    if (id && onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  // Helper to filter applications belonging to a status
  const getColApps = (colId) => {
    return applications.filter((app) => app.status === colId);
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start select-none min-h-[580px] min-w-[1100px] md:min-w-0">
        {COLUMNS.map((col) => {
          const colApps = getColApps(col.id);
          const isOver = draggedOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-card/40 border rounded-xl flex flex-col min-h-[550px] transition-all duration-200 ${
                isOver
                  ? "border-primary/80 bg-primary/5 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(108,71,255,0.06)] scale-[1.01]"
                  : "border-border/50 bg-card/25"
              } ${col.accentClass}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-border/40 flex items-center justify-between bg-card/50 rounded-t-xl select-none">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                  <span className="text-[11px] font-bold text-foreground/90 uppercase tracking-wider truncate max-w-[145px]" title={col.label}>
                    {col.id}
                  </span>
                </div>
                <span className="text-[10px] bg-secondary/80 border border-border/50 text-muted-foreground px-2 py-0.5 rounded-full font-bold select-none">
                  {colApps.length}
                </span>
              </div>

              {/* Column Body - Drop area containing cards */}
              <div className="p-2.5 flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[500px]">
                {colApps.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 border border-dashed border-border/30 rounded-lg text-center bg-card/5 select-none">
                    <span className="text-[10px] text-muted-foreground/30 font-semibold uppercase tracking-wider">Drop here</span>
                  </div>
                ) : (
                  colApps.map((app) => {
                    const dlStatus = getDeadlineStatus(app.deadline);
                    const isDragging = isDraggingId === app.id;

                    return (
                      <div
                        key={app.id}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onEditClick && onEditClick(app)}
                        className={`bg-card border rounded-lg p-3 flex flex-col gap-2.5 hover:bg-accent/15 transition-all duration-200 cursor-grab active:cursor-grabbing select-none relative group ${
                          isDragging ? "opacity-30 border-dashed border-primary" : dlStatus.cardBorder
                        }`}
                      >
                        {/* Top Row: Logo + Company + Role */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                onCompanyClick && onCompanyClick(app);
                              }}
                              className="cursor-pointer shrink-0"
                              title={`View Details for ${app.company}`}
                            >
                              <CompanyLogo company={app.company} className="w-8 h-8 rounded-md" />
                            </div>
                            <div className="min-w-0 leading-tight">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCompanyClick && onCompanyClick(app);
                                }}
                                className="font-bold text-foreground text-xs hover:text-primary transition-colors truncate block max-w-[120px]"
                                title={app.company}
                              >
                                {app.company}
                              </span>
                              <span className="text-[10px] text-muted-foreground/80 font-medium truncate block max-w-[120px]">
                                {app.role}
                              </span>
                            </div>
                          </div>

                          {/* Link Icon */}
                          <a
                            href={getCompanyCareersUrl(app.company)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground/35 hover:text-primary transition-colors p-1 bg-secondary/35 rounded self-start"
                            title="View Careers Site"
                          >
                            <LinkIcon size={11} />
                          </a>
                        </div>

                        {/* Notes snippet */}
                        {app.notes && (
                          <p className="text-[10px] text-muted-foreground/50 line-clamp-2 italic bg-secondary/15 rounded p-1.5 leading-normal select-none">
                            "{app.notes}"
                          </p>
                        )}

                        {/* Footer details */}
                        <div className="flex flex-col gap-1 pt-1.5 border-t border-border/30">
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                            <span>Deadline:</span>
                            <div className={`flex items-center gap-1 font-medium ${dlStatus.textClass}`}>
                              <Calendar size={11} className={dlStatus.iconClass} />
                              <span>{formatDate(app.deadline)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                            <span>Applied:</span>
                            <span className="font-medium text-muted-foreground/80">
                              {formatDate(app.dateApplied)}
                            </span>
                          </div>
                        </div>

                        {/* Edit Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick && onEditClick(app);
                          }}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-primary transition-all p-1 rounded bg-zinc-800/40 hover:bg-zinc-800 shrink-0 select-none"
                          title="Edit Application"
                        >
                          <Edit2 size={11} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

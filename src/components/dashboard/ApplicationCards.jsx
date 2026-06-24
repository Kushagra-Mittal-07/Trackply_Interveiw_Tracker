import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar, Link as LinkIcon, Edit2, AlertCircle } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import CompanyLogo, { getCompanyHomepageUrl } from "../ui/CompanyLogo";

/**
 * ApplicationCards Component - Dark Theme
 * Renders a list of job applications as clean, premium horizontal card rows.
 * Provides a responsive grid/stack layout that serves as an alternative to the Table view.
 * 
 * Props:
 * - applications: array of application objects
 * - onEditClick: callback triggered when a card is clicked to edit (function)
 */
export default function ApplicationCards({ applications = [], onEditClick }) {
  // Format dates helper using date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString;
  };

  // Sort applications by deadline (closest first)
  const sortedApplications = [...applications].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  if (sortedApplications.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center bg-card/20 select-none">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">No applications</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          No job applications match the selected status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 select-none animate-in fade-in duration-200">
      {sortedApplications.map((app) => (
        <div
          key={app.id}
          onClick={() => onEditClick && onEditClick(app)}
          className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-700 hover:bg-accent/15 transition-all cursor-pointer group"
        >
          {/* Left Section: Logo, Company Name, Role, Badge */}
          <div className="flex items-start gap-3">
            <a
              href={getCompanyHomepageUrl(app.company)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent card edit click trigger
              title={`Visit ${app.company} Homepage`}
              className="mt-0.5"
            >
              <CompanyLogo company={app.company} className="w-9 h-9" />
            </a>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <a
                  href={getCompanyHomepageUrl(app.company)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-foreground text-sm hover:text-primary transition-colors leading-tight"
                  title={`Visit ${app.company} Homepage`}
                >
                  {app.company}
                </a>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground/40 hover:text-primary transition-colors"
                    title="View Job Description URL"
                  >
                    <LinkIcon size={12} />
                  </a>
                )}
                <StatusBadge status={app.status} className="ml-1.5 py-0 px-1.5 text-[10px]" />
              </div>

              <p className="text-xs text-muted-foreground font-medium">
                {app.role}
              </p>
              
              {app.notes && (
                <p className="text-[11px] text-muted-foreground/60 line-clamp-1 max-w-xl italic mt-1 leading-normal">
                  "{app.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Deadlines, Dates & Edit Button */}
          <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t border-border/40 md:border-t-0">
            {/* Timeline details */}
            <div className="flex gap-4 sm:gap-6 text-xs text-muted-foreground select-none">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/50 block">
                  Deadline
                </span>
                <div className="flex items-center gap-1.5 text-foreground/90 font-medium">
                  <Calendar size={13} className="text-muted-foreground/60" />
                  <span>{formatDate(app.deadline)}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground/50 block">
                  Applied On
                </span>
                <span className="font-medium text-muted-foreground/80 block pt-0.5">
                  {formatDate(app.dateApplied)}
                </span>
              </div>
            </div>

            {/* Actions button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick && onEditClick(app);
              }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-primary transition-all p-1.5 rounded bg-zinc-800/40 hover:bg-zinc-800 shrink-0 inline-flex"
              title="Edit Application"
            >
              <Edit2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

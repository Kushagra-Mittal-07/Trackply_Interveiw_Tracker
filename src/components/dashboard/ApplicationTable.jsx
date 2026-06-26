import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar, Link as LinkIcon, Edit2, AlertCircle } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import CompanyLogo, { getCompanyCareersUrl } from "../ui/CompanyLogo";

// Helper to determine deadline color classes
const getDeadlineStatus = (deadlineDateStr) => {
  if (!deadlineDateStr) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50"
    };
  }
  try {
    const deadlineDate = new Date(deadlineDateStr);
    if (isNaN(deadlineDate.getTime())) {
      return {
        textClass: "text-muted-foreground/70",
        iconClass: "text-muted-foreground/50"
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
        iconClass: "text-red-400"
      };
    } else if (diffDays <= 30) {
      return {
        textClass: "text-amber-400 font-semibold",
        iconClass: "text-amber-400"
      };
    } else {
      return {
        textClass: "text-emerald-400 font-medium",
        iconClass: "text-emerald-400"
      };
    }
  } catch (e) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50"
    };
  }
};

/**
 * ApplicationTable Component - Dark Theme
 * Renders a list of job applications in a clean, Notion-style table.
 * Supports sorting (deadline closest first), custom date formatting,
 * and click-handlers to open the edit form.
 * 
 * Props:
 * - applications: array of application objects
 * - onEditClick: callback triggered when a row is clicked to edit (function)
 */
export default function ApplicationTable({ applications = [], onEditClick, onCompanyClick }) {
  // Format dates helper using date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString;
  };

  // Pre-sorted applications passed as prop
  const sortedApplications = applications;

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

  const statuses = ["Applied", "Screening", "OA", "Interview", "Offer", "Rejected"];

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card select-none">
      <div className="overflow-x-auto animate-in fade-in duration-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">Company</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Deadline</th>
              <th className="py-3.5 px-4 font-semibold">Date Applied</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            {sortedApplications.map((app) => {
              const dlStatus = getDeadlineStatus(app.deadline);
              return (
                <tr
                  key={app.id}
                  onClick={() => onEditClick && onEditClick(app)}
                  className="hover:bg-accent/25 transition-colors cursor-pointer group"
                >
                  {/* Company Name, Logo & Homepage URL */}
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompanyClick && onCompanyClick(app);
                        }}
                        className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
                        title={`View Details for ${app.company}`}
                      >
                        <CompanyLogo company={app.company} />
                        <span>{app.company}</span>
                      </div>
                      <a
                        href={getCompanyCareersUrl(app.company)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} // Stop modal from triggering when clicking external link
                        className="text-muted-foreground/50 hover:text-primary transition-colors inline-flex p-0.5"
                        title="View Careers Site"
                      >
                        <LinkIcon size={12} />
                      </a>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 text-muted-foreground">{app.role}</td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} />
                  </td>

                  {/* Deadline */}
                  <td className="py-3.5 px-4">
                    <div className={`flex items-center gap-1.5 ${dlStatus.textClass}`}>
                      <Calendar size={13} className={dlStatus.iconClass} />
                      <span>{formatDate(app.deadline)}</span>
                    </div>
                  </td>

                  {/* Date Applied */}
                  <td className="py-3.5 px-4 text-muted-foreground/70">
                    {formatDate(app.dateApplied)}
                  </td>

                  {/* Edit Button trigger (also row click triggers it) */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick && onEditClick(app);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground/60 hover:text-primary transition-all p-1 inline-flex"
                      title="Edit Application"
                    >
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { X, Calendar, ExternalLink, Edit, Trash2, AlertTriangle } from "lucide-react";
import CompanyLogo from "../ui/CompanyLogo";
import StatusBadge from "../ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { getCompanyCareersUrl } from "../ui/CompanyLogo";

/**
  * JobDetailsPanel Component - Dark Theme Right Sliding Panel
  * Displays complete application metadata, calculated deadline countdowns,
  * notes, description, and action buttons.
  */
export default function JobDetailsPanel({ application, isOpen, onClose, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !application) return null;

  // Calculate days remaining dynamically
  const calculateDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return { text: "No deadline set", colorClass: "text-muted-foreground bg-zinc-800/20 border border-zinc-700/20 px-2 py-0.5 rounded text-xs font-semibold" };
    
    const deadline = new Date(deadlineDate);
    deadline.setHours(23, 59, 59, 999); // end of deadline day
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: "Overdue", 
        colorClass: "text-red-400 bg-red-955/20 border border-red-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" 
      };
    } else if (diffDays === 0) {
      return { 
        text: "Deadline Today", 
        colorClass: "text-amber-400 bg-amber-955/20 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" 
      };
    } else if (diffDays === 1) {
      return { 
        text: "1 day left", 
        colorClass: "text-green-400 bg-green-955/20 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" 
      };
    } else {
      return { 
        text: `${diffDays} days left`, 
        colorClass: "text-green-400 bg-green-955/20 border border-green-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" 
      };
    }
  };

  const daysRemaining = calculateDaysRemaining(application.deadline);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(application.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    onEdit(application);
    onClose();
  };

  const jobPostingUrl = getCompanyCareersUrl(application.company);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Sliding Side Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-[420px] max-w-full bg-card border-l border-border shadow-2xl z-50 flex flex-col justify-between overflow-y-auto select-none transition-transform duration-300 translate-x-0 animate-in slide-in-from-right"
        style={{
          boxShadow: "-10px 0 30px -15px rgba(0,0,0,0.5)"
        }}
      >
        {/* Top Header Section */}
        <div className="p-6 pb-4 relative flex flex-col gap-4">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/40"
            title="Close Panel"
          >
            <X size={18} />
          </button>
          
          {/* Company Logo and Meta Details */}
          <div className="flex items-start gap-4 pr-8">
            <CompanyLogo company={application.company} className="w-12 h-12 rounded-lg bg-zinc-800" />
            <div className="space-y-1 overflow-hidden">
              <h2 className="text-xl font-bold text-foreground truncate tracking-tight" title={application.company}>
                {application.company}
              </h2>
              <p className="text-sm text-muted-foreground font-medium truncate" title={application.role}>
                {application.role}
              </p>
              <div className="pt-1 flex items-center gap-2">
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-border/60 mx-6" />

        {/* Content Section */}
        <div className="flex-1 p-6 space-y-6">
          {/* SECTION 1: Timeline & Dates */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Timeline & Dates
            </h3>
            
            <div className="grid grid-cols-2 gap-4 bg-secondary/10 border border-border/40 rounded-xl p-4">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider block">
                  Date Applied
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {formatDate(application.dateApplied)}
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider block">
                  Deadline
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {formatDate(application.deadline)}
                </span>
              </div>
              
              <div className="col-span-2 pt-2.5 border-t border-border/40 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider block">
                  Days Remaining
                </span>
                <span className={daysRemaining.colorClass}>
                  {daysRemaining.text}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-border/60" />

          {/* SECTION 2: Job Information */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Job Information
            </h3>
            
            <div className="space-y-3.5">
              <Button
                onClick={() => window.open(jobPostingUrl, "_blank")}
                className="w-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider py-2.5 h-10 shadow-sm rounded-lg"
              >
                <ExternalLink size={14} className="text-white" />
                <span className="text-white">View Job Posting</span>
              </Button>
              
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider block">
                  Application Notes & Requirements
                </span>
                <div className="bg-secondary/10 border border-border/40 rounded-xl p-4 min-h-[140px] text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {application.notes ? application.notes : "No notes or description provided for this application."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Quick Actions Footer */}
        <div className="p-6 bg-secondary/15 border-t border-border flex flex-col gap-3">
          {showDeleteConfirm ? (
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3.5 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={15} />
                <span className="text-xs font-semibold uppercase tracking-wide">Delete Application?</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal">
                This action is permanent and cannot be undone. Are you sure you want to remove this application?
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider h-9 rounded-lg"
                >
                  Yes, Delete
                </Button>
                <Button
                  onClick={handleCancelDelete}
                  variant="outline"
                  className="flex-1 border-border bg-card hover:bg-secondary/30 text-foreground font-semibold text-xs uppercase tracking-wider h-9 rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleEditClick}
                className="flex-grow bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider py-2.5 h-10 shadow-sm rounded-lg"
              >
                <Edit size={14} className="text-white" />
                <span className="text-white">Edit Application</span>
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="outline"
                className="border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 text-red-400 flex items-center justify-center gap-2 font-semibold text-xs uppercase tracking-wider py-2.5 h-10 shadow-sm rounded-lg animate-in fade-in"
              >
                <Trash2 size={14} className="text-red-400" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

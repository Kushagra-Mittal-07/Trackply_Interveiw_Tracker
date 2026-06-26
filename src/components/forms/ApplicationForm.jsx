import React, { useState, useEffect } from "react";
import { Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * ApplicationForm Component - Dark Theme
 * Renders the form for adding or editing job applications.
 * Switches between Manual Form inputs and JDPasteTab simulation.
 * Includes inline deletion confirmation and handles data saving.
 * 
 * Props:
 * - application: application object to edit (null if adding a new one)
 * - onSave: callback function to handle creating or saving application (function)
 * - onDelete: callback function to delete application by ID (function)
 * - onClose: callback function to close the dialog (function)
 */
export default function ApplicationForm({
  application,
  onSave,
  onDelete,
  onClose,
}) {
  const isEditing = application && application.id !== undefined;
  
  // Local form states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [requirements, setRequirements] = useState([]);
  
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync state when application prop changes
  useEffect(() => {
    if (application) {
      setCompany(application.company || "");
      setRole(application.role || "");
      setUrl(application.url || "");
      setDeadline(application.deadline || "");
      setStatus(application.status || "Applied");
      setNotes(application.notes || "");
      setTimeline(application.timeline || []);
      setRequirements(application.requirements || []);
    } else {
      // Clear fields for fresh Add Form
      setCompany("");
      setRole("");
      setUrl("");
      setDeadline("");
      setStatus("Applied");
      setNotes("");
      setTimeline([]);
      setRequirements([]);
    }
    setShowDeleteConfirm(false);
  }, [application]);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      alert("Company Name and Role are required fields.");
      return;
    }

    const payload = {
      id: isEditing ? application.id : undefined,
      company: company.trim(),
      role: role.trim(),
      url: url.trim(),
      deadline: deadline || "",
      status,
      notes: notes.trim(),
      timeline,
      requirements,
    };

    if (onSave) {
      onSave(payload);
    }
  };



  // Perform deletion
  const handleDeleteAction = () => {
    if (onDelete && isEditing) {
      onDelete(application.id);
    }
  };

  return (
    <div className="space-y-4 select-none text-foreground bg-card">
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-lg font-bold text-foreground leading-none">
          {isEditing ? "Edit Application" : "Add New Application"}
        </h2>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-accent/40 p-1"
        >
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {renderFormFields()}
      </form>
    </div>
  );

  // Sub-renderer for form fields structure
  function renderFormFields() {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="e.g. Stripe"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Role Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role"
              type="text"
              placeholder="e.g. Frontend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pipeline Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full h-9 focus-visible:ring-primary text-sm border-border bg-secondary/30">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="OA">OA (Online Assessment)</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deadline Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="deadline" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Application/OA Deadline
            </Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30 color-scheme-dark"
            />
          </div>
        </div>

        {/* Job Posting URL */}
        <div className="space-y-1.5">
          <Label htmlFor="url" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Job Posting URL
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="e.g. https://careers.company.com/job/123"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-9 focus-visible:ring-primary border-border text-sm text-foreground bg-secondary/30"
          />
        </div>

        {/* Notes Textarea */}
        <div className="space-y-1.5">
          <Label htmlFor="notes" className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Application Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Pasted details, contact person, interview prep questions, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] resize-y text-sm focus-visible:ring-primary border-border text-foreground bg-secondary/30"
          />
        </div>

        {/* Render Extracted Requirements if present */}
        {requirements && requirements.length > 0 && (
          <div className="space-y-2.5 border border-border bg-secondary/10 rounded-lg p-4 select-none">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Job Requirements Checklist
            </h3>
            <div className="space-y-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-border bg-secondary text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Extracted Timeline if present */}
        {timeline && timeline.length > 0 && (
          <div className="space-y-2.5 border border-border bg-secondary/10 rounded-lg p-4 select-none">
            <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Timeline Milestones
            </h3>
            <div className="relative pl-4 space-y-4 border-l border-border/80 ml-2 mt-2">
              {timeline.map((step, i) => (
                <div key={i} className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs">
                  {/* Timeline bullet dot */}
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-primary bg-card" />
                  <span className="text-foreground font-semibold">{step.label}</span>
                  <span className="text-muted-foreground text-[11px]">{step.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button Row */}
        <div className="flex items-center justify-between pt-4 border-t border-border bg-card">
          {/* Deletion Option (Edit mode only) */}
          {isEditing ? (
            showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 font-medium">Delete permanently?</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAction}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 h-8"
                >
                  Yes, Delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="h-8 text-xs font-semibold border-border hover:bg-accent/40 text-foreground"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-900/60 flex items-center gap-1.5 px-3 h-8"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </Button>
            )
          ) : (
            <div />
          )}

          {/* Save/Submit Options */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs font-semibold border-border hover:bg-accent/40 text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1.5 h-8 text-xs font-semibold"
            >
              <Save size={14} />
              <span>{isEditing ? "Save Changes" : "Save Application"}</span>
            </Button>
          </div>
        </div>
      </>
    );
  }
}

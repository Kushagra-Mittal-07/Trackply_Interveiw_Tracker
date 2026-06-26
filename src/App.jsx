import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import MainLayout from "@/components/layout/MainLayout";
import PipelineSummary from "@/components/dashboard/PipelineSummary";
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicationCards from "@/components/dashboard/ApplicationCards";
import ApplicationForm from "@/components/forms/ApplicationForm";
import JDExtractorForm from "@/components/forms/JDExtractorForm";
import RecentActivities from "@/components/dashboard/RecentActivities";
import CalendarView from "@/components/dashboard/CalendarView";
import JobDetailsPanel from "@/components/dashboard/JobDetailsPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";
import { initialApplications } from "@/data/mockData";
import { Plus, Kanban, List, Sparkles, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Main App Component - Dark Theme & React Router Setup
 * Implements route-switching between /login, /signup, and /dashboard.
 * Manages the top-level application state and recent activities timeline log.
 */
function App() {
  // Top-level state holding all applications
  const [applications, setApplications] = useState(initialApplications);

  // Top-level state holding all activities logs
  const [activities, setActivities] = useState([
    {
      id: "mock-1",
      type: "UPDATE",
      company: "Meta",
      role: "Software Engineer Intern",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      details: "Status updated from OA to Rejected.",
    },
    {
      id: "mock-2",
      type: "CREATE",
      company: "Google",
      role: "Software Engineering Intern",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      details: "Application added with target deadline: Jun 28, 2026.",
    },
    {
      id: "mock-3",
      type: "UPDATE",
      company: "Stripe",
      role: "Frontend Engineer Intern",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      details: "Status updated from Interview to Offer. Verbal offer received.",
    },
  ]);
  
  // Sync navigation tab state with URL search query parameter for history tracking
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";
  const setCurrentTab = (tab) => setSearchParams({ tab });
  
  // Status filter state (All, Applied, Screening, OA, Interview, Offer, Rejected, or Active)
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Dashboard view mode state ('table' or 'cards')
  const [viewMode, setViewMode] = useState("table");

  // Sorting state ('deadline-asc', 'deadline-desc', 'added-desc', 'applied-desc', 'applied-asc')
  const [sortBy, setSortBy] = useState("deadline-asc");

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog (modal) visibility state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  
  // Job Details side panel visibility and target application
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDetailsApplication, setSelectedDetailsApplication] = useState(null);
  
  // Holds the specific application object being edited (null if adding new application)
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Notifications read state
  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem("trackply_read_notifications");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const handleMarkAllRead = (idsToMark) => {
    setReadIds((prev) => {
      const updated = Array.from(new Set([...prev, ...idsToMark]));
      try {
        localStorage.setItem("trackply_read_notifications", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save read notification IDs", e);
      }
      return updated;
    });
  };

  // Generate dynamic notification logs
  const notifications = React.useMemo(() => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Generate urgent alerts from application deadlines
    applications.forEach((app) => {
      if (app.deadline && app.status !== "Offer" && app.status !== "Rejected") {
        const deadlineDate = new Date(app.deadline);
        const diffTime = deadlineDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 10) {
          list.push({
            id: `deadline-${app.id}-${app.deadline}`,
            type: "URGENT",
            title: "Urgent Deadline Reminder",
            message: `${app.company} (${app.role}) deadline is in ${diffDays} day${diffDays === 1 ? "" : "s"}!`,
            timestamp: new Date(deadlineDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          });
        } else if (diffDays < 0) {
          list.push({
            id: `deadline-${app.id}-${app.deadline}`,
            type: "OVERDUE",
            title: "Application Overdue",
            message: `${app.company} (${app.role}) deadline has passed!`,
            timestamp: new Date().toISOString(),
          });
        }
      }
    });

    // 2. Add mock job opportunities
    list.push({
      id: "opportunity-1",
      type: "OPPORTUNITY",
      title: "New Opportunity Alert",
      message: "Microsoft has opened applications for 'Software Engineering Intern'!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    });
    list.push({
      id: "opportunity-2",
      type: "OPPORTUNITY",
      title: "New Opportunity Alert",
      message: "Netflix is hiring 'Frontend Engineer Interns' on their careers portal.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    });

    // 3. Add status shifts from system activity log
    activities.slice(0, 2).forEach((act) => {
      list.push({
        id: `activity-${act.id}`,
        type: "ACTIVITY",
        title: act.type === "CREATE" ? "New Application Added" : "Status Updated",
        message: `${act.company} (${act.role}): ${act.details}`,
        timestamp: act.timestamp,
      });
    });

    // Sort newer notifications first
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [applications, activities]);

  // Prefill details from notification opportunity alert
  const handleAddOpportunity = (oppData) => {
    setSelectedApplication({
      company: oppData.company,
      role: oppData.role,
      url: oppData.url,
      status: "Applied",
      deadline: "",
      notes: "Opportunity alert discovered in notifications center."
    });
    setIsFormOpen(true);
  };

  // Triggered when clicking the "Add Application" button
  const handleAddClick = () => {
    setSelectedApplication(null); // Set to null to indicate Add Mode
    setIsFormOpen(true);
  };

  // Triggered when clicking a row in the ApplicationTable
  const handleEditClick = (app) => {
    setSelectedApplication(app); // Set target application to indicate Edit Mode
    setIsFormOpen(true);
  };

  // Triggered when clicking a company logo or name
  const handleCompanyClick = (app) => {
    setSelectedDetailsApplication(app);
    setIsDetailsOpen(true);
  };

  // Save handler for creating/updating applications
  const handleSave = (formData) => {
    if (formData.id) {
      // Edit Mode: update the existing entry in the state array
      const oldApp = applications.find((app) => app.id === formData.id);
      
      setApplications((prev) =>
        prev.map((app) => (app.id === formData.id ? formData : app))
      );

      // Check what changed to create a detailed log description
      let changeDetails = "Updated application details.";
      if (oldApp) {
        if (oldApp.status !== formData.status) {
          changeDetails = `Status updated from ${oldApp.status} to ${formData.status}.`;
        } else if (oldApp.role !== formData.role || oldApp.company !== formData.company) {
          changeDetails = `Updated job role and details.`;
        }
      }

      // Prepend the update activity log
      const newActivity = {
        id: String(Date.now()),
        type: "UPDATE",
        company: formData.company,
        role: formData.role,
        timestamp: new Date().toISOString(),
        details: changeDetails,
      };
      setActivities((prev) => [newActivity, ...prev]);

    } else {
      // Add Mode: prepend a new entry with generated ID and default date-applied if missing
      const newApp = {
        ...formData,
        id: String(Date.now()), // unique temporary ID
        dateApplied: formData.dateApplied || new Date().toISOString().split("T")[0],
      };
      setApplications((prev) => [newApp, ...prev]);

      // Prepend the creation activity log
      const newActivity = {
        id: String(Date.now()),
        type: "CREATE",
        company: formData.company,
        role: formData.role,
        timestamp: new Date().toISOString(),
        details: `Application created with starting status: ${formData.status}.`,
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
    setIsFormOpen(false);
  };

  // Delete handler
  const handleDelete = (id) => {
    const targetApp = applications.find((app) => app.id === id);
    setApplications((prev) => prev.filter((app) => app.id !== id));

    if (targetApp) {
      // Prepend the deletion activity log
      const newActivity = {
        id: String(Date.now()),
        type: "DELETE",
        company: targetApp.company,
        role: targetApp.role,
        timestamp: new Date().toISOString(),
        details: `Application for ${targetApp.role} removed from workspace.`,
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  // Status change handler for Drag & Drop
  const handleStatusChange = (id, newStatus) => {
    const targetApp = applications.find((app) => app.id === id);
    if (!targetApp || targetApp.status === newStatus) return;

    const oldStatus = targetApp.status;
    const updatedApp = { ...targetApp, status: newStatus };

    setApplications((prev) =>
      prev.map((app) => (app.id === id ? updatedApp : app))
    );

    // Prepend activity log for status change
    const newActivity = {
      id: String(Date.now()),
      type: "UPDATE",
      company: targetApp.company,
      role: targetApp.role,
      timestamp: new Date().toISOString(),
      details: `Status updated from ${oldStatus} to ${newStatus} via Kanban drag & drop.`,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  // Export applications details to Excel (.xlsx) format
  const handleExportExcel = () => {
    if (filteredApplications.length === 0) {
      alert("No applications to export.");
      return;
    }

    const data = filteredApplications.map(app => ({
      Company: app.company,
      Role: app.role,
      Status: app.status,
      Deadline: app.deadline,
      "Date Applied": app.dateApplied,
      "Job URL": app.jobUrl || app.url || "",
      Notes: app.notes || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "trackply-applications.xlsx");
  };

  // Filter application list based on active selected filter and search query
  const filteredApplications = applications.filter((app) => {
    // 1. Status Filter match
    let statusMatch = true;
    if (selectedStatus !== "All") {
      if (selectedStatus === "Active") {
        statusMatch = ["Applied", "OA"].includes(app.status);
      } else {
        statusMatch = app.status === selectedStatus;
      }
    }

    // 2. Search Query match (company name or role, case-insensitive)
    let searchMatch = true;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      const company = (app.company || "").toLowerCase();
      const role = (app.role || "").toLowerCase();
      searchMatch = company.includes(q) || role.includes(q);
    }

    return statusMatch && searchMatch;
  });

  // Sort applications based on active selection
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "deadline-asc") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      const isOverdueA = dateA < today;
      const isOverdueB = dateB < today;

      if (isOverdueA && !isOverdueB) return 1;
      if (!isOverdueA && isOverdueB) return -1;

      return dateA - dateB;
    }
    if (sortBy === "deadline-desc") {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      const isOverdueA = dateA < today;
      const isOverdueB = dateB < today;

      if (isOverdueA && !isOverdueB) return 1;
      if (!isOverdueA && isOverdueB) return -1;

      return dateB - dateA;
    }
    if (sortBy === "added-desc") {
      return Number(b.id) - Number(a.id);
    }
    if (sortBy === "applied-desc") {
      if (!a.dateApplied) return 1;
      if (!b.dateApplied) return -1;
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    }
    if (sortBy === "applied-asc") {
      if (!a.dateApplied) return 1;
      if (!b.dateApplied) return -1;
      return new Date(a.dateApplied) - new Date(b.dateApplied);
    }
    return 0;
  });

  return (
    <Routes>
      {/* Default landing route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <MainLayout
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            notificationElement={
              <NotificationDropdown
                notifications={notifications}
                readIds={readIds}
                onMarkAllRead={() => handleMarkAllRead(notifications.map(n => n.id))}
                onAddOpportunity={handleAddOpportunity}
              />
            }
          >
            {currentTab === "dashboard" ? (
              <div className="space-y-6">
                {/* Header Action Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground leading-tight">
                      Job Applications
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Keep track of your internship applications, online assessments, and interview pipeline.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                    {/* View mode toggle */}
                    <div className="flex items-center rounded-lg border border-border p-1 bg-card select-none">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded transition-all inline-flex ${
                          viewMode === "table"
                            ? "bg-accent text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Tabular Table View"
                      >
                        <List size={15} />
                      </button>
                      <button
                        onClick={() => setViewMode("cards")}
                        className={`p-1.5 rounded transition-all inline-flex ${
                          viewMode === "cards"
                            ? "bg-accent text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        title="Kanban Board View"
                      >
                        <Kanban size={15} />
                      </button>
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center rounded-lg border border-border p-1 bg-card select-none h-9">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-card text-foreground text-xs font-semibold px-2 py-1 rounded border border-border focus:outline-none focus:border-primary h-7 select-none cursor-pointer"
                        title="Sort Applications"
                      >
                        <option value="deadline-asc">Deadline (Closest First)</option>
                        <option value="deadline-desc">Deadline (Latest First)</option>
                        <option value="added-desc">Recently Added</option>
                        <option value="applied-desc">Date Applied (Newest)</option>
                        <option value="applied-asc">Date Applied (Oldest)</option>
                      </select>
                    </div>

                    <Button
                      onClick={() => setIsExtractorOpen(true)}
                      variant="outline"
                      className="border-border hover:bg-accent/40 text-foreground flex items-center gap-2 px-3.5 h-9 shadow-sm shrink-0 font-semibold text-xs uppercase tracking-wider bg-card"
                    >
                      <Sparkles size={14} className="text-primary" />
                      <span>Extract from JD</span>
                    </Button>

                    <Button
                      onClick={handleExportExcel}
                      variant="outline"
                      className="border-border hover:bg-accent/40 text-foreground flex items-center gap-2 px-3.5 h-9 shadow-sm shrink-0 font-semibold text-xs uppercase tracking-wider bg-card"
                    >
                      <Download size={14} className="text-muted-foreground" />
                      <span>Export to Excel</span>
                    </Button>

                    <Button
                      onClick={handleAddClick}
                      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider h-9 shadow-sm shrink-0"
                    >
                      <Plus size={15} className="stroke-[2.5] text-white" />
                      <span className="text-white">Add Application</span>
                    </Button>
                  </div>
                </div>

                {/* Pipeline stats bar at top */}
                <PipelineSummary
                  applications={applications}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                />

                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground/60" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by company name or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-8 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground/50 transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground text-xs font-semibold"
                      title="Clear Search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Table or Cards displaying matching entries */}
                  {viewMode === "table" ? (
                    <ApplicationTable
                      applications={sortedApplications}
                      onEditClick={handleEditClick}
                      onCompanyClick={handleCompanyClick}
                    />
                  ) : (
                    <ApplicationCards
                      applications={sortedApplications}
                      onEditClick={handleEditClick}
                      onCompanyClick={handleCompanyClick}
                      selectedStatus={selectedStatus}
                      onStatusChange={handleStatusChange}
                    />
                  )}
 
                 {/* Dialog Modal holding ApplicationForm */}
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                   <DialogContent showCloseButton={false} className="sm:max-w-lg p-5 border border-border bg-card shadow-2xl rounded-xl">
                     <ApplicationForm
                       application={selectedApplication}
                       onSave={handleSave}
                       onDelete={handleDelete}
                       onClose={() => setIsFormOpen(false)}
                     />
                   </DialogContent>
                 </Dialog>
 
                 {/* Dialog Modal holding JDExtractorForm */}
                 <Dialog open={isExtractorOpen} onOpenChange={setIsExtractorOpen}>
                   <DialogContent showCloseButton={false} className="sm:max-w-xl p-5 border border-border bg-card shadow-2xl rounded-xl">
                     <JDExtractorForm
                       onSave={(formData) => {
                         handleSave(formData);
                         setIsExtractorOpen(false);
                       }}
                       onClose={() => setIsExtractorOpen(false)}
                     />
                   </DialogContent>
                 </Dialog>
 
                 {/* Right Sliding Job Details Panel */}
                 <JobDetailsPanel
                   application={selectedDetailsApplication}
                   isOpen={isDetailsOpen}
                   onClose={() => setIsDetailsOpen(false)}
                   onEdit={handleEditClick}
                   onDelete={handleDelete}
                 />
              </div>
            ) : currentTab === "activities" ? (
              /* Recent Activities tab */
              <RecentActivities
                activities={activities}
                onClearLog={() => setActivities([])}
              />
            ) : currentTab === "calendar" ? (
              /* Dedicated Calendar view */
              <CalendarView applications={applications} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                This tab is currently under construction.
              </div>
            )}
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;

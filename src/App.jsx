import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/auth/Login";
import Signup from "@/components/auth/Signup";
import MainLayout from "@/components/layout/MainLayout";
import PipelineSummary from "@/components/dashboard/PipelineSummary";
import StatusFilter from "@/components/dashboard/StatusFilter";
import ApplicationTable from "@/components/dashboard/ApplicationTable";
import ApplicationCards from "@/components/dashboard/ApplicationCards";
import ApplicationForm from "@/components/forms/ApplicationForm";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { initialApplications } from "@/data/mockData";
import { Plus, LayoutGrid, List } from "lucide-react";
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
  
  // Navigation tab state (dashboard, activities, analytics, settings)
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Status filter state (All, Applied, Screening, OA, Interview, Offer, Rejected)
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Dashboard view mode state ('table' or 'cards')
  const [viewMode, setViewMode] = useState("table");
  
  // Dialog (modal) visibility state
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Holds the specific application object being edited (null if adding new application)
  const [selectedApplication, setSelectedApplication] = useState(null);

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
    setIsFormOpen(false);
  };

  // Filter application list based on active selected filter
  const filteredApplications = applications.filter((app) => {
    if (selectedStatus === "All") return true;
    return app.status === selectedStatus;
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
          <MainLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
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
                        title="Row Cards View"
                      >
                        <LayoutGrid size={15} />
                      </button>
                    </div>

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
                <PipelineSummary applications={applications} />

                {/* Tab filter bar */}
                <StatusFilter
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  applications={applications}
                />

                {/* Table or Cards displaying matching entries */}
                {viewMode === "table" ? (
                  <ApplicationTable
                    applications={filteredApplications}
                    onEditClick={handleEditClick}
                  />
                ) : (
                  <ApplicationCards
                    applications={filteredApplications}
                    onEditClick={handleEditClick}
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
              </div>
            ) : currentTab === "activities" ? (
              /* Recent Activities tab */
              <RecentActivities
                activities={activities}
                onClearLog={() => setActivities([])}
              />
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

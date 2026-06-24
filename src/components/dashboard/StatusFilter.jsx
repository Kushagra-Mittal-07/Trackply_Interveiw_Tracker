import React from "react";

/**
 * StatusFilter Component - Dark Theme
 * Renders a row of Notion-style tab filters for narrowing down applications by status.
 * Displays each status name and the count of applications currently in that status.
 * 
 * Props:
 * - selectedStatus: current active filter ('All' or specific status string)
 * - setSelectedStatus: callback to update active filter (function)
 * - applications: raw applications list to compute item counts (array)
 */
export default function StatusFilter({
  selectedStatus = "All",
  setSelectedStatus,
  applications = [],
}) {
  // Define status filter options matching the 6 statuses from the PRD plus 'All'
  const filterOptions = [
    { id: "All", label: "All Applications" },
    { id: "Applied", label: "Applied" },
    { id: "Screening", label: "Screening" },
    { id: "OA", label: "OA" },
    { id: "Interview", label: "Interview" },
    { id: "Offer", label: "Offer" },
    { id: "Rejected", label: "Rejected" },
  ];

  // Helper to compute the count of applications in each filter option
  const getCount = (statusId) => {
    if (statusId === "All") {
      return applications.length;
    }
    return applications.filter((app) => app.status === statusId).length;
  };

  return (
    <div className="flex items-center gap-1.5 border-b border-border overflow-x-auto no-scrollbar mb-6 select-none">
      {filterOptions.map((option) => {
        const isActive = selectedStatus === option.id;
        const count = getCount(option.id);

        return (
          <button
            key={option.id}
            onClick={() => setSelectedStatus && setSelectedStatus(option.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-[2px] transition-all whitespace-nowrap ${
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-accent"
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? "bg-primary/10 text-primary font-bold" : "bg-accent text-muted-foreground font-medium"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

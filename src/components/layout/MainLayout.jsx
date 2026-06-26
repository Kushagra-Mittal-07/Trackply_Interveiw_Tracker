import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";

/**
 * MainLayout Component - Dark Theme
 * Houses the structural framework of the application, splitting the page
 * into a static left Sidebar and a scrollable right main-content area.
 * 
 * Props:
 * - children: content to render inside the main panel (React.ReactNode)
 * - currentTab: active sidebar navigation tab (string)
 * - setCurrentTab: callback to update active navigation tab (function)
 */
export default function MainLayout({ children, currentTab, setCurrentTab }) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full min-h-screen bg-background text-foreground">
      {/* Sidebar - fixed on the left */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area - scrollable on the right */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-background flex flex-col">
        {/* Top Header Bar for UI Polish */}
        <header className="h-14 border-b border-border px-8 flex items-center justify-between sticky top-0 bg-background/85 backdrop-blur-sm z-10 select-none">
          <div className="flex items-center gap-4">
            {/* History Navigation Arrows */}
            <div className="flex items-center gap-1 rounded-md border border-border p-0.5 bg-card/60">
              <button
                onClick={() => navigate(-1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all inline-flex"
                title="Go Back"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => navigate(1)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all inline-flex"
                title="Go Forward"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Workspace</span>
              <span className="text-sm text-border">/</span>
              <span className="text-sm font-semibold text-foreground">Job Applications</span>
            </div>
          </div>
          
          {/* Mock Profile / Status bar */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-muted-foreground font-medium">Local Mock Storage</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        {/* Inner Content with generous padding */}
        <div className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

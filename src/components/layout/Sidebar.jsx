import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, LayoutDashboard, BarChart3, Settings, HelpCircle, Clock, LogOut, Calendar } from "lucide-react";

/**
 * Sidebar Component - Dark Theme
 * Renders a left-hand navigation sidebar inspired by Notion's dark theme layout.
 * Displays the app title, tagline, and navigation tabs.
 * 
 * Props:
 * - currentTab: active tab identifier (string)
 * - setCurrentTab: callback to update active tab (function)
 */
export default function Sidebar({ currentTab = "dashboard", setCurrentTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  // Navigation items definition
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      id: "activities",
      label: "Activities",
      icon: Clock,
      disabled: false,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      disabled: false,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      disabled: true,
      badge: "Soon",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      disabled: true,
    },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border flex flex-col h-screen sticky top-0 text-muted-foreground select-none">
      {/* App Logo & Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white">
            <Briefcase size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight leading-tight">
              Trackply
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              v1.0.0 (Phase 1)
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic leading-snug">
          "Track every job application. Miss nothing."
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          if (item.disabled) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground/45 cursor-not-allowed rounded"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-semibold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab && setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded transition-colors text-left ${
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              }`}
            >
              <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Support */}
      <div className="p-4 border-t border-border bg-card/25 text-xs text-muted-foreground space-y-3">
        <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
          <HelpCircle size={14} />
          <span>Documentation & Help</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors py-1 cursor-pointer font-medium text-left"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

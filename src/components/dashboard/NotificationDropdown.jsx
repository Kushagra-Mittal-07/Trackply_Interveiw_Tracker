import React, { useState, useRef, useEffect } from "react";
import { Bell, Sparkles, AlertTriangle, Clock, Trash, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationDropdown({
  notifications = [],
  readIds = [],
  onMarkAllRead,
  onAddOpportunity,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && onMarkAllRead) {
      onMarkAllRead();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "URGENT":
      case "OVERDUE":
        return <AlertTriangle size={14} className="text-red-400 shrink-0" />;
      case "OPPORTUNITY":
        return <Sparkles size={14} className="text-purple-400 shrink-0" />;
      default:
        return <Clock size={14} className="text-blue-400 shrink-0" />;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case "URGENT":
      case "OVERDUE":
        return "bg-red-950/20 border-red-900/30 hover:bg-red-950/30";
      case "OPPORTUNITY":
        return "bg-purple-950/20 border-purple-900/30 hover:bg-purple-950/30";
      default:
        return "bg-blue-950/20 border-blue-900/30 hover:bg-blue-950/30";
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "Just now";
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(isoString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={handleToggle}
        className={`p-2 rounded-lg border transition-all relative ${
          isOpen
            ? "bg-accent border-zinc-700 text-foreground"
            : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/40"
        }`}
        title="Notifications"
      >
        <Bell size={16} className={unreadCount > 0 ? "animate-bounce" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg border border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-border bg-secondary/15 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                Notification Logs
              </span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-900/30 px-1.5 py-0.2 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-accent/40"
            >
              <X size={14} />
            </button>
          </div>

          {/* List of items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs">All caught up! No notifications.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 transition-colors border-l-2 ${
                    n.type === "URGENT" || n.type === "OVERDUE"
                      ? "border-l-red-500"
                      : n.type === "OPPORTUNITY"
                      ? "border-l-purple-500"
                      : "border-l-blue-500"
                  } ${getBgClass(n.type)}`}
                >
                  {getIcon(n.type)}
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-foreground truncate">
                        {n.title}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 select-none shrink-0 font-medium">
                        {formatTime(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal break-words">
                      {n.message}
                    </p>

                    {/* Actions button for opportunities */}
                    {n.type === "OPPORTUNITY" && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (onAddOpportunity) {
                            if (n.id === "opportunity-1") {
                              onAddOpportunity({
                                company: "Microsoft",
                                role: "Software Engineering Intern",
                                url: "https://careers.microsoft.com",
                                status: "Applied"
                              });
                            } else {
                              onAddOpportunity({
                                company: "Netflix",
                                role: "Frontend Engineer Intern",
                                url: "https://jobs.netflix.com",
                                status: "Applied"
                              });
                            }
                          }
                        }}
                        className="flex items-center gap-1 text-[10px] bg-primary hover:bg-primary/90 text-white font-bold px-2.5 py-1 rounded transition-colors"
                      >
                        <Plus size={11} className="stroke-[2.5]" />
                        <span>Add Application</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

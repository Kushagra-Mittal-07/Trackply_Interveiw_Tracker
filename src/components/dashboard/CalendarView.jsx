import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Bell, FileText, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper to determine deadline color classes
const getDeadlineStatus = (deadlineDateStr) => {
  if (!deadlineDateStr) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50",
      bgClass: "bg-zinc-800/40 text-zinc-350 border-zinc-700/60"
    };
  }
  try {
    const deadlineDate = new Date(deadlineDateStr);
    if (isNaN(deadlineDate.getTime())) {
      return {
        textClass: "text-muted-foreground/70",
        iconClass: "text-muted-foreground/50",
        bgClass: "bg-zinc-800/40 text-zinc-350 border-zinc-700/60"
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
        iconClass: "text-red-400",
        bgClass: "bg-red-955 bg-red-950/20 text-red-300 border-red-800/30",
        borderClass: "border-red-800/30"
      };
    } else if (diffDays <= 30) {
      return {
        textClass: "text-amber-400 font-semibold",
        iconClass: "text-amber-400",
        bgClass: "bg-amber-950/20 text-amber-300 border-amber-800/30",
        borderClass: "border-amber-800/30"
      };
    } else {
      return {
        textClass: "text-emerald-400 font-medium",
        iconClass: "text-emerald-400",
        bgClass: "bg-emerald-955 bg-emerald-950/20 text-emerald-300 border-emerald-800/30",
        borderClass: "border-emerald-800/30"
      };
    }
  } catch (e) {
    return {
      textClass: "text-muted-foreground/70",
      iconClass: "text-muted-foreground/50",
      bgClass: "bg-zinc-800/40 text-zinc-355 border-zinc-700/60"
    };
  }
};

export default function CalendarView({ applications = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // format: YYYY-MM-DD
  const [customEvents, setCustomEvents] = useState({}); // format: { 'YYYY-MM-DD': [ { id, type: 'note'|'reminder', text }, ... ] }
  
  // Modal state for adding/editing notes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventType, setEventType] = useState("note"); // 'note' or 'reminder'

  // Load custom events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("trackply_calendar_events");
      if (stored) {
        setCustomEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load calendar events", e);
    }
  }, []);

  // Save custom events to localStorage when they change
  const saveEvents = (updatedEvents) => {
    setCustomEvents(updatedEvents);
    try {
      localStorage.setItem("trackply_calendar_events", JSON.stringify(updatedEvents));
    } catch (e) {
      console.error("Failed to save calendar events", e);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Generate grid calendar days (42 days total)
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({
        day,
        dateString,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Current month days
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    for (let i = 1; i <= totalDays; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      cells.push({
        day: i,
        dateString,
        isCurrentMonth: true,
        isToday: dateString === todayStr
      });
    }

    // Next month days to pad to a multiple of 7 (usually 42)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      cells.push({
        day: i,
        dateString,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return cells;
  }, [year, month]);

  // Click day handler
  const handleCellClick = (cell) => {
    setSelectedDate(cell.dateString);
    setIsModalOpen(true);
  };

  // Add event handler
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventText.trim()) return;

    const newEvent = {
      id: String(Date.now()),
      type: eventType,
      text: eventText.trim()
    };

    const dayEvents = customEvents[selectedDate] || [];
    const updated = {
      ...customEvents,
      [selectedDate]: [...dayEvents, newEvent]
    };

    saveEvents(updated);
    setEventText("");
  };

  // Delete event handler
  const handleDeleteEvent = (eventId) => {
    const dayEvents = customEvents[selectedDate] || [];
    const filtered = dayEvents.filter(ev => ev.id !== eventId);
    
    const updated = { ...customEvents };
    if (filtered.length === 0) {
      delete updated[selectedDate];
    } else {
      updated[selectedDate] = filtered;
    }
    
    saveEvents(updated);
  };

  // Helper to query apps for a date
  const getAppsForDate = (dateStr) => {
    const applied = applications.filter(app => app.dateApplied === dateStr);
    const deadline = applications.filter(app => app.deadline === dateStr);
    return { applied, deadline };
  };

  // Display human readable date (e.g. "June 15, 2026")
  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const selectedDayData = selectedDate ? {
    apps: getAppsForDate(selectedDate),
    events: customEvents[selectedDate] || []
  } : { apps: { applied: [], deadline: [] }, events: [] };

  return (
    <div className="border border-border rounded-lg bg-card p-6 space-y-4 select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          <h3 className="text-lg font-bold text-foreground">Interactive Calendar</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5 bg-secondary/20">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all animate-in"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-all animate-in"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Titles */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1 border-b border-border">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells.map((cell, idx) => {
          const { applied, deadline } = getAppsForDate(cell.dateString);
          const dayNotes = customEvents[cell.dateString] || [];

          return (
            <div
              key={idx}
              onClick={() => handleCellClick(cell)}
              className={`min-h-[90px] p-1.5 border rounded flex flex-col justify-between cursor-pointer transition-all hover:bg-accent/20 ${
                cell.isCurrentMonth
                  ? "bg-secondary/10 border-border"
                  : "bg-secondary/5 border-border/30 opacity-40 hover:opacity-100"
              } ${
                cell.isToday
                  ? "ring-1 ring-primary border-primary bg-primary/5"
                  : ""
              }`}
            >
              {/* Day Number */}
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold ${cell.isToday ? "text-primary font-black" : "text-muted-foreground/80"}`}>
                  {cell.day}
                </span>
                {dayNotes.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayNotes.some(e => e.type === "reminder") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500" title="Has Alert" />
                    )}
                    {dayNotes.some(e => e.type === "note") && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Has Note" />
                    )}
                  </span>
                )}
              </div>

              {/* Day Contents */}
              <div className="mt-1 space-y-1 overflow-hidden flex-1 flex flex-col justify-end">
                {/* Applied applications */}
                {applied.slice(0, 2).map((app) => {
                  const dlStatus = getDeadlineStatus(app.deadline);
                  return (
                    <div
                      key={`applied-${app.id}`}
                      className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium border ${dlStatus.bgClass}`}
                      title={`Applied: ${app.company} - ${app.role} (${app.status})`}
                    >
                      📝 {app.company}
                    </div>
                  );
                })}
                
                {/* Deadline applications */}
                 {deadline.slice(0, 2).map((app) => {
                   const dlStatus = getDeadlineStatus(app.deadline);
                   return (
                     <div
                       key={`deadline-${app.id}`}
                       className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium border ${dlStatus.bgClass}`}
                       title={`Deadline: ${app.company} - ${app.role} (${app.status})`}
                     >
                       ⏰ {app.company}
                     </div>
                   );
                 })}

                {/* Total event indicators count if more */}
                {(applied.length + deadline.length > 2) && (
                  <div className="text-[8px] font-semibold text-muted-foreground/85 px-1 py-0.5 bg-accent/40 rounded border border-border/40 truncate text-center">
                    + {applied.length + deadline.length - 2} more apps
                  </div>
                )}

                {/* Local Custom Events count summary */}
                {dayNotes.length > 0 && (
                  <div className="text-[8px] font-semibold text-muted-foreground/85 px-1 py-0.5 bg-accent/40 rounded border border-border/40 truncate text-center">
                    💬 {dayNotes.length} event{dayNotes.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details/Notes Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-5 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h4 className="text-base font-bold text-foreground">
                  Events & Notes
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatSelectedDate(selectedDate)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/40 p-1"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Content: Applications status lists on this day */}
            <div className="space-y-3">
              {/* Applications submitted / deadlined */}
              {(selectedDayData.apps.applied.length > 0 || selectedDayData.apps.deadline.length > 0) ? (
                <div className="space-y-2 border border-border/80 bg-secondary/15 rounded-lg p-3">
                  <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Synced Applications
                  </h5>
                  <div className="space-y-1.5">
                    {selectedDayData.apps.applied.map(app => {
                      const dlStatus = getDeadlineStatus(app.deadline);
                      return (
                        <div key={app.id} className="flex justify-between items-center text-xs text-foreground bg-card/60 p-2 rounded border border-border">
                          <span className={`font-semibold ${dlStatus.textClass}`}>📝 Applied: {app.company} — {app.role}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border uppercase ${dlStatus.bgClass}`}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                     {selectedDayData.apps.deadline.map(app => {
                       const dlStatus = getDeadlineStatus(app.deadline);
                       return (
                         <div key={app.id} className="flex justify-between items-center text-xs text-foreground bg-card/60 p-2 rounded border border-border">
                           <span className={`font-semibold ${dlStatus.textClass}`}>⏰ Deadline: {app.company} — {app.role}</span>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border uppercase ${dlStatus.bgClass}`}>
                             {app.status}
                           </span>
                         </div>
                       );
                     })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No job applications are scheduled on this date.</p>
              )}

              {/* Custom notes & reminders list */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Notes & Reminders List
                </h5>
                {selectedDayData.events.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No custom notes or reminders added yet.</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {selectedDayData.events.map((ev) => (
                      <div
                        key={ev.id}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded border text-xs leading-relaxed ${
                          ev.type === "reminder"
                            ? "bg-pink-955 bg-pink-950/20 border-pink-900/30 text-pink-300"
                            : "bg-emerald-950/20 border-emerald-900/30 text-emerald-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {ev.type === "reminder" ? (
                            <Bell size={13} className="text-pink-400 shrink-0" />
                          ) : (
                            <FileText size={13} className="text-emerald-400 shrink-0" />
                          )}
                          <span>{ev.text}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="h-6 w-6 p-0 hover:bg-red-950/40 text-muted-foreground hover:text-red-400 rounded-md shrink-0 flex items-center justify-center border-0"
                          title="Delete Item"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input Form for new Note/Reminder */}
            <form onSubmit={handleAddEvent} className="border-t border-border pt-4 space-y-3">
              <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Create New Event Log
              </h5>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Schedule mock interview, review system design..."
                  value={eventText}
                  onChange={(e) => setEventText(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-secondary/30 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary placeholder-muted-foreground/60"
                  required
                />
                
                {/* Event Type Select Button group */}
                <div className="flex bg-secondary/40 border border-border p-0.5 rounded-lg select-none">
                  <button
                    type="button"
                    onClick={() => setEventType("note")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      eventType === "note"
                        ? "bg-accent text-emerald-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType("reminder")}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                      eventType === "reminder"
                        ? "bg-accent text-pink-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Alert
                  </button>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/95 text-white h-9 px-3 flex items-center justify-center gap-1 text-xs"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

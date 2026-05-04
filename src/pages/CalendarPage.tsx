import { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Users, 
  FileText,
  Flag,
  Info
} from "lucide-react";
import toast from "react-hot-toast";

// Types
type EventType = "meeting" | "holiday" | "report";

interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  type: EventType;
  time?: string;
}

// Hardcoded National Holidays (Month is 0-indexed: 0 = Jan, 4 = May, etc.)
const NATIONAL_HOLIDAYS: Record<string, string> = {
  "0-26": "Republic Day",
  "4-1": "Labour Day", 
  "7-15": "Independence Day",
  "9-2": "Gandhi Jayanti",
  "11-25": "Christmas",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  // Basic Calendar Math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentMonth];

  // 🧠 DYNAMIC EVENT GENERATOR: Processes rules for the current viewed month
  const currentMonthEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentYear, currentMonth, day);
      const dayOfWeek = dateObj.getDay(); // 0: Sun, 5: Fri, 6: Sat
      const holidayKey = `${currentMonth}-${day}`;
      const holidayName = NATIONAL_HOLIDAYS[holidayKey];

      // Rule 3: National Holidays
      if (holidayName) {
        events.push({ id: `hol-${day}`, day, title: holidayName, type: "holiday" });
      }

      // Rule 1: Every Friday -> Send Report
      if (dayOfWeek === 5) {
        events.push({ id: `rep-${day}`, day, title: "Submit Admin Report", type: "report", time: "EOD" });
      }

      // Rule 2: Every Saturday (Excluding Holidays) -> Team Meeting
      if (dayOfWeek === 6 && !holidayName) {
        events.push({ id: `meet-${day}`, day, title: "Weekly Team Sync", type: "meeting", time: "11:00 AM" });
      }
    }
    return events;
  }, [currentMonth, currentYear, daysInMonth]);

  // Navigation handlers
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const resetToToday = () => setCurrentDate(new Date());

  const handleAddEvent = () => {
    toast("Manual event creation will unlock when backend integration is complete.", { 
      icon: "🔒",
      style: { background: '#121214', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  // Helper to get event styling
  const getEventStyle = (type: EventType) => {
    switch (type) {
      case "meeting": return { color: "text-blue-400", bg: "bg-blue-400", glow: "shadow-[0_0_8px_rgba(96,165,250,0.8)]", icon: Users };
      case "holiday": return { color: "text-amber-400", bg: "bg-amber-400", glow: "shadow-[0_0_8px_rgba(251,191,36,0.8)]", icon: Flag };
      case "report": return { color: "text-accent-start", bg: "bg-accent-start", glow: "shadow-[0_0_8px_rgba(52,211,153,0.8)]", icon: FileText };
    }
  };

  // Separate holidays for the right panel list
  const holidaysThisMonth = currentMonthEvents.filter(e => e.type === "holiday");

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <CalendarIcon size={18} className="text-accent-start" />
            </div>
            Company Schedule
          </h2>
          <p className="text-sm text-zinc-400 mt-1.5 ml-14">
            Automated tracking for weekly reports, meetings, and holidays.
          </p>
        </div>
        
        {/* Protruding Skeuomorphic Action Button */}
        <button
          onClick={handleAddEvent}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] text-sm font-bold text-zinc-400 hover:text-accent-start transition-all duration-200 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] active:bg-black active:translate-y-0.5 cursor-pointer"
        >
          <Plus size={16} />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Side: Calendar Grid */}
        <div className="lg:col-span-2 rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#09090b] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_20px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-start/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Calendar Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {currentMonthName} <span className="text-zinc-500 font-bold">{currentYear}</span>
              </h3>
              {/* Jump to Today Button */}
              {(currentMonth !== today.getMonth() || currentYear !== today.getFullYear()) && (
                <button 
                  onClick={resetToToday}
                  className="px-3 py-1.5 rounded-lg bg-[#121214] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-[10px] font-black uppercase tracking-wider text-accent-start hover:text-white transition-colors cursor-pointer"
                >
                  Jump to Today
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={prevMonth}
                className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#121214] transition-all active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] active:bg-black cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={nextMonth}
                className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.6)] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#121214] transition-all active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] active:bg-black cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-3 relative z-10">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {day}
              </div>
            ))}
          </div>

          {/* Recessed Grid Slots */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 relative z-10">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl bg-black/20 border border-white/5 opacity-30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              const dayOfWeek = dateObj.getDay();
              
              const dayEvents = currentMonthEvents.filter(e => e.day === dayNum);
              const hasHoliday = dayEvents.some(e => e.type === "holiday");
              const isSunday = dayOfWeek === 0;
              const isToday = today.getDate() === dayNum && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

              const dotEvents = dayEvents.filter(e => e.type !== "holiday");

              let blockClasses = "bg-[#050505] border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] hover:bg-[#0c0c0e]";
              let textClasses = "text-zinc-400";

              if (isToday) {
                blockClasses = "bg-[#121214] border-accent-start/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8),0_0_10px_rgba(52,211,153,0.1)]";
                textClasses = "text-accent-start drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]";
              } else if (hasHoliday) {
                blockClasses = "bg-amber-950/20 border-amber-500/20 shadow-[inset_0_2px_15px_rgba(245,158,11,0.1)] hover:bg-amber-950/30";
                textClasses = "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]";
              } else if (isSunday) {
                blockClasses = "bg-red-950/10 border-red-500/10 shadow-[inset_0_2px_15px_rgba(239,68,68,0.05)] hover:bg-red-950/20";
                textClasses = "text-red-400/80 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]";
              }

              return (
                <div 
                  key={dayNum} 
                  className={`aspect-square relative rounded-xl border flex flex-col items-center justify-start pt-2 sm:pt-3 transition-colors ${blockClasses}`}
                >
                  <span className={`text-xs sm:text-sm font-extrabold ${textClasses}`}>
                    {dayNum}
                  </span>
                  
                  {/* Event LED Indicators (Holidays filtered out since block handles it) */}
                  <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center gap-1.5 px-1">
                    {dotEvents.map(event => {
                      const style = getEventStyle(event.type);
                      return (
                        <div 
                          key={event.id}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${style.bg} ${style.glow}`}
                          title={event.title}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Monthly Overview Legend */}
        <div className="rounded-3xl border border-white/5 border-t-white/10 bg-gradient-to-b from-[#18181b] to-[#0a0a0c] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex flex-col h-auto">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#09090b] border border-white/5 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.02),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <Info size={16} className="text-zinc-400" />
            </div>
            Monthly Overview
          </h3>

          <div className="flex-1 space-y-8">
            
            {/* Legend: Weekly Rules */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-4">Recurring Operations</h4>
              <div className="space-y-4">
                {/* Meeting Rule */}
                <div className="group p-4 rounded-xl border border-white/5 bg-[#121214] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center gap-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[30px] rounded-full pointer-events-none opacity-50" />
                  <div className="w-10 h-10 rounded-lg bg-[#09090b] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_8px_rgba(96,165,250,0.6)] flex items-center justify-center shrink-0 relative z-10">
                    <Users size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <h4 className="text-sm font-extrabold text-white mb-1">Weekly Team Sync</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Every Saturday • 11:00 AM</p>
                  </div>
                </div>

                {/* Report Rule */}
                <div className="group p-4 rounded-xl border border-white/5 bg-[#121214] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_8px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center gap-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent-start/5 blur-[30px] rounded-full pointer-events-none opacity-50" />
                  <div className="w-10 h-10 rounded-lg bg-[#09090b] border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_8px_rgba(52,211,153,0.6)] flex items-center justify-center shrink-0 relative z-10">
                    <FileText size={16} className="text-accent-start" />
                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <h4 className="text-sm font-extrabold text-white mb-1">Submit Admin Report</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Every Friday • EOD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Section: Holidays occurring this specific month */}
            <div>
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-4">Holidays in {currentMonthName}</h4>
              
              {holidaysThisMonth.length > 0 ? (
                <div className="space-y-3">
                  {holidaysThisMonth.map((holiday) => {
                    const isPast = today.getMonth() === currentMonth && today.getFullYear() === currentYear && holiday.day < today.getDate();
                    
                    return (
                      <div 
                        key={holiday.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${
                          isPast ? "bg-[#09090b] opacity-50" : "bg-[#121214]"
                        }`}
                      >
                        <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                          <Flag size={14} className="text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold truncate ${isPast ? 'text-zinc-500' : 'text-zinc-200'}`}>
                            {holiday.title}
                          </h4>
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                            {currentMonthName.substring(0,3)} {holiday.day}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-white/10 bg-[#09090b] text-center">
                  <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">No holidays this month</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
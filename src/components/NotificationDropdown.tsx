"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Loader2, Sparkles, Gift, Car, ShieldAlert, Award, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  fetchUserNotificationsAction, 
  fetchUnreadNotificationsCountAction, 
  markNotificationAsReadAction, 
  markAllNotificationsAsReadAction 
} from "@/actions/notification";

const typeIcons: Record<string, any> = {
  RIDE: Car,
  VERIFICATION: Award,
  PROMO: Sparkles,
  REFERRAL: Gift,
};

const typeColors: Record<string, string> = {
  RIDE: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  VERIFICATION: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  PROMO: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  REFERRAL: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const count = await fetchUnreadNotificationsCountAction();
      setUnreadCount(count);
      
      const list = await fetchUserNotificationsAction();
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    loadNotifications();

    // Vetted reactive polling for real-time notification syncing (Phase 4 & 5)
    const interval = setInterval(() => {
      loadNotifications();
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsReadAction(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await markAllNotificationsAsReadAction();
      await loadNotifications();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-zinc-550 hover:text-zinc-950 rounded-full hover:bg-zinc-900/[0.03] transition-all cursor-pointer flex items-center justify-center border border-transparent active:scale-95"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-red-600 rounded-full text-white text-[8px] font-black flex items-center justify-center border border-white shadow-sm font-mono shrink-0"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Glassmorphic Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2.5 w-[330px] bg-white/95 backdrop-blur-2xl border border-zinc-200/80 rounded-2xl shadow-xl z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4.5 py-3.5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/50">
              <span className="text-[12px] font-black text-zinc-950 tracking-tight">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={loading}
                  className="text-[10px] font-extrabold text-zinc-550 hover:text-zinc-950 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read All</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-zinc-100">
              {notifications.length > 0 ? (
                notifications.map((item) => {
                  const Icon = typeIcons[item.type] || Inbox;
                  const colorClass = typeColors[item.type] || "bg-zinc-50 text-zinc-650 border-zinc-200";
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                      className={`p-4 hover:bg-zinc-50/60 cursor-pointer flex gap-3 transition-colors relative ${
                        !item.isRead ? "bg-zinc-900/[0.01]" : ""
                      }`}
                    >
                      {/* Unread dot indicator */}
                      {!item.isRead && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      )}

                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${colorClass}`}>
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      
                      <div className="flex flex-col min-w-0 space-y-0.5">
                        <span className="text-[11.5px] font-bold text-zinc-900 truncate leading-snug">{item.title}</span>
                        <p className="text-[11px] text-zinc-450 font-medium leading-relaxed">{item.message}</p>
                        <span className="text-[9px] font-mono text-zinc-400">
                          {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <Inbox className="w-8 h-8 text-zinc-300 stroke-[1.5]" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-none">No messages</p>
                    <p className="text-[10px] text-zinc-450 font-medium">Inbox is currently cleared.</p>
                  </div>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

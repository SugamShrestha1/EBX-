import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, 
  Search, 
  HelpCircle, 
  Menu, 
  LogOut, 
  User, 
  Building,
  Key,
  ChevronDown,
  Sun,
  Moon
} from "lucide-react";
import { useLogout } from "../../hooks/useAuthApi";

/**
 * Topbar component — fully light/dark theme-aware via themeMode prop.
 */
export const Topbar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  setIsMobileOpen,
  themeMode,
  setThemeMode
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const isDark = themeMode === "dark";

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const t = {
    bar:       isDark ? "bg-[#070b13]/80 border-slate-800"         : "bg-white border-slate-200",
    btn:       isDark ? "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-white"
                      : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200",
    searchBg:  isDark ? "bg-slate-800/30 border-slate-800 text-slate-200 placeholder-slate-500 focus:bg-slate-800/60"
                      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white",
    searchFocusBorder: isDark ? "border-brand-primary/60" : "border-brand-primary",
    shortcut:  isDark ? "bg-slate-800 border-slate-700/80 text-slate-500" : "bg-slate-100 border-slate-300 text-slate-400",
    divider:   isDark ? "bg-slate-800"   : "bg-slate-200",
    dropdown:  isDark ? "bg-[#090d16] border-slate-800" : "bg-white border-slate-200",
    dropHead:  isDark ? "border-slate-800" : "border-slate-100",
    notifTitle:isDark ? "text-white"   : "text-slate-800",
    notifDesc: isDark ? "text-slate-500" : "text-slate-500",
    notifTime: isDark ? "text-slate-500" : "text-slate-400",
    notifRow:  isDark ? "divide-slate-800/50" : "divide-slate-100",
    notifDot:  "bg-brand-primary",
    markBtn:   isDark ? "text-brand-secondary hover:text-white border-slate-800" : "text-brand-primary hover:text-brand-primary/70 border-slate-100",
    menuItem:  isDark ? "text-slate-400 hover:bg-slate-800/45 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    profileName: isDark ? "text-white" : "text-slate-800",
    profileSub:  isDark ? "text-slate-400" : "text-slate-500",
    profileLabel: isDark ? "text-slate-500" : "text-slate-400",
    avatarRing:  isDark ? "" : "shadow-sm",
    themePanelBg: isDark ? "bg-slate-800/30 border-slate-800/60" : "bg-slate-100 border-slate-200",
    themeActive: isDark
      ? { dark: "bg-brand-primary/20 text-brand-primary", light: "text-slate-500 hover:text-slate-300" }
      : { dark: "text-slate-400 hover:text-slate-600",   light: "bg-brand-primary/10 text-brand-primary" },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "Inbound SMS spikes detected",     description: "SMS channel gateway #902 spike in traffic.", time: "2 mins ago",  unread: true  },
    { id: 2, title: "API key successfully regenerated", description: "System admin updated security nodes.",       time: "1 hour ago",  unread: false },
    { id: 3, title: "Credit threshold alert",           description: "Remaining wallet credits fell below warning.", time: "5 hours ago", unread: true  }
  ];

  return (
    <header className={`h-16 flex items-center justify-between px-6 border-b backdrop-blur-md sticky top-0 z-20 ${t.bar}`}>
      
      {/* Left: toggle + search */}
      <div className="flex items-center gap-4 flex-1">

        <button 
          onClick={() => setIsMobileOpen(prev => !prev)}
          className={`md:hidden p-2 rounded-lg border ${t.btn}`}
        >
          <Menu className="w-4 h-4" />
        </button>

        <button 
          onClick={() => setIsSidebarOpen(prev => !prev)}
          className={`hidden md:flex p-2 rounded-lg border transition-all duration-200 ${t.btn}`}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="hidden sm:block relative max-w-md w-full">
          <div className={`absolute inset-y-0 left-3 flex items-center pointer-events-none ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search channels, settings, node status..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`
              w-full h-9 pl-9 pr-12 rounded-xl text-xs border focus:outline-none transition-all duration-200
              ${t.searchBg}
              ${searchFocused ? `${t.searchFocusBorder} ring-2 ring-brand-primary/10 w-80` : ""}
            `}
          />
          <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none px-1.5 py-0.5 rounded border text-[8px] font-bold ${t.shortcut}`}>
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {/* Right: theme, help, notifications, profile */}
      <div className="flex items-center gap-3">
        
        {/* Theme toggler */}
        <div className={`flex items-center p-1 rounded-lg border ${t.themePanelBg}`}>
          <button 
            onClick={() => setThemeMode("dark")}
            className={`p-1.5 rounded-md transition-all ${t.themeActive.dark}`}
            title="Dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setThemeMode("light")}
            className={`p-1.5 rounded-md transition-all ${t.themeActive.light}`}
            title="Light mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Help */}
        <button className={`p-2 rounded-lg border transition-colors relative group ${t.btn}`}>
          <HelpCircle className="w-4 h-4" />
          <span className={`absolute top-full right-0 mt-2 px-2 py-1 rounded border text-[9px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 ${t.dropdown} ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            View Docs
          </span>
        </button>

        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => setShowNotifications(prev => !prev)}
            className={`p-2 rounded-lg border transition-colors relative ${t.btn} ${showNotifications ? (isDark ? "bg-slate-800/60 text-white" : "bg-slate-200 text-slate-800") : ""}`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-accent rounded-full animate-pulse shadow-[0_0_8px_#a855f7]" />
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-3 w-80 rounded-2xl border p-4 shadow-2xl z-40 animate-[fadeIn_0.2s_ease-out] ${t.dropdown}`}>
              <div className={`flex items-center justify-between pb-3 border-b ${t.dropHead}`}>
                <span className={`font-bold text-xs ${t.notifTitle}`}>Platform Alerts</span>
                <span className="px-2 py-0.5 rounded bg-brand-accent/20 text-brand-accent text-[9px] font-bold">2 unread</span>
              </div>
              <div className={`mt-2 divide-y ${t.notifRow}`}>
                {notifications.map((notif) => (
                  <div key={notif.id} className="py-3 flex gap-2 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[11px] font-semibold truncate ${notif.unread ? t.notifTitle : t.notifDesc}`}>
                          {notif.title}
                        </span>
                        <span className={`text-[8px] flex-shrink-0 ${t.notifTime}`}>{notif.time}</span>
                      </div>
                      <p className={`text-[10px] mt-0.5 leading-relaxed truncate ${t.notifDesc}`}>
                        {notif.description}
                      </p>
                    </div>
                    {notif.unread && <span className={`w-1.5 h-1.5 rounded-full self-center flex-shrink-0 ${t.notifDot}`} />}
                  </div>
                ))}
              </div>
              <button className={`w-full text-center mt-3 pt-2.5 border-t text-[10px] font-bold transition-all ${t.markBtn}`}>
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={`h-5 w-px mx-1 ${t.divider}`} />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setShowProfile(prev => !prev)}
            className={`flex items-center gap-2.5 p-1 rounded-xl transition-all text-left ${isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-100"}`}
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent p-[1px] ${t.avatarRing}`}>
              <div className={`w-full h-full rounded-[7px] flex items-center justify-center font-bold text-xs ${isDark ? "bg-[#0b0f19] text-slate-200" : "bg-white text-slate-700"}`}>
                JD
              </div>
            </div>
            <div className="hidden md:flex flex-col pr-1">
              <span className={`text-xs font-bold ${t.profileName}`}>John Doe</span>
              <span className="text-[9px] text-brand-secondary font-medium tracking-wide">Developer node</span>
            </div>
            <ChevronDown className={`hidden md:block w-3.5 h-3.5 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
          </button>

          {showProfile && (
            <div className={`absolute right-0 mt-3 w-64 rounded-2xl border p-2.5 shadow-2xl z-40 animate-[fadeIn_0.2s_ease-out] ${t.dropdown}`}>
              <div className={`px-3.5 py-3 border-b ${t.dropHead}`}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${t.profileLabel}`}>Account Active</span>
                <h4 className={`text-xs font-extrabold mt-1 ${t.profileName}`}>John Doe</h4>
                <p className={`text-[10px] mt-0.5 truncate ${t.profileSub}`}>john.doe@ekghanti.com</p>
              </div>

              <div className="py-2 space-y-0.5">
                <button className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs transition-all ${t.menuItem}`}>
                  <User className="w-4 h-4 text-brand-primary" />
                  <span>My Profile Settings</span>
                </button>
                <button className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs transition-all ${t.menuItem}`}>
                  <Building className="w-4 h-4 text-brand-secondary" />
                  <span>Organization Hub</span>
                </button>
                <button className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs transition-all ${t.menuItem}`}>
                  <Key className="w-4 h-4 text-brand-accent" />
                  <span>API Keys Node</span>
                </button>
              </div>

              <div className={`border-t pt-2 pb-1 ${t.dropHead}`}>
                <button
                  onClick={() => logout(undefined, { onSettled: () => navigate('/login') })}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-xs text-rose-500 hover:bg-rose-50 transition-all font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut className={`w-4 h-4 ${isLoggingOut ? 'animate-spin' : ''}`} />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

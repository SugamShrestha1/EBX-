import React, { useState } from "react";
import {
  X,
  Sparkles
} from "lucide-react";

import { useLocation } from 'react-router-dom';
import { NavigationItems } from "./NavigationItems";

/**
 * Sidebar component for the EBX platform.
 * Supports collapse states, nested sub-menus, dynamic active state styling, and indicators.
 * Fully light/dark theme-aware via the themeMode prop.
 */
export const Sidebar = ({
  isOpen,
  setIsOpen,
  isMobileOpen,
  setIsMobileOpen,
  themeMode
}) => {
  const location = useLocation();

  // Extract active tab from pathname (e.g. "/extensions" -> "extensions")
  const activeTab = location.pathname.substring(1) || 'extensions';

  const isDark = themeMode === "dark";

  // ── Theming token helpers ──────────────────────────────────────────────────
  const t = {
    bg: isDark ? "bg-[#090d16]/95" : "bg-white",
    border: isDark ? "border-slate-800" : "border-slate-200",
    headerBg: isDark ? "" : "bg-slate-50",
    brandText: isDark ? "from-white to-slate-300" : "from-slate-800 to-slate-600",
    navItemBase: isDark
      ? "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    navItemActive: isDark
      ? "bg-gradient-to-r from-brand-primary/10 to-transparent text-white border-l-2 border-brand-primary"
      : "bg-brand-primary/5 text-brand-primary border-l-2 border-brand-primary",
    iconActive: isDark ? "text-brand-primary" : "text-brand-primary",
    badgeBg: isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600",
    subText: isDark ? "text-slate-500 hover:text-slate-200" : "text-slate-500 hover:text-slate-800",
    subActive: isDark ? "text-brand-secondary bg-slate-800/20" : "text-brand-primary bg-brand-primary/5",
    tooltip: isDark ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-700",
    footerBg: isDark ? "bg-[#06090f]/50" : "bg-slate-50",
    footerText: isDark ? "text-slate-200" : "text-slate-700",
    footerSub: isDark ? "text-slate-500" : "text-slate-500",
    footerAvatar: isDark ? "bg-slate-800 border-slate-700 text-brand-secondary" : "bg-slate-100 border-slate-200 text-brand-primary",
    chevron: isDark ? "text-slate-500" : "text-slate-400",
  };



  const sidebarContent = (
    <div className={`flex flex-col h-full backdrop-blur-xl border-r ${t.bg} ${t.border}`}>

      {/* Brand Header */}
      <div className={`flex items-center justify-between h-16 px-5 border-b ${t.border} ${t.headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary shadow-[0_0_15px_rgba(99,102,241,0.4)] animate-pulse-slow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className={`font-bold text-sm tracking-wider bg-clip-text text-transparent bg-gradient-to-r ${t.brandText}`}>
                EBX PORTAL
              </span>
              <span className="text-[10px] text-brand-secondary font-medium tracking-widest">
                TELECOM v2.0
              </span>
            </div>
          )}
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className={`md:hidden p-1.5 rounded-lg ${isDark ? "bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"} transition-all`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
        <NavigationItems 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setIsMobileOpen={setIsMobileOpen}
          activeTab={activeTab}
          t={t}
          isDark={isDark}
        />
      </div>

      {/* Footer Info */}
      <div className={`p-4 border-t ${t.border} ${t.footerBg}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${t.footerAvatar}`}>
                EB
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 ${isDark ? "border-[#0b0f19]" : "border-white"} rounded-full`}></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-semibold truncate ${t.footerText}`}>Enterprise Gateway</span>
              <span className={`text-[10px] truncate ${t.footerSub}`}>active node</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${t.footerAvatar}`}>
                EB
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 ${isDark ? "border-[#0b0f19]" : "border-white"} rounded-full`}></span>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out z-30 h-screen
        ${isOpen ? "w-60" : "w-[68px]"}
      `}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className={`md:hidden fixed inset-0 z-40 ${isDark ? "bg-[#030712]/60" : "bg-slate-900/30"} backdrop-blur-sm`}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {sidebarContent}
      </aside>
    </>
  );
};

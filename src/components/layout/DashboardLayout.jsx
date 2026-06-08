import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * DashboardLayout provides a consistent, high-tech admin dashboard frame.
 * Wraps the Sidebar (left) and Topbar (top) with support for full page content
 * and child rendering slots.
 */
export const DashboardLayout = ({ 
  children, 
  onThemeChange       // optional callback — lets parent mirror current theme
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState("dark");

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (onThemeChange) onThemeChange(mode);
  };

  // Sync theme changes with body class for dark/light variations
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, [themeMode]);

  return (
    <div className={`
      flex w-screen h-screen overflow-hidden font-sans transition-colors duration-300
      ${themeMode === "light" 
        ? "bg-slate-50 text-slate-900" 
        : "bg-[#0b0f19] text-slate-100"
      }
    `}>
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        themeMode={themeMode}
      />

      {/* Main app panel */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden min-w-0 ${themeMode === "light" ? "bg-slate-100" : ""}`}>
        
        {/* Top bar control hub */}
        <Topbar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsMobileOpen={setIsMobileOpen}
          themeMode={themeMode}
          setThemeMode={handleThemeChange}
        />

        {/* Content area scroll frame */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-out]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

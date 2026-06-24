import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useThemeMode } from "../../contexts/ThemeContext";

/**
 * DashboardLayout provides a consistent, high-tech admin dashboard frame.
 * Wraps the Sidebar (left) and Topbar (top) with support for full page content
 * and child rendering slots.
 */
export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { themeMode, setThemeMode } = useThemeMode();

  return (
    <div
      className={`
        flex w-screen h-screen overflow-hidden font-sans transition-colors duration-300
        ${themeMode === "light"
          ? "bg-slate-50 text-slate-900"
          : "bg-[#0b0f19] text-slate-100"
        }
      `}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        themeMode={themeMode}
      />

      <div
        className={`flex-1 flex flex-col h-full overflow-hidden min-w-0 ${themeMode === "light" ? "bg-slate-100" : ""}`}
      >
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          setIsMobileOpen={setIsMobileOpen}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />

        <main className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col">
          <div className="w-full h-full mx-auto animate-[fadeIn_0.3s_ease-out] flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

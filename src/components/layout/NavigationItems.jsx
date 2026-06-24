import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMenus } from "../../hooks/useDashboardApi";
import {
  LayoutDashboard,
  Headset,
  Server,
  ClipboardList,
  PhoneCall,
  Activity,
  Monitor,
  PhoneOutgoing,
  Shield,
  Network,
  Users,
  BarChart,
  Route,
  Radio,
  Ban,
  Voicemail,
  ChevronDown,
  Menu,
} from "lucide-react";

// Icon map — maps icon name string (from data) to lucide component.
// When menus come from the API, add new icons here.
const ICON_MAP = {
  LayoutDashboard,
  Headset,
  Server,
  ClipboardList,
  PhoneCall,
  Activity,
  Monitor,
  PhoneOutgoing,
  Shield,
  Network,
  Users,
  BarChart,
  Route,
  Radio,
  Ban,
  Voicemail,
  Menu,
};

// ─── Dummy data (replace with API call in future) ───────────────────────────
import { navigationMenuData } from "../../data/navigationMenuData";
// ─────────────────────────────────────────────────────────────────────────────

export const NavigationItems = ({
  isOpen,
  setIsOpen,
  setIsMobileOpen,
  activeTab,
  t,
  isDark,
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const { data } = useGetMenus();

  console.log(data, "333")
  const toggleSubMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleItemClick = (item) => {
    if (item.subItems) {
      toggleSubMenu(item.id);
      if (!isOpen) setIsOpen(true);
    } else {
      navigate(`/${item.id}`);
      setIsMobileOpen(false);
    }
  };

  const handleSubItemClick = (parentItem, subItem) => {
    navigate(`/${parentItem.id}/${subItem.id}`);
    setIsMobileOpen(false);
  };

  const menusToRender = data?.data?.menu_items || [];

  return (
    <>
      {menusToRender.map((apiItem) => {
        // Transform the API data into the shape expected by the UI
        const item = {
          id: apiItem.slug,
          title: apiItem.name,
          icon: apiItem.icon
            ? apiItem.icon.replace(/^lucide-/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
            : '',
          badge: apiItem.badge_text || null,
          subItems: apiItem.children && apiItem.children.length > 0
            ? apiItem.children.map(child => ({ id: child.slug, title: child.name }))
            : null
        };

        const Icon = ICON_MAP[item.icon] ?? LayoutDashboard; // fallback icon
        const isSelected =
          activeTab === item.id || activeTab.startsWith(item.id + "/");
        const isExpanded = expandedMenus[item.id];

        return (
          <div key={item.id} className="relative space-y-1">
            <button
              onClick={() => handleItemClick(item)}
              className={`
                flex items-center w-full rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all duration-200 relative group
                ${isSelected ? t.navItemActive : t.navItemBase}
              `}
            >
              {/* Glow behind icon when selected (dark mode only) */}
              {isSelected && isDark && (
                <span className="absolute -left-[2px] w-[8px] h-[24px] rounded-r-md bg-brand-primary blur-[4px]"></span>
              )}

              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isSelected ? t.iconActive : "group-hover:scale-110"
                  }`}
              />

              {isOpen && (
                <span className="ml-3 flex-1 text-left truncate">
                  {item.title}
                </span>
              )}

              {isOpen && item.badge && (
                <span
                  className={`
                  ml-auto px-2 py-0.5 text-[9px] font-bold rounded-full
                  ${item.badge === "New"
                      ? "bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30"
                      : t.badgeBg
                    }
                `}
                >
                  {item.badge}
                </span>
              )}

              {isOpen && item.subItems && (
                <ChevronDown
                  className={`w-3.5 h-3.5 ml-auto ${t.chevron
                    } transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                    }`}
                />
              )}

              {/* Tooltip for collapsed mode */}
              {!isOpen && (
                <div
                  className={`absolute left-full ml-3 px-3 py-2 rounded-lg border text-[10px] font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-xl z-50 ${t.tooltip}`}
                >
                  {item.title}
                </div>
              )}
            </button>

            {/* Sub-menu Rendering as Dropdown */}
            {isOpen && item.subItems && isExpanded && (
              <div
                className={`
                  mt-1 p-2 rounded-xl border animate-[fadeIn_0.15s_ease-out]
                  ${t.bg} ${t.border}
                `}
              >
                <div className="flex flex-col space-y-1">
                  {item.subItems.map((sub) => {
                    const isSubSelected = activeTab === `${item.id}/${sub.id}`;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubItemClick(item, sub)}
                        className={`
                          flex items-center w-full rounded-lg px-4 py-2 text-[11px] font-medium transition-all duration-150
                          ${isSubSelected ? t.subActive : t.subText}
                          ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}
                        `}
                      >
                        <span
                          className={`
                            w-1.5 h-1.5 rounded-full mr-2.5 transition-all
                            ${isSubSelected
                              ? "bg-brand-secondary scale-125"
                              : isDark
                                ? "bg-slate-600"
                                : "bg-slate-300"
                            }
                          `}
                        ></span>
                        {sub.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

export const navigationData = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "agent",
    title: "Agent",
    icon: Headset,
    subItems: [
      { id: "statuses", title: "Agent Statuses" },
      { id: "agents", title: "Agents" },
    ],
  },
  {
    id: "asterisk",
    title: "Asterisk",
    icon: Server,
    subItems: [
      { id: "deployment-logs", title: "Deployment logs" },
      { id: "feature-codes", title: "Feature Codes" },
    ],
  },
  {
    id: "audit",
    title: "Audit",
    icon: ClipboardList,
    subItems: [
      { id: "activity-logs", title: "Activity Logs" },
    ],
  },
  {
    id: "calls",
    title: "Calls",
    icon: PhoneCall,
    subItems: [
      { id: "detail-records", title: "Call detail records" },
      { id: "dispositions-calls", title: "Call dispositions" },
      { id: "recordings", title: "Call recordings" },
      { id: "channel-event-logs", title: "Channel event logs" },
      { id: "dispositions", title: "Dispositions" },
      { id: "live-calls", title: "Live calls" },
    ],
  },
  {
    id: "celery-results",
    title: "Celery Results",
    icon: Activity,
    subItems: [
      { id: "group-results", title: "Group results" },
      { id: "task-results", title: "Task results" },
    ],
  },
  {
    id: "conference-and-monitor",
    title: "Conference & Monitor",
    icon: Monitor,
    subItems: [
      { id: "conference-rooms", title: "Conference Rooms" },
      { id: "monitor-sessions", title: "Monitor Sessions" },
    ],
  },
  {
    id: "dialer",
    title: "Dialer",
    icon: PhoneOutgoing,
    subItems: [
      { id: "callbacks", title: "Callbacks" },
      { id: "campaign-contacts", title: "Campaign Contacts" },
      { id: "outbound-campaigns", title: "Outbound Campaigns" },
    ],
  },
  {
    id: "identity",
    title: "Identity",
    icon: Shield,
    subItems: [
      { id: "departments", title: "Departments" },
      { id: "users", title: "Users" },
    ],
  },
  {
    id: "ivr",
    title: "IVR",
    icon: Network,
    subItems: [
      { id: "flows", title: "IVR Flows" },
      { id: "nodes", title: "IVR Nodes" },
      { id: "prompts", title: "IVR Prompts" },
      { id: "session-logs", title: "IVR Session Logs" },
      { id: "transitions", title: "IVR Transitions" },
    ],
  },
  {
    id: "queues",
    title: "Queues",
    icon: Users,
    subItems: [
      { id: "members", title: "Queue Members" },
      { id: "states", title: "Queue states" },
      { id: "list", title: "Queues" },
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    icon: BarChart,
    subItems: [
      { id: "agent-performance", title: "Agent Performance Rep..." },
      { id: "hourly-cdr", title: "Hourly CDR Aggregates" },
      { id: "missed-call", title: "Missed Call Reports" },
      { id: "queue-performance", title: "Queue Performance Re..." },
    ],
  },
  {
    id: "routing",
    title: "Routing",
    icon: Route,
    subItems: [
      { id: "holidays", title: "Holidays" },
      { id: "inbound", title: "Inbound Routes" },
      { id: "outbound", title: "Outbound Routes" },
      { id: "ring-groups", title: "Ring Groups" },
      { id: "time-conditions", title: "Time Conditions" },
    ],
  },
  {
    id: "telephony",
    title: "Telephony",
    icon: Radio,
    subItems: [
      { id: "did-numbers", title: "DID Numbers" },
      { id: "devices", title: "Devices" },
      { id: "emergency-numbers", title: "Emergency Numbers" },
      { id: "extensions", title: "Extensions" },
      { id: "music-on-hold", title: "Music On Hold Classes" },
      { id: "parking-lots", title: "Parking Lots" },
      { id: "transport-bindings", title: "Transport Bindings" },
      { id: "trunks", title: "Trunks" },
    ],
  },
  {
    id: "token-blacklist",
    title: "Token Blacklist",
    icon: Ban,
    subItems: [
      { id: "blacklisted-tokens", title: "Blacklisted Tokens" },
      { id: "outstanding-tokens", title: "Outstanding Tokens" },
    ],
  },
  {
    id: "voicemail",
    title: "Voicemail",
    icon: Voicemail,
    subItems: [
      { id: "boxes", title: "Voicemail Boxes" },
      { id: "messages", title: "Voicemail Messages" },
    ],
  },
];

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
    navigate(`/${parentItem.id}-${subItem.id}`);
    setIsMobileOpen(false);
  };

  return (
    <>
      {navigationData.map((item) => {
        const Icon = item.icon;
        const isSelected =
          activeTab === item.id || activeTab.startsWith(item.id + "-");
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
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isSelected ? t.iconActive : "group-hover:scale-110"
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
                  ${
                    item.badge === "New"
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
                  className={`w-3.5 h-3.5 ml-auto ${
                    t.chevron
                  } transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
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
                    const isSubSelected = activeTab === `${item.id}-${sub.id}`;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubItemClick(item, sub)}
                        className={`
                          flex items-center w-full rounded-lg px-4 py-2 text-[11px] font-medium transition-all duration-150
                          ${isSubSelected ? t.subActive : t.subText}
                          ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}
                        `}
                      >
                        <span
                          className={`
                            w-1.5 h-1.5 rounded-full mr-2.5 transition-all
                            ${
                              isSubSelected
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

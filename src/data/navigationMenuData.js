/**
 * Dummy navigation menu data.
 * In the future, this will be fetched from the API.
 * Replace this static array with an API call when the backend endpoint is ready.
 *
 * Shape of each menu item:
 * {
 *   id: string,         — used for routing (/id) and active state matching
 *   title: string,      — display label
 *   icon: string,       — lucide icon name (mapped in NavigationItems.jsx)
 *   badge: string|null, — optional badge text e.g. "New"
 *   subItems: [         — optional sub-menu items
 *     { id: string, title: string }
 *   ]
 * }
 */

export const navigationMenuData = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "LayoutDashboard",
    badge: null,
  },
  {
    id: "agent",
    title: "Agent",
    icon: "Headset",
    subItems: [
      { id: "statuses", title: "Agent Statuses" },
      { id: "agents", title: "Agents" },
    ],
  },
  {
    id: "asterisk",
    title: "Asterisk",
    icon: "Server",
    subItems: [
      { id: "deployment-logs", title: "Deployment Logs" },
      { id: "feature-codes", title: "Feature Codes" },
    ],
  },
  {
    id: "audit",
    title: "Audit",
    icon: "ClipboardList",
    subItems: [
      { id: "activity-logs", title: "Activity Logs" },
    ],
  },
  {
    id: "calls",
    title: "Calls",
    icon: "PhoneCall",
    subItems: [
      { id: "detail-records", title: "Call Detail Records" },
      { id: "dispositions-calls", title: "Call Dispositions" },
      { id: "recordings", title: "Call Recordings" },
      { id: "channel-event-logs", title: "Channel Event Logs" },
      { id: "dispositions", title: "Dispositions" },
      { id: "live-calls", title: "Live Calls" },
    ],
  },
  {
    id: "celery-results",
    title: "Celery Results",
    icon: "Activity",
    subItems: [
      { id: "group-results", title: "Group Results" },
      { id: "task-results", title: "Task Results" },
    ],
  },
  {
    id: "conference-and-monitor",
    title: "Conference & Monitor",
    icon: "Monitor",
    subItems: [
      { id: "conference-rooms", title: "Conference Rooms" },
      { id: "monitor-sessions", title: "Monitor Sessions" },
    ],
  },
  {
    id: "dialer",
    title: "Dialer",
    icon: "PhoneOutgoing",
    subItems: [
      { id: "callbacks", title: "Callbacks" },
      { id: "campaign-contacts", title: "Campaign Contacts" },
      { id: "outbound-campaigns", title: "Outbound Campaigns" },
    ],
  },
  {
    id: "identity",
    title: "Identity",
    icon: "Shield",
    subItems: [
      { id: "departments", title: "Departments" },
      { id: "users", title: "Users" },
    ],
  },
  {
    id: "ivr",
    title: "IVR",
    icon: "Network",
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
    icon: "Users",
    subItems: [
      { id: "members", title: "Queue Members" },
      { id: "states", title: "Queue States" },
      { id: "list", title: "Queues" },
    ],
  },
  {
    id: "reporting",
    title: "Reporting",
    icon: "BarChart",
    subItems: [
      { id: "agent-performance", title: "Agent Performance Report" },
      { id: "hourly-cdr", title: "Hourly CDR Aggregates" },
      { id: "missed-call", title: "Missed Call Reports" },
      { id: "queue-performance", title: "Queue Performance Report" },
    ],
  },
  {
    id: "routing",
    title: "Routing",
    icon: "Route",
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
    icon: "Radio",
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
    icon: "Ban",
    subItems: [
      { id: "blacklisted-tokens", title: "Blacklisted Tokens" },
      { id: "outstanding-tokens", title: "Outstanding Tokens" },
    ],
  },
  {
    id: "voicemail",
    title: "Voicemail",
    icon: "Voicemail",
    subItems: [
      { id: "boxes", title: "Voicemail Boxes" },
      { id: "messages", title: "Voicemail Messages" },
    ],
  },
];

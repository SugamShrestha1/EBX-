import React from 'react';
import {
  PhoneCall,
  Headset,
  Activity,
  Server,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useUserData } from '../hooks/useDashboardApi';

const data = [
  { time: '00h', calls: 20 },
  { time: '04h', calls: 80 },
  { time: '08h', calls: 60 },
  { time: '12h', calls: 140 },
  { time: '16h', calls: 214 },
  { time: '20h', calls: 130 },
  { time: '24h', calls: 160 },
];

const liveCalls = [
  { id: '201', agent: 'Sarah K.', caller: '+1 555 0199', status: 'Active', duration: '04:12' },
  { id: '205', agent: 'Mark T.', caller: '+44 20 7123', status: 'Active', duration: '00:03' },
  { id: '210', agent: 'Elena G.', caller: '+1 415 8812', status: 'On Hold', duration: '00:30' },
  { id: '215', agent: 'David W.', caller: '+1 212 9982', status: 'Ringing', duration: '00:08' },
];

export const Dashboard = ({ isDark = true }) => {
  const { data: usersData, isLoading: isUsersLoading } = useUserData();
  console.log(usersData, 'data')
  return (
    <div className={`flex-1 p-6 space-y-6 ${isDark ? 'text-slate-100 bg-[#06090f]' : 'text-slate-800 bg-slate-50'} overflow-y-auto h-full`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-white to-slate-400' : 'from-slate-800 to-slate-500'}`}>
            System Overview
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time PBX analytics and monitoring</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg border border-brand-primary/20 hover:bg-brand-primary/20 transition-all font-medium text-sm">
          <Activity className="w-4 h-4" />
          Live View
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Calls Card */}
        <div className={`${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} backdrop-blur-xl border rounded-2xl p-5 relative overflow-hidden group transition-colors`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center gap-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <PhoneCall className="w-5 h-5 text-indigo-400" />
              Active Calls
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>147</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">+8.2%</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>vs last hour</span>
          </div>
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-800/50 text-slate-400' : 'border-slate-100 text-slate-500'} flex justify-between text-xs`}>
            <span>3 calls on hold</span>
            <span>12 pending</span>
          </div>
        </div>

        {/* Online Agents Card */}
        <div className={`${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} backdrop-blur-xl border rounded-2xl p-5 relative overflow-hidden group transition-colors`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center gap-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Headset className="w-5 h-5 text-cyan-400" />
              Online Agents
            </div>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>94</span>
            <span className="text-xl text-slate-500 font-medium mb-1">/110</span>
          </div>

          <div className={`w-full h-1.5 rounded-full mt-4 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-[85%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
          </div>

          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-800/50 text-slate-400' : 'border-slate-100 text-slate-500'} flex justify-between text-xs`}>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> 72 Available</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span> 22 On Call</span>
          </div>
        </div>

        {/* Server Health Card */}
        <div className={`${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} backdrop-blur-xl border rounded-2xl p-5 relative overflow-hidden group transition-colors`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center gap-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Server className="w-5 h-5 text-emerald-400" />
              Server Health
            </div>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>98.5%</div>
          <div className="text-emerald-500 text-sm font-medium">Stable</div>
          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-800/50 text-slate-400' : 'border-slate-100 text-slate-500'} flex justify-between text-xs`}>
            <span>Latency: 42ms</span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Call Volume (24 Hours)
          </h2>
          <button className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'} transition-colors`}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} vertical={false} />
              <XAxis dataKey="time" stroke={isDark ? "#475569" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#475569" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: isDark ? '#e2e8f0' : '#0f172a' }}
              />
              <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Calls Table */}
      <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-xl border rounded-2xl overflow-hidden`}>
        <div className={`p-5 border-b ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'} flex justify-between items-center`}>
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Live Calls</h2>
          <span className="bg-indigo-500/20 text-indigo-500 text-xs px-2 py-1 rounded font-medium border border-indigo-500/30">Auto-updating</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase ${isDark ? 'text-slate-400 bg-slate-900/30' : 'text-slate-500 bg-slate-50/50'}`}>
              <tr>
                <th className="px-6 py-4 font-medium">Extension</th>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Caller ID</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Duration</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
              {liveCalls.map((call, idx) => (
                <tr key={idx} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className="px-6 py-4 font-medium">{call.id}</td>
                  <td className={`px-6 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{call.agent}</td>
                  <td className={`px-6 py-4 font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{call.caller}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${call.status === 'Active' ? 'bg-emerald-400' :
                          call.status === 'On Hold' ? 'bg-amber-400' : 'bg-cyan-400'
                          }`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${call.status === 'Active' ? 'bg-emerald-500' :
                          call.status === 'On Hold' ? 'bg-amber-500' : 'bg-cyan-500'
                          }`}></span>
                      </span>
                      <span className={`text-xs font-medium ${call.status === 'Active' ? 'text-emerald-500' :
                        call.status === 'On Hold' ? 'text-amber-500' : 'text-cyan-500'
                        }`}>{call.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{call.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

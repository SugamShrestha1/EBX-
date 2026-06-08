import React from 'react';

export const StatusBadge = ({ status }) => {
  const map = {
    Online:       { dot: 'bg-emerald-400', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    'In Call':    { dot: 'bg-brand-primary', cls: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' },
    Offline:      { dot: 'bg-rose-400',    cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    Registered:   { dot: 'bg-emerald-400', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    Unregistered: { dot: 'bg-rose-400',    cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    Active:       { dot: 'bg-emerald-400', cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    Suspended:    { dot: 'bg-rose-400',    cls: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  };
  const { dot, cls } = map[status] ?? { dot: 'bg-slate-400', cls: 'bg-slate-100 text-slate-500 border-slate-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

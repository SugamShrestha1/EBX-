import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';

export const Queue = ({ t }) => {
  const [queues] = useState([
    { name: 'Support Queue',    strategy: 'Least Recent', agents: '4 Active', waiting: 3, avgWait: '1m 24s' },
    { name: 'Sales Ring Group', strategy: 'Ring All',     agents: '5 Active', waiting: 0, avgWait: '0m 12s' },
    { name: 'VIP Escalation',   strategy: 'Random',       agents: '2 Active', waiting: 1, avgWait: '0m 45s' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Call Waiting Queues" description="Control call distribution, waiting queues, and SLAs" action="+ Add Queue" t={t} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {queues.map((q, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${t.card} space-y-4`}>
            <div className={`flex items-center justify-between pb-3 border-b ${t.border}`}>
              <h3 className={`text-sm font-bold ${t.heading}`}>{q.name}</h3>
              <span className="text-[9px] font-bold text-brand-secondary bg-brand-secondary/15 px-2 py-0.5 rounded">{q.strategy}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className={`text-[10px] ${t.tdSub}`}>Active Agents</span>
                <p className={`font-bold ${t.tdPrimary}`}>{q.agents}</p>
              </div>
              <div className="space-y-1">
                <span className={`text-[10px] ${t.tdSub}`}>Avg Wait</span>
                <p className={`font-bold ${t.tdPrimary}`}>{q.avgWait}</p>
              </div>
            </div>
            <div className={`pt-3 border-t ${t.border} flex items-center justify-between text-xs`}>
              <span className={t.tdSub}>Callers Waiting</span>
              <span className={`font-black ${q.waiting > 0 ? 'text-amber-500 animate-pulse' : t.tdSub}`}>
                {q.waiting} Callers
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

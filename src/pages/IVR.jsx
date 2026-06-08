import React from 'react';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

export const IVR = ({ t }) => {
  return (
    <div className="space-y-6">
      <PageHeader title="Interactive Voice Response (IVR) Builder" description="Design automated telephone decision matrices" action="+ Construct IVR Menu" t={t} />
      <div className={`p-6 rounded-2xl border ${t.card}`}>
        <div className={`flex items-center justify-between mb-6 pb-4 border-b ${t.border}`}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-secondary animate-pulse"></div>
            <h3 className={`text-sm font-extrabold ${t.heading}`}>IVR Path: Main_Menu_v1</h3>
          </div>
          <span className={`text-[10px] font-bold ${t.tdSub}`}>Last updated: 2 hours ago</span>
        </div>
        <div className="space-y-4">
          {[
            { n: 1, label: 'Customer presses 1', sub: 'Route to Support Queue' },
            { n: 2, label: 'Customer presses 2', sub: 'Route to Sales Ring Group' },
            { n: 3, label: 'Customer presses 3', sub: 'Play After Hours announcement' },
          ].map(({ n, label, sub }) => (
            <div key={n} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${t.ivrNode}`}>
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs ${t.ivrNumBg[n]}`}>{n}</span>
                <div>
                  <h4 className={`text-xs font-bold ${t.tdPrimary}`}>{label}</h4>
                  <p className={`text-[10px] mt-0.5 ${t.tdSub}`}>{sub}</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${t.tdSub}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const Routes = ({ t }) => {
  const [routes] = useState([
    { name: 'Inbound Standard',    pattern: '+977*', destination: 'IVR Main Menu',  priority: 1, status: 'Active'    },
    { name: 'Outbound Mobile',     pattern: '98*',   destination: 'Ncell-PRI Trunk', priority: 2, status: 'Active'    },
    { name: 'Outbound International', pattern: '00*', destination: 'EBX-Intl Trunk', priority: 3, status: 'Suspended' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Call Routing Pipelines" description="Determine how inbound and outbound calls match destination endpoints" action="+ Add Route Rule" t={t} />
      <div className={`p-6 rounded-2xl border ${t.card}`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-4 ${t.sectionLabel}`}>Route List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${t.border} text-[10px] font-bold uppercase tracking-wider ${t.th}`}>
                <th className="pb-3">Route Name</th>
                <th className="pb-3">Dial Pattern</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divRow} text-xs`}>
              {routes.map((rt, idx) => (
                <tr key={idx} className={t.rowHover}>
                  <td className={`py-4 font-semibold ${t.tdPrimary}`}>{rt.name}</td>
                  <td className="py-4 font-mono font-bold text-brand-secondary">{rt.pattern}</td>
                  <td className={`py-4 ${t.tdSub}`}>{rt.destination}</td>
                  <td className={`py-4 font-mono ${t.tdMono}`}>#{rt.priority}</td>
                  <td className="py-4 text-right"><StatusBadge status={rt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

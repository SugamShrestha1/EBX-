import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const Extensions = ({ t }) => {
  const [extensions] = useState([
    { number: '101', name: 'John Doe',        protocol: 'WebRTC',           status: 'Online',  ip: '192.168.10.45' },
    { number: '102', name: 'Sarah Smith',     protocol: 'SIP (Hardware)',    status: 'In Call', ip: '192.168.10.68' },
    { number: '103', name: 'Support Node A',  protocol: 'SIP (Software)',    status: 'Offline', ip: '10.0.4.12'     },
    { number: '104', name: 'IVR Gateway',     protocol: 'System Loop',       status: 'Online',  ip: 'localhost'     },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="PBX Extensions Registry" description="Manage agents, protocols, and real-time extension nodes" action="+ Add Extension" t={t} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${t.card}`}>
          <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-4 ${t.sectionLabel}`}>Active Extensions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${t.border} text-[10px] font-bold uppercase tracking-wider ${t.th}`}>
                  <th className="pb-3">Ext</th>
                  <th className="pb-3">Assignee</th>
                  <th className="pb-3">Protocol</th>
                  <th className="pb-3">Network IP</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${t.divRow} text-xs`}>
                {extensions.map((ext) => (
                  <tr key={ext.number} className={t.rowHover}>
                    <td className="py-3.5 font-bold text-brand-secondary">{ext.number}</td>
                    <td className={`py-3.5 font-semibold ${t.tdPrimary}`}>{ext.name}</td>
                    <td className={`py-3.5 ${t.tdSub}`}>{ext.protocol}</td>
                    <td className={`py-3.5 font-mono ${t.tdMono}`}>{ext.ip}</td>
                    <td className="py-3.5"><StatusBadge status={ext.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${t.card}`}>
          <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-4 ${t.sectionLabel}`}>Device Status</h3>
          <div className="space-y-4">
            <div>
              <div className={`flex justify-between text-xs font-semibold mb-1.5 ${t.tdSub}`}>
                <span>SIP Channels Active</span>
                <span className={t.tdPrimary}>3 / 4 Online</span>
              </div>
              <div className={`h-2 w-full rounded-full overflow-hidden ${t.progressBg}`}>
                <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className={`pt-2 border-t ${t.border} flex items-center justify-between text-xs`}>
              <span className={t.tdSub}>Node Location</span>
              <span className={`font-mono font-bold ${t.tdPrimary}`}>Kathmandu HQ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';

export const Trunk = ({ t }) => {
  const [trunks] = useState([
    { id: 'NT-SIP',    provider: 'Nepal Telecom SIP',  host: '10.50.40.12',         channels: '30 / 30 Active', status: 'Registered'   },
    { id: 'Ncell-PRI', provider: 'Ncell E1 Trunk',     host: '172.16.8.5',          channels: '12 / 30 Active', status: 'Registered'   },
    { id: 'EBX-Intl',  provider: 'EBX Cloud Global',   host: 'sip.global.ebx.com',  channels: '0 / 100 Active', status: 'Unregistered' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="SIP Trunks & PSTN Gateways" description="Monitor trunk connections and concurrent channel pools" action="+ Add SIP Trunk" t={t} />
      <div className={`p-6 rounded-2xl border ${t.card}`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-4 ${t.sectionLabel}`}>Trunk Node Registries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${t.border} text-[10px] font-bold uppercase tracking-wider ${t.th}`}>
                <th className="pb-3">Trunk ID</th>
                <th className="pb-3">Carrier / Provider</th>
                <th className="pb-3">Host Domain</th>
                <th className="pb-3">Concurrent Channels</th>
                <th className="pb-3 text-right">State</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divRow} text-xs`}>
              {trunks.map((tr) => (
                <tr key={tr.id} className={t.rowHover}>
                  <td className="py-4 font-bold text-brand-secondary">{tr.id}</td>
                  <td className={`py-4 font-semibold ${t.tdPrimary}`}>{tr.provider}</td>
                  <td className={`py-4 font-mono ${t.tdMono}`}>{tr.host}</td>
                  <td className={`py-4 ${t.tdSub}`}>{tr.channels}</td>
                  <td className="py-4 text-right"><StatusBadge status={tr.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

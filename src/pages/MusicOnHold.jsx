import React, { useState } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

export const MusicOnHold = ({ t }) => {
  const [musicFiles] = useState([
    { id: 1, title: 'Corporate Chill Out Jazz',    format: 'MP3', size: '4.2 MB',  activeClass: 'Default Hold' },
    { id: 2, title: 'Lo-Fi Lounge Beats',          format: 'WAV', size: '12.8 MB', activeClass: 'Sales Hold'   },
    { id: 3, title: 'Synthesized Ambient Tech',    format: 'MP3', size: '3.8 MB',  activeClass: 'None'         },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Music on Hold Playlists" description="Configure audio playlists to broadcast during call holds" action="+ Upload Audio" t={t} />
      <div className={`p-6 rounded-2xl border ${t.card}`}>
        <h3 className={`text-xs font-extrabold uppercase tracking-widest mb-4 ${t.sectionLabel}`}>Hold Playlists</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${t.border} text-[10px] font-bold uppercase tracking-wider ${t.th}`}>
                <th className="pb-3">Audio Title</th>
                <th className="pb-3">Format</th>
                <th className="pb-3">Size</th>
                <th className="pb-3">Assigned To</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${t.divRow} text-xs`}>
              {musicFiles.map((music) => (
                <tr key={music.id} className={t.rowHover}>
                  <td className={`py-4 font-semibold ${t.tdPrimary}`}>{music.title}</td>
                  <td className={`py-4 ${t.tdSub}`}>{music.format}</td>
                  <td className={`py-4 font-mono ${t.tdMono}`}>{music.size}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      music.activeClass !== 'None'
                        ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20'
                        : t.isDark ? 'bg-slate-800/50 text-slate-500 border-slate-800' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {music.activeClass}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button className={`p-1.5 rounded transition-colors ${t.btnIcon}`}><Play className="w-3.5 h-3.5 fill-current" /></button>
                    <button className={`p-1.5 rounded transition-colors ${t.btnDanger}`}><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

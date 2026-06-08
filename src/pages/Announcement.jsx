import React, { useState } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';

export const Announcement = ({ t }) => {
  const [isPlayingAnnouncement, setIsPlayingAnnouncement] = useState(null);
  const [announcements] = useState([
    { id: 1, name: 'Welcome Prompt Nepal',       duration: '0:15', created: '2026-05-12' },
    { id: 2, name: 'Support Queue Greeting',     duration: '0:22', created: '2026-05-28' },
    { id: 3, name: 'After Hours Voicemail',      duration: '0:45', created: '2026-06-01' },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="System Announcements & Voice Prompts" description="Upload audio files played during IVR routing or call holds" action="+ Add Recording" t={t} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.map((ann) => (
          <div key={ann.id} className={`p-5 rounded-2xl border ${t.card} ${t.cardHover} flex flex-col justify-between h-44 group transition-all`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-brand-secondary bg-brand-secondary/15 px-2 py-0.5 rounded uppercase tracking-wider">Voice prompt</span>
                <h3 className={`text-sm font-bold group-hover:text-brand-secondary transition-colors mt-2 ${t.heading}`}>{ann.name}</h3>
              </div>
              <button
                onClick={() => setIsPlayingAnnouncement(isPlayingAnnouncement === ann.id ? null : ann.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${t.btnIcon} hover:!bg-brand-primary hover:!text-white`}
              >
                {isPlayingAnnouncement === ann.id
                  ? <Pause className="w-3.5 h-3.5 fill-current" />
                  : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
            </div>
            <div className={`flex items-center justify-between pt-4 border-t ${t.border} text-[10px] ${t.tdSub}`}>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ann.duration}</span>
              <span>Uploaded: {ann.created}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

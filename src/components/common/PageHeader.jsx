import React from 'react';

export const PageHeader = ({ title, description, action, t }) => (
  <div className="flex items-center justify-between">
    <div>
      <h2 className={`text-xl font-extrabold ${t.heading}`}>{title}</h2>
      <p className={`text-xs mt-0.5 ${t.pageDesc}`}>{description}</p>
    </div>
    {action && (
      <button className="h-9 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90 transition-all shadow-lg shadow-brand-primary/10">
        {action}
      </button>
    )}
  </div>
);

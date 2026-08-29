import React from 'react';

const variants = {
  default:  'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
  blue:     'bg-[#EEF3FF] dark:bg-[#14213c] text-[#000080] dark:text-[#d2e0ff]',
  green:    'bg-[#EAF9ED] dark:bg-[#162a1f] text-[#138808] dark:text-[#a8e4b9]',
  red:      'bg-[#FFF1F1] dark:bg-[#2a1e1e] text-[#D93025] dark:text-[#f9b1b1]',
  amber:    'bg-[#FFF2E6] dark:bg-[#2a1d10] text-[#B86A00] dark:text-[#ffd8a0]',
  purple:   'bg-[#F3ECFF] dark:bg-[#231b39] text-[#5032A0] dark:text-[#d7c2ff]',
  teal:     'bg-[#EAF9F5] dark:bg-[#112a29] text-[#0F766E] dark:text-[#9ae5d2]',
  orange:   'bg-[#FFF7E8] dark:bg-[#2a1d10] text-[#B86A00] dark:text-[#ffd8a0]',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '', dot = false }) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClass} ${variants[variant] || variants.default} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    'Planned':      'default',
    'Approved':     'blue',
    'In Progress':  'amber',
    'Delayed':      'red',
    'Completed':    'green',
    'Reported':     'red',
    'Under Review': 'orange',
    'Assigned':     'amber',
    'Resolved':     'green',
    'Closed':       'default',
  };
  return <Badge variant={map[status] || 'default'} dot>{status}</Badge>;
}

export function ConditionBadge({ condition }) {
  let variant, label;
  if (condition >= 8) { variant = 'green'; label = 'Excellent'; }
  else if (condition >= 6) { variant = 'teal'; label = 'Good'; }
  else if (condition === 5) { variant = 'blue'; label = 'Fair'; }
  else if (condition >= 3) { variant = 'amber'; label = 'Poor'; }
  else { variant = 'red'; label = 'Critical'; }
  return <Badge variant={variant}>{condition}/10 — {label}</Badge>;
}

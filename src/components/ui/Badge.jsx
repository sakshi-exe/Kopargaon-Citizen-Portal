import React from 'react';

const variants = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  navy:    'bg-navy-50 dark:bg-navy-950/60 text-navy-800 dark:text-navy-300 border border-navy-200 dark:border-navy-800/80',
  blue:    'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  green:   'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  red:     'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  amber:   'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  saffron: 'bg-saffron-50 dark:bg-saffron-950/50 text-saffron-800 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-800',
  orange:  'bg-orange-50 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
  purple:  'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
  teal:    'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
};

export function Badge({ children, variant = 'default', size = 'sm', className = '', dot = false }) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full tracking-tight ${sizeClass} ${variants[variant] || variants.default} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    'Planned':      'default',
    'Approved':     'navy',
    'In Progress':  'amber',
    'Delayed':      'red',
    'Completed':    'green',
    'Reported':     'red',
    'Under Review': 'orange',
    'Assigned':     'saffron',
    'Resolved':     'green',
    'Verified':     'green',
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
  return <Badge variant={variant} dot>{condition}/10 — {label}</Badge>;
}


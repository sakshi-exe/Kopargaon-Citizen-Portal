import React from 'react';

const variants = {
  default:  'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  blue:     'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  green:    'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  red:      'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  amber:    'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  purple:   'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  teal:     'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  orange:   'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
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

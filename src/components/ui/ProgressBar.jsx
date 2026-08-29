import React from 'react';

export function ProgressBar({ value = 0, max = 100, color = 'blue', size = 'md', showLabel = false, label = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colorMap = {
    blue:   'bg-navy-600 dark:bg-navy-500',
    green:  'bg-emerald-600 dark:bg-emerald-500',
    amber:  'bg-saffron-500 dark:bg-saffron-400',
    red:    'bg-red-500 dark:bg-red-400',
    purple: 'bg-purple-500',
    teal:   'bg-teal-500',
    navy:   'bg-navy-700 dark:bg-navy-400',
  };
  const sizeMap = {
    xs:  'h-1',
    sm:  'h-1.5',
    md:  'h-2',
    lg:  'h-2.5',
    xl:  'h-3.5',
  };

  // Auto-color by value when color === 'auto'
  const autoColor = pct >= 80 ? 'bg-emerald-600 dark:bg-emerald-500' : pct >= 50 ? 'bg-blue-600 dark:bg-blue-500' : pct >= 25 ? 'bg-saffron-500 dark:bg-saffron-400' : 'bg-red-500 dark:bg-red-400';
  const usedColor = color === 'auto' ? autoColor : (colorMap[color] || 'bg-blue-600');

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-400 truncate pr-2">{label}</span>
          <span className="font-bold font-mono text-slate-800 dark:text-slate-200 flex-shrink-0">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 ${sizeMap[size] || sizeMap.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${usedColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MultiProgressBar({ segments = [] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`h-full transition-all duration-300 ${seg.color}`}
          style={{ width: `${(seg.value / total) * 100}%` }}
          title={`${seg.label}: ${seg.value}`}
        />
      ))}
    </div>
  );
}


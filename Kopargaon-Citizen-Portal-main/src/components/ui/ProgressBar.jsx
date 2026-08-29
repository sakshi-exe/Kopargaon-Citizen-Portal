import React from 'react';

export function ProgressBar({ value = 0, max = 100, color = 'blue', size = 'md', showLabel = false, label = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colorMap = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    amber:  'bg-amber-500',
    red:    'bg-red-500',
    purple: 'bg-purple-500',
    teal:   'bg-teal-500',
  };
  const sizeMap = {
    xs:  'h-1',
    sm:  'h-1.5',
    md:  'h-2',
    lg:  'h-3',
    xl:  'h-4',
  };

  // Auto-color by value when color === 'auto'
  const autoColor = value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-blue-500' : value >= 20 ? 'bg-amber-500' : 'bg-red-500';
  const usedColor = color === 'auto' ? autoColor : (colorMap[color] || 'bg-blue-500');

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${sizeMap[size] || sizeMap.md}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${usedColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MultiProgressBar({ segments = [] }) {
  // segments: [{label, value, color}] — values are absolute, auto-normalized
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <div className="w-full h-3 rounded-full overflow-hidden flex">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={`h-full ${seg.color}`}
          style={{ width: `${(seg.value / total) * 100}%` }}
          title={`${seg.label}: ${seg.value}`}
        />
      ))}
    </div>
  );
}

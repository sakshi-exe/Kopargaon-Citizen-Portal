import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({ title, value, subtitle, icon: Icon, iconBg = 'bg-blue-100 dark:bg-blue-900/40', iconColor = 'text-blue-600 dark:text-blue-400', trend, trendLabel, className = '' }) {
  return (
    <div className={`rounded-[20px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-800/95 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-[#0B1736] dark:text-white tracking-tight">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
              trend > 0 ? 'text-[#138808] dark:text-[#9ae5b3]' : trend < 0 ? 'text-[#D93025] dark:text-[#f9b1b1]' : 'text-slate-500'
            }`}>
              {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {trendLabel || `${Math.abs(trend)}%`}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${iconBg}`}>
            <Icon size={22} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
}

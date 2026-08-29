import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg = 'bg-navy-50 dark:bg-navy-950/60',
  iconColor = 'text-navy-700 dark:text-navy-300',
  trend,
  trendLabel,
  accentColor,
  className = ''
}) {
  return (
    <div className={`relative overflow-hidden bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 ${className}`}>
      {accentColor && (
        <span
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate leading-tight font-medium">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className={`mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              trend > 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : trend < 0
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
              <span>{trendLabel || `${Math.abs(trend)}%`}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800 ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
}


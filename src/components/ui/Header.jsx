import React from 'react';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Menu, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function Header({
  title,
  subtitle,
  onMenuToggle,
  actions,
}) {
  const { state } = useApp();

  const status = state.datastoreStatus || 'ONLINE';

  const statusConfig = {
    ONLINE: {
      label: 'System Online',
      icon: Wifi,
      className:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
      dot: 'bg-emerald-500',
    },

    OFFLINE: {
      label: 'Offline Mode',
      icon: WifiOff,
      className:
        'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
      dot: 'bg-red-500',
    },

    RECOVERING: {
      label: 'Recovering',
      icon: RefreshCw,
      className:
        'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
      dot: 'bg-amber-500',
    },
  };

  const config =
    statusConfig[status] || statusConfig.ONLINE;

  const StatusIcon = config.icon;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">

      {/* Left Side */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {actions}

        {/* System Status */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${config.className}`}
          title={
            status === 'ONLINE'
              ? 'CivicFix is connected to the network'
              : status === 'OFFLINE'
              ? 'CivicFix is currently operating offline'
              : 'CivicFix is restoring connectivity'
          }
        >
          <span
            className={`w-2 h-2 rounded-full ${config.dot} ${
              status === 'ONLINE'
                ? 'animate-pulse'
                : ''
            }`}
          />

          <StatusIcon size={13} />

          <span>{config.label}</span>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
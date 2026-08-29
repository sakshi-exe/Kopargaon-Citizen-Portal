import React from 'react';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Menu } from 'lucide-react';

export default function Header({ title, subtitle, onMenuToggle, actions }) {
  return (
    <header className="relative flex items-center justify-between gap-4 px-6 py-4 bg-white/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm flex-shrink-0 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#FF9933] hover:text-[#000080] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-[#FF9F43] dark:hover:text-white"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-[-0.02em] text-[#0B1736] dark:text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}

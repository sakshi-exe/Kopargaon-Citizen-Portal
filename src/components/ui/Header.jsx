import React from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Menu, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function Header({ title, subtitle, onMenuToggle: propMenuToggle, actions }) {
  const outletCtx = useOutletContext();
  const location = useLocation();
  const { state } = useApp();
  const onMenuToggle = propMenuToggle || (outletCtx && outletCtx.onMenuToggle);

  const isAdmin = location.pathname.startsWith('/admin') || state.role === 'admin';

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 flex-shrink-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="w-8.5 h-8.5 flex md:hidden items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>
        )}

        <div className="min-w-0">
          {/* Breadcrumb / Context */}
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            <span className="text-slate-600 dark:text-slate-300">
              {isAdmin ? 'Administration Console' : 'Citizen Portal'}
            </span>
            <ChevronRight size={10} className="text-slate-300 dark:text-slate-600" />
            <span className="text-slate-400 dark:text-slate-500 truncate">Kopargaon</span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
            {title}
          </h1>

          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Official Status Indicator Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>KMC Live GIS</span>
        </div>

        {actions}

        {/* Theme Toggle Button */}
        <ThemeToggle />
      </div>
    </header>
  );
}


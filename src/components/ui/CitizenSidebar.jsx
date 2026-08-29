import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Map, Home, AlertCircle, ClipboardList, FolderOpen,
  Eye, ChevronRight, QrCode, Sparkles, X, ChevronLeft,
  Building, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/citizen',                 icon: Home,          label: 'Overview & Home' },
  { to: '/citizen/map',             icon: Map,           label: 'City GIS Map' },
  { to: '/citizen/scan-qr',         icon: QrCode,        label: 'Scan QR Infrastructure' },
  { to: '/citizen/transformations', icon: Sparkles,      label: 'Before & After Upgrades' },
  { to: '/citizen/report',          icon: AlertCircle,   label: 'Report Civic Issue' },
  { to: '/citizen/my-reports',      icon: ClipboardList, label: 'My Reports & Tracking' },
  { to: '/citizen/projects',        icon: FolderOpen,    label: 'Development Projects' },
  { to: '/citizen/transparency',    icon: Eye,           label: 'Public Transparency' },
];

export default function CitizenSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full bg-white dark:bg-[#0B132B] border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out shadow-lg md:shadow-none
        ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${collapsed ? 'md:w-16' : 'md:w-64'}
      `}
    >
      {/* Municipal Branding Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-3 min-w-0">
          {/* Civic Logo Mark with Ashoka Chakra / Navy & Saffron theme */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-navy-700">
            {/* Ashoka Chakra 24-spoke inspired central vector */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-saffron-400 fill-none stroke-current stroke-[1.75]" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <circle cx="12" cy="12" r="2.5" fill="currentColor" />
              <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indiaGreen-500 border-2 border-white dark:border-slate-900" />
          </div>

          {(!collapsed || mobileOpen) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                  CivicFix
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-saffron-100 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-800">
                  CITIZEN
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-1">
                Kopargaon Municipal Council
              </p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {(!collapsed || mobileOpen) && (
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Citizen Services
          </div>
        )}

        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/citizen'}
            onClick={() => { if (mobileOpen && onCloseMobile) onCloseMobile(); }}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-navy-50/90 dark:bg-navy-950/70 text-navy-900 dark:text-navy-200 font-bold shadow-xs border border-navy-100 dark:border-navy-800/80'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
              }`
            }
            title={collapsed && !mobileOpen ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                {/* Active Saffron Accent Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-saffron-500" />
                )}
                <item.icon
                  size={18}
                  className={`flex-shrink-0 transition-colors ${
                    isActive
                      ? 'text-navy-700 dark:text-saffron-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Footer Section: Role Switcher & Collapse Toggle */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex-shrink-0 space-y-1.5">
        {/* Switch to Admin View */}
        <button
          onClick={() => {
            dispatch({ type: 'SET_ROLE', payload: 'admin' });
            navigate('/admin');
            if (mobileOpen && onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-navy-400 dark:hover:border-navy-600 hover:shadow-xs transition-all"
          title="Switch to Municipal Administration Console"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building size={14} className="text-navy-600 dark:text-navy-400 flex-shrink-0" />
            {(!collapsed || mobileOpen) && (
              <span className="truncate text-[11px]">Admin Console</span>
            )}
          </div>
          {(!collapsed || mobileOpen) && <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />}
        </button>

        {/* Desktop Collapse / Expand Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center justify-center gap-2 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}


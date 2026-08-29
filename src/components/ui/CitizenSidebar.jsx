import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Map, Home, AlertCircle, ClipboardList, FolderOpen,
  Eye, ChevronRight, Building2, QrCode, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  { to: '/citizen',                 icon: Home,          label: 'Home' },
  { to: '/citizen/map',             icon: Map,           label: 'City GIS Map' },
  { to: '/citizen/scan-qr',         icon: QrCode,        label: 'Scan QR Code' },
  { to: '/citizen/transformations', icon: Sparkles,      label: 'Before & After' },
  { to: '/citizen/report',          icon: AlertCircle,   label: 'Report Issue' },
  { to: '/citizen/my-reports',      icon: ClipboardList, label: 'My Reports' },
  { to: '/citizen/projects',        icon: FolderOpen,    label: 'Projects' },
  { to: '/citizen/transparency',    icon: Eye,           label: 'Transparency' },
];

export default function CitizenSidebar({ collapsed = false }) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <aside className={`flex h-full flex-col border-r border-[#F0DCC0] bg-[#FFFDF8] transition-all duration-200 dark:border-slate-800 dark:bg-[#091827] ${collapsed ? 'w-20' : 'w-72'}`}>
      <div className="flex-shrink-0 border-b border-[#F3E4D2] bg-[#FFFDF8]/90 px-4 py-5 dark:border-slate-800 dark:bg-[#0B1D33]/90">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF9933] via-[#FFF1E2] to-[#138808] shadow-[0_12px_20px_rgba(255,153,51,0.18)] ring-1 ring-[#FF9933]/20">
            <Building2 size={18} className="text-[#0B1324]" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-base font-black tracking-[-0.03em] text-[#0B1324] dark:text-white">CivicFix</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#52627A] dark:text-[#A9C2F7]">Kopargaon portal</div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-2 pt-5">
        {!collapsed && (
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#52627A] dark:text-[#A7B9D9]">Civic services</div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/citizen'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF9933]/12 via-[#FFF8F1] to-[#138808]/10 text-[#0B1324] shadow-[0_12px_22px_rgba(19,136,8,0.08)] ring-1 ring-[#FF9933]/10 dark:from-[#FF9933]/10 dark:via-[#0F233B] dark:to-[#138808]/10 dark:text-white dark:ring-[#20BFA9]/15'
                    : 'text-[#52627A] hover:bg-[#FFF7F0] hover:text-[#0B1324] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute inset-y-1 left-1 w-1.5 rounded-full bg-gradient-to-b from-[#FF9933] via-[#FFB15F] to-[#138808]" />}
                  <item.icon size={17} className={`relative z-10 ${isActive ? 'text-[#0B1324] dark:text-[#fff7f1]' : 'text-[#52627A] group-hover:text-[#0B1324] dark:text-slate-300 dark:group-hover:text-white'}`} />
                  {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-[#F3E4D2] px-3 py-4 dark:border-slate-800">
        <button
          onClick={() => { dispatch({ type: 'SET_ROLE', payload: 'admin' }); navigate('/admin'); }}
          className="flex w-full items-center justify-between rounded-2xl border border-[#E9DFD6] bg-[#FFF7F0] px-3 py-2.5 text-left text-sm font-semibold text-[#0B1324] transition-all hover:border-[#FF9933]/40 hover:bg-[#FFF1E4] dark:border-slate-700 dark:bg-[#0F233B] dark:text-white dark:hover:border-[#20BFA9]/40 dark:hover:bg-[#122a44]"
        >
          <span className="flex items-center gap-2">
            <ChevronRight size={15} className="text-[#138808]" />
            {!collapsed && 'Switch to admin'}
          </span>
        </button>
      </div>
    </aside>
  );
}

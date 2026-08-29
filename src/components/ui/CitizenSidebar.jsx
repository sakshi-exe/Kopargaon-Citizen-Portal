import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Map, Home, AlertCircle, ClipboardList, FolderOpen,
  Eye, ChevronRight, Building2, QrCode, Sparkles, LogIn, LogOut, User
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
  const { state, dispatch, user, profile, logout, openAuthModal } = useApp();
  const navigate = useNavigate();

  return (
    <aside className={`flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Building2 size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">CivicFix</div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Kopargaon Portal</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/citizen'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Auth Info or Login Button */}
      <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
        {user ? (
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
                {!collapsed && (
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <LogOut size={13} />
              </button>
            </div>
            {!collapsed && (
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-mono font-bold">
                  {profile?.role || 'Citizen'}
                </span>
                <span className="truncate text-slate-400">{user.email}</span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-xs font-bold transition-all shadow-sm"
          >
            <LogIn size={14} />
            {!collapsed && <span>Sign In / Register</span>}
          </button>
        )}
      </div>

      {/* Switch to Admin View */}
      <div className="px-2 py-2 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
        <button
          onClick={() => { dispatch({ type: 'SET_ROLE', payload: 'admin' }); navigate('/admin'); }}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronRight size={14} />
          {!collapsed && <span>Switch to Admin View</span>}
        </button>
      </div>
    </aside>
  );
}

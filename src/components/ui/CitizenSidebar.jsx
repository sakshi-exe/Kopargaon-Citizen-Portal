import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Map,
  Home,
  AlertCircle,
  ClipboardList,
  FolderOpen,
  Eye,
  ChevronRight,
  Building2,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const NAV_ITEMS = [
  {
    to: '/citizen',
    icon: Home,
    label: 'Home',
  },
  {
    to: '/citizen/map',
    icon: Map,
    label: 'City GIS Map',
  },
  {
    to: '/citizen/scan-qr',
    icon: QrCode,
    label: 'Scan QR Code',
  },
  {
    to: '/citizen/transformations',
    icon: Sparkles,
    label: 'Before & After',
  },
  {
    to: '/citizen/report',
    icon: AlertCircle,
    label: 'Report Issue',
  },
  {
    to: '/citizen/my-reports',
    icon: ClipboardList,
    label: 'My Reports',
  },
  {
    to: '/citizen/projects',
    icon: FolderOpen,
    label: 'Projects',
  },
  {
    to: '/citizen/transparency',
    icon: Eye,
    label: 'Transparency',
  },
];

export default function CitizenSidebar({ collapsed = false }) {
  const { dispatch } = useApp();
  const navigate = useNavigate();

  return (
    <aside
      className={`flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Building2 size={21} className="text-white" />
        </div>

        {!collapsed && (
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              CivicFix
            </div>

            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              Kopargaon Portal
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/citizen'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />

              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Switch to Admin */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
        <button
          onClick={() => {
            dispatch({
              type: 'SET_ROLE',
              payload: 'admin',
            });

            navigate('/admin');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronRight size={16} />

          {!collapsed && (
            <span>
              Switch to Admin View
            </span>
          )}
        </button>

        {!collapsed && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 px-4 mt-2">
            Kopargaon Municipal Console
          </p>
        )}
      </div>
    </aside>
  );
}